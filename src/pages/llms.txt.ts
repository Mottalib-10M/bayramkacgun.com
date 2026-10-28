/** llms.txt (RECETTE §21), généré à partir du registre des pages. */
import { GUIDES } from '../lib/pages';
import { SITE_URL, LAST_UPDATED, SITE_NAMES } from '../data/site-config';
import { route } from '../i18n/routes';
import { GROUPS } from '../i18n/nav';
import { KIT as K } from '../lib/kit';
export function GET() {
  const k27 = K.bayram('kurban', 2027)!, r27 = K.bayram('ramazan', 2027)!, ram = K.ramazan(2027)!, D = K.DOGRULAMA, o = K.optimize(2027, 10);
  const lines = [
    `# ${SITE_NAMES.tr}`, '',
    `> Turkish religious holidays (Ramazan Bayramı, Kurban Bayramı), public holidays under Law No. 2429, and Ramadan fasting times for all 81 provincial centres, 2026 to 2028, in Turkish and English. Bayram dates come from the Presidency of Religious Affairs (Diyanet) religious-day lists for 2026-2035 (read on ${K.P.retrieved_at}). Eid al-Fitr 2027: ${r27.ilk} to ${r27.son} (eve ${r27.arefe}, half day from 13:00). Eid al-Adha 2027: ${k27.ilk} to ${k27.son} (eve ${k27.arefe}; day 4 coincides with 19 May). Ramadan 2027: first fast ${ram.ilk}, Laylat al-Qadr evening of ${ram.kadir}. Fasting times are computed, not copied: sun at 18 degrees below the horizon for imsak, 17 for isha, Diyanet safety margins (temkin); checked against the official Diyanet calendar for ${D.iller} provinces over ${D.gunler.adet} days (${D.karsilastirma} comparisons): ${D.tam.imsak}% of imsak and ${D.tam.aksam}% of iftar times identical to the minute, never more than ${D.enFazlaFark} minute apart. Holidays falling on weekends are not moved in Turkey. Administrative leave (idari izin) for 2027: not announced. Leave planner: exact dynamic programming; 2027 with 10 leave days gives ${o.bos} days off. Everything runs in the browser; nothing entered is sent. Independent site by Radif Partners; no donations, no sacrifice sales, no travel offers. Last updated ${LAST_UPDATED}.`, '',
    ...GROUPS.flatMap((g) => [`## ${g.label.en} / ${g.label.tr}`, ...GUIDES.filter((p) => p.group === g.id).flatMap((p) => [
      `- [${p.tr.nav}](${SITE_URL}${route(p.id, 'tr')}): ${p.tr.card}`,
      `- [${p.en.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.en.card}`,
    ]), '']),
    '## About', `- [Yöntem](${SITE_URL}${route('method', 'tr')})`, `- [Method](${SITE_URL}${route('method', 'en')})`, `- [Hakkımızda](${SITE_URL}${route('about', 'tr')})`, `- [About](${SITE_URL}${route('about', 'en')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
