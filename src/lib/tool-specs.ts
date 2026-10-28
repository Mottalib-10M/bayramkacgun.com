/**
 * Sitenin araçları. Her tarih ve sayı hesap çekirdeğinden gelir (engine/takvim.ts, engine/izin.ts, engine/vakit.ts,
 * engine/iller.ts); hiçbiri elle yazılmaz. Bir spec alanlarını (önce görünenler, `adv` katlanmış) ve sonuç kartını
 * veren bir `run` işlevini listeler. Geri sayım, günlük vakit ve yıllık takvim ayrı bileşenlerdir.
 */
import type { ToolSpec, V, ToolOut, Opt } from './tool-types';
import { resolve } from './tool-types';
import { formatNumber, formatDecimal, formatMoney, type Lang } from './format';
import { bayramlar, bayram, ramazanlar, ramazan, tatiller, yilOzeti, diniGunler, DINI_AD, DINI_YILLAR, fromIso, toIso, isWeekend, tatilHaritasi, weekday, type Tur, type Hafta } from './engine/takvim';
import { optimize, kopruler, bayramTatili } from './engine/izin';
import { IL, il, imsakiye, ramazanOzet, sure } from './engine/iller';
import P from '../data/params-2026.json';

export type Args = Record<string, number | string>;
const T = (l: Lang, tr: string, en: string) => (l === 'tr' ? tr : en);
const n = (v: V, k: string) => Number(v[k]) || 0;
const s = (v: V, k: string) => String(v[k] ?? '');
const num = (x: number, l: Lang) => formatNumber(x, 0, l);
const dec = (x: number, l: Lang) => formatDecimal(x, 1, l);
const TAG = (l: Lang) => (l === 'tr' ? 'tr-TR' : 'en-GB');
const fmt = (iso: string, l: Lang, o: Intl.DateTimeFormatOptions) => new Date(`${iso}T12:00:00Z`).toLocaleDateString(TAG(l), { ...o, timeZone: 'UTC' });
/** « 16 Mayıs 2027 » / « 16 May 2027 » */
export const dLong = (iso: string, l: Lang) => fmt(iso, l, { day: 'numeric', month: 'long', year: 'numeric' });
/** « 16 Mayıs 2027 Pazar » / « Sunday 16 May 2027 » */
export const dWeek = (iso: string, l: Lang) => fmt(iso, l, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).replace(',', '');
/** « 16 Mayıs Pazar » / « Sun 16 May » */
export const dShort = (iso: string, l: Lang) => (l === 'tr' ? `${fmt(iso, l, { day: 'numeric', month: 'long' })} ${fmt(iso, l, { weekday: 'long' })}` : fmt(iso, l, { weekday: 'short', day: 'numeric', month: 'long' }).replace(',', ''));
/** Gün adı: « Pazar » / « Sunday » */
export const gunAdi = (iso: string, l: Lang) => fmt(iso, l, { weekday: 'long' });
/** « 16–19 Mayıs 2027 » ; ay değişirse « 30 Nisan – 2 Mayıs 2027 ». */
export function aralik(a: string, b: string, l: Lang): string {
  if (a === b) return dLong(a, l);
  const [ya, ma] = [a.slice(0, 4), a.slice(5, 7)], [yb, mb] = [b.slice(0, 4), b.slice(5, 7)];
  const da = Number(a.slice(8)), db = Number(b.slice(8));
  if (ya === yb && ma === mb) return `${da}–${db} ${fmt(a, l, { month: 'long' })} ${ya}`;
  if (ya === yb) return `${fmt(a, l, { day: 'numeric', month: 'long' })} – ${dLong(b, l)}`;
  return `${dLong(a, l)} – ${dLong(b, l)}`;
}
const gunler = (x: number, l: Lang) => (l === 'tr' ? `${dec(x, l)} gün` : `${dec(x, l)} ${x === 1 ? 'day' : 'days'}`);
const TUR_AD = (t: Tur, l: Lang) => (t === 'kurban' ? T(l, 'Kurban Bayramı', 'Kurban Bayramı (Eid al-Adha)') : T(l, 'Ramazan Bayramı', 'Ramazan Bayramı (Eid al-Fitr)'));
export const turKisa = (t: Tur, l: Lang) => (t === 'kurban' ? T(l, 'Kurban Bayramı', 'Eid al-Adha') : T(l, 'Ramazan Bayramı', 'Eid al-Fitr'));

