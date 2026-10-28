/**
 * Yıllık takvim: hafta numaraları (ISO 8601), resmi tatiller (tam ve yarım gün) ve dini günler.
 * İlk çizim = derlemenin varsayılan yılı; paylaşılan adres yüklemeden sonra okunur (RECETTE §17.5).
 */
import { useEffect, useMemo, useState } from 'react';
import SelectField from '../ui/SelectField';
import { ResultCard, Rows, ShareRow } from '../calc/parts';
import { readParams, updateURL } from '../../lib/url-state';
import { tatiller, diniGunler, DINI_AD, yilOzeti, dayNum, isoWeek, type Hafta } from '../../lib/engine/takvim';
import { dLong } from '../../lib/tool-specs';
import { t } from '../../i18n/ui';
import type { Lang } from '../../lib/format';

interface Props { lang: Lang; year: number; methodHref?: string; idPrefix?: string }
const TAG = (l: Lang) => (l === 'tr' ? 'tr-TR' : 'en-GB');
const YILLAR = [2026, 2027, 2028];

export default function Takvim({ lang, year: y0, methodHref, idPrefix = 'k' }: Props) {
  const ui = t(lang), T = (tr: string, en: string) => (lang === 'tr' ? tr : en);
  const [year, setYear] = useState(y0);
  const [hafta, setHafta] = useState<Hafta>('5');
  useEffect(() => { const u = readParams(window.location.search); const y = Number(u.get('yil')); if (YILLAR.includes(y)) setYear(y); if (u.get('hafta') === '6') setHafta('6'); }, []);
  useEffect(() => updateURL({ yil: year, hafta }), [year, hafta]);
  const list = useMemo(() => tatiller(year), [year]);
  const hol = useMemo(() => { const m = new Map<string, { sure: number; ad: string }>(); for (const x of list) { const o = m.get(x.date); m.set(x.date, { sure: Math.max(o?.sure ?? 0, x.sure), ad: o ? `${o.ad} · ${x.ad[lang]}` : x.ad[lang] }); } return m; }, [list, lang]);
  const dini = useMemo(() => new Map(diniGunler(year).filter((e) => !/^(ramazan|kurban)-(\d|arefe)$/.test(e.id)).map((e) => [e.date, DINI_AD[e.id][lang]])), [year, lang]);
  const oz = yilOzeti(year, hafta);
  const wdHead = Array.from({ length: 7 }, (_, i) => new Date(Date.UTC(2027, 1, 1 + i)).toLocaleDateString(TAG(lang), { weekday: 'short', timeZone: 'UTC' }));
  const iso = (d: number) => new Date(d * 864e5).toISOString().slice(0, 10);
  const months = Array.from({ length: 12 }, (_, m) => {
    const first = dayNum(year, m + 1, 1), last = dayNum(year, m + 2, 1) - 1;
    const lead = (new Date(first * 864e5).getUTCDay() + 6) % 7;
    const cells: Array<number | null> = [...Array(lead).fill(null)];
    for (let d = first; d <= last; d++) cells.push(d);
    while (cells.length % 7) cells.push(null);
    const weeks: Array<Array<number | null>> = []; for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
    return { name: new Date(first * 864e5).toLocaleDateString(TAG(lang), { month: 'long', timeZone: 'UTC' }), weeks };
  });
  return (
    <div className="rounded-xl border border-navy-200 bg-white p-4 sm:p-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,23rem)]">
        <form className="grid content-start grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
          <SelectField id={`${idPrefix}-yil`} label={T('Yıl', 'Year')} value={String(year)} onChange={(v) => setYear(Number(v))} options={YILLAR.map((y) => ({ value: String(y), label: String(y) }))} />
          <SelectField id={`${idPrefix}-hafta`} label={T('Çalışma haftası', 'Working week')} value={hafta} onChange={(v) => setHafta(v as Hafta)} options={[{ value: '5', label: T('5 gün (Cmt-Paz tatil)', '5 days (Sat-Sun off)') }, { value: '6', label: T('6 gün (Paz tatil)', '6 days (Sun off)') }]} />
        </form>
        <ResultCard label={T(`Takvim ${year}`, `Calendar ${year}`)} value={T(`${String(oz.isGunu)} iş günü`, `${String(oz.isGunu)} working days`)} sub={T(`${String(oz.toplam).replace('.', ',')} gün resmi tatil, ${String(oz.yarim)} yarım gün`, `${oz.toplam} days of public holidays, ${oz.yarim} half days`)}>
          <Rows rows={[[T('Hafta içine düşen tatil', 'Holidays on working days'), String(oz.haftaIci).replace('.', lang === 'tr' ? ',' : '.')], [T('1. hafta başlangıcı', 'Week 1 starts on'), dLong(iso(dayNum(year, 1, 4) - ((new Date(dayNum(year, 1, 4) * 864e5).getUTCDay() + 6) % 7)), lang)]]} />
          <ShareRow methodHref={methodHref} labels={ui} />
        </ResultCard>
      </div>
      <div className="kal-grid mt-6">
        {months.map((mo) => (
          <table key={mo.name}>
            <caption className="mb-1 text-left text-sm font-semibold text-navy-900">{mo.name} {year}</caption>
            <thead><tr><th scope="col" className="text-[0.7rem] font-medium text-navy-600">{T('Hf', 'Wk')}</th>{wdHead.map((h) => <th key={h} scope="col" className="font-medium text-navy-700">{h}</th>)}</tr></thead>
            <tbody>{mo.weeks.map((w, i) => {
              const firstDay = w.find((x) => x !== null)!;
              return (
                <tr key={i}><td className="kw">{isoWeek(iso(firstDay))}</td>
                  {w.map((d, j) => {
                    if (d === null) return <td key={j} />;
                    const f = hol.get(iso(d)), dn = dini.get(iso(d));
                    const cls = f ? (f.sure < 1 ? 'tf' : 'ft') : (j === 6 || (hafta === '5' && j === 5)) ? 'we' : '';
                    return <td key={j} className={cls} title={f ? f.ad : dn}>{new Date(d * 864e5).getUTCDate()}{dn && !f ? '*' : ''}</td>;
                  })}
                </tr>
              );
            })}</tbody>
          </table>
        ))}
      </div>
      <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-navy-700"><span><span className="mr-1 inline-block h-3 w-3 rounded bg-accent-100 align-middle" aria-hidden="true" />{T('resmi tatil', 'public holiday')}</span><span><span className="mr-1 inline-block h-3 w-3 rounded bg-navy-100 align-middle" aria-hidden="true" />{T('yarım gün (13.00\'ten sonra)', 'half day (from 1 pm)')}</span><span>* {T('dini gün ya da kandil (tatil değil)', 'religious day or kandil night (not a holiday)')}</span></p>
      <ul className="mt-4 grid gap-x-6 gap-y-1 text-sm text-navy-800 sm:grid-cols-2">
        {list.map((f) => <li key={f.id + f.date}><span className="tabular-nums">{dLong(f.date, lang)}</span> · {f.ad[lang]}</li>)}
      </ul>
    </div>
  );
}
