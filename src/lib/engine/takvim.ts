/**
 * Bayramlar ve resmi tatiller, hesaplanmış ve elle yazılmamış.
 *
 * - Dini bayramlar ve dini günler: Diyanet İşleri Başkanlığının yıllık "Dini Günler" listeleri (src/data/dini-gunler.json,
 *   2026–2035). Hicri ay başı Diyanet'in hesabıyla belirlenir: hilalin dünyanın herhangi bir yerinde görülebilir olması
 *   (içtima doğrultusundan en az 8° açılma, gün batımında en az 5° yükseklik). Liste yoksa tarih yazılmaz.
 * - Resmi tatiller: 2429 sayılı Ulusal Bayram ve Genel Tatiller Hakkında Kanun, md. 1 ve 2:
 *   29 Ekim (28 Ekim 13.00'ten itibaren), 23 Nisan, 19 Mayıs, 30 Ağustos, 1 Ocak, 1 Mayıs, 15 Temmuz,
 *   Ramazan Bayramı arefe 13.00'ten itibaren 3,5 gün, Kurban Bayramı arefe 13.00'ten itibaren 4,5 gün.
 * - Hafta sonuna denk gelen tatil Türkiye'de başka güne kaydırılmaz.
 */
import DG from '../../data/dini-gunler.json';

/* ------------------------------------------------------------------ Günler tam sayı olarak (UTC) */
const MS = 86400000;
export const dayNum = (y: number, m: number, d: number) => Date.UTC(y, m - 1, d) / MS;
export const fromIso = (iso: string) => { const [y, m, d] = iso.split('-').map(Number); return dayNum(y, m, d); };
export const toIso = (n: number) => new Date(n * MS).toISOString().slice(0, 10);
export const addDays = (iso: string, k: number) => toIso(fromIso(iso) + k);
/** 0 = Pazar … 6 = Cumartesi */
export const weekday = (n: number) => new Date(n * MS).getUTCDay();
/** Hafta tatili: 5 günlük haftada Cumartesi ve Pazar, 6 günlük haftada yalnız Pazar (2429 md. 3: hafta tatili Pazar). */
export type Hafta = '5' | '6';
export const isWeekend = (n: number, h: Hafta = '5') => { const w = weekday(n); return w === 0 || (h === '5' && w === 6); };
export const daysBetween = (a: string, b: string) => fromIso(b) - fromIso(a);

/* ------------------------------------------------------------------ Dini günler (Diyanet) */
export type DiniId = 'ramazan-baslangici' | 'kadir' | 'ramazan-arefe' | 'ramazan-1' | 'ramazan-2' | 'ramazan-3' | 'kurban-arefe' | 'kurban-1' | 'kurban-2' | 'kurban-3' | 'kurban-4' | 'hicri-yilbasi' | 'asure' | 'mevlid' | 'uc-aylar' | 'regaib' | 'mirac' | 'berat';
export interface DiniGun { id: DiniId; date: string; pair: boolean; hicri: string }
const YEARS = (DG as unknown as { years: Record<string, { source: string; events: DiniGun[] }> }).years;
export const DINI_YILLAR = Object.keys(YEARS).map(Number).sort((a, b) => a - b);
export const diniKaynak = (y: number) => YEARS[String(y)]?.source;
/** Bir yılın dini günleri, tarih sırasıyla. */
export const diniGunler = (y: number): DiniGun[] => [...(YEARS[String(y)]?.events ?? [])].sort((a, b) => a.date.localeCompare(b.date));
/** Tüm yıllardaki dini günler (bir yıla iki Ramazan Bayramı düşebilir: 2033). */
export const TUM_DINI: DiniGun[] = DINI_YILLAR.flatMap(diniGunler);
export const DINI_AD: Record<DiniId, { tr: string; en: string }> = {
  'ramazan-baslangici': { tr: 'Ramazan başlangıcı (ilk oruç)', en: 'Start of Ramadan (first fast)' },
  kadir: { tr: 'Kadir Gecesi', en: 'Laylat al-Qadr (Night of Power)' },
  'ramazan-arefe': { tr: 'Ramazan Bayramı arefesi', en: 'Eve of Eid al-Fitr' },
  'ramazan-1': { tr: 'Ramazan Bayramı 1. gün', en: 'Eid al-Fitr, day 1' },
  'ramazan-2': { tr: 'Ramazan Bayramı 2. gün', en: 'Eid al-Fitr, day 2' },
  'ramazan-3': { tr: 'Ramazan Bayramı 3. gün', en: 'Eid al-Fitr, day 3' },
  'kurban-arefe': { tr: 'Kurban Bayramı arefesi', en: 'Eve of Eid al-Adha' },
  'kurban-1': { tr: 'Kurban Bayramı 1. gün', en: 'Eid al-Adha, day 1' },
  'kurban-2': { tr: 'Kurban Bayramı 2. gün', en: 'Eid al-Adha, day 2' },
  'kurban-3': { tr: 'Kurban Bayramı 3. gün', en: 'Eid al-Adha, day 3' },
  'kurban-4': { tr: 'Kurban Bayramı 4. gün', en: 'Eid al-Adha, day 4' },
  'hicri-yilbasi': { tr: 'Hicri yılbaşı', en: 'Islamic New Year' },
  asure: { tr: 'Aşure Günü', en: 'Day of Ashura' },
  mevlid: { tr: 'Mevlid Kandili', en: 'Mawlid (Prophet\'s birthday night)' },
  'uc-aylar': { tr: 'Üç ayların başlangıcı', en: 'Start of the three holy months' },
  regaib: { tr: 'Regaib Kandili', en: 'Raghaib night' },
  mirac: { tr: 'Miraç Kandili', en: 'Isra and Mi\'raj night' },
  berat: { tr: 'Berat Kandili', en: 'Bara\'at night' },
};