/* ------------------------------------------------------------------ Alanlar */
const YILLAR = P.yillar as number[];
const yilOpts = (ys: number[]): Opt[] => ys.map((y) => ({ value: String(y), label: String(y) }));
const fYil = (l: Lang, def: number, ys = YILLAR) => ({ kind: 'select' as const, id: 'yil', label: T(l, 'Yıl', 'Year'), def: String(def), options: yilOpts(ys) });
const fTur = (l: Lang, def: string) => ({ kind: 'choice' as const, id: 'tur', label: T(l, 'Bayram', 'Holiday'), def, options: [{ value: 'ramazan', label: T(l, 'Ramazan', 'Ramazan (Fitr)') }, { value: 'kurban', label: T(l, 'Kurban', 'Kurban (Adha)') }] });
const fHafta = (l: Lang, adv = true) => ({ kind: 'choice' as const, id: 'hafta', label: T(l, 'Çalışma haftası', 'Working week'), def: '5', adv, options: [{ value: '5', label: T(l, '5 gün (Cmt-Paz tatil)', '5 days (Sat-Sun off)') }, { value: '6', label: T(l, '6 gün (Paz tatil)', '6 days (Sun off)') }] });
const fArefe = (l: Lang) => ({ kind: 'choice' as const, id: 'arefe', label: T(l, 'Arefe sabahı için izin', 'Leave for the eve morning'), def: 'tam', adv: true, options: [{ value: 'tam', label: T(l, 'Tam gün sayılır', 'Counts as a full day') }, { value: 'yarim', label: T(l, 'Yarım gün sayılır', 'Counts as half a day') }] });
const ilOpts = (l: Lang): Opt[] => [...IL].sort((a, b) => a.ad.localeCompare(b.ad, 'tr')).map((x) => ({ value: x.slug, label: l === 'tr' ? x.ad : x.en }));
const fIl = (l: Lang, def: string) => ({ kind: 'select' as const, id: 'il', label: T(l, 'İl', 'Province'), def, options: ilOpts(l) });
const sec = (v: V) => ({ hafta: (s(v, 'hafta') || '5') as Hafta, yarim: s(v, 'arefe') === 'yarim' });
const DINI_RANGE = DINI_YILLAR;
/** Bir günün durumu, plan tablolarında. */
function durum(iso: string, h: Hafta, izinler: Set<string>, l: Lang): string {
  const t = tatilHaritasi([Number(iso.slice(0, 4))]).get(iso);
  if (t && t.sure >= 1) return T(l, 'Resmi tatil', 'Public holiday');
  if (isWeekend(fromIso(iso), h)) return T(l, 'Hafta tatili', 'Weekend');
  if (t && izinler.has(iso)) return T(l, 'Arefe: sabah izin, 13.00\'ten sonra tatil', 'Eve: leave in the morning, holiday from 1 pm');
  if (izinler.has(iso)) return T(l, '<strong>İzin</strong>', '<strong>Leave</strong>');
  if (t) return T(l, 'Arefe: 13.00\'e kadar iş', 'Eve: work until 1 pm');
  return T(l, 'İş günü', 'Working day');
}

/* ------------------------------------------------------------------ Bayram tarihleri */
function bySpec(l: Lang, a: Args = {}): ToolSpec {
  return {
    inputs: [fTur(l, String(a.tur ?? 'kurban')), fYil(l, Number(a.yil ?? 2027), DINI_RANGE)],
    run: (v) => {
      const tur = s(v, 'tur') as Tur, y = n(v, 'yil');
      const list = bayramlar(tur).filter((b) => b.ilk.startsWith(String(y)));
      const b = list[0];
      if (!b) return { label: TUR_AD(tur, l), value: '–', rows: [] };
      const hi = b.gunler.filter((d) => !isWeekend(fromIso(d))).length;
      const toplam = tur === 'kurban' ? 4.5 : 3.5;
      const out: ToolOut = {
        label: `${TUR_AD(tur, l)} ${y}`,
        value: aralik(b.ilk, b.son, l),
        sub: T(l, `Arefe ${dShort(b.arefe, l)}, 13.00'ten itibaren yarım gün tatil. Bayram ${gunAdi(b.ilk, l)} günü başlar.`, `Eve on ${dShort(b.arefe, l)}, a half-day holiday from 1 pm. The holiday starts on a ${gunAdi(b.ilk, l)}.`),
        rows: [
          [T(l, 'Arefe (yarım gün)', 'Eve (half day)'), dShort(b.arefe, l)],
          [T(l, 'Bayramın 1. günü', 'First day'), dShort(b.ilk, l)],
          [T(l, 'Son gün', 'Last day'), dShort(b.son, l)],
          [T(l, 'Resmi tatil süresi', 'Official holiday length'), gunler(toplam, l)],
          [T(l, 'Hafta içine düşen bayram günü', 'Holiday days on weekdays'), num(hi, l)],
          [T(l, 'Hicri yıl', 'Hijri year'), b.hicriYil],
        ],
        table: {
          caption: T(l, `${TUR_AD(tur, l)}: ${DINI_RANGE[0]}–${DINI_RANGE[DINI_RANGE.length - 1]} tarihleri (Diyanet listeleri)`, `${TUR_AD(tur, l)}: dates ${DINI_RANGE[0]}–${DINI_RANGE[DINI_RANGE.length - 1]} (Diyanet lists)`),
          headers: [T(l, 'Yıl', 'Year'), T(l, 'Arefe', 'Eve'), T(l, 'Bayram günleri', 'Holiday days'), T(l, 'Başladığı gün', 'Starts on')],
          rows: bayramlar(tur).map((x) => [x.ilk.slice(0, 4), dLong(x.arefe, l), aralik(x.ilk, x.son, l), gunAdi(x.ilk, l)]),
          align: ['l', 'l', 'l', 'l'],
        },
      };
      if (list.length > 1) out.note = T(l, `${y} yılında iki ${TUR_AD(tur, l)} var: ikincisi ${aralik(list[1].ilk, list[1].son, l)}.`, `${y} has two ${turKisa(tur, l)} holidays: the second runs ${aralik(list[1].ilk, list[1].son, l)}.`);
      return out;
    },
  };
}

