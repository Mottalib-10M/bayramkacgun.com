/** Ramazan Bayramı 2028 : Diyanet 2028 listesi ; hafta sonuna düşen bayram (engine/izin.ts). */
import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { dShort, dLong, aralik } from '../../lib/tool-specs';

const b = K.bayram('ramazan', 2028)!, r = K.ramazan(2028)!;
const z = K.diniGunler(2028).filter((e) => /^ramazan-(arefe|\d)$/.test(e.id));
const t0 = K.bayramTatili('ramazan', 2028, 0)!, t1 = K.bayramTatili('ramazan', 2028, 1)!, t4 = K.bayramTatili('ramazan', 2028, 4)!, t5 = K.bayramTatili('ramazan', 2028, 5)!;
const kayip = b.gunler.filter((d) => K.isWeekend(K.fromIso(d))).length;

export default defineGuide({
  id: 'ramazan-bayrami-2028', group: 'bayram', order: 7, tool: 'by', toolArg: { tur: 'ramazan', yil: 2028 },
  countdown: { date: b.ilk, label: { tr: 'Ramazan Bayramı 2028', en: 'Ramazan Bayramı 2028' } },
  related: ['ramazan-bayrami-2027', 'imsakiye-2028', 'kurban-bayrami-2028', 'resmi-tatiller-2028', 'bayram-tarihleri'],
  sources: ['dg2028', 'k2429', 'rt2028'],
  tr: {
    slug: 'ramazan-bayrami-2028', nav: 'Ramazan Bayramı 2028', card: '26–28 Şubat 2028: iki günü hafta sonunda, arefe Cuma',
    title: 'Ramazan Bayramı 2028 ne zaman? 26–28 Şubat, arefe ve tatil',
    description: 'Ramazan Bayramı 2028: 26 Şubat Cumartesi başlar, 28 Şubat Pazartesi biter; arefe 25 Şubat Cuma. Bayramın iki günü hafta sonunda: izinsiz 3, 4 gün izinle 9 gün.',
    h1: 'Ramazan Bayramı 2028: 26–28 Şubat, hafta sonuyla çakışıyor',
    intro: 'Diyanet takvimine göre Ramazan Bayramı 2028, 26 Şubat Cumartesi günü başlar. Araç bayram günlerini ve diğer yılların tarihlerini listeler.',
    resume: `Ramazan Bayramı 2028, Diyanet'in 2028 dini günler listesine göre ${dShort(b.ilk, 'tr')} günü başlar ve ${dShort(b.son, 'tr')} günü sona erer. Arefe ${dShort(b.arefe, 'tr')} günüdür; Ramazanın son orucu o gün tutulur ve 13.00'ten sonrası tatildir. Bu yıl bayramın ${kayip} günü hafta sonuna denk gelir. Türkiye'de hafta sonuna düşen tatil başka güne aktarılmadığı için Cumartesi-Pazar zaten tatil olan çalışan, izin almadan yalnızca ${t0.gun} gün evde kalır ve iş günü kaybı olarak bayramdan sadece Pazartesi'yi kazanır. Arefe sabahı için bir gün izinle tatil Cuma başlar ve ${t1.gun} güne çıkar. Daha uzun bir ara için iki seçenek vardır: bayramdan sonraki 29 Şubat–3 Mart için 4 gün izin ${aralik(t4.bas, t4.son, 'tr')} arası ${t4.gun} gün, bayramdan önceki haftanın tamamı için 5 gün izin ise ${t5.gun} gün eder. Ramazan 2028 ${dShort(r.ilk, 'tr')} günü başlar ve ${r.gun} gün sürer.`,
    faqs: [
      { q: 'Ramazan Bayramı 2028 hangi tarihte başlıyor?', a: `${dShort(b.ilk, 'tr')} günü başlar, ${dShort(b.son, 'tr')} günü biter. Arefe ${dShort(b.arefe, 'tr')} günüdür; Ramazanın son orucu o gün tutulur ve tatil saat 13.00'te başlar. Tarih Diyanet İşleri Başkanlığının 2028 listesindedir. Kanuni süre 3,5 gündür, ancak bayramın ${kayip} günü hafta sonuna denk geldiği için Cumartesi-Pazar tatil yapan biri izinsiz ${t0.gun} gün tatil yapar.` },
      { q: 'Ramazan Bayramı 2028 hafta sonuna denk gelince tatil uzar mı?', a: `Hayır. Cumartesi ve Pazara düşen bayram günlerinin yerine başka gün verilmez. Hafta sonu tatil yapan biri için bayram ${aralik(t0.bas, t0.son, 'tr')} arasında ${t0.gun} gündür; tek iş günü kazancı Pazartesi'dir. Tatili uzatmanın yolu izindir: arefe sabahı için bir gün izinle ${t1.gun} gün, bayramdan sonraki ${t4.izin} iş günü için izinle ${aralik(t4.bas, t4.son, 'tr')} arası ${t4.gun} gün olur.` },
      { q: '2028 Ramazan ayı kaç gün sürecek?', a: `${r.gun} gün. İlk oruç ${dShort(r.ilk, 'tr')}, son oruç arefe günü ${dShort(r.son, 'tr')} tutulur. Kadir Gecesi ${dShort(r.kadir, 'tr')} akşamıdır. Diyanet ay başlarını hilal ölçütüne göre önceden hesapladığı için ayın kaç gün çekeceği bugünden bellidir ve bayram tarihi son anda değişmez. Son orucun ertesi günü, ${dShort(b.ilk, 'tr')}, bayramın ilk günüdür ve o gün oruç tutulmaz.` },
    ],
    body: (h) => `<h2>Bayram günleri</h2>
${h.table(['Tarih', 'Gün', 'Hicri tarih'], z.map((e) => [h.day(e.date), h.wd(e.date), e.hicri]), 'Ramazan Bayramı 2028 (Diyanet İşleri Başkanlığı)')}
<h2>Hafta sonuna düşen bir bayram</h2>
<p>2028'de bayramın birinci ve ikinci günleri Cumartesi ve Pazardır. Kanunda tanımlanan 3,5 günlük tatilin büyük kısmı, beş gün çalışanlar için zaten boş olan günlere gelir. Kazanç, Cuma öğleden sonrası ile Pazartesiden ibarettir. Cumartesi de çalışılan işyerlerinde durum farklıdır: orada Cumartesi gerçekten tatile dönüşür, bu yüzden altı günlük haftada bayram, beş günlük haftadakiyle aynı uzunluktadır.</p>
<h2>Uzun tatil için hangi günler?</h2>
<p>Kısa yol arefe sabahıdır: bir gün izinle Cuma'dan Pazartesiye ${t1.gun} gün. Daha uzun bir tatil için bayramdan sonraki haftanın Salı-Cuma günleri, yani 29 Şubat ile 3 Mart arası seçilebilir; 2028 artık yıl olduğu için Şubat 29 gün çeker ve bu tarih takvimde vardır. Dört gün izinle ${h.wday(t4.bas)} ile ${h.wday(t4.son)} arası ${t4.gun} gün tatil yapılır.</p>
${h.mini('bt', { p: ['izin'], d: { tur: 'ramazan', yil: 2028, izin: 4 }, c: 'Ramazan Bayramı 2028 için izin planlayın' })}
<h2>Ramazan 2028 ve imsakiye</h2>
<p>Bayramdan önceki Ramazan, kışın sonuna denk geldiği için kısa oruçlu bir aydır. İstanbul'da ilk gün oruç süresi on bir buçuk saatin biraz üstündedir. 81 il için gün gün imsak ve iftar saatleri ${h.a('imsakiye-2028', 'imsakiye 2028')} sayfasındadır.</p>
<h2>Sonraki yıllar</h2>
<p>Hicri yıl her yıl yaklaşık on bir gün öne kaydığı için Ramazan Bayramı 2029'da Şubat ortasına, 2031'de Ocak sonuna iner ve 2033'te bir yılda iki kez kutlanır. Liste ${h.a('bayram-tarihleri', 'bayram tarihleri 2026–2035')} sayfasında. Bir önceki bayram ${h.a('ramazan-bayrami-2027', 'Ramazan Bayramı 2027')} ise 9–11 Mart'tadır.</p>`,
  },
  en: {
    slug: 'eid-al-fitr-2028-turkey', nav: 'Ramazan Bayramı 2028', card: '26–28 February 2028: two days on the weekend, eve on Friday',
    title: 'Eid al-Fitr 2028 in Turkey: Ramazan Bayramı dates, days off',
    description: 'Ramazan Bayramı (Eid al-Fitr) 2028 in Turkey: Saturday 26 to Monday 28 February, eve on Friday 25. Two on the weekend: 3 days off, or 9 with 4 leave days.',
    h1: 'Ramazan Bayramı 2028 in Turkey: 26–28 February, over a weekend',
    intro: 'According to the Diyanet calendar, Ramazan Bayramı (Eid al-Fitr) 2028 starts on Saturday 26 February. The tool lists the holiday days and the dates of other years.',
    resume: `Ramazan Bayramı 2028, the feast at the end of Ramadan, starts on ${dShort(b.ilk, 'en')} and ends on ${dShort(b.son, 'en')}, according to the Diyanet's 2028 list. The eve is ${dShort(b.arefe, 'en')}: the last fast of Ramadan is kept that day and the afternoon from 1 pm is a holiday. This year ${kayip} days of the feast fall on the weekend. Turkey does not move holidays that land on a Saturday or Sunday, so an employee who already has weekends off stays home for only ${t0.gun} days without leave, and the only working day gained is the Monday. One leave day for the eve morning starts the break on Friday and makes it ${t1.gun} days. For a longer break there are two options: four leave days from 29 February to 3 March give ${t4.gun} days, from ${dLong(t4.bas, 'en')} to ${dLong(t4.son, 'en')}, and five leave days on the whole week before give ${t5.gun} days. Ramadan 2028 begins on ${dShort(r.ilk, 'en')} and lasts ${r.gun} days.`,
    faqs: [
      { q: 'When does Eid al-Fitr 2028 start in Turkey?', a: `On ${dShort(b.ilk, 'en')}; it ends on ${dShort(b.son, 'en')}. The eve is ${dShort(b.arefe, 'en')}, the last day of fasting, with the holiday starting at 1 pm. The date is on the Diyanet's 2028 list. The legal length is 3.5 days, but ${kayip} of the feast days fall on the weekend, so someone with Saturdays and Sundays off gets ${t0.gun} days without leave.` },
      { q: 'Is the Eid al-Fitr 2028 holiday extended because it falls on a weekend?', a: `No. Turkey gives no replacement for holiday days falling on a Saturday or Sunday. For someone with weekends off the feast runs from ${aralik(t0.bas, t0.son, 'en')}, ${t0.gun} days, and the Monday is the only working day gained. Leave is the way to stretch it: one day on the eve morning gives ${t1.gun} days, and ${t4.izin} days after the feast give ${t4.gun} days, ${aralik(t4.bas, t4.son, 'en')}.` },
      { q: 'How long is Ramadan 2028?', a: `${r.gun} days. The first fast is on ${dShort(r.ilk, 'en')}, the last on the eve, ${dShort(r.son, 'en')}. Laylat al-Qadr is the evening of ${dShort(r.kadir, 'en')}. Because the Diyanet computes month starts in advance from its crescent criterion, the length of the month is already known and the feast date will not shift at the last minute. The day after the last fast, ${dShort(b.ilk, 'en')}, is the first day of Eid.` },
    ],
    body: (h) => `<h2>The holiday days</h2>
${h.table(['Date', 'Day', 'Hijri date'], z.map((e) => [h.day(e.date), h.wd(e.date), e.hicri]), 'Ramazan Bayramı 2028 (Diyanet)')}
<h2>A feast that lands on a weekend</h2>
<p>In 2028 the first and second days of the feast are Saturday and Sunday. Most of the 3.5 days set by law fall on days that five-day workers have off anyway. What they gain is Friday afternoon and Monday. Where Saturday is a working day the picture changes: Saturday really becomes a day off, so on a six-day week the feast is as long as on a five-day week.</p>
<h2>Which days to take for a long break</h2>
<p>The short route is the eve morning: one leave day for ${t1.gun} days from Friday to Monday. For a longer break, take Tuesday to Friday of the following week, 29 February to 3 March; 2028 is a leap year, so February has 29 days. Four leave days then give ${t4.gun} days off from ${h.wday(t4.bas)} to ${h.wday(t4.son)}.</p>
${h.mini('bt', { p: ['izin'], d: { tur: 'ramazan', yil: 2028, izin: 4 }, c: 'Plan your leave around Eid al-Fitr 2028' })}
<h2>Ramadan 2028 and fasting times</h2>
<p>The Ramadan before this feast falls at the end of winter, so the fasts are short. In Istanbul the first fast lasts just over eleven and a half hours. Fasting start and iftar times for all 81 provinces are on ${h.a('imsakiye-2028', 'the 2028 Ramadan timetable')}.</p>
<h2>The years after</h2>
<p>The Hijri year moves about eleven days earlier each year, so Eid al-Fitr reaches mid-February in 2029, late January in 2031 and is celebrated twice in 2033. The list is on ${h.a('bayram-tarihleri', 'bayram dates 2026–2035')}. The previous feast, ${h.a('ramazan-bayrami-2027', 'Ramazan Bayramı 2027')}, runs from 9 to 11 March.</p>`,
  },
});