export type Tur = 'ramazan' | 'kurban';
export interface Bayram { tur: Tur; arefe: string; gunler: string[]; hicriYil: string; ilk: string; son: string }
/** Bir türün tüm bayramları (2026–2035), arefe ve bayram günleriyle. */
export function bayramlar(tur: Tur): Bayram[] {
  const n = tur === 'ramazan' ? 3 : 4;
  return TUM_DINI.filter((e) => e.id === `${tur}-1`).map((e) => {
    const gunler = Array.from({ length: n }, (_, i) => addDays(e.date, i));
    return { tur, arefe: addDays(e.date, -1), gunler, hicriYil: e.hicri.split(' ').pop()!, ilk: gunler[0], son: gunler[n - 1] };
  });
}
/** y yılındaki ilk bayram (tarih Diyanet listesinden). */
export const bayram = (tur: Tur, y: number): Bayram | undefined => bayramlar(tur).find((b) => b.ilk.startsWith(String(y)));
/** Bir tarihten sonraki ilk bayram günü (o gün dahil). */
export const sonrakiBayram = (tur: Tur, iso: string): Bayram | undefined => bayramlar(tur).find((b) => b.son >= iso);
/** Ramazan ayı: ilk oruç ve son oruç (arefe günü). */
export interface Ramazan { ilk: string; son: string; gun: number; kadir: string; bayram: string; hicriYil: string }
export function ramazanlar(): Ramazan[] {
  return TUM_DINI.filter((e) => e.id === 'ramazan-baslangici').map((e) => {
    const b = TUM_DINI.find((x) => x.id === 'ramazan-1' && x.date > e.date)!;
    const k = TUM_DINI.find((x) => x.id === 'kadir' && x.date > e.date && x.date < b.date)!;
    return { ilk: e.date, son: addDays(b.date, -1), gun: daysBetween(e.date, b.date), kadir: k.date, bayram: b.date, hicriYil: e.hicri.split(' ').pop()! };
  });
}
export const ramazan = (y: number) => ramazanlar().find((r) => r.ilk.startsWith(String(y)));
/** Hicri ayın kaçıncı günü (Ramazan içinde): ilk oruç = 1. */
export const ramazanGunu = (r: Ramazan, iso: string) => daysBetween(r.ilk, iso) + 1;