/* ------------------------------------------------------------------ Bayram tatili kaç gün */
function btSpec(l: Lang, a: Args = {}): ToolSpec {
  return {
    inputs: [fTur(l, String(a.tur ?? 'kurban')), fYil(l, Number(a.yil ?? 2027)), { id: 'izin', label: T(l, 'Kullanacağınız izin günü', 'Leave days you will take'), def: Number(a.izin ?? 2), unit: T(l, 'gün', 'days'), max: 15, help: T(l, '0 girerseniz izinsiz tatil görünür.', 'Enter 0 to see the break without leave.') }, fHafta(l), fArefe(l)],
    run: (v) => {
      const tur = s(v, 'tur') as Tur, y = n(v, 'yil'), o = sec(v), izin = Math.max(0, Math.min(15, n(v, 'izin')));
      const r = bayramTatili(tur, y, izin, o), r0 = bayramTatili(tur, y, 0, o);
      const b = bayram(tur, y);
      if (!r || !r0 || !b) return { label: TUR_AD(tur, l), value: '–', rows: [] };
      const set = new Set(r.izinGunleri);
      const days: string[] = []; for (let d = fromIso(r.bas); d <= fromIso(r.son); d++) days.push(toIso(d));
      const tbl = [0, 1, 2, 3, 4, 5, 7, 9].map((k) => { const x = bayramTatili(tur, y, k, o)!; return [num(k, l), dec(x.izin, l), aralik(x.bas, x.son, l), num(x.gun, l)]; });
      return {
        label: T(l, `${TUR_AD(tur, l)} ${y}: ${dec(r.izin, l)} gün izinle`, `${TUR_AD(tur, l)} ${y}: with ${dec(r.izin, l)} leave days`),
        value: T(l, `${num(r.gun, l)} gün tatil`, `${num(r.gun, l)} days off`),
        sub: T(l, `${aralik(r.bas, r.son, l)}. İzinsiz tatil ${num(r0.gun, l)} gün (${aralik(r0.bas, r0.son, l)}).`, `${aralik(r.bas, r.son, l)}. Without leave: ${num(r0.gun, l)} days (${aralik(r0.bas, r0.son, l)}).`),
        rows: [
          [T(l, 'Tatilin ilk günü', 'First day off'), dShort(r.bas, l)],
          [T(l, 'İşe dönüş', 'Back to work'), dShort(toIso(fromIso(r.son) + 1), l)],
          [T(l, 'Kullanılan izin', 'Leave used'), gunler(r.izin, l)],
          [T(l, 'İzin günleri', 'Leave dates'), r.izinGunleri.length ? r.izinGunleri.map((d) => fmt(d, l, { day: 'numeric', month: 'short' })).join(', ') : T(l, 'yok', 'none')],
          [T(l, 'İzin olmadan', 'Without leave'), T(l, `${num(r0.gun, l)} gün`, `${num(r0.gun, l)} days`), r0.gun],
          [T(l, 'Bu planla', 'With this plan'), T(l, `${num(r.gun, l)} gün`, `${num(r.gun, l)} days`), r.gun],
        ],
        table: {
          caption: T(l, `Gün gün plan: ${aralik(r.bas, r.son, l)}`, `Day by day: ${aralik(r.bas, r.son, l)}`),
          headers: [T(l, 'Tarih', 'Date'), T(l, 'Gün', 'Day'), T(l, 'Durum', 'Status')],
          rows: days.map((d) => [dLong(d, l), gunAdi(d, l), durum(d, o.hafta, set, l)]),
          align: ['l', 'l', 'l'],
        },
        tables: [{
          caption: T(l, `İzin günü sayısına göre en uzun ${TUR_AD(tur, l)} ${y} tatili`, `Longest ${turKisa(tur, l)} ${y} break by number of leave days`),
          headers: [T(l, 'İzin bütçesi', 'Leave budget'), T(l, 'Kullanılan', 'Used'), T(l, 'Tatil', 'Break'), T(l, 'Gün', 'Days')],
          rows: tbl, align: ['r', 'r', 'l', 'r'],
        }],
        note: r.izin < izin ? T(l, `Daha fazla izin tatili uzatmıyor: kalan ${dec(izin - r.izin, l)} gün araya hafta sonu girmeden kullanılamaz.`, `More leave would not lengthen the break: the remaining ${dec(izin - r.izin, l)} days cannot be joined to it.`) : undefined,
      };
    },
  };
}

