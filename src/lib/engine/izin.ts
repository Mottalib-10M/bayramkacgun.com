/**
 * Köprü günleri ve izin planlama.
 *
 * Yıl, birbirini izleyen bloklara ayrılır: boş bloklar (hafta tatili ve tam gün resmi tatil) ve çalışma blokları
 * (iş günleri ile arefe ve 28 Ekim gibi yarım günler). Bir çalışma bloğunun tamamı izinle kapatılınca iki yanındaki
 * boş bloklar birleşir.
 * - Yarım gün (arefe, 28 Ekim) sabahı iş günüdür; öğleden sonrası 2429 sayılı Kanun gereği tatildir. Sabahı için
 *   kullanılan izin, işyerinin uygulamasına göre yarım ya da tam gün sayılır: seçenek `yarim`.
 * - Hafta: 5 günlük (Cumartesi-Pazar tatil) ya da 6 günlük (yalnız Pazar tatil).
 * - `optimize`: bir izin bütçesi için en iyi seçim. Sıralı çalışma blokları üzerinde dinamik programlama: art arda
 *   boş gün sayısını en çoğa çıkarır, eşitlikte daha az izin günü kullananı seçer. Kesin sonuçtur, tahmin değildir.
 *   Her izin zinciri, iş gününe denk gelen bir tatile değmelidir; tatile değmeyen bir izin haftası "serbest" kalır.
 * Birimler: hesaplar yarım gün biriminde yapılır (1 iş günü = 2).
 */
import { tatilHaritasi, dayNum, toIso, fromIso, isWeekend, bayramlar, type Hafta, type Tur, type TatilId } from './takvim';

export interface Secenek { hafta?: Hafta; /** arefe sabahı için izin yarım gün sayılır */ yarim?: boolean }
interface Blok { bos: boolean; start: number; len: number; tatil: boolean; maliyet: number }

export function bloklar(y: number, o: Secenek = {}): Blok[] {
  const h = o.hafta ?? '5';
  const map = tatilHaritasi([y - 1, y, y + 1]);
  const a = dayNum(y - 1, 12, 1), b = dayNum(y + 1, 1, 31);
  const out: Blok[] = [];
  for (let d = a; d <= b; d++) {
    const t = map.get(toIso(d)), we = isWeekend(d, h);
    const bos = we || (!!t && t.sure >= 1);
    // Bir tatil ancak iş gününe denk geliyorsa köprü yapar: Pazar'a düşen 1 Mayıs değil.
    const etkili = !!t && t.sure >= 1 && !we;
    const maliyet = bos ? 0 : t && t.sure < 1 ? (o.yarim ? 1 : 2) : 2;
    const last = out[out.length - 1];
    if (last && last.bos === bos) { last.len++; last.tatil ||= etkili; last.maliyet += maliyet; }
    else out.push({ bos, start: d, len: 1, tatil: etkili, maliyet });
  }
  return out;
}

export interface Kopru {
  izinBas: string; izinSon: string; /** izin günü (yarım günler 0,5) */ izin: number;
  bosBas: string; bosSon: string; bos: number;
  tatiller: TatilId[];
}
const mk = (bl: Blok[], i: number, j: number, y: number): Kopru => {
  const pre = bl[i - 1], post = bl[j + 1];
  const bas = pre ? pre.start : bl[i].start, son = post ? post.start + post.len - 1 : bl[j].start + bl[j].len - 1;
  let m = 0; for (let k = i; k <= j; k++) m += bl[k].maliyet;
  const ids = new Set<TatilId>();
  const map = tatilHaritasi([y - 1, y, y + 1]);
  for (let d = bas; d <= son; d++) for (const id of map.get(toIso(d))?.ids ?? []) ids.add(id);
  return { izinBas: toIso(bl[i].start), izinSon: toIso(bl[j].start + bl[j].len - 1), izin: m / 2, bosBas: toIso(bas), bosSon: toIso(son), bos: son - bas + 1, tatiller: [...ids] };
};
const yilda = (b: Blok, y: number) => b.start >= dayNum(y, 1, 1) && b.start + b.len - 1 <= dayNum(y, 12, 31);

/** Yılın tüm köprüleri: bir tatile komşu, en fazla `max` iş günlük çalışma blokları; en verimli önce. */
export function kopruler(y: number, o: Secenek = {}, max = 4): Kopru[] {
  const bl = bloklar(y, o), out: Kopru[] = [];
  for (let i = 1; i < bl.length - 1; i++) {
    const b = bl[i];
    if (b.bos || b.len > max || !yilda(b, y)) continue;
    if (!bl[i - 1].tatil && !bl[i + 1].tatil) continue;
    out.push(mk(bl, i, i, y));
  }
  return out.sort((a, b) => b.bos / b.izin - a.bos / a.izin || b.bos - a.bos || a.izinBas.localeCompare(b.izinBas));
}
/** Gerçek köprü günleri: tatil ile hafta sonu (ya da iki tatil) arasında kalan tek iş günü. */
export const kopruGunleri = (y: number, o: Secenek = {}) => kopruler(y, o, 1);

