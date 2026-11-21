import { describe, it, expect } from 'vitest';
import { VigieauCardEditor, VigieauCardEditorConfig } from './vigieau-card-editor';
import { buildEntityIdsFromCityCode } from './vigieau-card';

describe('VigieauCardEditor', () => {
  describe('getStubConfig', () => {
    it('retourne une configuration par défaut complète', () => {
      const stub = VigieauCardEditor.getStubConfig();
      expect(stub.type).toBe('custom:vigieau-card');
      expect(stub.city_code).toBe('');
      expect(stub.alert_level_entity).toBe('');
      expect(stub.alert_level_numeric_entity).toBe('');
      expect(stub.restriction_entities).toEqual([]);
      expect(stub.show_alert_level).toBe(true);
      expect(stub.show_restrictions).toBe(true);
      expect(stub.show_progress).toBe(false);
      expect(stub.show_last_updated).toBe(false);
      expect(stub.compact).toBe(false);
      expect(stub.hide_no_restriction).toBe(false);
    });
  });

  describe('setConfig / config getter', () => {
    it('fusionne la config fournie avec les valeurs par défaut', () => {
      const editor = new VigieauCardEditor();
      editor.setConfig({
        type: 'custom:vigieau-card',
        city_code: '35322',
        show_restrictions: false,
      } as VigieauCardEditorConfig);

      expect(editor.config.city_code).toBe('35322');
      expect(editor.config.show_restrictions).toBe(false);
      // Les valeurs non spécifiées conservent leur défaut
      expect(editor.config.show_alert_level).toBe(true);
      expect(editor.config.type).toBe('custom:vigieau-card');
      expect(editor.config.hide_no_restriction).toBe(false);
    });

    it('le getter config expose la configuration courante', () => {
      const editor = new VigieauCardEditor();
      editor.setConfig({
        type: 'custom:vigieau-card',
        city_code: 'thorigne_fouillard',
      } as VigieauCardEditorConfig);

      expect(editor.config.city_code).toBe('thorigne_fouillard');
      expect(editor.config.type).toBe('custom:vigieau-card');
    });
  });

  describe('_notifyConfigChanged', () => {
    it('dispatch un événement config-changed avec la config courante', () => {
      const editor = new VigieauCardEditor();
      editor.setConfig({
        type: 'custom:vigieau-card',
        city_code: '35322',
        hide_no_restriction: true,
      } as VigieauCardEditorConfig);

      let received: VigieauCardEditorConfig | null = null;
      editor.addEventListener(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        'config-changed' as any,
        ((e: CustomEvent) => {
          received = e.detail.config as VigieauCardEditorConfig;
        }) as EventListener
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (editor as any)._notifyConfigChanged();

      expect(received).not.toBeNull();
      expect(received!.city_code).toBe('35322');
      expect(received!.hide_no_restriction).toBe(true);
    });
  });

  describe('auto-generation des entités depuis le slug', () => {
    it('construit les entity ids à partir d un code INSEE', () => {
      const built = buildEntityIdsFromCityCode('35322');
      expect(built.alert_level_entity).toBe('sensor.alert_level_in_35322');
      expect(built.alert_level_numeric_entity).toBe('sensor.alert_level_numeric_35322');
      expect(built.restriction_entities).toContain(
        'sensor.alimentation_des_fontaines_restrictions_35322'
      );
      expect(built.restriction_entities.length).toBe(8);
    });

    it('regénère les entités quand le code ville change (éditeur)', () => {
      const editor = new VigieauCardEditor();
      editor.setConfig({
        type: 'custom:vigieau-card',
        city_code: '35322',
      } as VigieauCardEditorConfig);

      // On simule un changement de ville dans le champ texte
      const event = new CustomEvent('value-changed', {
        detail: { value: 'thorigne_fouillard' },
        bubbles: true,
        composed: true,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (editor as any)._handleCityCodeChanged(event);

      expect(editor.config.city_code).toBe('thorigne_fouillard');
      expect(editor.config.alert_level_entity).toBe('sensor.alert_level_in_thorigne_fouillard');
      expect(editor.config.alert_level_numeric_entity).toBe(
        'sensor.alert_level_numeric_thorigne_fouillard'
      );
      expect(editor.config.restriction_entities).toContain(
        'sensor.alimentation_des_fontaines_restrictions_thorigne_fouillard'
      );
    });

    it('préserve les entités sélectionnées manuellement quand le code ville change', () => {
      const editor = new VigieauCardEditor();
      editor.setConfig({
        type: 'custom:vigieau-card',
        city_code: '35322',
        alert_level_entity: 'sensor.custom_alert',
        alert_level_numeric_entity: 'sensor.custom_numeric',
        restriction_entities: ['sensor.custom_restriction'],
      } as VigieauCardEditorConfig);

      // On simule un changement de ville dans le champ texte
      const event = new CustomEvent('value-changed', {
        detail: { value: 'thorigne_fouillard' },
        bubbles: true,
        composed: true,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (editor as any)._handleCityCodeChanged(event);

      expect(editor.config.city_code).toBe('thorigne_fouillard');
      // Les entités saisies manuellement doivent être préservées, pas écrasées
      expect(editor.config.alert_level_entity).toBe('sensor.custom_alert');
      expect(editor.config.alert_level_numeric_entity).toBe('sensor.custom_numeric');
      expect(editor.config.restriction_entities).toEqual(['sensor.custom_restriction']);
    });
  });
});