/* ------------------------------------------------------------------ Resmi tatiller (2429 sayılı Kanun) */
export type TatilId = 'yilbasi' | 'cocuk' | 'emek' | 'genclik' | 'demokrasi' | 'zafer' | 'cumhuriyet-arefe' | 'cumhuriyet' | 'ramazan-arefe' | 'ramazan-1' | 'ramazan-2' | 'ramazan-3' | 'kurban-arefe' | 'kurban-1' | 'kurban-2' | 'kurban-3' | 'kurban-4';
export interface Tatil { id: TatilId; date: string; /** 1 tam gün, 0,5 öğleden sonra (13.00'ten itibaren) */ sure: 1 | 0.5; tur: 'ulusal' | 'resmi' | 'dini' | 'genel'; ad: { tr: string; en: string } }
export const TATIL_AD: Record<TatilId, { tr: string; en: string }> = {
  yilbasi: { tr: 'Yılbaşı', en: "New Year's Day" },
  cocuk: { tr: 'Ulusal Egemenlik ve Çocuk Bayramı', en: 'National Sovereignty and Children\'s Day' },
  emek: { tr: 'Emek ve Dayanışma Günü', en: 'Labour and Solidarity Day' },
  genclik: { tr: "Atatürk'ü Anma, Gençlik ve Spor Bayramı", en: 'Commemoration of Atatürk, Youth and Sports Day' },
  demokrasi: { tr: 'Demokrasi ve Milli Birlik Günü', en: 'Democracy and National Unity Day' },
  zafer: { tr: 'Zafer Bayramı', en: 'Victory Day' },
  'cumhuriyet-arefe': { tr: 'Cumhuriyet Bayramı arefesi (13.00\'ten itibaren)', en: 'Eve of Republic Day (from 1 pm)' },
  cumhuriyet: { tr: 'Cumhuriyet Bayramı', en: 'Republic Day' },
  'ramazan-arefe': { tr: 'Ramazan Bayramı arefesi (13.00\'ten itibaren)', en: 'Eve of Eid al-Fitr (from 1 pm)' },
  'ramazan-1': DINI_AD['ramazan-1'], 'ramazan-2': DINI_AD['ramazan-2'], 'ramazan-3': DINI_AD['ramazan-3'],
  'kurban-arefe': { tr: 'Kurban Bayramı arefesi (13.00\'ten itibaren)', en: 'Eve of Eid al-Adha (from 1 pm)' },
  'kurban-1': DINI_AD['kurban-1'], 'kurban-2': DINI_AD['kurban-2'], 'kurban-3': DINI_AD['kurban-3'], 'kurban-4': DINI_AD['kurban-4'],
};
const SABIT: Array<[TatilId, number, number, Tatil['tur'], 1 | 0.5]> = [
  ['yilbasi', 1, 1, 'genel', 1], ['cocuk', 4, 23, 'resmi', 1], ['emek', 5, 1, 'genel', 1], ['genclik', 5, 19, 'resmi', 1],
  ['demokrasi', 7, 15, 'genel', 1], ['zafer', 8, 30, 'resmi', 1], ['cumhuriyet-arefe', 10, 28, 'ulusal', 0.5], ['cumhuriyet', 10, 29, 'ulusal', 1],
];
/** y yılının resmi tatilleri, tarih sırasıyla. Dini bayramlar Diyanet listesi olan yıllarda eklenir. */
export function tatiller(y: number): Tatil[] {
  const out: Tatil[] = SABIT.map(([id, m, d, tur, sure]) => ({ id, date: toIso(dayNum(y, m, d)), sure, tur, ad: TATIL_AD[id] }));
  for (const e of diniGunler(y)) {
    if (/^(ramazan|kurban)-(arefe|\d)$/.test(e.id)) out.push({ id: e.id as TatilId, date: e.date, sure: e.id.endsWith('arefe') ? 0.5 : 1, tur: 'dini', ad: TATIL_AD[e.id as TatilId] });
  }
  return out.sort((a, b) => a.date.localeCompare(b.date) || b.sure - a.sure);
}
export const yilBilinir = (y: number) => DINI_YILLAR.includes(y);
/** Tarih başına tatil durumu: 1 tam gün, 0,5 yarım gün (öğleden sonra), yoksa 0. Aynı güne iki tatil düşerse (19 Mayıs 2027) bir kez sayılır. */
export function tatilHaritasi(years: number[]): Map<string, { sure: number; ids: TatilId[] }> {
  const m = new Map<string, { sure: number; ids: TatilId[] }>();
  for (const y of years) for (const t of tatiller(y)) {
    const o = m.get(t.date) ?? { sure: 0, ids: [] };
    o.sure = Math.max(o.sure, t.sure); o.ids.push(t.id); m.set(t.date, o);
  }
  return m;
}
/** Yıl özeti: toplam tatil (gün), hafta içine düşen tatil (gün), iş günü sayısı. */
export function yilOzeti(y: number, h: Hafta = '5') {
  const map = tatilHaritasi([y]);
  let toplam = 0, haftaIci = 0, isGunu = 0, yarim = 0;
  for (const [, v] of map) toplam += v.sure;
  for (let d = dayNum(y, 1, 1); d <= dayNum(y, 12, 31); d++) {
    if (isWeekend(d, h)) continue;
    const t = map.get(toIso(d));
    if (t) { haftaIci += t.sure; if (t.sure < 1) { yarim++; isGunu += 1; } } else isGunu++;
  }
  return { toplam, haftaIci, isGunu, yarim, gunSayisi: map.size };
}
/** Ay ay iş günü (yarım günler iş günü sayılır, ayrıca yarım olarak döner). */
export function isGunleri(y: number, h: Hafta = '5'): Array<{ tam: number; yarim: number }> {
  const map = tatilHaritasi([y]);
  return Array.from({ length: 12 }, (_, i) => {
    let tam = 0, yarim = 0;
    for (let d = dayNum(y, i + 1, 1); d < dayNum(y, i + 2, 1); d++) {
      if (isWeekend(d, h)) continue;
      const t = map.get(toIso(d));
      if (!t) tam++; else if (t.sure < 1) yarim++;
    }
    return { tam, yarim };
  });
}
/** ISO 8601 hafta numarası. */
export function isoWeek(iso: string): number {
  const n = fromIso(iso), wd = (weekday(n) + 6) % 7, thu = n - wd + 3, ty = new Date(thu * MS).getUTCFullYear();
  return Math.floor((thu - dayNum(ty, 1, 1)) / 7) + 1;
}
/** Türkiye saatiyle (UTC+3, yıl boyu) bir anı ISO biçiminde verir: geri sayımlar için. */
export const trInstant = (iso: string, time = '00:00') => `${iso}T${time}:00+03:00`;
