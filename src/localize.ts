/**
 * Translation functions for the Vigieau Card
 */

import EN_TRANSLATIONS from './en.json';
import FR_TRANSLATIONS from './fr.json';

const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: EN_TRANSLATIONS,
  fr: FR_TRANSLATIONS,
};

/**
 * Get a localized string
 * @param key - The translation key
 * @param lang - The language code (default: 'en')
 * @returns The localized string
 */
export function localizeCommon(key: string, lang: string = 'en'): string {
  const translations = TRANSLATIONS[lang.startsWith('fr') ? 'fr' : 'en'];
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
