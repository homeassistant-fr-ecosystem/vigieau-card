/**
 * Vigieau Card - A custom Home Assistant Lovelace card for displaying French drought water restriction data
 * Based on the kamaradclimber/vigieau custom integration
 * https://github.com/kamaradclimber/vigieau
 */

import { LitElement, html, css, PropertyValues, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';
import { localize, localizeCommon } from './localize';

/**
 * Configuration interface for the Vigieau Card
 */
interface VigieauCardConfig {
  type: string;
  /** INSEE city code for the location (e.g., '75056' for Paris) */
  city_code: string;
  /** Show the alert level banner */
  show_alert_level?: boolean;
  /** Show the restrictions grid */
  show_restrictions?: boolean;
  /** Show the numeric progress bar */
  show_progress?: boolean;
}

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

interface SensorEntity extends HassEntity {
  attributes: {
    unit_of_measurement?: string;
    friendly_name?: string;
    [key: string]: unknown;
  };
}

/**
 * Restriction level color mapping
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
};

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
    restrictions: Map<string, string>;
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
      city_code: '75056', // Default to Paris area
      show_alert_level: true,
      show_restrictions: true,
      show_progress: false,
    };
  }

  /**
   * Get the configuration editor element
   * Dynamically imports and creates the editor component
   * @returns Promise resolving to the editor element
   */
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import('./vigieau-card-editor');
    return document.createElement('vigieau-card-editor');
  }

  /**
   * Set the card configuration
   * Validates and applies the configuration with defaults
   * @param config - The card configuration object
   * @throws Error if city_code is not specified
   */
  public setConfig(config: VigieauCardConfig): void {
    if (!config.city_code) {
      throw new Error('You must specify a city_code (INSEE code)');
    }

    this._config = {
      show_alert_level: true,
      show_restrictions: true,
      show_progress: false,
      ...config,
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

      // Check if entity states changed
      const oldAlertLevel = oldHass.states['sensor.alert_level_in_' + this._config.city_code];
      const newAlertLevel = this.hass.states['sensor.alert_level_in_' + this._config.city_code];
      if (oldAlertLevel?.state !== newAlertLevel?.state) {
        return true;
      }

      // Check if restriction entities changed
      const restrictionEntities = this._getRestrictionEntities();
      return restrictionEntities.some((entityId: string) => {
        return oldHass.states[entityId] !== this.hass.states[entityId];
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
   * Build entity ID from suffix and city code
   * @param suffix - The entity suffix (e.g., 'alert_level_in')
   * @returns The full entity ID
   */
  private _buildEntityId(suffix: string): string {
    return `sensor.vigieau_${suffix}_${this._config.city_code}`;
  }

  /**
   * Get all restriction entity IDs for the configured city
   * @returns Array of entity IDs
   */
  private _getRestrictionEntities(): string[] {
    const entities: string[] = [];
    if (!this.hass?.states) return entities;
    // Get all sensor entities matching the pattern for this city
    const keys = Object.keys(this.hass.states).filter((key: string) => key.startsWith('sensor.'));
    for (const key of keys) {
      if (key.endsWith('_restrictions_' + this._config.city_code)) {
        entities.push(key);
      }
    }
    return entities;
  }

  /**
   * Get the current alert level state
   * @returns The alert level string or null
   */
  private _getAlertLevel(): string | null {
    const entityId = this._buildEntityId('alert_level_in');
    const state = this._getState(entityId);
    return state?.state || null;
  }

  /**
   * Get the numeric alert level (0-4)
   * @returns The numeric value string or null
   */
  private _getAlertLevelNumeric(): string | null {
    const entityId = this._buildEntityId('alert_level_numeric');
    const state = this._getState(entityId);
    if (!state || !state.state) return null;
    return state.state;
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
    if (!level) return 'grey';
    const lowerLevel = level.toLowerCase().trim();
    return RESTRICTION_COLORS[lowerLevel] || 'grey';
  }

  /**
   * Update entity references based on the config and HA state
   */
  private _updateEntities(): void {
    if (!this.hass || !this._config) return;

    // Update alert level entities
    this._entities.alert_level = this._getAlertLevel();
    this._entities.alert_level_numeric = this._getAlertLevelNumeric();

    // Update restriction entities
    this._entities.restrictions.clear();
    const restrictionEntities = this._getRestrictionEntities();
    for (const entityId of restrictionEntities) {
      const state = this._getState(entityId);
      if (state && state.state) {
        // Extract the category name from the entity ID
        const match = entityId.match(/sensor\.(.+)_restrictions/);
        if (match) {
          const category = match[1];
          this._entities.restrictions.set(category, state.state);
        }
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
   * Render the card header with alert level
   * @returns Template result for the header section
   */
  private _renderHeader(): TemplateResult {
    const alertLevel = this._entities.alert_level;
    const alertLevelNumeric = this._entities.alert_level_numeric;
    const lang = this.hass?.locale?.language || this.hass?.language || 'en';

    // Get color for the alert level
    const color = this._getRestrictionColor(alertLevel);

    let alertText = localizeCommon('unknown', lang);
    if (alertLevel) {
      alertText = this._getDisplayLevel(alertLevel);
    }

    // Progress bar if numeric level available
    let progressHtml = '';
    if (alertLevelNumeric !== null && !isNaN(Number(alertLevelNumeric))) {
      const percent = Math.round((Number(alertLevelNumeric) / 4) * 100);
      progressHtml = html`
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${percent}%"></div>
        </div>
        <span class="progress-percent">${percent}%</span>
      ` as TemplateResult;
    }

    return html`
      <div class="card-header">
        <div class="alert-level ${color}" @click=${() => this._showMoreInfo('alert_level')}>
          <ha-icon icon="mdi:alert-circle"></ha-icon>
          <span>${alertText}</span>
        </div>
        ${progressHtml}
      </div>
    `;
  }

  /**
   * Render the restrictions grid
   * @returns Template result for the restrictions section
   */
  private _renderRestrictions(): TemplateResult {
    const restrictions = this._entities.restrictions;
    const lang = this.hass?.locale?.language || this.hass?.language || 'en';

    if (restrictions.size === 0) {
      return html`
        <div class="restrictions-grid">
          <span>${localizeCommon('no_data', lang)}</span>
        </div>
      `;
    }

    // Build grid HTML from restrictions map
    const gridItems = Array.from(restrictions.entries()).map(([category, state]) => {
      const color = this._getRestrictionColor(state);
      const displayName = this._getCategoryDisplayName(category, lang);

      return html`
        <div class="restriction-item" title="${displayName}" style="border-color: ${color};">
          <ha-icon icon="mdi:help-circle" style="color: ${color}"></ha-icon>
          <span>${displayName}</span>
        </div>
      `;
    });

    return html`
      <div class="restrictions-grid">
        ${gridItems}
      </div>
    `;
  }

  /**
   * Get display name for a restriction category
   * @param category - The category key
   * @param lang - The language code
   * @returns The display name string
   */
  private _getCategoryDisplayName(category: string, lang: string): string {
    const translations: Record<string, Record<string, string>> = {
      en: {
        fountains: 'Fountains',
        gardens: 'Gardens',
        lawns: 'Lawns',
        vehicle_wash: 'Vehicle Wash',
        pools: 'Pools',
        roads: 'Roads',
        roofs: 'Roofs',
        ponds: 'Ponds',
      },
      fr: {
        fountains: 'Fontaines',
        gardens: 'Jardins',
        lawns: 'Pelouses',
        vehicle_wash: 'Lavage véhicules',
        pools: 'Piscines',
        roads: 'Routes',
        roofs: 'Toits',
        ponds: 'Étangs',
      },
    };

    const i18n = translations[lang] || translations.en;
    return i18n[category] || category.replace(/_/g, ' ');
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
   * Render the complete card
   * Combines all sections based on configuration
   * @returns Template result for the entire card
   */
  protected render(): TemplateResult {
    if (!this._config || !this.hass) {
      return html``;
    }

    return html`
      <ha-card>
        ${this._config.show_alert_level ? this._renderHeader() : ''}
        ${this._config.show_restrictions ? this._renderRestrictions() : ''}
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
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 12px;
        margin-top: 16px;
      }

      .restriction-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px;
        background: var(--card-background-color);
        border-radius: 8px;
        border: 2px solid var(--divider-color);
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .restriction-item:hover {
        border-color: var(--primary-color);
        background: var(--secondary-background-color);
      }

      .restriction-item ha-icon {
        width: 20px;
        height: 20px;
        flex-shrink: 0;
      }

      .restriction-item span {
        font-size: 0.9em;
        color: var(--primary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 180px;
      }

      @media (max-width: 600px) {
        .restrictions-grid {
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
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
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'vigieau-card',
  name: 'Vigieau Eau',
  description: 'French drought water restrictions card',
  preview: false,
  documentationURL: 'https://github.com/kamaradclimber/vigieau',
});