/* ------------------------------------------------------------------ Köprü günleri ve izin planlayıcı */
function kpSpec(l: Lang, a: Args = {}): ToolSpec {
  return {
    inputs: [fYil(l, Number(a.yil ?? 2027)), { id: 'izin', label: T(l, 'Kullanmak istediğiniz izin günü', 'Leave days you want to use'), def: Number(a.izin ?? 10), unit: T(l, 'gün', 'days'), max: 40 }, fHafta(l), fArefe(l)],
    run: (v) => {
      const y = n(v, 'yil'), o = sec(v), butce = Math.round(n(v, 'izin'));
      const p = optimize(y, butce, o), all = kopruler(y, o, 4);
      const ad = (ids: string[]) => [...new Set(ids.map((id) => id.replace(/-\d$/, '').replace('-arefe', '')))].map((id) => ({ ramazan: turKisa('ramazan', l), kurban: turKisa('kurban', l) } as Record<string, string>)[id] ?? tatiller(y).find((t) => t.id === id)?.ad[l] ?? id).join(', ');
      const faktor = p.izin ? p.bos / p.izin : 0;
      return {
        label: T(l, `${y}: ${dec(p.izin, l)} gün izinle`, `${y}: using ${dec(p.izin, l)} leave days`),
        value: T(l, `${num(p.bos, l)} gün tatil`, `${num(p.bos, l)} days off`),
        sub: p.izin ? T(l, `Her izin günü ${dec(faktor, l)} gün kesintisiz tatil getiriyor.`, `Each leave day buys ${dec(faktor, l)} consecutive days off.`) : T(l, 'En az bir izin günü girin.', 'Enter at least one leave day.'),
        rows: p.bloklar.slice(0, 6).map((b) => [aralik(b.bosBas, b.bosSon, l), T(l, `${dec(b.izin, l)} → ${num(b.bos, l)} gün`, `${dec(b.izin, l)} → ${num(b.bos, l)} days`), b.bos] as [string, string, number]),
        table: p.bloklar.length ? {
          caption: T(l, `${y} planınız: izin alın, tatil yapın`, `Your ${y} plan: take leave, get time off`),
          headers: [T(l, 'İzin alın', 'Take leave'), T(l, 'İzin günü', 'Leave days'), T(l, 'Kesintisiz tatil', 'Off in a row'), T(l, 'Gün', 'Days'), T(l, 'Sayesinde', 'Thanks to')],
          rows: p.bloklar.map((b) => [aralik(b.izinBas, b.izinSon, l), dec(b.izin, l), aralik(b.bosBas, b.bosSon, l), num(b.bos, l), ad(b.tatiller)]),
          align: ['l', 'r', 'l', 'r', 'l'],
        } : undefined,
        tables: all.length ? [{
          caption: T(l, `${y} yılının tüm köprüleri, en verimlisi önce`, `Every bridge in ${y}, best first`),
          headers: [T(l, 'İzin alın', 'Take leave'), T(l, 'İzin günü', 'Leave days'), T(l, 'Kesintisiz tatil', 'Off in a row'), T(l, 'Gün', 'Days'), T(l, 'Tatil', 'Holiday')],
          rows: all.map((b) => [aralik(b.izinBas, b.izinSon, l), dec(b.izin, l), aralik(b.bosBas, b.bosSon, l), num(b.bos, l), ad(b.tatiller)]),
          align: ['l', 'r', 'l', 'r', 'l'],
        }] : undefined,
        note: p.kalan > 0 ? T(l, `${dec(p.kalan, l)} gün izin artık bir köprüyü uzatmıyor: yaz tatili gibi serbestçe planlanabilir.`, `${dec(p.kalan, l)} leave days no longer extend a bridge: free to plan, for a summer break for instance.`) : undefined,
      };
    },
  };
}

