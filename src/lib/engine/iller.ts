/**
 * 81 il merkezi ve imsakiye: her il için hesaplanan vakitler (engine/vakit.ts) ve Diyanet takvimiyle karşılaştırma özeti.
 * Koordinatlar src/data/iller.json (Wikidata, CC0). Diyanet saatleri sitede yayımlanmaz; yalnız doğrulama özeti
 * (src/data/dogrulama.json) ve küçük bir örnek tablo gösterilir.
 */
import ILLER from '../../data/iller.json';
import DOG from '../../data/dogrulama.json';
import { vakit, hhmm, type Vakitler } from './vakit';
import { ramazan, addDays, daysBetween, type Ramazan } from './takvim';

export interface Il { plaka: number; ad: string; en: string; merkez: string; slug: string; lat: number; lng: number }
export const IL: Il[] = (ILLER as unknown as { iller: Il[] }).iller;
export const il = (slug: string): Il => { const x = IL.find((i) => i.slug === slug); if (!x) throw new Error(`il inconnu : ${slug}`); return x; };
export const DOGRULAMA = DOG as unknown as {
  okundu: string; gunler: { ilk: string; son: string; adet: number }; iller: number; karsilastirma: number;
  tam: Record<string, number>; ramazan2027: Record<string, number>; enFazlaFark: number;
  ornek: Record<string, Record<string, { imsak: string; aksam: string }>>; ilBazinda: Record<string, number>;
};
/** Bir ilin bir günkü vakitleri (dakika). */
export const ilVakit = (slug: string, iso: string): Vakitler => { const x = il(slug); return vakit(iso, x.lat, x.lng); };
export interface ImsakiyeSatir { gun: number; date: string; imsak: string; gunes: string; aksam: string; yatsi: string; oruc: number; kadir: boolean }
/** Ramazan imsakiyesi: her gün imsak, güneş, iftar (akşam), yatsı ve oruç süresi (dakika). */
export function imsakiye(slug: string, y: number): { r: Ramazan; rows: ImsakiyeSatir[] } {
  const r = ramazan(y);
  if (!r) throw new Error(`Ramazan ${y} bilinmiyor`);
  const rows: ImsakiyeSatir[] = [];
  for (let i = 0; i < r.gun; i++) {
    const date = addDays(r.ilk, i), v = ilVakit(slug, date);
    // Kadir Gecesi, Diyanet listesindeki tarihin akşamıdır: o günün iftarından sonra başlar.
    rows.push({ gun: i + 1, date, imsak: hhmm(v.imsak), gunes: hhmm(v.gunes), aksam: hhmm(v.aksam), yatsi: hhmm(v.yatsi), oruc: v.aksam - v.imsak, kadir: date === r.kadir });
  }
  return { r, rows };
}
/** Ramazan boyunca en kısa ve en uzun oruç, ilk ve son gün iftar farkı. */
export function ramazanOzet(slug: string, y: number) {
  const { r, rows } = imsakiye(slug, y);
  const by = [...rows].sort((a, b) => a.oruc - b.oruc);
  return { r, ilk: rows[0], son: rows[rows.length - 1], enKisa: by[0], enUzun: by[by.length - 1], gun: rows.length, ortalama: Math.round(rows.reduce((a, b) => a + b.oruc, 0) / rows.length) };
}
/** Bir ilin İstanbul'a göre iftar farkı (dakika, + daha geç). */
export const iftarFarki = (slug: string, iso: string, ref = 'istanbul') => ilVakit(slug, iso).aksam - ilVakit(ref, iso).aksam;
/** İki tarih arasındaki gün sayısı (dahil). */
export const gunSayisi = (a: string, b: string) => daysBetween(a, b) + 1;
/** Oruç süresi « 13 sa 21 dk ». */
export const sure = (dk: number, l: 'tr' | 'en') => { const h = Math.floor(dk / 60), m = Math.round(dk % 60); return l === 'tr' ? `${h} sa ${m} dk` : `${h} h ${m} min`; };
/** Doğu–batı: en erken ve en geç iftar eden il, bir gün için. */
export function uclar(iso: string) {
  const all = IL.map((x) => ({ il: x, v: vakit(iso, x.lat, x.lng) }));
  const by = (k: keyof Vakitler) => [...all].sort((a, b) => a.v[k] - b.v[k]);
  const ak = by('aksam'), im = by('imsak');
  return { ilkIftar: ak[0], sonIftar: ak[ak.length - 1], ilkImsak: im[0], sonImsak: im[im.length - 1] };
}
