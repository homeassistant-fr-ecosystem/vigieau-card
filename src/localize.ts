/**
 * Translation functions for the Vigieau Card
 */

// French translations
const FR_TRANSLATIONS = {
  unknown: 'Inconnu',
  no_data: 'Aucune donnée',
  fountains: 'Fontaines',
  gardens: 'Jardins',
  lawns: 'Pelouses',
  vehicle_wash: 'Lavage de véhicules',
  pools: 'Piscines',
  roads: 'Routes',
  roofs: 'Toits',
  ponds: 'Étangs',
};

// English translations
const EN_TRANSLATIONS = {
  unknown: 'Unknown',
  no_data: 'No data',
  fountains: 'Fountains',
  gardens: 'Gardens',
  lawns: 'Lawns',
  vehicle_wash: 'Vehicle Wash',
  pools: 'Pools',
  roads: 'Roads',
  roofs: 'Roofs',
  ponds: 'Ponds',
};

/**
 * Get a localized string
 * @param key - The translation key
 * @param lang - The language code (default: 'en')
 * @returns The localized string
 */
export function localizeCommon(key: string, lang: string = 'en'): string {
  const translations = lang.startsWith('fr') ? FR_TRANSLATIONS : EN_TRANSLATIONS;
  return translations[key] || key;
}

/**
 * Localize a face state (for compatibility with other cards)
 * @param face - The face state
 * @param lang - The language code
 * @returns The localized face name
 */
export function localizeFace(face: string, lang: string = 'en'): string {
  return localizeCommon(face, lang);
}