/* ------------------------------------------------------------------ Resmi tatiller */
function rtSpec(l: Lang, a: Args = {}): ToolSpec {
  return {
    inputs: [fYil(l, Number(a.yil ?? 2027), DINI_RANGE), fHafta(l, false)],
    run: (v) => {
      const y = n(v, 'yil'), h = (s(v, 'hafta') || '5') as Hafta;
      const list = tatiller(y), oz = yilOzeti(y, h);
      const we = list.filter((t) => t.sure >= 1 && isWeekend(fromIso(t.date), h)).length;
      return {
        label: T(l, `Resmi tatiller ${y}`, `Public holidays in Turkey, ${y}`),
        value: T(l, `${dec(oz.toplam, l)} gün`, `${dec(oz.toplam, l)} days`),
        sub: T(l, `${dec(oz.haftaIci, l)} günü hafta içine düşüyor; ${num(we, l)} tam gün hafta tatiline denk geliyor ve kaydırılmıyor.`, `${dec(oz.haftaIci, l)} of them fall on working days; ${num(we, l)} full days land on the weekly rest day and are not moved.`),
        rows: [
          [T(l, 'Toplam resmi tatil', 'Total public holidays'), dec(oz.toplam, l)],
          [T(l, 'Hafta içine düşen', 'On working days'), dec(oz.haftaIci, l)],
          [T(l, 'Yarım gün (13.00\'ten sonra)', 'Half days (from 1 pm)'), num(oz.yarim, l)],
          [T(l, 'Yıldaki iş günü', 'Working days in the year'), num(oz.isGunu, l)],
        ],
        table: {
          caption: T(l, `${y} resmi tatil listesi (2429 sayılı Kanun; dini bayram tarihleri Diyanet)`, `${y} public holidays (Law No. 2429; religious holiday dates from the Diyanet)`),
          headers: [T(l, 'Tarih', 'Date'), T(l, 'Gün', 'Day'), T(l, 'Tatil', 'Holiday'), T(l, 'Süre', 'Length')],
          rows: list.map((t) => [dLong(t.date, l), gunAdi(t.date, l), t.ad[l], t.sure < 1 ? T(l, 'yarım gün', 'half day') : T(l, 'tam gün', 'full day')]),
          align: ['l', 'l', 'l', 'l'],
        },
      };
    },
  };
}

/* ------------------------------------------------------------------ İmsakiye */
function imSpec(l: Lang, a: Args = {}): ToolSpec {
  return {
    inputs: [fIl(l, String(a.il ?? 'istanbul')), fYil(l, Number(a.yil ?? 2027), [2027, 2028])],
    run: (v) => {
      const slug = s(v, 'il'), y = n(v, 'yil'), x = il(slug);
      const { r, rows } = imsakiye(slug, y), oz = ramazanOzet(slug, y);
      const ad = l === 'tr' ? x.ad : x.en;
      return {
        label: T(l, `${ad} imsakiye ${y}: ilk oruç ${dShort(r.ilk, l)}`, `${ad} Ramadan ${y}: first fast ${dShort(r.ilk, l)}`),
        value: T(l, `İftar ${rows[0].aksam}`, `Iftar ${rows[0].aksam}`),
        sub: T(l, `İlk gün imsak ${rows[0].imsak}, oruç ${sure(rows[0].oruc, l)}. Son gün (${dShort(r.son, l)}) iftar ${rows[rows.length - 1].aksam}.`, `First day: fast starts ${rows[0].imsak}, lasts ${sure(rows[0].oruc, 'en')}. Last day (${dShort(r.son, l)}): iftar ${rows[rows.length - 1].aksam}.`),
        rows: [
          [T(l, 'Ramazan süresi', 'Length of Ramadan'), T(l, `${num(r.gun, l)} gün`, `${num(r.gun, l)} days`)],
          [T(l, 'En kısa oruç', 'Shortest fast'), `${sure(oz.enKisa.oruc, l)} (${fmt(oz.enKisa.date, l, { day: 'numeric', month: 'short' })})`],
          [T(l, 'En uzun oruç', 'Longest fast'), `${sure(oz.enUzun.oruc, l)} (${fmt(oz.enUzun.date, l, { day: 'numeric', month: 'short' })})`],
          [T(l, 'Kadir Gecesi', 'Laylat al-Qadr'), T(l, `${dShort(r.kadir, l)} akşamı`, `evening of ${dShort(r.kadir, l)}`)],
          [T(l, 'Ramazan Bayramı', 'Eid al-Fitr'), dShort(r.bayram, l)],
        ],
        table: {
          caption: T(l, `${ad} ${y} Ramazan imsakiyesi: hesaplanan vakitler, Türkiye saati (Diyanet ölçüleriyle; resmi takvimle farkı en çok 1 dakika)`, `${ad} Ramadan ${y} timetable: computed times, Turkey time (Diyanet parameters; at most 1 minute off the official calendar)`),
          headers: [T(l, 'Gün', 'Day'), T(l, 'Tarih', 'Date'), T(l, 'İmsak', 'Imsak'), T(l, 'Güneş', 'Sunrise'), T(l, 'İftar', 'Iftar'), T(l, 'Yatsı', 'Isha'), T(l, 'Oruç', 'Fast')],
          rows: rows.map((z) => [num(z.gun, l), `${fmt(z.date, l, { day: 'numeric', month: 'short' })} ${fmt(z.date, l, { weekday: 'short' })}${z.kadir ? T(l, ' · Kadir Gecesi', ' · Qadr night') : ''}`, z.imsak, z.gunes, `<strong>${z.aksam}</strong>`, z.yatsi, sure(z.oruc, l)]),
          align: ['r', 'l', 'r', 'r', 'r', 'r', 'r'],
        },
      };
    },
  };
}

