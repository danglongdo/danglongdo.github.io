import { defaultLang, ui, type SupportedLanguage, type UIKey } from './ui';

/**
 * Extracts the current locale from a URL pathname.
 * Falls back to defaultLang ('en') if not present or unrecognized.
 */
export function getLangFromUrl(url: URL | string): SupportedLanguage {
  const pathname = typeof url === 'string' ? url : url.pathname;
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && firstSegment in ui) {
    return firstSegment as SupportedLanguage;
  }
  return defaultLang;
}

/**
 * Returns a translation function `t(key)` for the specified language.
 *
 * Fallback strategy:
 * 1. Look up key in specified language dictionary.
 * 2. If not found, look up key in default language ('en') dictionary.
 * 3. If still not found, return the key string itself (defensive fallback, never throws).
 */
export function useTranslations(lang: SupportedLanguage) {
  return function t(key: UIKey | string): string {
    if (typeof key !== 'string') {
      return String(key ?? '');
    }

    const currentDict = ui[lang] as Record<string, string> | undefined;
    if (currentDict && Object.prototype.hasOwnProperty.call(currentDict, key)) {
      return currentDict[key];
    }

    const defaultDict = ui[defaultLang] as Record<string, string> | undefined;
    if (defaultDict && Object.prototype.hasOwnProperty.call(defaultDict, key)) {
      return defaultDict[key];
    }

    // Defensive fallback: return the raw key string instead of throwing
    return key;
  };
}

/**
 * Returns a URL path translation helper.
 * Since prefixDefaultLocale is false, English URLs have no prefix (e.g. '/'),
 * while Vietnamese URLs are prefixed with '/vi' (e.g. '/vi').
 */
export function useTranslatedPath(lang: SupportedLanguage) {
  return function translatePath(path: string, targetLang: SupportedLanguage = lang): string {
    const trimmedPath = path.trim() || '/';

    // Preserve query parameters and anchor hash
    const match = trimmedPath.match(/^([^?#]*)([?#].*)?$/);
    const cleanPath = match ? match[1] || '/' : trimmedPath;
    const suffix = match && match[2] ? match[2] : '';

    // Strip existing locale prefix (/vi or /en) if present
    let normalized = cleanPath.replace(/^\/(?:vi|en)(?=\/|$)/, '');
    if (!normalized.startsWith('/')) {
      normalized = '/' + normalized;
    }

    // Format for target locale
    if (targetLang === defaultLang) {
      const finalPath = normalized === '' ? '/' : normalized;
      return `${finalPath}${suffix}`;
    }

    const finalPath = normalized === '/' ? `/${targetLang}` : `/${targetLang}${normalized}`;
    return `${finalPath}${suffix}`;
  };
}
