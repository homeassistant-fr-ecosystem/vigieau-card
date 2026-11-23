import { describe, it, expect } from 'vitest';
import { PropertyValues, TemplateResult, render } from 'lit';
import {
  getRestrictionColor,
  buildEntityIdsFromCityCode,
  getCategoryDisplayName,
  getCategoryIcon,
  VigieauCard,
} from './vigieau-card';
import type { VigieauCardConfig } from './config';
import type { HomeAssistant } from 'custom-card-helpers';

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

describe('Rendu de la carte (Lit)', () => {
  type HassStates = Record<string, { state: string; attributes: Record<string, unknown> }>;

  const createMockHass = (states: HassStates = {}): HomeAssistant => {
    return {
      locale: { language: 'fr' },
      states,
    } as unknown as HomeAssistant;
  };

  const createCard = (
    config: Partial<VigieauCardConfig> = {},
    states: HassStates = {},
  ): VigieauCard => {
    const card = new VigieauCard();
    card.hass = createMockHass(states);
    card.setConfig({
      type: 'custom:vigieau-card',
      city_code: '',
      alert_level_entity: '',
      alert_level_numeric_entity: '',
      restriction_entities: [],
      show_alert_level: true,
      show_restrictions: true,
      compact: false,
      hide_no_restriction: false,
      show_city: true,
      sort: 'severity',
      show_progress: false,
      ...config,
    } as VigieauCardConfig);
    return card;
  };

  const asCardWithPrivate = (card: VigieauCard) =>
    card as unknown as {
      _renderConfigMissing: () => TemplateResult;
      _renderProgressBar: () => TemplateResult;
      _updateEntities: () => void;
      _getRestrictionEntities: () => string[];
      _isNoRestriction: (state: string | null) => boolean;
      shouldUpdate: (changedProps: PropertyValues) => boolean;
    };

  const renderToHtml = (template: TemplateResult): string => {
    const container = document.createElement('div');
    render(template, container);
    return container.innerHTML;
  };

  it('affiche le message de configuration manquante quand aucune entité n est définie', () => {
    const card = createCard();
    const result = asCardWithPrivate(card)._renderConfigMissing();
    const html = renderToHtml(result as TemplateResult);
    expect(html).toContain('Veuillez configurer les entités');
  });

  it('affiche le message de configuration manquante en anglais quand la langue est en', () => {
    const card = createCard();
    card.hass = createMockHass();
    (card.hass as unknown as { locale: { language: string } }).locale = {
      language: 'en',
    };
    const result = asCardWithPrivate(card)._renderConfigMissing();
    const html = renderToHtml(result as TemplateResult);
    expect(html).toContain('Please configure entities');
  });

  it('rend la barre de progression quand show_progress est true', () => {
    const card = createCard(
      {
        show_progress: true,
        alert_level_entity: 'sensor.alert_level',
        alert_level_numeric_entity: 'sensor.alert_level_numeric',
      },
      {
        'sensor.alert_level': { state: 'alerte', attributes: {} },
        'sensor.alert_level_numeric': { state: '2', attributes: {} },
      },
    );

    asCardWithPrivate(card)._updateEntities();
    const result = asCardWithPrivate(card)._renderProgressBar();
    const html = renderToHtml(result as TemplateResult);
    expect(html).toContain('Barre de progression');
    expect(html).toContain('progress-bar');
    expect(html).toContain('2 / 4');
  });

  it('rend la barre de progression avec valeur 0 quand aucune entité numérique', () => {
    const card = createCard(
      {
        show_progress: true,
        alert_level_entity: 'sensor.alert_level',
      },
      {
        'sensor.alert_level': { state: 'alerte', attributes: {} },
      },
    );

    asCardWithPrivate(card)._updateEntities();
    const result = asCardWithPrivate(card)._renderProgressBar();
    const html = renderToHtml(result as TemplateResult);
    expect(html).toContain('0 / 4');
  });

  it('rend la barre de progression par defaut quand show_progress est false', () => {
    const card = createCard({
      show_progress: false,
    });
    const result = asCardWithPrivate(card)._renderProgressBar();
    const html = renderToHtml(result as TemplateResult);
    expect(html).toContain('Barre de progression');
    expect(html).toContain('0 / 4');
  });

  it('getRestrictionEntities retourne les entités de restriction et binaire', () => {
    const card = createCard(
      {
        restriction_entities: ['sensor.restriction1', 'sensor.restriction2'],
      } as VigieauCardConfig,
    );
    const entities = asCardWithPrivate(card)._getRestrictionEntities();
    expect(entities).toContain('sensor.restriction1');
    expect(entities).toContain('sensor.restriction2');
  });

  it('getRestrictionEntities inclut restriction_binary_entities', () => {
    const card = createCard(
      {
        restriction_entities: ['sensor.restriction1'],
        restriction_binary_entities: ['binary_sensor.restriction1'],
      } as VigieauCardConfig,
    );
    const entities = asCardWithPrivate(card)._getRestrictionEntities();
    expect(entities).toContain('sensor.restriction1');
    expect(entities).toContain('binary_sensor.restriction1');
  });

  it('_isNoRestriction identifie les états sans restriction', () => {
    const card = createCard();
    const privateCard = asCardWithPrivate(card);
    expect(privateCard._isNoRestriction('aucune restriction')).toBe(true);
    expect(privateCard._isNoRestriction('vigilance')).toBe(true);
    expect(privateCard._isNoRestriction('alerte')).toBe(false);
    expect(privateCard._isNoRestriction(null)).toBe(false);
  });

  it('shouldUpdate retourne true quand _config change', () => {
    const card = createCard();
    const privateCard = asCardWithPrivate(card);
    const changedProps = new Map([['_config', null]]);
    expect(privateCard.shouldUpdate(changedProps)).toBe(true);
  });

  it('shouldUpdate retourne false quand aucun état d entité n a changé', () => {
    const card = createCard(
      {
        alert_level_entity: 'sensor.alert_level',
      },
      {
        'sensor.alert_level': { state: 'alerte', attributes: {} },
      },
    );
    const privateCard = asCardWithPrivate(card);
    const oldHass = createMockHass({
      'sensor.alert_level': { state: 'alerte', attributes: {} },
    });
    const changedProps = new Map([['hass', oldHass]]);
    // Même état, pas de changement
    expect(privateCard.shouldUpdate(changedProps)).toBe(false);
  });

  it('shouldUpdate retourne true quand l état d une entité change', () => {
    const card = createCard(
      {
        alert_level_entity: 'sensor.alert_level',
      },
      {
        'sensor.alert_level': { state: 'crise', attributes: {} },
      },
    );
    const privateCard = asCardWithPrivate(card);
    const oldHass = createMockHass({
      'sensor.alert_level': { state: 'alerte', attributes: {} },
    });
    const changedProps = new Map([['hass', oldHass]]);
    expect(privateCard.shouldUpdate(changedProps)).toBe(true);
  });
});

