/**
 * « Bayrama kaç gün kaldı » : sıradaki Ramazan Bayramı, Kurban Bayramı, Ramazan başlangıcı, Kadir Gecesi ya da resmi tatile
 * canlı geri sayım. Tarihler Diyanet listelerinden (engine/takvim.ts); an Türkiye saatiyle gece yarısı (UTC+3, yıl boyu).
 * İlk çizim derleme gününe göre; cihaz saati yüklemeden sonra devralır. Seçim adres satırına yazılır, başka yere gönderilmez.
 */
import { useEffect, useMemo, useState } from 'react';
import SelectField from '../ui/SelectField';
import { ResultCard, Rows, ShareRow } from '../calc/parts';
import { readParams, updateURL } from '../../lib/url-state';
import { bayramlar, ramazanlar, tatiller, trInstant, addDays } from '../../lib/engine/takvim';
import { dWeek, aralik } from '../../lib/tool-specs';
import { Hucreler, useNow, useTz } from './Countdown';
import { t } from '../../i18n/ui';
import type { Lang } from '../../lib/format';

type Hedef = 'ramazan-bayrami' | 'kurban-bayrami' | 'ramazan' | 'kadir' | 'tatil';
interface Olay { tarih: string; son: string; ad: string; saat?: string }
interface Props { lang: Lang; hedef?: Hedef; methodHref?: string; idPrefix?: string }

function olaylar(h: Hedef, l: Lang): Olay[] {
  const T = (tr: string, en: string) => (l === 'tr' ? tr : en);
  if (h === 'ramazan-bayrami' || h === 'kurban-bayrami') { const tur = h === 'kurban-bayrami' ? 'kurban' : 'ramazan'; return bayramlar(tur).map((b) => ({ tarih: b.ilk, son: b.son, ad: `${tur === 'kurban' ? T('Kurban Bayramı', 'Eid al-Adha') : T('Ramazan Bayramı', 'Eid al-Fitr')} ${b.ilk.slice(0, 4)}` })); }
  // İlk oruç: imsak vakti ile başlar; geri sayım o günün başına (gece yarısı) kurulur, ilk sahur o gece yapılır.
  if (h === 'ramazan') return ramazanlar().map((r) => ({ tarih: r.ilk, son: r.son, ad: T(`Ramazan ${r.ilk.slice(0, 4)} (ilk oruç)`, `Ramadan ${r.ilk.slice(0, 4)} (first fast)`) }));
  // Kadir Gecesi listede yazan günün akşamıdır: yaklaşık akşam vakti, 18.00 Türkiye saati alınır.
  if (h === 'kadir') return ramazanlar().map((r) => ({ tarih: r.kadir, son: r.kadir, ad: T(`Kadir Gecesi ${r.kadir.slice(0, 4)}`, `Laylat al-Qadr ${r.kadir.slice(0, 4)}`), saat: '18:00' }));
  const ys = [2026, 2027, 2028, 2029];
  return ys.flatMap((y) => tatiller(y)).filter((x) => x.sure >= 1 && !/-(2|3|4)$/.test(x.id)).map((x) => ({ tarih: x.date, son: x.date, ad: x.ad[l] }));
}

export default function GeriSayim({ lang, hedef: h0 = 'kurban-bayrami', methodHref, idPrefix = 'g' }: Props) {
  const ui = t(lang), T = (tr: string, en: string) => (lang === 'tr' ? tr : en);
  const [hedef, setHedef] = useState<Hedef>(h0);
  const now = useNow(), tz = useTz();
  useEffect(() => { const x = readParams(window.location.search).get('hedef') as Hedef | null; if (x && ['ramazan-bayrami', 'kurban-bayrami', 'ramazan', 'kadir', 'tatil'].includes(x)) setHedef(x); }, []);
  useEffect(() => updateURL({ hedef }), [hedef]);
  const list = useMemo(() => olaylar(hedef, lang), [hedef, lang]);
  const ileri = list.filter((o) => Date.parse(trInstant(o.son, '23:59')) > now);
  const o = ileri[0];
  const at = o ? Date.parse(trInstant(o.tarih, o.saat ?? '00:00')) : 0;
  const left = at - now, basladi = o && left <= 0;
  const gun = Math.ceil(left / 864e5);
  const opts = [
    { value: 'kurban-bayrami', label: T('Kurban Bayramı', 'Eid al-Adha (Kurban)') },
    { value: 'ramazan-bayrami', label: T('Ramazan Bayramı', 'Eid al-Fitr (Ramazan)') },
    { value: 'ramazan', label: T('Ramazan (ilk oruç)', 'Ramadan (first fast)') },
    { value: 'kadir', label: T('Kadir Gecesi', 'Laylat al-Qadr') },
    { value: 'tatil', label: T('Sıradaki resmi tatil', 'Next public holiday') },
  ];
  return (
    <div className="rounded-xl border border-navy-200 bg-white p-4 sm:p-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,23rem)]">
        <form className="grid content-start grid-cols-1 gap-x-4 gap-y-3" onSubmit={(e) => e.preventDefault()}>
          <SelectField id={`${idPrefix}-hedef`} label={T('Neye kaç gün kaldı?', 'Count down to')} value={hedef} onChange={(v) => setHedef(v as Hedef)} options={opts} />
          {o && <div className="rounded-lg border border-accent-200 bg-accent-50 px-4 py-3">
            <p className="text-sm font-medium text-navy-700">{basladi ? T(`${o.ad} sürüyor`, `${o.ad} is under way`) : `${ui.countdownTo} ${o.ad}`}</p>
            {!basladi && <Hucreler left={left} lang={lang} />}
            {tz && <p className="mt-1 text-xs text-navy-600">{ui.tzNote} {tz}. {T('Hedef an Türkiye saatiyle (UTC+3) gece yarısı.', 'Target is midnight Turkey time (UTC+3).')}</p>}
          </div>}
        </form>
        {o && <ResultCard label={o.ad} value={basladi ? T('Bugün', 'Today') : T(`${gun} gün kaldı`, `${gun} days to go`)} sub={o.tarih === o.son ? dWeek(o.tarih, lang) : aralik(o.tarih, o.son, lang)}>
          <Rows rows={ileri.slice(1, 4).map((x) => [x.ad, x.tarih === x.son ? dWeek(x.tarih, lang) : aralik(x.tarih, x.son, lang)] as [string, string])} />
          {hedef.endsWith('bayrami') && <p className="mt-2 text-xs text-navy-600">{T(`Arefe ${dWeek(addDays(o.tarih, -1), lang)}, 13.00'ten itibaren yarım gün tatil.`, `Eve on ${dWeek(addDays(o.tarih, -1), lang)}, a half-day holiday from 1 pm.`)}</p>}
          <ShareRow methodHref={methodHref} labels={ui} />
        </ResultCard>}
      </div>
    </div>
  );
}
