/**
 * Vigieau Card - A custom Home Assistant Lovelace card for displaying French drought water restriction data
 * Based on the kamaradclimber/vigieau custom integration
 * https://github.com/kamaradclimber/vigieau
 */

import { LitElement, html, css, PropertyValues, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';
import { localizeCommon } from './localize';

/**
 * Configuration interface for the Vigieau Card
 * Entities are selected explicitly via the UI editor; no entity_id is built from a city code.
 */
interface VigieauCardConfig {
  type: string;
  /** City code or slug (e.g. 35322 INSEE code or thorigne_fouillard slug). Used to auto-build entity ids when not set manually. */
  city_code?: string;
  /** Entity id of the alert level sensor (e.g. sensor.alert_level_in_thorigne_fouillard) */
  alert_level_entity?: string;
  /** Entity id of the numeric alert level sensor (e.g. sensor.alert_level_numeric_thorigne_fouillard) */
  alert_level_numeric_entity?: string;
  /** Entity ids of the restriction sensors (e.g. sensor.alimentation_des_fontaines_restrictions_thorigne_fouillard) */
  restriction_entities?: string[];
  /** Show the alert level banner */
  show_alert_level?: boolean;
  /** Show the restrictions grid */
  show_restrictions?: boolean;
  /** Show the numeric progress bar */
  show_progress?: boolean;
  /** Show the last updated timestamp of the alert level entity */
  show_last_updated?: boolean;
  /** Compact card size (reduced padding and font sizes) */
  compact?: boolean;
  /** Hide restriction categories with no active restriction */
  hide_no_restriction?: boolean;
}

/** Restriction categories known by the vigieau integration, used to auto-build entity ids from a city code. */
const RESTRICTION_CATEGORIES: string[] = [
  'alimentation_des_fontaines',
  'jardins_potagers',
  'pelouses',
  'lavage_des_vehicules',
  'piscines',
  'voiries_trottoirs',
  'toitures_facades',
  'plans_deau',
];

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
 * Build entity ids from a city code (INSEE code).
 * @param cityCode - The INSEE city code (e.g. 35322)
 * @returns Object with alert level, numeric alert level and restriction entity ids
 */
export function buildEntityIdsFromCityCode(cityCode: string): {
  alert_level_entity: string;
  alert_level_numeric_entity: string;
  restriction_entities: string[];
} {
  const slug = cityCode.toLowerCase().trim();
  return {
    alert_level_entity: `sensor.alert_level_in_${slug}`,
    alert_level_numeric_entity: `sensor.alert_level_numeric_${slug}`,
    restriction_entities: RESTRICTION_CATEGORIES.map(
      (cat) => `sensor.${cat}_restrictions_${slug}`
    ),
  };
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
    restrictions: Map<string, { state: string; entity_id: string; attributes: Record<string, unknown>; category: string }>;
  } = {
    alert_level: null,
    alert_level_numeric: null,
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
      show_last_updated: false,
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
    // If a city code is provided but no entities are set manually, auto-build entity ids from it
    const resolvedConfig = { ...config };
    if (config.city_code && config.city_code.trim()) {
      const built = buildEntityIdsFromCityCode(config.city_code);
      if (!config.alert_level_entity) {
        resolvedConfig.alert_level_entity = built.alert_level_entity;
      }
      if (!config.alert_level_numeric_entity) {
        resolvedConfig.alert_level_numeric_entity = built.alert_level_numeric_entity;
      }
      if (!config.restriction_entities || config.restriction_entities.length === 0) {
        resolvedConfig.restriction_entities = built.restriction_entities;
      }
    }

    this._config = {
      show_alert_level: true,
      show_restrictions: true,
      show_progress: false,
      show_last_updated: false,
      compact: false,
      hide_no_restriction: false,
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
      if (!oldHass || !this._entities) {
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
   * Get the color for a restriction level
   * @param level - The restriction level string
   * @returns The color name or 'grey' if not found
   */
  private _getRestrictionColor(level: string | null): string {
    return getRestrictionColor(level);
  }

/**
 * Get the color from the entity attributes (Couleur attribute from vigieau)
 * @param attributes - The entity attributes
 * @returns The color or null if not found
 */
  private _getColorFromAttributes(attributes: Record<string, unknown>): string | null {
    const couleur = attributes['Couleur'];
    if (couleur && typeof couleur === 'string') return couleur;
    return null;
  }

  /**
   * Update entity references based on the config and HA state
   */
  private _updateEntities(): void {
    if (!this.hass || !this._config) return;

    // Update alert level entities
    this._entities.alert_level = this._getState(this._config.alert_level_entity ?? null)?.state || null;
    this._entities.alert_level_numeric = this._getState(this._config.alert_level_numeric_entity ?? null)?.state || null;

    // Update restriction entities
    // Index by entity_id (unique) instead of category to avoid collisions between cities
    this._entities.restrictions.clear();
    const restrictionEntities = this._getRestrictionEntities();
    for (const entityId of restrictionEntities) {
      const state = this._getState(entityId);
      if (state) {
        // Extract the category name for display purposes.
        // Prefer the entity attribute (if the vigieau integration exposes it),
        // then fall back to parsing the entity_id.
        const catAttr = state.attributes;
        let category: string = '';
        if (catAttr && catAttr.categorie !== undefined) {
          category = catAttr.categorie as string;
        } else if (catAttr && catAttr.category !== undefined) {
          category = catAttr.category as string;
        }
        if (!category) {
          const sensorMatch = entityId.match(/^sensor\.(.+)_restrictions_/);
          if (sensorMatch) {
            category = sensorMatch[1];
          } else {
            const binaryMatch = entityId.match(/^binary_sensor\.vigieau-(.+)-/);
            if (binaryMatch) {
              category = binaryMatch[1];
            } else {
              // Fallback: use the part after the domain and before the last _restrictions or suffix
              const parts = entityId.split('.');
              if (parts.length > 1) {
                category = parts[1].replace(/_restrictions.*$/, '');
              }
            }
          }
        }
        if (!category) {
          console.warn(`[vigieau-card] Unable to extract category for entity ${entityId}`);
        }
        this._entities.restrictions.set(entityId, {
          state: state.state,
          entity_id: state.entity_id,
          attributes: state.attributes,
          category,
        });
      }
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
   * Get display name for a restriction category
   * @param category - The category key
   * @param lang - The language code
   * @returns The display name string
   */
  private _getCategoryDisplayName(category: string, lang: string): string {
    return getCategoryDisplayName(category, lang);
  }

  /**
   * Get the icon for a restriction category
   * @param category - The category key
   * @returns An mdi icon name
   */
  private _getCategoryIcon(category: string): string {
    return getCategoryIcon(category);
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
    const lang = this.hass?.locale?.language || this.hass?.language || 'fr';

    // Get color for the alert level
    const color = this._getRestrictionColor(alertLevel);

    let alertText: string;
    if (!alertLevel) {
      alertText = localizeCommon('unknown', lang);
    } else if (alertLevel === 'unavailable') {
      alertText = localizeCommon('entity_unavailable', lang);
    } else if (alertLevel === 'unknown') {
      alertText = localizeCommon('entity_unknown', lang);
    } else {
      alertText = this._getDisplayLevel(alertLevel);
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

    // Last updated timestamp
    let lastUpdatedHtml: TemplateResult = html``;
    if (this._config.show_last_updated && alertLevel) {
      const entity = this._getState(this._config.alert_level_entity ?? null);
      const lastUpdated = entity?.last_updated;
      if (lastUpdated) {
        lastUpdatedHtml = html`
          <span class="last-updated" aria-label="${localizeCommon('last_updated', lang)}: ${lastUpdated}">
            ${localizeCommon('last_updated_short', lang)}: ${new Date(lastUpdated).toLocaleString(
              lang,
              { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }
            )}
          </span>
        `;
      }
    }

    return html`
      <div class="card-header">
        <div
          class="alert-level ${color}"
          role="button"
          tabindex="0"
          aria-label="${alertText}"
          @click=${() => this._showMoreInfo(alertEntityId ?? null)}
          @keydown=${(e: KeyboardEvent) => this._handleCardKeyDown(e, alertEntityId ?? null)}
        >
          <ha-icon icon="mdi:alert-circle" style="color: ${color};"></ha-icon>
          <span>${alertText}</span>
        </div>
        ${progressHtml}
        ${lastUpdatedHtml}
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

    if (restrictedEntries.length === 0) {
      return html`
        <div class="restrictions-grid">
          <span>${localizeCommon('no_active_restrictions', lang)}</span>
        </div>
      `;
    }

    // Build grid HTML from restrictions map
    const gridItems = restrictedEntries.map(([, info]) => {
      const { state, entity_id, attributes, category } = info;
      const colorAttr = this._getColorFromAttributes(attributes);
      const color = colorAttr || this._getRestrictionColor(state);
      const displayName = this._getCategoryDisplayName(category, lang);
      const isBinary = this._isBinarySensor(entity_id);

      // Build title with attributes if available
      let title = displayName;
      const currentlyRestricted = attributes['currently_restricted'];
      if (currentlyRestricted !== undefined) {
        title += ` - ${localizeCommon('currently_restricted', lang)}: ${currentlyRestricted ? localizeCommon('yes', lang) : localizeCommon('no', lang)}`;
      }
      const nextStart = attributes['next_restriction_start'];
      const nextEnd = attributes['next_restriction_end'];
      if (nextStart && nextEnd) {
        title += ` - ${localizeCommon('next_restriction', lang)}: ${nextStart} / ${nextEnd}`;
      }

      // Icon by category (or binary state)
      const icon = isBinary
        ? (state === 'on' ? 'mdi:water-off' : 'mdi:water-check')
        : this._getCategoryIcon(category);

      // Restriction level text (lowercase -> capitalize)
      let levelText: string;
      if (!state) {
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
          class="restriction-item ${this._config.compact ? 'compact' : ''} ${isBinary ? 'binary' : ''}"
          role="button"
          tabindex="0"
          aria-label="${ariaLabel}"
          title="${title}"
          @click=${() => this._showMoreInfo(entity_id)}
          @keydown=${(e: KeyboardEvent) => this._handleCardKeyDown(e, entity_id)}
          style="border-color: ${color};"
        >
          <ha-icon icon="${icon}" style="color: ${color};"></ha-icon>
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
    if (!state) return true;
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
        white-space: normal;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 150px;
        line-height: 1.2;
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

      /* Last updated timestamp */
      .last-updated {
        font-size: 0.75em;
        color: var(--secondary-text-color);
        margin-left: auto;
        white-space: nowrap;
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
        max-width: 100px;
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