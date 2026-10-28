/**
 * Günlük vakitler ve « iftara kaç dakika kaldı » : il ve tarih seçilir; imsak, güneş, öğle, ikindi, akşam (iftar) ve yatsı
 * Diyanet ölçüleriyle hesaplanır (engine/vakit.ts). Seçilen gün bugünse sıradaki vakte canlı geri sayım gösterilir.
 * İlk çizim derleme gününe göre (RECETTE §17.5); il ve tarih adres satırına yazılır, başka yere gönderilmez.
 */
import { useEffect, useMemo, useState } from 'react';
import SelectField from '../ui/SelectField';
import { ResultCard, Rows, ShareRow } from '../calc/parts';
import { readParams, updateURL } from '../../lib/url-state';
import { IL, il } from '../../lib/engine/iller';
import { vakit, hhmm, VAKIT_IDS, type VakitId } from '../../lib/engine/vakit';
import { ramazan, ramazanGunu, addDays } from '../../lib/engine/takvim';
import { dWeek } from '../../lib/tool-specs';
import { Hucreler, useNow, useTz } from './Countdown';
import { t } from '../../i18n/ui';
import type { Lang } from '../../lib/format';

interface Props { lang: Lang; il?: string; methodHref?: string; idPrefix?: string }
const AD: Record<VakitId, { tr: string; en: string }> = { imsak: { tr: 'İmsak', en: 'Imsak (fast begins)' }, gunes: { tr: 'Güneş', en: 'Sunrise' }, ogle: { tr: 'Öğle', en: 'Dhuhr' }, ikindi: { tr: 'İkindi', en: 'Asr' }, aksam: { tr: 'Akşam (iftar)', en: 'Maghrib (iftar)' }, yatsi: { tr: 'Yatsı', en: 'Isha' } };
/** Türkiye'de şu anın tarihi (UTC+3). */
const trBugun = (ms: number) => new Date(ms + 3 * 3600e3).toISOString().slice(0, 10);

export default function Vakit({ lang, il: il0 = 'istanbul', methodHref, idPrefix = 'v' }: Props) {
  const ui = t(lang), T = (tr: string, en: string) => (lang === 'tr' ? tr : en);
  const now = useNow(), tz = useTz();
  const [slug, setSlug] = useState(il0);
  const [gun, setGun] = useState<string>(__BUILD_DAY__);
  const [elle, setElle] = useState(false);
  useEffect(() => {
    const u = readParams(window.location.search);
    const x = u.get('il'); if (x && IL.some((i) => i.slug === x)) setSlug(x);
    const d = u.get('tarih'); if (d && /^\d{4}-\d{2}-\d{2}$/.test(d)) { setGun(d); setElle(true); } else setGun(trBugun(Date.now()));
  }, []);
  useEffect(() => updateURL(elle ? { il: slug, tarih: gun } : { il: slug }), [slug, gun, elle]);
  const x = il(slug);
  const v = useMemo(() => vakit(gun, x.lat, x.lng), [gun, x]);
  const bugun = trBugun(now);
  const yarin = useMemo(() => vakit(addDays(gun, 1), x.lat, x.lng), [gun, x]);
  // Sıradaki vakit: seçilen gün bugünse, Türkiye saatine göre.
  const dk = (now + 3 * 3600e3) % 864e5 / 60000;
  const sira = gun === bugun ? VAKIT_IDS.find((k) => v[k] > dk) : undefined;
  const hedefDk = sira ? v[sira] : gun === bugun ? 1440 + yarin.imsak : undefined;
  const hedefAd = sira ? AD[sira][lang] : T('Yarın imsak', 'Tomorrow\'s imsak');
  const left = hedefDk !== undefined ? (hedefDk - dk) * 60000 : 0;
  const iftarLeft = gun === bugun && v.aksam > dk ? (v.aksam - dk) * 60000 : 0;
  const r = ramazan(Number(gun.slice(0, 4)));
  const ramGun = r && gun >= r.ilk && gun <= r.son ? ramazanGunu(r, gun) : 0;
  const ad = lang === 'tr' ? x.ad : x.en;
  return (
    <div className="rounded-xl border border-navy-200 bg-white p-4 sm:p-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,23rem)]">
        <form className="grid content-start grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
          <SelectField id={`${idPrefix}-il`} label={T('İl', 'Province')} value={slug} onChange={(s) => setSlug(s)} options={[...IL].sort((a, b) => a.ad.localeCompare(b.ad, 'tr')).map((i) => ({ value: i.slug, label: lang === 'tr' ? i.ad : i.en }))} />
          <div className="grid grid-rows-subgrid row-span-3 content-start gap-y-0">
            <label htmlFor={`${idPrefix}-tarih`} className="mb-1 block text-sm font-medium text-navy-700">{T('Tarih', 'Date')}</label>
            <input id={`${idPrefix}-tarih`} type="date" value={gun} min="2026-01-01" max="2035-12-31" onChange={(e) => { if (e.target.value) { setGun(e.target.value); setElle(true); } }} className="h-12 w-full rounded-lg border border-navy-300 bg-white px-3 text-navy-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20" />
          </div>
          {gun === bugun && hedefDk !== undefined && <div className="sm:col-span-2 rounded-lg border border-accent-200 bg-accent-50 px-4 py-3">
            <p className="text-sm font-medium text-navy-700">{iftarLeft > 0 ? T(`${ad} iftarına kalan süre (${hhmm(v.aksam)})`, `Time left until iftar in ${ad} (${hhmm(v.aksam)})`) : T(`${hedefAd} vaktine kalan süre`, `Time left until ${hedefAd}`)}</p>
            <Hucreler left={iftarLeft > 0 ? iftarLeft : left} lang={lang} />
            {tz && <p className="mt-1 text-xs text-navy-600">{ui.tzNote} {tz}. {T('Vakitler Türkiye saatiyle (UTC+3).', 'Times are Turkey time (UTC+3).')}</p>}
          </div>}
        </form>
        <ResultCard label={T(`${ad}, ${dWeek(gun, lang)}`, `${ad}, ${dWeek(gun, lang)}`)} value={T(`İftar ${hhmm(v.aksam)}`, `Iftar ${hhmm(v.aksam)}`)} sub={ramGun ? T(`Ramazan'ın ${ramGun}. günü · imsak ${hhmm(v.imsak)}`, `Day ${ramGun} of Ramadan · imsak ${hhmm(v.imsak)}`) : T(`İmsak ${hhmm(v.imsak)} · oruç ${Math.floor((v.aksam - v.imsak) / 60)} sa ${Math.round((v.aksam - v.imsak) % 60)} dk`, `Imsak ${hhmm(v.imsak)} · fast ${Math.floor((v.aksam - v.imsak) / 60)} h ${Math.round((v.aksam - v.imsak) % 60)} min`)}>
          <Rows rows={VAKIT_IDS.map((k) => [AD[k][lang], hhmm(v[k])] as [string, string])} />
          <p className="mt-2 text-xs text-navy-600">{T('Hesaplanan vakit; Diyanet takviminden en çok 1 dakika farklı. İbadette resmi takvim esastır.', 'Computed time; at most 1 minute off the Diyanet calendar. For worship, the official calendar prevails.')}</p>
          <ShareRow methodHref={methodHref} labels={ui} />
        </ResultCard>
      </div>
    </div>
  );
}
