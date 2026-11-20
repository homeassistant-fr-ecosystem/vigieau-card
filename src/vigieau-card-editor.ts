/**
 * Vigieau Card Editor - Configuration editor for the Vigieau custom card
 */

import { html, css, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';

/**
 * Configuration interface for the editor
 */
interface VigieauCardEditorConfig {
  type: string;
  city_code: string;
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
    const { city_code, show_alert_level, show_restrictions, show_progress } = this._config;

    return html`
      <ha-settings>
        <ha-textfield
          .label="INSEE City Code"
          .value=${city_code}
          @change=${(e: Event) => {
            const target = e.target as HTMLInputElement;
            this._config.city_code = target.value;
            this.requestUpdate();
          }}
          .placeholder="e.g., 75056 for Paris, 35238 for Rennes"
          required
        ></ha-textfield>

        <ha-switch
          .checked=${show_alert_level}
          @change=${(e: Event) => {
            this._config.show_alert_level = (e.target as HTMLInputElement).checked;
          }}
        >
          ${this.hass?.locale?.language === 'fr' ? 'Afficher le niveau d\'alerte' : 'Show alert level'}
        </ha-switch>

        <ha-switch
          .checked=${show_restrictions}
          @change=${(e: Event) => {
            this._config.show_restrictions = (e.target as HTMLInputElement).checked;
          }}
        >
          ${this.hass?.locale?.language === 'fr' ? 'Afficher les restrictions' : 'Show restrictions'}
        </ha-switch>

        <ha-switch
          .checked=${show_progress}
          @change=${(e: Event) => {
            this._config.show_progress = (e.target as HTMLInputElement).checked;
          }}
        >
          ${this.hass?.locale?.language === 'fr' ? 'Afficher la barre de progression' : 'Show progress bar'}
        </ha-switch>
      </ha-settings>
    `;
  }

  static get styles() {
    return css`
      ha-textfield {
        margin-bottom: 16px;
      }

      ha-switch {
        margin-right: 16px;
        margin-bottom: 16px;
      }
    `;
  }
}