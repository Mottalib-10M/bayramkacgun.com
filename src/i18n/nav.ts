import { route, hasRoute, type Locale } from './routes';
import { GUIDES, guideById } from '../lib/pages';
import type { Group } from '../lib/page-types';
export interface NavLink { href: string; label: string } export interface NavCategory { label: string; links: NavLink[] }
const CORE: Record<Locale, Record<string, string>> = {
  tr: { home: 'Bayram 2027', method: 'Yöntem', about: 'Hakkımızda', widget: 'Araçları ekleyin', contact: 'İletişim', editorial: 'Yayın ilkeleri', privacy: 'Gizlilik', terms: 'Yasal bilgiler', cookies: 'Çerezler' },
  en: { home: 'Bayram 2027', method: 'Method', about: 'About', widget: 'Embed the tools', contact: 'Contact', editorial: 'Editorial policy', privacy: 'Privacy', terms: 'Legal notice', cookies: 'Cookies' },
};
/** `short` : intitulé du menu du haut (un ou deux mots, RECETTE §10.3) ; `label` : intitulé complet. */
export const GROUPS: Array<{ id: Group; label: Record<Locale, string>; short: Record<Locale, string> }> = [
  { id: 'bayram', label: { tr: 'Bayramlar ve dini günler', en: 'Bayrams and religious days' }, short: { tr: 'Bayramlar', en: 'Bayrams' } },
  { id: 'ramazan', label: { tr: 'Ramazan, imsak ve iftar', en: 'Ramadan, fasting times' }, short: { tr: 'Ramazan', en: 'Ramadan' } },
  { id: 'iller', label: { tr: 'İllere göre imsakiye', en: 'Ramadan times by city' }, short: { tr: 'İmsakiye', en: 'Cities' } },
  { id: 'tatil', label: { tr: 'Resmi tatiller ve izin', en: 'Public holidays and leave' }, short: { tr: 'Tatiller', en: 'Holidays' } },
];
export const label = (id: string, lang: Locale) => CORE[lang][id] ?? guideById(id)?.[lang]?.nav ?? id;
const link = (id: string, lang: Locale): NavLink => ({ href: route(id, lang), label: label(id, lang) });
export const inGroup = (g: Group, lang: Locale): NavLink[] => GUIDES.filter((p) => p.group === g && hasRoute(p.id, lang)).map((p) => link(p.id, lang));
export function navCategories(lang: Locale, short = true): NavCategory[] {
  return GROUPS.map((g) => ({ label: (short ? g.short : g.label)[lang], links: g.id === 'bayram' ? [link('home', lang), ...inGroup(g.id, lang)] : inGroup(g.id, lang) })).filter((c) => c.links.length);
}
/** La Méthode n'est pas dans le menu du haut (RECETTE §10.3) : sous le titre et en bas de page. */
export const navDirect = (_lang: Locale): NavLink[] => [];
export const footerColumns = (lang: Locale): NavCategory[] => {
  const site = { label: { tr: 'Bu site', en: 'This site' }[lang], links: ['home', 'method', 'about', 'contact', 'editorial', 'widget', 'terms', 'privacy', 'cookies'].map((i) => link(i, lang)) };
  return [
    { label: GROUPS[0].label[lang], links: inGroup('bayram', lang) },
    { label: GROUPS[1].label[lang], links: [...inGroup('ramazan', lang), ...inGroup('iller', lang)] },
    { label: GROUPS[3].label[lang], links: inGroup('tatil', lang) },
    site,
  ];
};
/** Les outils, à un clic de toute page (RECETTE §18.2). */
export const popularLinks = (lang: Locale): NavLink[] => [link('home', lang), ...['bayrama-kac-gun-kaldi', 'imsakiye-2027', 'iftara-kac-dakika-kaldi', 'kopru-gunleri-2027', 'resmi-tatiller-2027'].filter((id) => hasRoute(id, lang)).map((id) => link(id, lang))];