export interface Plan { bloklar: Kopru[]; izin: number; bos: number; /** hiçbir köprüyü uzatmayan izin günleri */ kalan: number }
/** `butce` izin gününün y yılı içinde en iyi dağılımı (yalnız y yılındaki günler izinden düşer). */
export function optimize(y: number, butce: number, o: Secenek = {}): Plan {
  const B = Math.max(0, Math.min(60, Math.floor(butce))) * 2;
  const bl = bloklar(y, o);
  const runs: number[] = []; for (let i = 0; i < bl.length; i++) if (!bl[i].bos) runs.push(i);
  const n = runs.length, NEG = -1e9;
  const ok = (r: number) => { const i = runs[r]; return i > 0 && i < bl.length - 1 && yilda(bl[i], y) && bl[i].len <= 10; };
  const fr = (i: number) => (bl[i] && bl[i].bos ? bl[i].len : 0);
  // dp[r][s][c] : r. bloktan sonra c yarım gün harcanmışken en iyi değer. s = 0 seçilmedi; 1 seçildi ve zincir bir tatile
  // değdi; 2 seçildi ama henüz tatile değmedi (öyle bitemez). Değer = 100 × boş gün − harcanan.
  const dp: Float64Array[][] = [], from: Int32Array[][] = [];
  for (let r = 0; r <= n; r++) { dp.push([0, 1, 2].map(() => new Float64Array(B + 1).fill(NEG))); from.push([0, 1, 2].map(() => new Int32Array(B + 1).fill(-1))); }
  dp[0][0][0] = 0;
  const tat = (i: number) => !!(bl[i] && bl[i].bos && bl[i].tatil);
  for (let r = 0; r < n; r++) {
    const i = runs[r], cost = bl[i].maliyet;
    for (let c = 0; c <= B; c++) for (let s = 0; s < 3; s++) {
      const v = dp[r][s][c]; if (v <= NEG / 2) continue;
      if (s !== 2 && v > dp[r + 1][0][c]) { dp[r + 1][0][c] = v; from[r + 1][0][c] = s; }
      if (ok(r) && c + cost <= B) {
        const gain = s ? bl[i].len + fr(i + 1) : fr(i - 1) + bl[i].len + fr(i + 1);
        const has = s === 1 || (s === 0 && tat(i - 1)) || tat(i + 1);
        const t = has ? 1 : 2, nv = v + 100 * gain - cost;
        if (nv > dp[r + 1][t][c + cost]) { dp[r + 1][t][c + cost] = nv; from[r + 1][t][c + cost] = s; }
      }
    }
  }
  let best = 0, bc = 0, bs = 0;
  for (let c = 0; c <= B; c++) for (let s = 0; s < 2; s++) if (dp[n][s][c] > best) { best = dp[n][s][c]; bc = c; bs = s; }
  const chosen: boolean[] = new Array(n).fill(false);
  for (let r = n, c = bc, s = bs; r > 0; r--) { const p = from[r][s][c]; if (s) { chosen[r - 1] = true; c -= bl[runs[r - 1]].maliyet; } s = p < 0 ? 0 : p; }
  const plan: Kopru[] = [];
  for (let r = 0; r < n; r++) {
    if (!chosen[r]) continue;
    let e = r; while (e + 1 < n && chosen[e + 1]) e++;
    plan.push(mk(bl, runs[r], runs[e], y)); r = e;
  }
  const izin = plan.reduce((a, b) => a + b.izin, 0);
  return { bloklar: plan, izin, bos: plan.reduce((a, b) => a + b.bos, 0), kalan: B / 2 - izin };
}

/**
 * Bayram tatili: bayramın ilk gününü içeren en uzun kesintisiz boş dönem, en fazla `izin` gün izinle.
 * İzin olmadan: hafta sonu ve tatil günleriyle oluşan blok. Yarım gün (arefe) izinsiz boş sayılmaz.
 */
export interface BayramTatili { bas: string; son: string; gun: number; izin: number; izinGunleri: string[] }
export function bayramTatili(tur: Tur, y: number, izin: number, o: Secenek = {}): BayramTatili | undefined {
  const b = bayramlar(tur).find((x) => x.ilk.startsWith(String(y)));
  if (!b) return undefined;
  const h = o.hafta ?? '5';
  const map = tatilHaritasi([y - 1, y, y + 1]);
  const cost = (d: number) => { const t = map.get(toIso(d)); if (isWeekend(d, h) || (t && t.sure >= 1)) return 0; return t && t.sure < 1 ? (o.yarim ? 1 : 2) : 2; };
  const k = fromIso(b.ilk), budget = Math.round(izin * 2);
  // Bayramın 1. gününü içeren her [s, e] aralığı: maliyet bütçeyi aşmıyorsa aday. En uzun olan, eşitlikte en ucuz olan seçilir.
  // İzin günleri de boş gündür; boş günler bedavadır, bu yüzden en uzun aralık komşu hafta sonlarını kendiliğinden içerir.
  let best: BayramTatili | undefined;
  for (let s = k - 14; s <= k; s++) {
    let c = 0; for (let d = s; d < k; d++) c += cost(d);
    if (c > budget) continue;
    for (let e = k; e <= k + 20; e++) {
      c += cost(e);
      if (c > budget) break;
      const gun = e - s + 1;
      if (!best || gun > best.gun || (gun === best.gun && c / 2 < best.izin)) {
        const izinGunleri: string[] = []; for (let d = s; d <= e; d++) if (cost(d) > 0) izinGunleri.push(toIso(d));
        best = { bas: toIso(s), son: toIso(e), gun, izin: c / 2, izinGunleri };
      }
    }
  }
  return best;
}
