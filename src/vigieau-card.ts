/**
 * Vigieau Card - A custom Home Assistant Lovelace card for displaying French drought water restriction data
 * Based on the kamaradclimber/vigieau custom integration
 * https://github.com/kamaradclimber/vigieau
 */

import { LitElement, html, css, PropertyValues, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';
import { localizeCommon } from './localize';
import {
  VigieauCardConfig,
  DEFAULT_CONFIG,
  applyCityCodeToConfig,
  getSeverityRank,
} from './config';
import { VERSION } from './version.generated';

// Bannière de version affichée à l'ouverture du navigateur
console.info(`Vigieau Card v${VERSION}`);

// Re-exported for tests and the editor
export { buildEntityIdsFromCityCode } from './config';

/**
 * Entity state interfaces
 */
interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed: string;
  last_updated: string;
  context: {
    id: string;
    parent_id: string | null;
    user_id: string | null;
  };
}

/**
 * Restriction level color mapping (text states from the vigieau integration)
 */
const RESTRICTION_COLORS: Record<string, string> = {
  'aucune restriction': 'green',
  'vigilance': 'green',
  'alerte': 'yellow',
  'alerte renforcée': 'orange',
  'crise': 'red',
  'interdiction sauf exception': 'orange',
  'interdiction': 'red',
  'interdiction sur plage horaire': 'orange',
  'sensibilisation': 'yellow',
  'réduction': 'orange',
};

/**
 * Get the color for a restriction level
 * @param level - The restriction level string
 * @returns The color name or 'grey' if not found or unavailable
 */
export function getRestrictionColor(level: string | null): string {
  if (!level) return 'grey';
  const lowerLevel = level.toLowerCase().trim();
  // États Home Assistant indisponibles / inconnus
  if (lowerLevel === 'unavailable' || lowerLevel === 'unknown') return 'grey';
  return RESTRICTION_COLORS[lowerLevel] || 'grey';
}

/**
 * Get display name for a restriction category using localized strings
 * @param category - The category key
 * @param lang - The language code
 * @returns The display name string
 */
export function getCategoryDisplayName(category: string, lang: string): string {
  const translated = localizeCommon(`categorie.${category}`, lang);
  if (translated !== `categorie.${category}`) {
    return translated;
  }
  // Fallback : remplacer les underscores par des espaces
  return category.replace(/_/g, ' ');
}

/**
 * Get the icon for a restriction category
 * @param category - The category key
 * @returns An mdi icon name
 */
export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    // French category names from the vigieau component
    alimentation_des_fontaines: 'mdi:fountain',
    jardins_potagers: 'mdi:flower',
    pelouses: 'mdi:grass',
    lavage_des_vehicules: 'mdi:car-wash',
    piscines: 'mdi:pool',
    voiries_trottoirs: 'mdi:road',
    toitures_facades: 'mdi:roof',
    plans_deau: 'mdi:water',
    // English aliases (fallback)
    fountains: 'mdi:fountain',
    gardens: 'mdi:flower',
    lawns: 'mdi:grass',
    vehicle_wash: 'mdi:car-wash',
    pools: 'mdi:pool',
    roads: 'mdi:road',
    roofs: 'mdi:roof',
    ponds: 'mdi:water',
  };
  return icons[category] || 'mdi:water';
}

/**
 * Custom Lovelace card for Vigieau water restrictions
 */
