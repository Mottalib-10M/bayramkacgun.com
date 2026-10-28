/**
 * Canlı geri sayım (gün, saat, dakika, saniye): Türkiye saatiyle (UTC+3) sabitlenmiş bir ana kadar.
 * İlk çizim = derleme günü (__BUILD_DAY__), sunucu ve tarayıcıda aynı (RECETTE §17.5); cihaz saati yüklemeden sonra devralır.
 * Hiçbir şey gönderilmez: hesap tarayıcıda yapılır.
 */
import { useEffect, useState } from 'react';
import { t } from '../../i18n/ui';
import type { Lang } from '../../lib/format';

interface Props { at: string; label: string; dateText: string; lang: Lang }
export const parca = (ms: number) => { const s = Math.max(0, Math.floor(ms / 1000)); return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 }; };
/** Derleme günü, Türkiye saatiyle gece yarısı: ilk çizimin « şimdi »si. */
export const ILK_AN = () => Date.parse(`${__BUILD_DAY__}T00:00:00+03:00`);

export function useNow(): number {
  const [now, setNow] = useState<number>(ILK_AN);
  useEffect(() => { setNow(Date.now()); const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);
  return now;
}
export function useTz(): string {
  const [tz, setTz] = useState('');
  useEffect(() => { try { setTz(Intl.DateTimeFormat().resolvedOptions().timeZone); } catch { /* saat dilimi yok */ } }, []);
  return tz;
}
export function Hucreler({ left, lang }: { left: number; lang: Lang }) {
  const ui = t(lang), p = parca(left);
  const nf = new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-GB');
  const cell = (v: number, u: string) => <span className="inline-flex items-baseline gap-1"><span className="tabular-nums text-2xl font-bold text-navy-900">{nf.format(v)}</span><span className="text-sm text-navy-600">{u}</span></span>;
  return <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1" aria-live="off">{cell(p.d, ui.days)}{cell(p.h, ui.hours)}{cell(p.m, ui.minutes)}{cell(p.s, ui.seconds)}</p>;
}

export default function Countdown({ at, label, dateText, lang }: Props) {
  const ui = t(lang);
  const now = useNow(), tz = useTz();
  const left = Date.parse(at) - now;
  return (
    <div data-chrome className="rounded-lg border border-accent-200 bg-accent-50 px-4 py-3">
      <p className="text-sm font-medium text-navy-700">{ui.countdownTo} {label}, {dateText}</p>
      {left > 0 ? <Hucreler left={left} lang={lang} /> : <p className="mt-1 text-sm text-navy-800">{ui.passed}</p>}
      {tz && <p className="mt-1 text-xs text-navy-600">{ui.tzNote} {tz}.</p>}
    </div>
  );
}
