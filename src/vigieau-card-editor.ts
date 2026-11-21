/**
 * Vigieau Card Editor - Configuration editor for the Vigieau custom card
 */

import { html, css, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import { buildEntityIdsFromCityCode } from './vigieau-card';

/**
 * Configuration interface for the editor
 */
export interface VigieauCardEditorConfig {
  type: string;
  city_code?: string;
  alert_level_entity?: string;
  alert_level_numeric_entity?: string;
  restriction_entities?: string[];
  show_alert_level?: boolean;
  show_restrictions?: boolean;
  show_progress?: boolean;
  show_last_updated?: boolean;
  compact?: boolean;
  hide_no_restriction?: boolean;
}

/**
 * The Vigieau Card Editor element
 */
@customElement('vigieau-card-editor')
export class VigieauCardEditor extends LitElement {
  @property() private hass!: HomeAssistant;
  private _config: VigieauCardEditorConfig = {
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

  /**
   * Public config exposed to Lovelace so user changes are persisted.
   */
  @property({ attribute: false })
  get config(): VigieauCardEditorConfig {
    return this._config;
  }

  set config(value: VigieauCardEditorConfig) {
    this._config = { ...VigieauCardEditor.getStubConfig(), ...value };
    this.requestUpdate();
  }

  /**
   * Get default config
   * @returns Default configuration object
   */
  public static getStubConfig(): VigieauCardEditorConfig {
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
   * Set the configuration
   * @param config - The configuration object from Lovelace
   */
  setConfig(config: VigieauCardEditorConfig): void {
    this.config = config;
  }

  /**
   * Notify Lovelace and re-render when the config changes.
   */
  private _notifyConfigChanged(): void {
    this.requestUpdate();
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: { ...this._config } },
      bubbles: true,
      composed: true,
    }));
  }

  /**
   * Handle changes on the city code / slug textfield.
   * Works with both 'value-changed' (ha-textfield) and 'input' (inner input) events.
   * Auto-generates entity ids from the slug when entities are not set manually.
   * @param event - The change event
   */
  private _handleCityCodeChanged(e: CustomEvent | Event): void {
    const value = (e as CustomEvent).detail?.value ?? (e.target as HTMLInputElement).value;
    this._config.city_code = value;
    // Auto-générer les entités depuis le slug uniquement quand elles ne sont pas
    // déjà renseignées manuellement, afin de préserver les sélections utilisateur.
    if (value && value.trim()) {
      const built = buildEntityIdsFromCityCode(value);
      if (!this._config.alert_level_entity) {
        this._config.alert_level_entity = built.alert_level_entity;
      }
      if (!this._config.alert_level_numeric_entity) {
        this._config.alert_level_numeric_entity = built.alert_level_numeric_entity;
      }
      if (!this._config.restriction_entities || this._config.restriction_entities.length === 0) {
        this._config.restriction_entities = built.restriction_entities;
      }
    }
    this._notifyConfigChanged();
  }

  /**
   * Get the card size for the editor
   * @returns Card height in grid rows
   */
  getCardSize(): number {
    return 6;
  }

  /**
   * Render the editor UI
   * @returns Template result for the editor
   */
  protected render(): TemplateResult {
    const isFr = this.hass?.locale?.language === 'fr';

    return html`
      <ha-settings>
        <!-- City code or slug -->
        <div style="margin-bottom: 16px;">
          <div style="font-weight: 500; margin-bottom: 8px;">
            ${isFr ? 'Code ville / slug' : 'City code or slug'}
          </div>
          <ha-textfield
            .hass=${this.hass}
            .label=${isFr ? 'Code ville / slug' : 'City code or slug'}
            .value=${this._config.city_code || ''}
            .helper=${isFr
              ? 'Ex: 35322 (code INSEE) ou thorigne_fouillard (slug). Génère automatiquement les entités si elles ne sont pas saisies.'
              : 'Ex: 35322 (INSEE code) or thorigne_fouillard (slug). Auto-generates entities when not set manually.'}
            @value-changed=${(e: CustomEvent) => this._handleCityCodeChanged(e)}
            @input=${(e: Event) => this._handleCityCodeChanged(e)}
          ></ha-textfield>
          <div style="font-size: 0.8em; color: var(--secondary-text-color); margin-top: 4px;">
            ${isFr ? 'Laissez vide pour sélectionner les entités manuellement.' : 'Leave empty to select entities manually.'}
          </div>
        </div>

        <!-- Alert level entity -->
        <div>
          <div style="font-weight: 500; margin-bottom: 8px;">
            ${isFr ? 'Entité niveau d\'alerte' : 'Alert level entity'}
          </div>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.alert_level_entity || ''}
            .domain=${['sensor']}
            @value-changed=${(e: CustomEvent) => {
              this._config.alert_level_entity = e.detail.value as string;
              this._notifyConfigChanged();
            }}
            .placeholder=${isFr ? 'Ex: sensor.alert_level_in_thorigne_fouillard' : 'Ex: sensor.alert_level_in_thorigne_fouillard'}
          ></ha-entity-picker>
        </div>

        <!-- Numeric alert level entity (optional) -->
        <div style="margin-top: 16px;">
          <div style="font-weight: 500; margin-bottom: 8px;">
            ${isFr ? 'Entité niveau numérique (optionnel)' : 'Numeric alert level entity (optional)'}
          </div>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.alert_level_numeric_entity || ''}
            .domain=${['sensor']}
            @value-changed=${(e: CustomEvent) => {
              this._config.alert_level_numeric_entity = e.detail.value as string;
              this._notifyConfigChanged();
            }}
            .placeholder=${isFr ? 'Ex: sensor.alert_level_numeric_thorigne_fouillard' : 'Ex: sensor.alert_level_numeric_thorigne_fouillard'}
          ></ha-entity-picker>
        </div>

        <!-- Restriction entities (multiple) -->
        <div style="margin-top: 16px;">
          <div style="font-weight: 500; margin-bottom: 8px;">
            ${isFr ? 'Entités de restrictions' : 'Restriction entities'}
          </div>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.restriction_entities || []}
            .domain=${['sensor']}
            .multiple=${true}
            @value-changed=${(e: CustomEvent) => {
              this._config.restriction_entities = e.detail.value as string[];
              this._notifyConfigChanged();
            }}
            .placeholder=${isFr ? 'Ex: sensor.alimentation_des_fontaines_restrictions_thorigne_fouillard' : 'Ex: sensor.alimentation_des_fontaines_restrictions_thorigne_fouillard'}
          ></ha-entity-picker>
        </div>

        <ha-switch
          .checked=${this._config.show_alert_level}
          @change=${(e: Event) => {
            this._config.show_alert_level = (e.target as HTMLInputElement).checked;
            this._notifyConfigChanged();
          }}
        >
          ${isFr ? 'Afficher le niveau d\'alerte' : 'Show alert level'}
        </ha-switch>

        <ha-switch
          .checked=${this._config.show_restrictions}
          @change=${(e: Event) => {
            this._config.show_restrictions = (e.target as HTMLInputElement).checked;
            this._notifyConfigChanged();
          }}
        >
          ${isFr ? 'Afficher les restrictions' : 'Show restrictions'}
        </ha-switch>

        <ha-switch
          .checked=${this._config.show_progress}
          @change=${(e: Event) => {
            this._config.show_progress = (e.target as HTMLInputElement).checked;
            this._notifyConfigChanged();
          }}
        >
          ${isFr ? 'Afficher la barre de progression' : 'Show progress bar'}
        </ha-switch>

        <ha-switch
          .checked=${this._config.show_last_updated}
          @change=${(e: Event) => {
            this._config.show_last_updated = (e.target as HTMLInputElement).checked;
            this._notifyConfigChanged();
          }}
        >
          ${isFr ? 'Afficher l\'horodatage' : 'Show last updated'}
        </ha-switch>

        <ha-switch
          .checked=${this._config.compact}
          @change=${(e: Event) => {
            this._config.compact = (e.target as HTMLInputElement).checked;
            this._notifyConfigChanged();
          }}
        >
          ${isFr ? 'Taille compacte' : 'Compact size'}
        </ha-switch>

        <ha-switch
          .checked=${this._config.hide_no_restriction}
          @change=${(e: Event) => {
            this._config.hide_no_restriction = (e.target as HTMLInputElement).checked;
            this._notifyConfigChanged();
          }}
        >
          ${isFr ? 'Masquer sans restriction' : 'Hide no restriction'}
        </ha-switch>
      </ha-settings>
    `;
  }

  static get styles() {
    return css`
      ha-textfield,
      ha-entity-picker {
        margin-bottom: 16px;
        display: block;
      }

      ha-switch {
        margin-right: 16px;
        margin-bottom: 16px;
        display: block;
      }
    `;
  }
}