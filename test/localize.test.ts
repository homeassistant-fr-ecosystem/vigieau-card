import { describe, it, expect } from 'vitest';
import { localizeCommon } from '../src/localize';

describe('localizeCommon', () => {
  it('retourne la traduction française pour une clé existante', () => {
    expect(localizeCommon('unknown', 'fr')).toBe('Inconnu');
    expect(localizeCommon('no_data', 'fr')).toBe('Aucune donnée');
    expect(localizeCommon('configure_entities', 'fr')).toBe(
      'Veuillez configurer les entités dans l\'éditeur de carte'
    );
  });

  it('retourne la traduction anglaise pour une clé existante', () => {
    expect(localizeCommon('unknown', 'en')).toBe('Unknown');
    expect(localizeCommon('no_data', 'en')).toBe('No data');
    expect(localizeCommon('configure_entities', 'en')).toBe(
      'Please configure entities in the card editor'
    );
  });

  it('retourne la clé elle-même quand aucune traduction n\'existe', () => {
    expect(localizeCommon('cle_inexistante', 'fr')).toBe('cle_inexistante');
    expect(localizeCommon('missing_key', 'en')).toBe('missing_key');
  });

  it('gère les codes de langue avec préfixe (ex: fr-FR)', () => {
    expect(localizeCommon('unknown', 'fr-FR')).toBe('Inconnu');
    expect(localizeCommon('unknown', 'en-US')).toBe('Unknown');
  });

  it('défault vers l\'anglais pour une langue inconnue', () => {
    expect(localizeCommon('unknown', 'de')).toBe('Unknown');
  });
});
