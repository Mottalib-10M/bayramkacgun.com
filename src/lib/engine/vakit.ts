/**
 * İmsak ve iftar (namaz) vakitleri, hesapla.
 *
 * Güneşin konumu (deklinasyon, zaman denklemi) Jean Meeus'ün kısaltılmış formülleriyle, her gün için 0h UT'de hesaplanır; vakitler güneşin
 * ufka göre açısından çıkar. Ölçüler Diyanet İşleri Başkanlığının açıkladığı esaslardır:
 * - imsak: güneş ufkun 18° altında (fecr-i sâdık), temkin yok;
 * - güneş: doğuş (−0,833°: kırılma ve güneş yarıçapı), 7 dakika temkin (doğuştan 7 dk önce);
 * - öğle: güneşin meridyenden geçişi + 5 dakika;
 * - ikindi: gölge boyu = cisim boyu + öğle gölgesi (asr-ı evvel), + 4 dakika;
 * - akşam (iftar): batış + 7 dakika temkin;
 * - yatsı: güneş ufkun 17° altında, temkin yok.
 * Temkin değerleri Diyanet'in "İbadet vakitlerinde temkin" açıklamasından (params-2026.json > sources.temkin);
 * 18° ve 17° açıları Diyanet takvimiyle karşılaştırılarak doğrulanır (tests/engine.test.ts).
 * Türkiye 2016'dan beri yıl boyu UTC+3 kullanır: saat dilimi sabittir.
 */
const RAD = Math.PI / 180;
const sin = (d: number) => Math.sin(d * RAD), cos = (d: number) => Math.cos(d * RAD), tan = (d: number) => Math.tan(d * RAD);
const asin = (x: number) => Math.asin(x) / RAD, acos = (x: number) => Math.acos(x) / RAD, atan2 = (y: number, x: number) => Math.atan2(y, x) / RAD;
const fix = (a: number, b: number) => { a = a - b * Math.floor(a / b); return a < 0 ? a + b : a; };

/** Türkiye saati: UTC+3. */
export const TZ = 3;
/** Diyanet ölçüleri: açılar (derece) ve temkin (dakika). */
export const OLCU = { imsakAci: 18, yatsiAci: 17, temkin: { imsak: 0, gunes: -7, ogle: 5, ikindi: 4, aksam: 7, yatsi: 0 } } as const;

const julian = (y: number, m: number, d: number) => {
  if (m <= 2) { y -= 1; m += 12; }
  const A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
};
function gunes(jd: number) {
  const D = jd - 2451545.0;
  const g = fix(357.529 + 0.98560028 * D, 360), q = fix(280.459 + 0.98564736 * D, 360);
  const L = fix(q + 1.915 * sin(g) + 0.020 * sin(2 * g), 360);
  const e = 23.439 - 0.00000036 * D;
  const RA = fix(atan2(cos(e) * sin(L), cos(L)) / 15, 24);
  return { decl: asin(sin(e) * sin(L)), eqt: q / 15 - RA };
}

export interface Vakitler { imsak: number; gunes: number; ogle: number; ikindi: number; aksam: number; yatsi: number }
export const VAKIT_IDS = ['imsak', 'gunes', 'ogle', 'ikindi', 'aksam', 'yatsi'] as const;
export type VakitId = (typeof VAKIT_IDS)[number];

/** Bir gün ve bir yer için vakitler, Türkiye saatiyle gece yarısından itibaren dakika (yuvarlanmamış). */
export function vakitHam(iso: string, lat: number, lng: number): Vakitler {
  const [y, m, d] = iso.split('-').map(Number);
  // Güneşin konumu günde bir kez, 0h UT'de alınır (günlük efemeris). Olayın kendi anında almak Diyanet takviminden
  // akşam ve yatsıda mevsime bağlı ±1-2 dk sapma veriyordu; 0h UT ile İstanbul'da günlerin %95'inden fazlası dakikası dakikasına tutar.
  const jd = julian(y, m, d);
  const at = (_t: number) => jd;
  const ogleSaat = (t: number) => fix(12 - gunes(at(t)).eqt, 24);
  const aciSaat = (aci: number, t: number, once: boolean) => {
    const { decl } = gunes(at(t));
    const n = ogleSaat(t);
    const x = (-sin(aci) - sin(decl) * sin(lat)) / (cos(decl) * cos(lat));
    const h = acos(Math.max(-1, Math.min(1, x))) / 15;
    return n + (once ? -h : h);
  };
  const ikindiSaat = (t: number) => {
    const { decl } = gunes(at(t));
    // Güneşin yüksekliği = arccot(1 + tan|φ − δ|) ; aciSaat "ufkun altında" açı beklediği için eksi işaret.
    const aci = -atan2(1, 1 + tan(Math.abs(lat - decl)));
    return aciSaat(aci, t, false);
  };
  let t = { imsak: 5, gunes: 6, ogle: 12, ikindi: 13, aksam: 18, yatsi: 18 };
  for (let i = 0; i < 2; i++) {
    t = {
      imsak: aciSaat(OLCU.imsakAci, t.imsak, true),
      gunes: aciSaat(0.833, t.gunes, true),
      ogle: ogleSaat(t.ogle),
      ikindi: ikindiSaat(t.ikindi),
      aksam: aciSaat(0.833, t.aksam, false),
      yatsi: aciSaat(OLCU.yatsiAci, t.yatsi, false),
    };
  }
  const k = TZ - lng / 15;
  const T = OLCU.temkin;
  return {
    imsak: (t.imsak + k) * 60 + T.imsak, gunes: (t.gunes + k) * 60 + T.gunes, ogle: (t.ogle + k) * 60 + T.ogle,
    ikindi: (t.ikindi + k) * 60 + T.ikindi, aksam: (t.aksam + k) * 60 + T.aksam, yatsi: (t.yatsi + k) * 60 + T.yatsi,
  };
}
/** Takvimde yazılan dakika (yuvarlama kuralı testlerle seçildi). */
export const yuvarla = (dk: number) => Math.round(dk);
export function vakit(iso: string, lat: number, lng: number): Vakitler {
  const h = vakitHam(iso, lat, lng);
  return { imsak: yuvarla(h.imsak), gunes: yuvarla(h.gunes), ogle: yuvarla(h.ogle), ikindi: yuvarla(h.ikindi), aksam: yuvarla(h.aksam), yatsi: yuvarla(h.yatsi) };
}
/** « 05:57 » */
export const hhmm = (dk: number) => { const m = ((Math.round(dk) % 1440) + 1440) % 1440; return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`; };
