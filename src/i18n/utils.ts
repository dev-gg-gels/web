import { translations, type Locale } from './translations';

export function getT(locale: string | undefined): (typeof translations)[Locale] {
  const l = (locale ?? 'nb') as Locale;
  return translations[l] ?? translations.nb;
}

export function getLocalePath(locale: Locale, path = ''): string {
  if (locale === 'nb') return `/${path}`.replace(/\/$/, '') || '/';
  return `/en${path ? `/${path}` : ''}`;
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === 'nb' ? 'en' : 'nb';
}