/* ------------------------------------------------------------------ Ramazan ayı */
function rmSpec(l: Lang, a: Args = {}): ToolSpec {
  return {
    inputs: [fYil(l, Number(a.yil ?? 2027), DINI_RANGE)],
    run: (v) => {
      const y = n(v, 'yil'), r = ramazan(y);
      if (!r) return { label: T(l, `Ramazan ${y}`, `Ramadan ${y}`), value: '–', rows: [] };
      return {
        label: T(l, `Ramazan ${y} (hicri ${r.hicriYil})`, `Ramadan ${y} (Hijri ${r.hicriYil})`),
        value: aralik(r.ilk, r.son, l),
        sub: T(l, `İlk oruç ${dShort(r.ilk, l)}. İlk teravih ve ilk sahur bir önceki akşam ve gece, ${dShort(toIso(fromIso(r.ilk) - 1), l)}.`, `The first fast is on ${dShort(r.ilk, l)}; the first tarawih prayer and pre-dawn meal come the evening and night before, ${dShort(toIso(fromIso(r.ilk) - 1), l)}.`),
        rows: [
          [T(l, 'İlk oruç', 'First fast'), dShort(r.ilk, l)],
          [T(l, 'İlk teravih', 'First tarawih'), T(l, `${dShort(toIso(fromIso(r.ilk) - 1), l)} akşamı`, `evening of ${dShort(toIso(fromIso(r.ilk) - 1), l)}`)],
          [T(l, 'Kadir Gecesi', 'Laylat al-Qadr'), T(l, `${dShort(r.kadir, l)} akşamı`, `evening of ${dShort(r.kadir, l)}`)],
          [T(l, 'Son oruç (arefe)', 'Last fast (eve)'), dShort(r.son, l)],
          [T(l, 'Oruç günü', 'Days of fasting'), num(r.gun, l)],
          [T(l, 'Ramazan Bayramı', 'Eid al-Fitr'), dShort(r.bayram, l)],
        ],
        table: {
          caption: T(l, 'Ramazan ayı, yıl yıl (Diyanet dini günler listeleri)', 'Ramadan year by year (Diyanet religious-day lists)'),
          headers: [T(l, 'Yıl', 'Year'), T(l, 'İlk oruç', 'First fast'), T(l, 'Kadir Gecesi', 'Qadr night'), T(l, 'Bayram', 'Eid'), T(l, 'Gün', 'Days')],
          rows: ramazanlar().map((z) => [z.ilk.slice(0, 4), dLong(z.ilk, l), dLong(z.kadir, l), dLong(z.bayram, l), num(z.gun, l)]),
          align: ['l', 'l', 'l', 'l', 'r'],
        },
      };
    },
  };
}

/* ------------------------------------------------------------------ Dini günler */
function dgSpec(l: Lang, a: Args = {}): ToolSpec {
  return {
    inputs: [fYil(l, Number(a.yil ?? 2027), DINI_RANGE)],
    run: (v) => {
      const y = n(v, 'yil'), list = diniGunler(y);
      const kandil = list.filter((e) => ['regaib', 'mirac', 'berat', 'mevlid', 'kadir'].includes(e.id));
      const k = list.find((e) => e.id === 'kadir');
      return {
        label: T(l, `Dini günler ${y}`, `Religious days in Turkey, ${y}`),
        value: T(l, `${num(list.length, l)} gün ve gece`, `${num(list.length, l)} days and nights`),
        sub: T(l, `${num(kandil.length, l)} kandil gecesi; kandiller listede yazan günün akşamı başlar.`, `${num(kandil.length, l)} kandil nights; each starts on the evening of the listed date.`),
        rows: [
          [T(l, 'Kadir Gecesi', 'Laylat al-Qadr'), k ? dShort(k.date, l) : '–'],
          ...(['regaib', 'mirac', 'berat', 'mevlid'] as const).map((id) => { const e = list.find((x) => x.id === id); return [DINI_AD[id][l], e ? dShort(e.date, l) : '–'] as [string, string]; }),
        ],
        table: {
          caption: T(l, `${y} dini günler (Diyanet İşleri Başkanlığı listesi)`, `${y} religious days (Diyanet list)`),
          headers: [T(l, 'Tarih', 'Date'), T(l, 'Gün', 'Day'), T(l, 'Dini gün', 'Day or night'), T(l, 'Hicri tarih', 'Hijri date')],
          rows: list.map((e) => [dLong(e.date, l), gunAdi(e.date, l), DINI_AD[e.id][l], e.hicri]),
          align: ['l', 'l', 'l', 'l'],
        },
      };
    },
  };
}

