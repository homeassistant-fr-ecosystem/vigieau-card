import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VigieauCard } from './vigieau-card';
import { HomeAssistant } from 'custom-card-helpers';
import { VigieauCardConfig } from './config';

/**
 * Crée un objet HomeAssistant minimal pour les tests.
 */
function createHass(entities: Record<string, { state: string; last_updated?: string; attributes?: Record<string, unknown> }>): HomeAssistant {
  return {
    states: Object.fromEntries(
      Object.entries(entities).map(([id, ent]) => [id, { ...ent, entity_id: id, last_changed: ent.last_updated ?? '', context: { id, parent_id: null, user_id: null } }])
    ),
    locale: { language: 'fr' },
    language: 'fr',
    connected: true,
  } as unknown as HomeAssistant;
}

/**
 * Monte le card dans le DOM happy-dom et attend le premier rendu.
 */
async function mountCard(config: Partial<VigieauCardConfig>, entities: Record<string, { state: string; last_updated?: string; attributes?: Record<string, unknown> }> = {}): Promise<VigieauCard> {
  const card = new VigieauCard();
  card.hass = createHass(entities);
  document.body.appendChild(card);
  card.setConfig({
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
    ...config,
  });
  await card.updateComplete;
  return card;
}

describe('VigieauCard rendering', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('affiche un message de configuration quand aucune entité n est définie', async () => {
    const card = await mountCard({});
    const msg = card.shadowRoot?.querySelector('.config-missing');
    expect(msg).not.toBeNull();
    expect(msg?.textContent).toContain('configurer');
  });

  it('affiche le header du niveau d alerte quand configuré', async () => {
    const card = await mountCard(
      { alert_level_entity: 'sensor.alert_level_in_test' },
      { 'sensor.alert_level_in_test': { state: 'alerte', last_updated: '2026-01-01T12:00:00' } }
    );
    const header = card.shadowRoot?.querySelector('.card-header');
    expect(header).not.toBeNull();
    const alertLevel = card.shadowRoot?.querySelector('.alert-level');
    expect(alertLevel).not.toBeNull();
    expect(alertLevel?.textContent).toContain('Alerte');
  });

  it('affiche la grille des restrictions avec entités configurées', async () => {
    const card = await mountCard(
      {
        alert_level_entity: 'sensor.alert_level_in_test',
        restriction_entities: [
          'sensor.alimentation_des_fontaines_restrictions_test',
          'sensor.piscines_restrictions_test',
        ],
      },
      {
        'sensor.alert_level_in_test': { state: 'vigilance' },
        'sensor.alimentation_des_fontaines_restrictions_test': { state: 'alerte' },
        'sensor.piscines_restrictions_test': { state: 'crise' },
      }
    );
    const grid = card.shadowRoot?.querySelector('.restrictions-grid');
    expect(grid).not.toBeNull();
    const items = card.shadowRoot?.querySelectorAll('.restriction-item');
    expect(items?.length).toBe(2);
  });

  it('masque les catégories sans restriction avec hide_no_restriction', async () => {
    const card = await mountCard(
      {
        alert_level_entity: 'sensor.alert_level_in_test',
        restriction_entities: [
          'sensor.alimentation_des_fontaines_restrictions_test',
          'sensor.piscines_restrictions_test',
        ],
        hide_no_restriction: true,
      },
      {
        'sensor.alert_level_in_test': { state: 'vigilance' },
        'sensor.alimentation_des_fontaines_restrictions_test': { state: 'aucune restriction' },
        'sensor.piscines_restrictions_test': { state: 'crise' },
      }
    );
    const items = card.shadowRoot?.querySelectorAll('.restriction-item');
    expect(items?.length).toBe(1);
    expect(card.shadowRoot?.textContent).toContain('Piscines');
  });

  it('affiche la barre de progression quand show_progress et niveau numérique', async () => {
    const card = await mountCard(
      {
        alert_level_entity: 'sensor.alert_level_in_test',
        alert_level_numeric_entity: 'sensor.alert_level_numeric_test',
        show_progress: true,
      },
      {
        'sensor.alert_level_in_test': { state: 'alerte' },
        'sensor.alert_level_numeric_test': { state: '2' },
      }
    );
    const progressBar = card.shadowRoot?.querySelector('.progress-bar');
    expect(progressBar).not.toBeNull();
    const fill = card.shadowRoot?.querySelector('.progress-fill') as HTMLElement | null;
    expect(fill?.style.width).toBe('50%');
  });

  it('affiche l horodatage quand show_last_updated est activé', async () => {
    const card = await mountCard(
      {
        alert_level_entity: 'sensor.alert_level_in_test',
        show_last_updated: true,
      },
      {
        'sensor.alert_level_in_test': { state: 'vigilance', last_updated: '2026-06-15T10:30:00' },
      }
    );
    const lastUpdated = card.shadowRoot?.querySelector('.last-updated');
    expect(lastUpdated).not.toBeNull();
  });

  it('applique la classe compact sur ha-card quand compact est activé', async () => {
    const card = await mountCard(
      { alert_level_entity: 'sensor.alert_level_in_test', compact: true },
      { 'sensor.alert_level_in_test': { state: 'vigilance' } }
    );
    const haCard = card.shadowRoot?.querySelector('ha-card');
    expect(haCard?.classList.contains('compact')).toBe(true);
  });

  it('affiche "Entité indisponible" pour une entité unavailable', async () => {
    const card = await mountCard(
      { alert_level_entity: 'sensor.alert_level_in_test' },
      { 'sensor.alert_level_in_test': { state: 'unavailable' } }
    );
    const alertLevel = card.shadowRoot?.querySelector('.alert-level');
    expect(alertLevel?.textContent).toContain('indisponible');
  });

  it('affiche "État inconnu" pour une entité unknown', async () => {
    const card = await mountCard(
      { alert_level_entity: 'sensor.alert_level_in_test' },
      { 'sensor.alert_level_in_test': { state: 'unknown' } }
    );
    const alertLevel = card.shadowRoot?.querySelector('.alert-level');
    expect(alertLevel?.textContent).toContain('inconnu');
  });

  it('affiche "Entité introuvable" quand l entité niveau d alerte est absente', async () => {
    const card = await mountCard(
      { alert_level_entity: 'sensor.alert_level_does_not_exist' },
      {}
    );
    const alertLevel = card.shadowRoot?.querySelector('.alert-level');
    expect(alertLevel).not.toBeNull();
    expect(alertLevel?.textContent).toContain('introuvable');
    expect(alertLevel?.classList.contains('entity-not-found')).toBe(true);
  });

  it('affiche "Entité introuvable" pour une restriction absente', async () => {
    const card = await mountCard(
      {
        alert_level_entity: 'sensor.alert_level_in_test',
        restriction_entities: ['sensor.restriction_does_not_exist'],
      },
      { 'sensor.alert_level_in_test': { state: 'vigilance' } }
    );
    const item = card.shadowRoot?.querySelector('.restriction-item.entity-not-found');
    expect(item).not.toBeNull();
    expect(item?.textContent).toContain('introuvable');
  });

  it('affiche une restriction normalement quand elle existe', async () => {
    const card = await mountCard(
      {
        alert_level_entity: 'sensor.alert_level_in_test',
        restriction_entities: ['sensor.piscines_restrictions_test'],
      },
      {
        'sensor.alert_level_in_test': { state: 'vigilance' },
        'sensor.piscines_restrictions_test': { state: 'crise' },
      }
    );
    const item = card.shadowRoot?.querySelector('.restriction-item:not(.entity-not-found)');
    expect(item).not.toBeNull();
    expect(item?.textContent).toContain('Piscines');
    expect(item?.textContent).toContain('Crise');
  });

  it('utilise la couleur depuis l attribut Couleur (majuscule)', async () => {
    const card = await mountCard(
      {
        alert_level_entity: 'sensor.alert_level_in_test',
        restriction_entities: ['sensor.piscines_restrictions_test'],
      },
      {
        'sensor.alert_level_in_test': { state: 'vigilance' },
        'sensor.piscines_restrictions_test': {
          state: 'alerte',
          attributes: { Couleur: 'purple' },
        },
      }
    );
    const item = card.shadowRoot?.querySelector('.restriction-item:not(.entity-not-found)') as HTMLElement | null;
    expect(item).not.toBeNull();
    expect(item?.style.borderColor).toBe('purple');
  });

  it('utilise la couleur depuis l attribut couleur (minuscule)', async () => {
    const card = await mountCard(
      {
        alert_level_entity: 'sensor.alert_level_in_test',
        restriction_entities: ['sensor.piscines_restrictions_test'],
      },
      {
        'sensor.alert_level_in_test': { state: 'vigilance' },
        'sensor.piscines_restrictions_test': {
          state: 'alerte',
          attributes: { couleur: 'pink' },
        },
      }
    );
    const item = card.shadowRoot?.querySelector('.restriction-item:not(.entity-not-found)') as HTMLElement | null;
    expect(item).not.toBeNull();
    expect(item?.style.borderColor).toBe('pink');
  });

  it('trie les restrictions par ordre alphabetique (sort=alpha)', async () => {
    const card = await mountCard(
      {
        alert_level_entity: 'sensor.alert_level_in_test',
        restriction_entities: [
          'sensor.piscines_restrictions_test',
          'sensor.alimentation_des_fontaines_restrictions_test',
        ],
        sort: 'alpha',
      },
      {
        'sensor.alert_level_in_test': { state: 'vigilance' },
        'sensor.piscines_restrictions_test': { state: 'crise' },
        'sensor.alimentation_des_fontaines_restrictions_test': { state: 'alerte' },
      }
    );
    const items = card.shadowRoot?.querySelectorAll('.restriction-item:not(.entity-not-found)');
    expect(items?.length).toBe(2);
    const first = items?.[0]?.textContent || '';
    expect(first).toContain('Alimentation');
  });

  it('trie les restrictions par severite (sort=severity)', async () => {
    const card = await mountCard(
      {
        alert_level_entity: 'sensor.alert_level_in_test',
        restriction_entities: [
          'sensor.alimentation_des_fontaines_restrictions_test',
          'sensor.piscines_restrictions_test',
        ],
        sort: 'severity',
      },
      {
        'sensor.alert_level_in_test': { state: 'vigilance' },
        'sensor.alimentation_des_fontaines_restrictions_test': { state: 'alerte' },
        'sensor.piscines_restrictions_test': { state: 'crise' },
      }
    );
    const items = card.shadowRoot?.querySelectorAll('.restriction-item:not(.entity-not-found)');
    expect(items?.length).toBe(2);
    const first = items?.[0]?.textContent || '';
    expect(first).toContain('Piscines');
  });
});