@customElement('vigieau-card')
export class VigieauCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property() private _config!: VigieauCardConfig;
  @state() private _entities: {
    alert_level: string | null;
    alert_level_numeric: string | null;
    last_updated: string | null;
    restrictions: Map<string, { state: string; entity_id: string; attributes: Record<string, unknown>; category: string; entityFound: boolean }>;
  } = {
    alert_level: null,
    alert_level_numeric: null,
    last_updated: null,
    restrictions: new Map(),
  };

  /**
   * Get a default stub configuration for the card
   * Used when adding the card to Lovelace for the first time
   * @returns Default configuration object
   */
  public static getStubConfig(): VigieauCardConfig {
    return {
      type: 'custom:vigieau-card',
      city_code: '',
      alert_level_entity: '',
      alert_level_numeric_entity: '',
      restriction_entities: [],
      show_alert_level: true,
      show_restrictions: true,
      show_progress: false,
      compact: false,
      hide_no_restriction: false,
    };
  }

  /**
   * Get the configuration editor element
   * Dynamically imports and creates the editor component
   * @returns Promise resolving to the editor element
   */
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import('./vigieau-card-editor');
    return document.createElement('vigieau-card-editor') as LovelaceCardEditor;
  }

  /**
   * Set the card configuration
   * Validates and applies the configuration with defaults
   * @param config - The card configuration object
   */
  public setConfig(config: VigieauCardConfig): void {
    // Apply city code to auto-build entity ids for unset fields
    const resolvedConfig = applyCityCodeToConfig(config, config.city_code ?? '');

    this._config = {
      ...DEFAULT_CONFIG,
      ...resolvedConfig,
    };

    this._updateEntities();
  }

  /**
   * Get the card size for layout purposes
   * @returns Card height in grid rows
   */
  public getCardSize(): number {
    return 6;
  }

  /**
   * Determine if the card should update based on changed properties
   * Optimizes rendering by only updating when relevant entities change
   * @param changedProps - Map of changed properties
   * @returns True if the card should re-render
   */
  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (changedProps.has('_config')) {
      return true;
    }

    if (changedProps.has('hass')) {
      const oldHass = changedProps.get('hass') as HomeAssistant | undefined;
      if (!oldHass || !this._entities || !this._config) {
        return true;
      }

      // Check if the alert level entity changed
      if (this._config.alert_level_entity) {
        const oldAlert = oldHass.states[this._config.alert_level_entity];
        const newAlert = this.hass.states[this._config.alert_level_entity];
        if (oldAlert?.state !== newAlert?.state) {
          return true;
        }
      }

      // Check if the numeric alert level entity changed
      if (this._config.alert_level_numeric_entity) {
        const oldNum = oldHass.states[this._config.alert_level_numeric_entity];
        const newNum = this.hass.states[this._config.alert_level_numeric_entity];
        if (oldNum?.state !== newNum?.state) {
          return true;
        }
      }

      // Check if restriction entities changed
      const restrictionEntities = this._getRestrictionEntities();
      return restrictionEntities.some((entityId: string) => {
        return oldHass.states[entityId]?.state !== this.hass.states[entityId]?.state;
      });
    }

    return true;
  }

  /**
   * Lifecycle method called after the element updates
   * Updates entity references when config or hass changes
   */
  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);
    if (changedProps.has('hass') || changedProps.has('_config')) {
      this._updateEntities();
    }
  }

  /**
   * Get all restriction entity ids from the configuration
   * @returns Array of entity IDs
   */
  private _getRestrictionEntities(): string[] {
    return this._config.restriction_entities || [];
  }

  /**
   * Get the state object for an entity
   * @param entityId - The entity ID to retrieve
   * @returns The entity state object or undefined if not found
   */
  private _getState(entityId: string | null): HassEntity | undefined {
    if (!entityId || !this.hass) return undefined;
    return this.hass.states[entityId] as HassEntity | undefined;
  }



