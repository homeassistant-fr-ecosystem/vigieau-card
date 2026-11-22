/**
 * Shared configuration for the Vigieau Card.
 * Centralises the default config, restriction categories and entity-id
 * building logic so the card and its editor stay in sync.
 */

/**
 * Configuration interface for the Vigieau Card.
 * Entities are selected explicitly via the UI editor; no entity_id is built from a city code.
 */
export interface VigieauCardConfig {
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
  /** Compact card size (reduced padding and font sizes) */
  compact?: boolean;
  /** Hide restriction categories with no active restriction */
  hide_no_restriction?: boolean;
  /** Tri des restrictions : 'config' (ordre config), 'alpha' (alphabétique), 'severity' (sévérité) */
  sort?: 'config' | 'alpha' | 'severity';
}

/** Restriction categories known by the vigieau integration, used to auto-build entity ids from a city code. */
export const RESTRICTION_CATEGORIES: string[] = [
  'alimentation_des_fontaines',
  'jardins_potagers',
  'pelouses',
  'lavage_des_vehicules',
  'piscines',
  'voiries_trottoirs',
  'toitures_facades',
  'plans_deau',
];

/** Default configuration applied when no value is provided. */
export const DEFAULT_CONFIG: Required<VigieauCardConfig> = {
  type: 'custom:vigieau-card',
  city_code: '',
  alert_level_entity: '',
  alert_level_numeric_entity: '',
  restriction_entities: [],
  show_alert_level: true,
  show_restrictions: true,
  compact: false,
  hide_no_restriction: false,
  sort: 'config',
};

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
    alert_level_numeric_entity: `sensor.alert_level_in_${slug}_numeric`,
    restriction_entities: RESTRICTION_CATEGORIES.map(
      (cat) => `sensor.${cat}_restrictions_${slug}`
    ),
  };
}

/**
 * Apply a city code / slug to a configuration, auto-building entity ids
 * only for fields that are not already set manually.
 * @param config - The base configuration
 * @param cityCode - The INSEE code or slug
 * @returns A new configuration with auto-built entity ids filled in
 */
export function applyCityCodeToConfig(
  config: VigieauCardConfig,
  cityCode: string
): VigieauCardConfig {
  const resolvedConfig = { ...config };
  if (cityCode && cityCode.trim()) {
    const built = buildEntityIdsFromCityCode(cityCode);
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
  return resolvedConfig;
}

/** Rang de sévérité d'un niveau de restriction (plus élevé = plus sévère). */
export function getSeverityRank(level: string | null): number {
  if (!level) return 0;
  const lower = level.toLowerCase().trim();
  const ranks: Record<string, number> = {
    'aucune restriction': 0,
    'vigilance': 0,
    'aucune': 0,
    'normale': 0,
    'aucun': 0,
    'rien': 0,
    'sensibilisation': 1,
    'alerte': 2,
    'alerte renforcée': 3,
    'réduction': 3,
    'interdiction sauf exception': 4,
    'interdiction sur plage horaire': 4,
    'crise': 5,
    'interdiction': 5,
  };
  return ranks[lower] ?? 0;
}
