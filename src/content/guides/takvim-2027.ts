/** 2027 takvimi : iş günleri K.isGunleri, hafta numaraları K.isoWeek, tatiller K.tatiller, dini günler K.diniGunler (Diyanet). */
import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { dShort } from '../../lib/tool-specs';
import { formatDecimal } from '../../lib/format';

type L = 'tr' | 'en';
const d1 = (x: number, l: L) => formatDecimal(x, 1, l);
const Y = 2027;
const ig = K.isGunleri(Y), ig6 = K.isGunleri(Y, '6');
const o = K.yilOzeti(Y), o6 = K.yilOzeti(Y, '6');
const AY = (i: number, l: L) => new Date(Date.UTC(Y, i, 15)).toLocaleDateString(l === 'tr' ? 'tr-TR' : 'en-GB', { month: 'long', timeZone: 'UTC' });
const topIs = (i: number) => ig[i].tam + ig[i].yarim;
const enAz = ig.map((_, i) => i).sort((a, b) => topIs(a) - topIs(b) || a - b)[0];
const enCok = ig.map((_, i) => i).sort((a, b) => topIs(b) - topIs(a) || a - b)[0];
const ceyrek = [0, 1, 2, 3].map((q) => ig.slice(q * 3, q * 3 + 3).reduce((s, m) => s + m.tam + m.yarim, 0));
const hafta1 = K.addDays(`${Y}-01-04`, -((K.weekday(K.fromIso(`${Y}-01-04`)) + 6) % 7));
const sonHafta = K.isoWeek(`${Y}-12-28`);
const rb = K.bayram('ramazan', Y)!, kb = K.bayram('kurban', Y)!;
const dini = K.diniGunler(Y).filter((e) => !/^(ramazan|kurban)-(\d|arefe)$/.test(e.id));
const kandil = dini.filter((e) => ['regaib', 'mirac', 'berat', 'mevlid', 'kadir'].includes(e.id));
const rmz = K.ramazan(Y)!;

