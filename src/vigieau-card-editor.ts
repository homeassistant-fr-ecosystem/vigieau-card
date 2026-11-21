/**
 * Vigieau Card Editor - Configuration editor for the Vigieau custom card
 */

import { html, css, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';

/**
 * Configuration interface for the editor
 */
interface VigieauCardEditorConfig {
  type: string;
  city_code?: string;
  alert_level_entity?: string;
  alert_level_numeric_entity?: string;
  restriction_entities?: string[];
  show_alert_level?: boolean;
  show_restrictions?: boolean;
  show_progress?: boolean;
}

/**
 * The Vigieau Card Editor element
 */
@customElement('vigieau-card-editor')
export class VigieauCardEditor extends LitElement {
  @property() private hass!: HomeAssistant;
  @property() private _config: VigieauCardEditorConfig = {
    type: 'custom:vigieau-card',
    city_code: '',
    alert_level_entity: '',
    alert_level_numeric_entity: '',
    restriction_entities: [],
    show_alert_level: true,
    show_restrictions: true,
    show_progress: false,
  };

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
    };
  }

  /**
   * Set the configuration
   * @param config - The configuration object from Lovelace
   */
  setConfig(config: VigieauCardEditorConfig): void {
    this._config = {
      ...VigieauCardEditor.getStubConfig(),
      ...config,
    };
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
        <!-- City code (INSEE) -->
        <div style="margin-bottom: 16px;">
          <div style="font-weight: 500; margin-bottom: 8px;">
            ${isFr ? 'Code commune (INSEE)' : 'City code (INSEE)'}
          </div>
          <ha-textfield
            .hass=${this.hass}
            .label=${isFr ? 'Code commune' : 'City code'}
            .value=${this._config.city_code || ''}
            .helper=${isFr
              ? 'Ex: 35322 pour Thorigné-Fouillard. Génère automatiquement les entités si elles ne sont pas saisies.'
              : 'Ex: 35322 for Thorigne-Fouillard. Auto-generates entities when not set manually.'}
            @value-changed=${(e: CustomEvent) => {
              this._config.city_code = (e.target as HTMLInputElement).value;
              this.requestUpdate();
            }}
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
              this.requestUpdate();
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
              this.requestUpdate();
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
              this.requestUpdate();
            }}
            .placeholder=${isFr ? 'Ex: sensor.alimentation_des_fontaines_restrictions_thorigne_fouillard' : 'Ex: sensor.alimentation_des_fontaines_restrictions_thorigne_fouillard'}
          ></ha-entity-picker>
        </div>

        <ha-switch
          .checked=${this._config.show_alert_level}
          @change=${(e: Event) => {
            this._config.show_alert_level = (e.target as HTMLInputElement).checked;
          }}
        >
          ${isFr ? 'Afficher le niveau d\'alerte' : 'Show alert level'}
        </ha-switch>

        <ha-switch
          .checked=${this._config.show_restrictions}
          @change=${(e: Event) => {
            this._config.show_restrictions = (e.target as HTMLInputElement).checked;
          }}
        >
          ${isFr ? 'Afficher les restrictions' : 'Show restrictions'}
        </ha-switch>

        <ha-switch
          .checked=${this._config.show_progress}
          @change=${(e: Event) => {
            this._config.show_progress = (e.target as HTMLInputElement).checked;
          }}
        >
          ${isFr ? 'Afficher la barre de progression' : 'Show progress bar'}
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