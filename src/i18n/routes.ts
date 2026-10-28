import { makeRouter, type RouteDef } from './routes-core';
import { GUIDES } from '../lib/pages';
/** Türkçe önce, her sayfa İngilizce de (RECETTE : langue locale + anglais). */
export const LOCALES = ['tr', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'tr';
const R = (id: string, tr: string, en: string, noindex = false) => ({ id, paths: { tr: `/tr/${tr}/`, en: `/en/${en}/` }, ...(noindex ? { noindex } : {}) });
const CORE: RouteDef<Locale>[] = [
  { id: 'home', paths: { tr: '/tr/', en: '/en/' } },
  R('method', 'yontem', 'method'),
  R('about', 'hakkimizda', 'about'),
  R('widget', 'widget', 'widget', true),
  R('contact', 'iletisim', 'contact', true),
  R('editorial', 'yayin-ilkeleri', 'editorial-policy', true),
  R('privacy', 'gizlilik', 'privacy', true),
  R('terms', 'yasal-bilgiler', 'legal-notice', true),
  R('cookies', 'cerezler', 'cookies', true),
];
const G = (g: (typeof GUIDES)[number]): RouteDef<Locale> => ({ id: g.id, paths: { tr: `/tr/${g.tr.slug}/`, en: `/en/${g.en.slug}/` } });
export const ROUTES: RouteDef<Locale>[] = [CORE[0], ...GUIDES.map(G), ...CORE.slice(1)];
export const { NOINDEX_PATHS, route, hasRoute, altPaths } = makeRouter(LOCALES, ROUTES);