export default defineGuide({
  id: 'takvim-2027', group: 'tatil', order: 53, tool: 'takvim', toolArg: { yil: Y },
  related: ['resmi-tatiller-2027', 'kopru-gunleri-2027', 'dini-gunler-2027', 'ramazan-2027', 'yillik-izin', 'kurban-bayrami-2027'],
  sources: ['k2429', 'dg2027', 'rt2027'],
  tr: {
    slug: 'takvim-2027', nav: '2027 takvimi', card: `${o.isGunu} iş günü, hafta numaraları ve kandiller`,
    title: '2027 takvimi: iş günleri, hafta numaraları ve tatiller',
    description: `2027 takvimi: ay ay iş günü sayısı (yılda ${o.isGunu}), ISO hafta numaraları, resmi tatiller ve kandil geceleri tek sayfada; iki bayramın haftası da işaretli.`,
    h1: '2027 takvimi: 12 ay, hafta numaraları ve iş günleri',
    intro: 'Aşağıdaki yıllık takvimde her satırın başında ISO hafta numarası var; resmi tatiller renkli, yarım günler açık renkli, dini günler yıldızla işaretli.',
    resume: `2027 yılı Cuma günü başlar ve Cuma günü biter; 365 gündür. Cumartesi ve Pazar tatil yapan biri için ${o.isGunu} iş günü vardır; bunun ${o.yarim} tanesi öğleden sonrası tatil olan yarım gündür (Ramazan Bayramı arefesi ve 28 Ekim). En az iş günü olan ay ${topIs(enAz)} günle ${AY(enAz, 'tr')}, en çok olan ay ${topIs(enCok)} günle ${AY(enCok, 'tr')}. ISO 8601 hafta numaralandırmasına göre 1 Ocak 2027 hâlâ 2026'nın ${K.isoWeek(`${Y}-01-01`)}. haftasıdır; 2027'nin 1. haftası ${dShort(hafta1, 'tr')} başlar ve yıl ${sonHafta} haftadır. Ramazan Bayramı ${K.isoWeek(rb.ilk)}. haftada, Kurban Bayramı ${K.isoWeek(kb.ilk)}. haftanın Pazarından ${K.isoWeek(kb.son)}. haftanın Çarşambasına uzanır. Takvimde ayrıca ${kandil.length} kandil gecesi ile hicri yılbaşı ve Aşure Günü gibi tatil olmayan dini günler de gösterilir. Pazar dışında her gün çalışanlar için yılın iş günü ${o6.isGunu} olur; bu hesapta Cumartesiye düşen 1 Mayıs tatil, yine Cumartesiye gelen Kurban arefesi ise yarım iş günü sayılır.`,
    faqs: [
      { q: '2027 yılında hangi ayda kaç iş günü var?', a: `Beş günlük haftada: ${ig.map((m, i) => `${AY(i, 'tr')} ${m.tam + m.yarim}`).join(', ')}. Yarım günler (Mart ve Ekim'de birer tane) iş günü olarak sayılmıştır. Yıl toplamı ${o.isGunu} gündür; en kısa ay ${AY(enAz, 'tr')}, en uzun ay ${AY(enCok, 'tr')} olur. Altı günlük haftada yıl toplamı ${o6.isGunu} gündür.` },
      { q: '2027 kaç hafta?', a: `ISO 8601'e göre ${sonHafta} hafta. Bu standartta hafta Pazartesi başlar ve yılın ilk Perşembesini içeren hafta 1. haftadır. Bu yüzden 1. hafta ${dShort(hafta1, 'tr')} başlar; 1–3 Ocak 2027 ise önceki yılın ${K.isoWeek(`${Y}-01-01`)}. haftasına aittir. Son hafta 27 Aralık Pazartesi başlar ve 2 Ocak 2028'de biter.` },
      { q: '2027\'de Kurban Bayramı kaçıncı haftada?', a: `Bayramın ilk günü ${dShort(kb.ilk, 'tr')} ${K.isoWeek(kb.ilk)}. haftanın son günüdür; ikinci, üçüncü ve dördüncü günler ${K.isoWeek(kb.son)}. haftanın Pazartesi–Çarşamba günlerine düşer. Arefe günü olan ${dShort(kb.arefe, 'tr')} ise ${K.isoWeek(kb.arefe)}. haftadadır. Pazartesi–Cuma çalışan biri için bu arefenin yarım günü hafta sonunda kalır. Ramazan Bayramının üç günü ${K.isoWeek(rb.ilk)}. haftada, arefesi ${dShort(rb.arefe, 'tr')} ise ${K.isoWeek(rb.arefe)}. haftadadır.` },
    ],
    body: (h) => `<h2>Ay ay iş günleri</h2>
<p>Tablo, her ayda hafta tatili ve resmi tatil dışında kalan günleri sayar. Yarım gün sütunu, sabahı çalışılan ama 13.00'ten sonra tatil olan günleri ayrıca gösterir. Bordro, proje planı ya da fatura vadesi hesaplarken bu sayıları kullanabilirsiniz.</p>
${h.table(['Ay', 'Tam iş günü (5 gün)', 'Yarım gün', 'Tam iş günü (6 gün)'], ig.map((m, i) => [AY(i, 'tr'), m.tam, m.yarim, ig6[i].tam]), '2027 iş günleri, Cumartesi-Pazar ve yalnız Pazar tatil için', ['l', 'r', 'r', 'r'])}
<p>Çeyrek bazında iş günü dağılımı ${ceyrek.join(', ')} şeklindedir. İlk çeyrekte Ramazan Bayramı, ikinci çeyrekte 23 Nisan, 1 Mayıs ve Kurban Bayramı iş günlerini azaltır. ${AY(4, 'tr')} ayı ${topIs(4)} iş günüyle yılın en kısa ayıdır; 1 Mayıs Cumartesiye düşse de Kurban Bayramının hafta içine gelen üç günü (sonuncusu aynı zamanda 19 Mayıs) bu ayı kısaltır. Yılın ikinci yarısında yalnızca 15 Temmuz, 30 Ağustos ve 28–29 Ekim vardır.</p>
<h2>Hafta numaraları neden 53 ile başlıyor?</h2>
<p>Türkiye'de iş hayatında yaygın olan ISO 8601 standardında hafta Pazartesi başlar ve yılın ilk haftası, içinde ilk Perşembeyi barındıran haftadır. 2027'nin ilk Perşembesi 7 Ocak olduğu için 1. hafta ${h.wday(hafta1)} başlar; Cuma 1 Ocak, Cumartesi 2 Ocak ve Pazar 3 Ocak önceki yılın ${K.isoWeek(`${Y}-01-01`)}. haftasında kalır. Yıl ${sonHafta} hafta sürer. Önemli tarihlerin hafta numaraları: Ramazan Bayramı ${K.isoWeek(rb.ilk)}, Kurban Bayramı ${K.isoWeek(kb.ilk)}–${K.isoWeek(kb.son)}, 15 Temmuz ${K.isoWeek('2027-07-15')}, 30 Ağustos ${K.isoWeek('2027-08-30')}, 29 Ekim ${K.isoWeek('2027-10-29')}.</p>
<h2>Takvimdeki yıldızlar: dini günler ve kandiller</h2>
<p>Yıldızla işaretli günler resmi tatil değildir; Diyanet İşleri Başkanlığının dini günler listesinden gelir. Kandiller, listede yazan günün akşamı başlar. Ramazan ayı ${dShort(rmz.ilk, 'tr')} ilk oruçla başlar, Kadir Gecesi ${dShort(rmz.kadir, 'tr')} akşamıdır.</p>
${h.table(['Tarih', 'Gün', 'Dini gün', 'Hicri'], dini.map((e) => [h.day(e.date), h.wd(e.date), K.DINI_AD[e.id].tr, e.hicri]), '2027 dini günleri (tatil değildir; Diyanet listesi)')}
<p>Tüm dini günleri hicri karşılıklarıyla ${h.a('dini-gunler-2027', '2027 dini günler')} sayfasında, oruç takvimini ${h.a('ramazan-2027', 'Ramazan 2027')} sayfasında bulabilirsiniz.</p>
${h.mini('dg', { p: ['yil'], d: { yil: Y }, c: 'Dini günler listesini açın' })}
<h2>Takvimi izin planına çevirmek</h2>
<p>Takvime bakınca boşlukların nerede olduğu hemen görülür: Mart başında Ramazan Bayramının iki yanı, Mayıs ortasında Kurban Bayramının ardından gelen Perşembe-Cuma, Temmuz ortasında 15 Temmuzu izleyen Cuma. Hangi günlere izin koyarsanız kaç gün kazanacağınızı ${h.a('kopru-gunleri-2027', '2027 köprü günleri')} sayfası hesaplar; resmi tatillerin tam listesi ${h.a('resmi-tatiller-2027', 'resmi tatiller 2027')} sayfasında, kaç gün izin hakkınız olduğu ${h.a('yillik-izin', 'yıllık izin hesabında')}. Kurban Bayramının gün gün dökümü için ${h.a('kurban-bayrami-2027', 'Kurban Bayramı 2027')}.</p>`,
  },
  en: {
    slug: 'turkey-calendar-2027', nav: '2027 calendar', card: `${o.isGunu} working days, week numbers and religious days`,
    title: 'Turkey calendar 2027: working days, weeks and holidays',
    description: `Turkey calendar 2027: working days month by month (${o.isGunu} in the year), ISO week numbers, public holidays and kandil nights on one page; both Eid weeks marked.`,
    h1: 'Turkey calendar 2027: twelve months, week numbers, working days',
    intro: 'In the yearly calendar below, each row starts with its ISO week number; public holidays are shaded, half days lighter, and religious days carry a star.',
    resume: `2027 starts on a Friday and ends on a Friday, with 365 days. For someone off on Saturdays and Sundays, Turkey has ${o.isGunu} working days in 2027, ${o.yarim} of them half days with the afternoon off (the Ramazan Bayramı eve and 28 October). The month with the fewest working days is ${AY(enAz, 'en')} with ${topIs(enAz)}; the one with the most is ${AY(enCok, 'en')} with ${topIs(enCok)}. Under ISO 8601 week numbering, 1 January 2027 still belongs to week ${K.isoWeek(`${Y}-01-01`)} of 2026; week 1 of 2027 begins on ${dShort(hafta1, 'en')} and the year has ${sonHafta} weeks. Ramazan Bayramı (Eid al-Fitr) sits in week ${K.isoWeek(rb.ilk)}, while Kurban Bayramı (Eid al-Adha) runs from the Sunday of week ${K.isoWeek(kb.ilk)} to the Wednesday of week ${K.isoWeek(kb.son)}. The calendar also shows ${kandil.length} kandil nights and other religious days, such as the Islamic New Year and Ashura, that are not days off. On a six-day week the year has ${o6.isGunu} working days.`,
    faqs: [
      { q: 'How many working days does each month of 2027 have in Turkey?', a: `On a five-day week: ${ig.map((m, i) => `${AY(i, 'en')} ${m.tam + m.yarim}`).join(', ')}. The half days (one in March, one in October) are counted as working days. The year totals ${o.isGunu}; the shortest month is ${AY(enAz, 'en')} and the longest ${AY(enCok, 'en')}. On a six-day week the year has ${o6.isGunu} working days.` },
      { q: 'How many weeks are there in 2027?', a: `${sonHafta} ISO weeks. Under ISO 8601 weeks start on Monday, and week 1 is the one containing the first Thursday of the year. So week 1 starts on ${dShort(hafta1, 'en')}, while 1 to 3 January 2027 belong to week ${K.isoWeek(`${Y}-01-01`)} of the previous year. The last week starts on Monday 27 December and ends on 2 January 2028.` },
      { q: 'Which week number is Eid al-Adha 2027?', a: `Day one, ${dShort(kb.ilk, 'en')}, is the last day of week ${K.isoWeek(kb.ilk)}; days two to four fall on Monday to Wednesday of week ${K.isoWeek(kb.son)}. The eve, ${dShort(kb.arefe, 'en')}, belongs to week ${K.isoWeek(kb.arefe)}. Eid al-Fitr sits entirely in week ${K.isoWeek(rb.ilk)}, and its eve, ${dShort(rb.arefe, 'en')}, falls in week ${K.isoWeek(rb.arefe)}.` },
    ],
    body: (h) => `<h2>Working days month by month</h2>
<p>The table counts the days in each month that are neither a weekly rest day nor a public holiday. The half-day column lists days worked in the morning but off from 1 pm. Use these figures for payroll, project plans or payment terms.</p>
${h.table(['Month', 'Full working days (5-day)', 'Half days', 'Full working days (6-day)'], ig.map((m, i) => [AY(i, 'en'), m.tam, m.yarim, ig6[i].tam]), 'Working days in Turkey, 2027, with Saturday-Sunday or Sunday only off', ['l', 'r', 'r', 'r'])}
<p>By quarter, working days run ${ceyrek.join(', ')}. Ramazan Bayramı trims the first quarter; 23 April, 1 May and Kurban Bayramı trim the second. With ${topIs(4)} working days, ${AY(4, 'en')} is the shortest month even though Labour Day falls on a Saturday, because three weekdays of Kurban Bayramı fall in it, the last of them doubling as Youth Day. The second half of the year only has 15 July, 30 August and 28 and 29 October.</p>
<h2>Why the weeks start at 53</h2>
<p>ISO 8601, the week numbering used across Turkish business, starts each week on Monday and makes week 1 the one containing the first Thursday. The first Thursday of 2027 is 7 January, so week 1 begins on ${h.wday(hafta1)}; Friday 1, Saturday 2 and Sunday 3 January stay in week ${K.isoWeek(`${Y}-01-01`)} of the year before. The year has ${sonHafta} weeks. Key week numbers: Ramazan Bayramı ${K.isoWeek(rb.ilk)}, Kurban Bayramı ${K.isoWeek(kb.ilk)} to ${K.isoWeek(kb.son)}, 15 July ${K.isoWeek('2027-07-15')}, 30 August ${K.isoWeek('2027-08-30')}, 29 October ${K.isoWeek('2027-10-29')}.</p>
<h2>The stars: religious days and kandil nights</h2>
<p>Starred dates are not public holidays; they come from the Diyanet's list of religious days. A kandil night begins on the evening of the listed date. Ramadan starts with the first fast on ${dShort(rmz.ilk, 'en')}, and Laylat al-Qadr is the evening of ${dShort(rmz.kadir, 'en')}.</p>
${h.table(['Date', 'Day', 'Religious day', 'Hijri'], dini.map((e) => [h.day(e.date), h.wd(e.date), K.DINI_AD[e.id].en, e.hicri]), 'Religious days in Turkey, 2027 (not days off; Diyanet list)')}
<p>The full list with Hijri dates is on ${h.a('dini-gunler-2027', 'religious days 2027')}, and the fasting calendar on ${h.a('ramazan-2027', 'Ramadan 2027')}.</p>
${h.mini('dg', { p: ['yil'], d: { yil: Y }, c: 'Open the list of religious days' })}
<h2>Turning the calendar into a leave plan</h2>
<p>Seen on a calendar, the gaps stand out: both sides of Ramazan Bayramı in early March, the Thursday and Friday after Kurban Bayramı in mid-May, the Friday after 15 July. The ${h.a('kopru-gunleri-2027', '2027 bridge days')} page works out how many days off each choice of leave brings; the full list is on ${h.a('resmi-tatiller-2027', 'public holidays 2027')}, and your entitlement on the ${h.a('yillik-izin', 'annual leave calculator')}. For Kurban Bayramı day by day, see ${h.a('kurban-bayrami-2027', 'Kurban Bayramı 2027')}.</p>`,
  },
});
