import { describe, it, expect } from 'vitest';
import {
  getRestrictionColor,
  buildEntityIdsFromCityCode,
  getCategoryDisplayName,
  getCategoryIcon,
} from './vigieau-card';

describe('getRestrictionColor', () => {
  it('retourne green pour aucune restriction / vigilance', () => {
    expect(getRestrictionColor('aucune restriction')).toBe('green');
    expect(getRestrictionColor('vigilance')).toBe('green');
  });

  it('retourne yellow pour alerte / sensibilisation', () => {
    expect(getRestrictionColor('alerte')).toBe('yellow');
    expect(getRestrictionColor('sensibilisation')).toBe('yellow');
  });

  it('retourne orange pour alerte renforcée / interdiction sauf exception / interdiction sur plage horaire / réduction', () => {
    expect(getRestrictionColor('alerte renforcée')).toBe('orange');
    expect(getRestrictionColor('interdiction sauf exception')).toBe('orange');
    expect(getRestrictionColor('interdiction sur plage horaire')).toBe('orange');
    expect(getRestrictionColor('réduction')).toBe('orange');
  });

  it('retourne red pour crise / interdiction', () => {
    expect(getRestrictionColor('crise')).toBe('red');
    expect(getRestrictionColor('interdiction')).toBe('red');
  });

  it('retourne grey pour unknown / unavailable / null / valeur inconnue', () => {
    expect(getRestrictionColor('unknown')).toBe('grey');
    expect(getRestrictionColor('unavailable')).toBe('grey');
    expect(getRestrictionColor(null)).toBe('grey');
    expect(getRestrictionColor('niveau_inconnu')).toBe('grey');
  });

  it('ignore la casse et les espaces', () => {
    expect(getRestrictionColor('  AlERTE  ')).toBe('yellow');
    expect(getRestrictionColor('Crise')).toBe('red');
  });
});

describe('buildEntityIdsFromCityCode', () => {
  it('construit les entity ids à partir d un code INSEE', () => {
    const result = buildEntityIdsFromCityCode('35322');
    expect(result.alert_level_entity).toBe(
      'sensor.outdoor_vigieau_35322_aep_alert_level_in_35322'
    );
    expect(result.alert_level_numeric_entity).toBe(
      'sensor.outdoor_vigieau_35322_aep_alert_level_in_35322_numeric'
    );
    expect(result.restriction_entities).toContain(
      'sensor.vigieau_aep_fountain_supply_restrictions_in_35322'
    );
    expect(result.restriction_entities).toContain(
      'sensor.vigieau_aep_pool_draining_and_filling_restrictions_in_35322'
    );
    expect(result.restriction_entities.length).toBe(17);
  });

  it('normalise le slug (minuscules, trim)', () => {
    const result = buildEntityIdsFromCityCode('  Thorigne-Fouillard  ');
    expect(result.alert_level_entity).toBe(
      'sensor.outdoor_vigieau_thorigne-fouillard_aep_alert_level_in_thorigne-fouillard'
    );
  });
});

describe('getCategoryDisplayName', () => {
  it('retourne la traduction française pour une categorie connue', () => {
    expect(getCategoryDisplayName('alimentation_des_fontaines', 'fr')).toBe(
      'Alimentation des fontaines'
    );
    expect(getCategoryDisplayName('jardins_potagers', 'fr')).toBe(
      'Jardins potagers'
    );
    expect(getCategoryDisplayName('piscines', 'fr')).toBe('Piscines');
  });

  it('retourne la traduction anglaise pour une categorie connue', () => {
    expect(getCategoryDisplayName('alimentation_des_fontaines', 'en')).toBe(
      'Fountains'
    );
    expect(getCategoryDisplayName('pelouses', 'en')).toBe('Lawns');
  });

  it('fallback vers underscores -> espaces pour une categorie inconnue', () => {
    expect(getCategoryDisplayName('ma_categorie', 'fr')).toBe('ma categorie');
    expect(getCategoryDisplayName('ma_categorie', 'en')).toBe('ma categorie');
  });

  it('gère les codes de langue avec préfixe', () => {
    expect(getCategoryDisplayName('piscines', 'fr-FR')).toBe('Piscines');
    expect(getCategoryDisplayName('piscines', 'en-US')).toBe('Pools');
  });
});

describe('getCategoryIcon', () => {
  it('retourne l icone mdi pour chaque categorie', () => {
    expect(getCategoryIcon('alimentation_des_fontaines')).toBe('mdi:fountain');
    expect(getCategoryIcon('jardins_potagers')).toBe('mdi:flower');
    expect(getCategoryIcon('pelouses')).toBe('mdi:grass');
    expect(getCategoryIcon('lavage_des_vehicules')).toBe('mdi:car-wash');
    expect(getCategoryIcon('piscines')).toBe('mdi:pool');
    expect(getCategoryIcon('voiries_trottoirs')).toBe('mdi:road');
    expect(getCategoryIcon('toitures_facades')).toBe('mdi:roof');
    expect(getCategoryIcon('plans_deau')).toBe('mdi:water');
  });

  it('retourne mdi:water par defaut pour une categorie inconnue', () => {
    expect(getCategoryIcon('inconnue')).toBe('mdi:water');
  });
});