/**
 * Get the color from the entity attributes (Couleur attribute from vigieau)
 * @param attributes - The entity attributes
 * @returns The color or null if not found
 */
  private _getColorFromAttributes(attributes: Record<string, unknown>): string | null {
    const couleur = attributes['Couleur'] ?? attributes['couleur'];
    if (couleur && typeof couleur === 'string') return couleur;
    return null;
  }

  /**
   * Extract the category name from an entity id for display purposes.
   * sensor.{categorie}_restrictions_{ville}  -> categorie
   * binary_sensor.vigieau-{categorie}-...   -> categorie (after vigieau-)
   * @param entityId - The entity ID
   * @returns The category key or empty string if it cannot be extracted
   */
  private _extractCategoryFromEntityId(entityId: string): string {
    const sensorMatch = entityId.match(/^sensor\.(.+)_restrictions_/);
    if (sensorMatch) {
      return sensorMatch[1];
    }
    const binaryMatch = entityId.match(/^binary_sensor\.vigieau-(.+)-/);
    if (binaryMatch) {
      return binaryMatch[1];
    }
    // Fallback: use the part after the domain and before the last _restrictions or suffix
    const parts = entityId.split('.');
    if (parts.length > 1) {
      return parts[1].replace(/_restrictions.*$/, '');
    }
    return '';
  }

  /**
   * Update entity references based on the config and HA state
   * All configured restriction entities are added to the map, even when they
   * do not exist yet in hass.states, so they are displayed (as unknown) instead
   * of being silently dropped.
   */
  private _updateEntities(): void {
    if (!this.hass || !this._config) return;

    // Update alert level entities
    const alertEntity = this._getState(this._config.alert_level_entity ?? null);
    this._entities.alert_level = alertEntity?.state || null;
    this._entities.alert_level_numeric = this._getState(this._config.alert_level_numeric_entity ?? null)?.state || null;
    this._entities.last_updated = alertEntity?.last_updated ?? null;

    // Update restriction entities
    // Index by entity_id (unique) instead of category to avoid collisions between cities
    this._entities.restrictions.clear();
    const restrictionEntities = this._getRestrictionEntities();
    for (const entityId of restrictionEntities) {
      const state = this._getState(entityId);
      let category = '';
      if (state) {
        // Prefer the entity attribute (if the vigieau integration exposes it)
        const catAttr = state.attributes;
        if (catAttr && catAttr.categorie !== undefined) {
          category = catAttr.categorie as string;
        } else if (catAttr && catAttr.category !== undefined) {
          category = catAttr.category as string;
        }
      }
      // Fallback: extract from the entity id (works even when the entity has no state yet)
      if (!category) {
        category = this._extractCategoryFromEntityId(entityId);
      }
      this._entities.restrictions.set(entityId, {
        state: state?.state ?? '',
        entity_id: state?.entity_id ?? entityId,
        attributes: state?.attributes ?? {},
        category,
        entityFound: Boolean(state),
      });
    }

    // Request update to re-render
    this.requestUpdate();
  }

  /**
   * Get translated restriction level name
   * @param level - The raw level string
   * @returns A nicer display name
   */
  private _getDisplayLevel(level: string | null): string {
    if (!level) return 'Inconnu';
    // Capitalize first letter
    return level.charAt(0).toUpperCase() + level.slice(1);
  }

  /**
   * Check if an entity is a binary sensor
   * @param entityId - The entity ID
   * @returns True if the entity is a binary_sensor
   */
  private _isBinarySensor(entityId: string): boolean {
    return entityId.startsWith('binary_sensor.');
  }

  /**
   * Render the card header with alert level
   * @returns Template result for the header section
   */
  private _renderHeader(): TemplateResult {
    const alertLevel = this._entities.alert_level;
    const alertLevelNumeric = this._entities.alert_level_numeric;
    const lastUpdated = this._entities.last_updated;
    const lang = this.hass?.locale?.language || this.hass?.language || 'fr';

    // Get color for the alert level
    const color = getRestrictionColor(alertLevel);

    // Détecter si l'entité est configurée mais introuvable dans Home Assistant
    const alertEntityState = this._getState(this._config.alert_level_entity ?? null);
    const entityNotFound = Boolean(this._config.alert_level_entity) && !alertEntityState;

    let alertText: string;
    if (entityNotFound) {
      alertText = localizeCommon('entity_not_found', lang);
    } else if (!alertLevel) {
      alertText = localizeCommon('unknown', lang);
    } else if (alertLevel === 'unavailable') {
      alertText = localizeCommon('entity_unavailable', lang);
    } else if (alertLevel === 'unknown') {
      alertText = localizeCommon('entity_unknown', lang);
    } else {
      alertText = this._getDisplayLevel(alertLevel);
    }

    // City badge (optional)
    let cityHtml: TemplateResult = html``;
    if (this._config.show_city && this._config.city_code) {
      cityHtml = html`<span class="card-city">${this._config.city_code}</span>`;
    }

    // Last update timestamp (optional)
    let lastUpdatedHtml: TemplateResult = html``;
    if (this._config.show_timestamp && lastUpdated) {
      const date = new Date(lastUpdated);
      if (!isNaN(date.getTime())) {
        lastUpdatedHtml = html`<span class="last-updated">${localizeCommon('last_updated', lang)}: ${date.toLocaleString(lang, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>`;
      }
    }

    // Active restrictions counter
    let activeCountHtml: TemplateResult = html``;
    if (this._config.show_restrictions) {
      const activeCount = (this._config.restriction_entities ?? []).filter((eid) => {
        const info = this._entities.restrictions.get(eid);
        return info && !this._isNoRestriction(info.state);
      }).length;
      if (activeCount > 0) {
        activeCountHtml = html`<span class="active-count">${activeCount} ${localizeCommon('active_restrictions', lang)}</span>`;
      }
    }

    // Progress bar only if enabled and numeric level available
    let progressHtml: TemplateResult = html``;
    if (this._config.show_progress && alertLevelNumeric !== null && !isNaN(Number(alertLevelNumeric))) {
      const percent = Math.round((Number(alertLevelNumeric) / 4) * 100);
      progressHtml = html`
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${percent}%"></div>
        </div>
        <span class="progress-percent">${percent}%</span>
      `;
    }

    const alertEntityId = this._config.alert_level_entity;

    return html`
      <div class="card-header">
        <div class="header-main">
          <div class="card-title">
            <h3>Vigieau</h3>
            ${cityHtml}
          </div>
          <div class="header-meta">
            ${lastUpdatedHtml}
            ${activeCountHtml}
          </div>
          <div
            class="alert-level ${color} ${entityNotFound ? 'entity-not-found' : ''}"
            role="button"
            tabindex="0"
            aria-label="${alertText}"
            aria-live="polite"
            @click=${() => this._showMoreInfo(alertEntityId ?? null)}
            @keydown=${(e: KeyboardEvent) => this._handleCardKeyDown(e, alertEntityId ?? null)}
          >
            <ha-icon icon="mdi:alert-circle-outline" style="color: ${color};" aria-hidden="true"></ha-icon>
            <span>${alertText}</span>
          </div>
          ${progressHtml}
        </div>
        <ha-icon
          icon="mdi:refresh"
          class="refresh-button"
          role="button"
          tabindex="0"
          aria-label="${localizeCommon('refresh', lang)}"
          @click=${() => this._refresh()}
          @keydown=${(e: KeyboardEvent) => this._handleRefreshKeyDown(e)}
        ></ha-icon>
      </div>
    `;
  }

  /**
   * Render the restrictions grid
   * @returns Template result for the restrictions section
   */
  private _renderRestrictions(): TemplateResult {
    const restrictions = this._entities.restrictions;
    const lang = this.hass?.locale?.language || this.hass?.language || 'fr';

    if (restrictions.size === 0) {
      return html`
        <div class="restrictions-grid">
          <span>${localizeCommon('no_data', lang)}</span>
        </div>
      `;
    }

    // Filter out categories with no active restriction if configured
    let restrictedEntries = Array.from(restrictions.entries());
    if (this._config.hide_no_restriction) {
      restrictedEntries = restrictedEntries.filter((entry) => {
        const info = entry[1];
        return !this._isNoRestriction(info.state);
      });
    }

    // Ne pas afficher les entités introuvables
    restrictedEntries = restrictedEntries.filter((entry) => {
      const info = entry[1];
      return info.entityFound;
    });

    // Sort restrictions according to config
    if (this._config.sort === 'alpha') {
      restrictedEntries.sort((a, b) => {
        const nameA = getCategoryDisplayName(a[1].category, lang);
        const nameB = getCategoryDisplayName(b[1].category, lang);
        return nameA.localeCompare(nameB, lang);
      });
    } else if (this._config.sort === 'severity') {
      restrictedEntries.sort((a, b) => {
        return getSeverityRank(b[1].state) - getSeverityRank(a[1].state);
      });
    }
    // 'config' keeps the original order

    if (restrictedEntries.length === 0) {
      return html`
        <div class="restrictions-grid">
          <span>${localizeCommon('no_active_restrictions', lang)}</span>
        </div>
      `;
    }

    // Build grid HTML from restrictions map
    const gridItems = restrictedEntries.map(([, info]) => {
      const { state, entity_id, attributes, category, entityFound } = info;
      const entityNotFound = !entityFound;
      const colorAttr = this._getColorFromAttributes(attributes);
      const color = colorAttr || (entityNotFound ? 'grey' : getRestrictionColor(state));
      const displayName = getCategoryDisplayName(category, lang);
      const isBinary = this._isBinarySensor(entity_id);

      // Build title with attributes if available
      let title = displayName;
      if (entityNotFound) {
        title += ` - ${localizeCommon('entity_not_found', lang)}`;
      } else {
        const currentlyRestricted = attributes['currently_restricted'];
        if (currentlyRestricted !== undefined) {
          title += ` - ${localizeCommon('currently_restricted', lang)}: ${currentlyRestricted ? localizeCommon('yes', lang) : localizeCommon('no', lang)}`;
        }
        const nextStart = attributes['next_restriction_start'];
        const nextEnd = attributes['next_restriction_end'];
        if (nextStart && nextEnd) {
          title += ` - ${localizeCommon('next_restriction', lang)}: ${nextStart} / ${nextEnd}`;
        }
      }

      // Icon by category (or binary state)
      const icon = isBinary
        ? (state === 'on' ? 'mdi:water-off' : 'mdi:water-check')
        : getCategoryIcon(category);

      // Restriction level text (lowercase -> capitalize)
      let levelText: string;
      if (entityNotFound) {
        levelText = localizeCommon('entity_not_found', lang);
      } else if (!state) {
        levelText = localizeCommon('unknown', lang);
      } else if (state === 'unavailable') {
        levelText = localizeCommon('entity_unavailable', lang);
      } else if (state === 'unknown') {
        levelText = localizeCommon('entity_unknown', lang);
      } else {
        levelText = this._getDisplayLevel(state);
      }

      const ariaLabel = `${displayName}: ${levelText}`;

      return html`
        <div
          class="restriction-item ${this._config.compact ? 'compact' : ''} ${isBinary ? 'binary' : ''} ${entityNotFound ? 'entity-not-found' : ''}"
          role="button"
          tabindex="0"
          aria-label="${ariaLabel}"
          title="${title}"
          @click=${() => this._showMoreInfo(entity_id)}
          @keydown=${(e: KeyboardEvent) => this._handleCardKeyDown(e, entity_id)}
          style="border-color: ${color};"
        >
          <ha-icon icon="${icon}" style="color: ${color};" aria-hidden="true"></ha-icon>
          <div class="restriction-content">
            <span class="restriction-name">${displayName}</span>
            <span class="restriction-level" style="color: ${color};">${levelText}</span>
          </div>
        </div>
      `;
    });

    return html`
      <div class="restrictions-grid ${this._config.compact ? 'compact' : ''}">
        ${gridItems}
      </div>
    `;
  }

  /**
   * Render a configuration-missing message when no entities are set up
   * @returns Template result for the configuration message
   */
  private _renderConfigMissing(): TemplateResult {
    const lang = this.hass?.locale?.language || this.hass?.language || 'fr';
    return html`
      <div class="config-missing">
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
        <span>${localizeCommon('configure_entities', lang)}</span>
      </div>
    `;
  }

  /**
   * Show more-info dialog for an entity
   * @param entityId - The entity ID to show details for
   */
  private _showMoreInfo(entityId: string | null): void {
    if (!entityId) return;

    const event = new CustomEvent('hass-more-info', {
      detail: { entityId },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  /**
   * Check if a restriction state means "no restriction"
   * @param state - The restriction state string
   * @returns True if the state indicates no active restriction
   */
  private _isNoRestriction(state: string | null): boolean {
    if (!state) return false;
    const lower = state.toLowerCase().trim();
    return (
      lower === 'aucune restriction' ||
      lower === 'vigilance' ||
      lower === 'aucune' ||
      lower === 'normale' ||
      lower === 'aucun' ||
      lower === 'rien'
    );
  }

  /**
   * Handle keyboard events on clickable card elements (Enter / Space).
   * @param event - The keyboard event
   * @param entityId - The entity ID to show more info for
   */
  private _handleCardKeyDown(event: KeyboardEvent, entityId: string | null): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this._showMoreInfo(entityId);
    }
  }

  /**
   * Rafraîchit manuellement l'affichage des entités.
   * Relance _updateEntities() pour relire les états actuels depuis Home Assistant.
   */
  private _refresh(): void {
    this._updateEntities();
  }

  /**
   * Gestion clavier pour le bouton de rafraîchissement (Enter / Espace).
   * @param event - L'événement clavier
   */
  private _handleRefreshKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this._refresh();
    }
  }

  /**
   * Render the complete card
   * Combines all sections based on configuration
   * @returns Template result for the entire card
   */
  protected render(): TemplateResult {
    if (!this._config || !this.hass) {
      return html``;
    }

    // If no entities are configured, show a configuration message
    const hasAlert = Boolean(this._config.alert_level_entity);
    const hasRestrictions = (this._config.restriction_entities ?? []).length > 0;
    if (!hasAlert && !hasRestrictions) {
      return html`
        <ha-card>
          ${this._renderConfigMissing()}
        </ha-card>
      `;
    }

    return html`
      <ha-card class="${this._config.compact ? 'compact' : ''}">
        ${this._config.show_alert_level && hasAlert ? this._renderHeader() : ''}
        ${this._config.show_restrictions && hasRestrictions ? this._renderRestrictions() : ''}
      </ha-card>
    `;
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      ha-card {
        padding: 16px;
        --ha-card-box-shadow: none;
      }

      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid var(--divider-color);
        gap: 16px;
      }

      .header-main {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;
      }

      .card-title {
        font-weight: 700;
        font-size: 1.25em;
        color: var(--primary-text-color);
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0;
      }

      .card-title h3 {
        margin: 0;
        font-size: inherit;
        font-weight: inherit;
      }

      .card-city {
        font-size: 0.8em;
        color: var(--secondary-text-color);
        background: var(--secondary-background-color);
        padding: 2px 8px;
        border-radius: 4px;
        border: 1px solid var(--divider-color);
        white-space: nowrap;
      }

      .header-meta {
        display: flex;
        gap: 12px;
        font-size: 0.8em;
        color: var(--secondary-text-color);
        flex-wrap: wrap;
      }

      .last-updated,
      .active-count {
        white-space: nowrap;
      }

      .alert-level {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        transition: color 0.2s ease;
      }

      .alert-level:hover {
        color: var(--primary-color);
      }

      .alert-level ha-icon {
        width: 24px;
        height: 24px;
        color: var(--secondary-text-color);
      }

      .alert-level span {
        font-weight: bold;
        font-size: 1.2em;
      }

      .alert-level.entity-not-found {
        color: var(--warning-color, var(--primary-color));
      }

      .alert-level.entity-not-found ha-icon {
        color: var(--warning-color, var(--primary-color));
      }

      .progress-bar {
        width: 100%;
        height: 8px;
        background: var(--secondary-background-color);
        border-radius: 4px;
        overflow: hidden;
        margin-top: 8px;
      }

      .progress-fill {
        height: 100%;
        border-radius: 4px;
        transition: width 0.3s ease;
      }

      .progress-percent {
        margin-top: 4px;
        text-align: right;
        font-size: 0.85em;
        color: var(--secondary-text-color);
      }

      .restrictions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 12px;
        margin-top: 16px;
      }

      .restriction-item {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        padding: 10px;
        background: var(--card-background-color);
        border-radius: 8px;
        border: 2px solid var(--divider-color);
        cursor: pointer;
        transition: all 0.2s ease;
        min-height: 80px;
      }

      .restriction-item:hover {
        border-color: var(--primary-color);
        background: var(--secondary-background-color);
      }

      .restriction-item:active {
        transform: scale(0.98);
        border-color: var(--primary-color);
        background: var(--secondary-background-color);
      }

      .restriction-item.entity-not-found {
        border-color: var(--disabled-text-color, #aaa);
        opacity: 0.6;
      }

      .restriction-item.entity-not-found ha-icon {
        color: var(--disabled-text-color, #aaa);
      }

      .restriction-item.entity-not-found .restriction-level {
        color: var(--disabled-text-color, #aaa);
      }

      .restriction-item ha-icon {
        width: 20px;
        height: 20px;
        flex-shrink: 0;
        margin-top: 2px;
      }

      .restriction-content {
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 0;
      }

      .restriction-name {
        font-size: 0.85em;
        color: var(--primary-text-color);
        font-weight: 500;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        line-height: 1.3;
      }

      .restriction-level {
        font-size: 0.75em;
        color: var(--secondary-text-color);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      /* Accessibility: focus visible for keyboard navigation */
      .alert-level[role="button"]:focus-visible,
      .restriction-item[role="button"]:focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
      }

      .alert-level[role="button"],
      .restriction-item[role="button"] {
        outline: none;
      }

      /* Compact mode */
      ha-card.compact {
        padding: 8px;
      }

      ha-card.compact .card-header {
        margin-bottom: 8px;
        padding-bottom: 6px;
      }

      ha-card.compact .alert-level span {
        font-size: 1em;
      }

      ha-card.compact .card-title {
        font-size: 1.1em;
      }

      .restrictions-grid.compact {
        gap: 6px;
        margin-top: 8px;
      }

      .restriction-item.compact {
        padding: 6px;
        min-height: 60px;
        gap: 6px;
      }

      .restriction-item.compact ha-icon {
        width: 16px;
        height: 16px;
      }

      .restriction-item.compact .restriction-name {
        font-size: 0.75em;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        line-height: 1.2;
      }

      .restriction-item.compact .restriction-level {
        font-size: 0.65em;
      }

      .config-missing {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 20px;
        color: var(--secondary-text-color);
        text-align: center;
      }

      .config-missing ha-icon {
        width: 24px;
        height: 24px;
        color: var(--primary-color);
      }

      .refresh-button {
        width: 24px;
        height: 24px;
        color: var(--primary-color);
        cursor: pointer;
        margin-left: auto;
        transition: transform 0.2s ease;
      }

      .refresh-button:hover {
        color: var(--primary-text-color);
        transform: rotate(90deg);
      }

      .refresh-button:focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
      }

      @media (max-width: 600px) {
        .restrictions-grid {
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        }

        .restriction-item {
          padding: 8px;
        }

        .restriction-item span {
          max-width: 150px;
          font-size: 0.8em;
        }

        .card-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }

        .alert-level {
          width: 100%;
        }
      }
    `;
  }
}

// Register card in Home Assistant
interface CustomCard {
  type: string;
  name: string;
  description: string;
  preview: boolean;
  documentationURL: string;
}

declare global {
  interface Window {
    customCards: CustomCard[];
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'vigieau-card',
  name: 'Vigieau Eau',
  description: 'French drought water restrictions card',
  preview: false,
  documentationURL: 'https://github.com/kamaradclimber/vigieau',
});