/* ------------------------------------------------------------------ Resmi tatilde çalışma ücreti (4857 md. 47) */
function ucSpec(l: Lang, a: Args = {}): ToolSpec {
  const U = P.ucret;
  return {
    inputs: [
      { kind: 'choice', id: 'tip', label: T(l, 'Ücretiniz', 'Your pay'), def: String(a.tip ?? 'aylik'), options: [{ value: 'aylik', label: T(l, 'Aylık', 'Monthly') }, { value: 'saatlik', label: T(l, 'Saatlik', 'Hourly') }] },
      { id: 'ucret', label: T(l, 'Brüt ücret', 'Gross pay'), def: Number(a.ucret ?? 40000), unit: '₺', max: 10000000, decimals: 2 },
      { id: 'gun', label: T(l, 'Çalışılan tatil günü', 'Holiday days worked'), def: Number(a.gun ?? 4.5), unit: T(l, 'gün', 'days'), max: 20, decimals: 1, help: T(l, 'Arefe öğleden sonrası 0,5 gün.', 'An eve afternoon counts as 0.5.') },
    ],
    run: (v) => {
      const saatlik = s(v, 'tip') === 'saatlik', u = n(v, 'ucret'), g = n(v, 'gun');
      const gunluk = saatlik ? u * U.saatlikKat : u / U.aylikGun;
      const ek = gunluk * g;
      const normal = saatlik ? gunluk * g : 0;
      return {
        label: T(l, `${dec(g, l)} tatil günü çalışmanın ek ücreti (brüt)`, `Extra pay for working ${dec(g, l)} holiday days (gross)`),
        value: formatMoney(ek, 2, l),
        sub: saatlik ? T(l, `Saatlik ücretle: o günün ücreti (${formatMoney(normal, 2, l)}) ayrıca ödenir; çalışılan her tatil günü için bir günlük ücret daha eklenir.`, `On hourly pay the day itself (${formatMoney(normal, 2, l)}) is also paid; each holiday worked adds one more day's pay.`) : T(l, 'Aylık ücret zaten tatil gününü kapsar; çalışılan her tatil günü için bir günlük ücret daha ödenir.', 'Your monthly pay already covers the holiday; each holiday worked adds one extra day of pay.'),
        rows: [
          [T(l, 'Günlük brüt ücret', 'Gross daily pay'), formatMoney(gunluk, 2, l)],
          [T(l, 'Hesap', 'Calculation'), saatlik ? T(l, `saatlik × ${dec(U.saatlikKat, l)} saat`, `hourly × ${dec(U.saatlikKat, l)} hours`) : T(l, `aylık ÷ ${U.aylikGun}`, `monthly ÷ ${U.aylikGun}`)],
          [T(l, 'Ek ücret (md. 47)', 'Extra pay (art. 47)'), formatMoney(ek, 2, l)],
          ...(saatlik ? [[T(l, 'Çalışılan günün kendi ücreti', 'Pay for the day itself'), formatMoney(normal, 2, l)] as [string, string]] : []),
          [T(l, 'Bu dönem tatil ücreti toplamı', 'Holiday pay in total'), formatMoney(ek + normal, 2, l)],
        ],
        table: {
          caption: T(l, '2027 bayramlarında çalışırsanız (aynı günlük ücretle)', 'If you work through the 2027 bayrams (same daily pay)'),
          headers: [T(l, 'Dönem', 'Period'), T(l, 'Tatil günü', 'Holiday days'), T(l, 'Ek ücret', 'Extra pay')],
          rows: [[T(l, 'Ramazan Bayramı (arefe dahil)', 'Eid al-Fitr incl. eve'), '3,5', 3.5], [T(l, 'Kurban Bayramı (arefe dahil)', 'Eid al-Adha incl. eve'), '4,5', 4.5], [T(l, '28 Ekim öğleden sonra ve 29 Ekim', '28 Oct afternoon and 29 Oct'), '1,5', 1.5], [T(l, 'Yılın tüm resmi tatilleri', 'All public holidays of the year'), dec(yilOzeti(2027).toplam, l), yilOzeti(2027).toplam]].map(([a1, b1, c1]) => [String(a1), l === 'tr' ? String(b1) : String(b1).replace(',', '.'), formatMoney(gunluk * Number(c1), 2, l)]),
          align: ['l', 'r', 'r'],
        },
        note: T(l, 'Brüt tutardır; gelir vergisi ve SGK kesintisi ayrıca uygulanır. Toplu sözleşme daha fazlasını verebilir.', 'Gross amount; income tax and social security are deducted on top. A collective agreement may give more.'),
      };
    },
  };
}

/* ------------------------------------------------------------------ Yıllık izin (4857 md. 53, 657 md. 102) */
/** Kıdem dilimi: ilk dilimin üst sınırı dahildir (4857 md. 53 « beş yıl dahil », 657 md. 102 « 10 yıl dahil »). */
const dilimFn = (kidem: number) => (t: { kidemMin: number; kidemMax: number }, i: number) => kidem >= t.kidemMin && (i === 0 ? kidem <= t.kidemMax : kidem < t.kidemMax);
export function yillikIzin(statu: 'isci' | 'memur', kidem: number, yas: number, yeralti: boolean): { gun: number; neden: 'kidem' | 'yas' | 'yok' } {
  const Z = P.izin, dilim = dilimFn(kidem);
  if (statu === 'memur') { if (kidem < 1) return { gun: 0, neden: 'yok' }; return { gun: Z.memur.find(dilim)!.gun, neden: 'kidem' }; }
  if (kidem < 1) return { gun: 0, neden: 'yok' };
  let g = Z.isci.find(dilim)!.gun, neden: 'kidem' | 'yas' = 'kidem';
  if ((yas <= 18 || yas >= 50) && g < Z.isciGencYasli) { g = Z.isciGencYasli; neden = 'yas'; }
  if (yeralti) g += Z.yeraltiEk;
  return { gun: g, neden };
}
function yiSpec(l: Lang, a: Args = {}): ToolSpec {
  return {
    inputs: [
      { kind: 'choice', id: 'statu', label: T(l, 'Çalışma durumu', 'Status'), def: String(a.statu ?? 'isci'), options: [{ value: 'isci', label: T(l, 'İşçi (4857)', 'Employee (4857)') }, { value: 'memur', label: T(l, 'Memur (657)', 'Civil servant (657)') }] },
      { id: 'kidem', label: T(l, 'Hizmet süresi', 'Length of service'), def: Number(a.kidem ?? 3), unit: T(l, 'yıl', 'years'), max: 50, decimals: 1 },
      { id: 'yas', label: T(l, 'Yaşınız', 'Your age'), def: Number(a.yas ?? 35), unit: T(l, 'yaş', 'years'), max: 80 },
      { kind: 'choice', id: 'yeralti', label: T(l, 'Yer altı maden işi', 'Underground mining'), def: 'hayir', adv: true, options: [{ value: 'hayir', label: T(l, 'Hayır', 'No') }, { value: 'evet', label: T(l, 'Evet', 'Yes') }] },
    ],
    run: (v) => {
      const st = s(v, 'statu') as 'isci' | 'memur', k = n(v, 'kidem'), y = n(v, 'yas');
      const r = yillikIzin(st, k, y, s(v, 'yeralti') === 'evet' && st === 'isci');
      const p = optimize(2027, Math.min(r.gun, 40));
      const Z = P.izin;
      return {
        label: st === 'isci' ? T(l, 'Yasal yıllık ücretli izin (İş Kanunu md. 53)', 'Statutory paid annual leave (Labour Act art. 53)') : T(l, 'Yıllık izin (657 sayılı Kanun md. 102)', 'Annual leave (Civil Servants Act art. 102)'),
        value: T(l, `${num(r.gun, l)} gün`, `${num(r.gun, l)} days`),
        sub: r.neden === 'yok' ? T(l, 'İzin hakkı deneme süresi dahil bir yıl çalıştıktan sonra doğar.', 'The right arises after one year of service, probation included.') : r.neden === 'yas' ? T(l, '18 yaş ve altı ile 50 yaş ve üstü işçilere en az 20 gün verilir.', 'Employees aged 18 or under and 50 or over get at least 20 days.') : st === 'isci' ? T(l, 'Kıdeme göre: 1–5 yıl 14, 5–15 yıl 20, 15 yıl ve üstü 26 gün.', 'By service: 1–5 years 14, 5–15 years 20, 15 years and over 26 days.') : T(l, '1–10 yıl hizmette 20, 10 yıldan fazlada 30 gün.', '20 days for 1–10 years of service, 30 beyond 10 years.'),
        rows: [
          [T(l, 'İzin günü', 'Leave days'), num(r.gun, l)],
          [T(l, 'Bölünürse bir parça en az', 'If split, one part at least'), st === 'isci' ? T(l, `${Z.bolumEnAz} gün`, `${Z.bolumEnAz} days`) : T(l, 'kural yok', 'no minimum')],
          [T(l, 'Resmi tatil izne sayılır mı', 'Do holidays inside leave count'), T(l, 'hayır (md. 56)', 'no (art. 56)')],
          [T(l, '2027\'de bu izinle en uzun toplam tatil', 'Best 2027 use: days off in total'), T(l, `${num(p.bos, l)} gün`, `${num(p.bos, l)} days`), p.bos],
        ],
        note: T(l, 'İş sözleşmesi ya da toplu sözleşme daha fazla gün verebilir, daha azını veremez.', 'A contract or collective agreement can give more days, never fewer.'),
      };
    },
  };
}

export const SPECS: Record<string, (l: Lang, arg?: Args) => ToolSpec> = { by: bySpec, bt: btSpec, kp: kpSpec, rt: rtSpec, im: imSpec, rm: rmSpec, dg: dgSpec, uc: ucSpec, yi: yiSpec };
export const TOOL_KINDS = [...Object.keys(SPECS), 'geri', 'vakit', 'takvim'];
export function getTool(kind: string, l: Lang, arg?: Args): ToolSpec {
  const f = SPECS[kind]; if (!f) throw new Error(`simulateur inconnu : ${kind}`);
  return f(l, arg);
}
/** Lance un simulateur avec ses valeurs par défaut (ou celles données) : sert aux pages et aux tests. */
export function runTool(kind: string, l: Lang, arg?: Args, values?: V): ToolOut {
  const spec = getTool(kind, l, arg);
  const v = Object.fromEntries(spec.inputs.map((i) => [i.id, i.def])) as V;
  return spec.run(resolve(spec.inputs, { ...v, ...(values ?? {}) }));
}
export { formatNumber, weekday };
