/** Kurban Bayramı 2028 : Diyanet 2028 listesi ; 1 Mayıs Pazartesi ile köprü (engine/izin.ts). */
import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { dShort, dLong, aralik } from '../../lib/tool-specs';

const b = K.bayram('kurban', 2028)!, b27 = K.bayram('kurban', 2027)!;
const z = K.diniGunler(2028).filter((e) => e.id.startsWith('kurban'));
const t0 = K.bayramTatili('kurban', 2028, 0)!, t3 = K.bayramTatili('kurban', 2028, 3)!, t7 = K.bayramTatili('kurban', 2028, 7)!;
const s3 = K.bayramTatili('kurban', 2028, 3, { hafta: '6' })!;
const geri = K.daysBetween(b.ilk.replace('2028', '2027'), b27.ilk);

export default defineGuide({
  id: 'kurban-bayrami-2028', group: 'bayram', order: 6, tool: 'by', toolArg: { tur: 'kurban', yil: 2028 },
  countdown: { date: b.ilk, label: { tr: 'Kurban Bayramı 2028', en: 'Kurban Bayramı 2028' } },
  related: ['kurban-bayrami-2027', 'ramazan-bayrami-2028', 'resmi-tatiller-2028', 'kopru-gunleri-2028', 'bayram-tarihleri'],
  sources: ['dg2028', 'k2429', 'rt2028'],
  tr: {
    slug: 'kurban-bayrami-2028', nav: 'Kurban Bayramı 2028', card: '5–8 Mayıs 2028: 1 Mayıs ile birleşince 3 gün izinle 10 gün',
    title: 'Kurban Bayramı 2028 ne zaman? 5–8 Mayıs, 1 Mayıs köprüsü',
    description: 'Kurban Bayramı 2028: 5 Mayıs Cuma başlar, 8 Mayıs Pazartesi biter; arefe 4 Mayıs Perşembe. 1 Mayıs Pazartesi ile 3 gün izinle 10 gün, 7 gün izinle 16 gün tatil.',
    h1: 'Kurban Bayramı 2028: 5–8 Mayıs, Cumadan Pazartesiye',
    intro: 'Diyanet takvimine göre Kurban Bayramı 2028, 5 Mayıs Cuma günü başlar. Tarih aracı arefe, bayram günleri ve diğer yılları gösterir.',
    resume: `Kurban Bayramı 2028, Diyanet İşleri Başkanlığının 2028 dini günler listesine göre ${dShort(b.ilk, 'tr')} günü başlar ve ${dShort(b.son, 'tr')} günü biter; arefe ${dShort(b.arefe, 'tr')} günüdür ve 13.00'ten itibaren tatildir. 2027'deki bayramın tersine bu kez takvim cömerttir. Bayram iki iş günü ile hafta sonunu kapsadığı için izin almadan ${t0.gun} gün tatil yapılır. Daha önemlisi, aynı haftanın başında 1 Mayıs Emek ve Dayanışma Günü vardır ve Pazartesiye düşer. Arada yalnızca Salı, Çarşamba ve arefe sabahı kalır: bu üç gün için izin alan, ${aralik(t3.bas, t3.son, 'tr')} arasında ${t3.gun} gün kesintisiz tatil yapar. Bayramdan sonraki haftayı da eklerseniz 7 gün izinle tatil ${t7.gun} güne çıkar. Haftada altı gün çalışanlar için aynı 3 gün izin ${s3.gun} gün eder. Hicri takvim güneş yılından kısa olduğundan bayram her yıl yaklaşık ${geri} gün öne gelir: 2027'de 16 Mayıs'ta başlıyordu.`,
    faqs: [
      { q: 'Kurban Bayramı 2028 hangi tarihlerde?', a: `${dShort(b.ilk, 'tr')} ile ${dShort(b.son, 'tr')} arasında, dört gün. Arefe ${dShort(b.arefe, 'tr')} günüdür ve tatil o gün saat 13.00'te başlar; kanuni süre 4,5 gündür. Hicri takvimde 10–13 Zilhicce 1449'a karşılık gelir. Tarih Diyanet İşleri Başkanlığının 2028 dini günler listesinden alınmıştır. Bayram, 2027'deki ${aralik(b27.ilk, b27.son, 'tr')} tarihlerine göre yılın ${geri} gün daha erken bir dönemine düşer.` },
      { q: '2028 Kurban Bayramında kaç gün izinle kaç gün tatil yapılır?', a: `İzinsiz ${t0.gun} gün (${aralik(t0.bas, t0.son, 'tr')}). 2, 3 ve 4 Mayıs için ${t3.izin} gün izinle 1 Mayıs da tatile katılır ve ${t3.gun} gün olur. 9–12 Mayıs da eklenirse ${t7.izin} gün izinle ${t7.gun} gün. Cumartesi de çalışılan altı günlük düzende aynı ${s3.izin} gün izin ${s3.gun} günlük tatil sağlar. Kendi izin bütçenize göre sonucu sayfadaki hesaplayıcı gösterir.` },
      { q: '2028 Kurban Bayramı 19 Mayıs ile çakışıyor mu?', a: `Hayır. 2028'de 19 Mayıs Cumadır ve bayramdan ayrı bir tatil günüdür; Kurban Bayramı ${dShort(b.son, 'tr')} günü biter. Bu yüzden 2028'in toplam resmi tatili 2027'dekinden bir gün fazladır. 19 Mayıs Cumaya düştüğü için Cumartesi-Pazar tatil yapanlar o hafta izin almadan üç gün üst üste dinlenir; bu, bayramın bitişinden ${K.daysBetween(b.son, '2028-05-19')} gün sonra gelen ayrı bir uzun hafta sonudur.` },
    ],
    body: (h) => `<h2>Kurban Bayramı 2028 takvimi</h2>
${h.table(['Tarih', 'Gün', 'Hicri tarih'], z.map((e) => [h.day(e.date), h.wd(e.date), e.hicri]), 'Kurban Bayramı 2028 (Diyanet İşleri Başkanlığı 2028 listesi)')}
<h2>1 Mayıs ile bayram arasında üç gün</h2>
<p>Mayıs 2028'in ilk haftası, yılın en verimli köprüsünü içerir. Pazartesi 1 Mayıs tam gün tatil, Cuma'dan itibaren bayram. Aradaki Salı ve Çarşamba normal iş günüdür, Perşembe arefedir: sabah iş, 13.00'ten sonra tatil. Bu üç gün kapatıldığında önceki Cumartesi, 29 Nisan'dan 8 Mayıs Pazartesiye kadar kesintisiz ${t3.gun} gün boş kalır. Arefe sabahı işyerinizde yarım gün izin sayılıyorsa aynı tatil iki buçuk gün izne mal olur.</p>
${h.mini('bt', { p: ['izin', 'arefe'], d: { tur: 'kurban', yil: 2028, izin: 3 }, c: 'Kurban Bayramı 2028 tatilinizi hesaplayın' })}
<h2>Bayramdan sonraki hafta</h2>
<p>Bayram Pazartesi bittiği için ertesi haftanın dört iş günü, 9–12 Mayıs, bir sonraki hafta sonuna uzanır. Önceki köprüyle birlikte toplam 7 gün izin, ${h.wday(t7.bas)} ile ${h.wday(t7.son)} arasında ${t7.gun} gün eder. Aynı ay 19 Mayıs Cumaya düşer ve ayrıca bir uzun hafta sonu verir. Tüm yılın köprülerini ${h.a('kopru-gunleri-2028', 'köprü günleri 2028')} sayfası listeler.</p>
<h2>2027 ile karşılaştırma</h2>
<p>2027'de bayram Pazar başlıyor, arefe Cumartesiye ve dördüncü gün 19 Mayıs'a denk geliyordu; tatil hem kısa hem de verimsizdi. 2028'de arefe Perşembedir, bayram günlerinin ikisi iş gününe düşer ve 1 Mayıs aynı haftadadır. Aynı kanun, iki yıl arasında çok farklı bir tatil üretir. Ayrıntılar ${h.a('kurban-bayrami-2027', 'Kurban Bayramı 2027')} sayfasında.</p>
<h2>Tarih kesin mi?</h2>
<p>Evet. Diyanet, hicri ayların başını hilalin görülebilirliğine göre önceden hesaplar ve 2028 listesini yayımlamıştır. Türkiye'de bayram son gece ilan edilmez; bu tarih değişmez. Sonraki yılların tarihleri ${h.a('bayram-tarihleri', 'bayram tarihleri')} sayfasındadır. Kamu personeline idari izin verilip verilmeyeceği ise her yıl ayrıca kararlaştırılır; 2028 için henüz bir karar yoktur.</p>`,
  },
  en: {
    slug: 'eid-al-adha-2028-turkey', nav: 'Kurban Bayramı 2028', card: '5–8 May 2028: with 1 May, 10 days off for 3 leave days',
    title: 'Eid al-Adha 2028 in Turkey: Kurban Bayramı dates, long break',
    description: 'Kurban Bayramı (Eid al-Adha) 2028 in Turkey: Friday 5 to Monday 8 May, eve on Thursday 4 May. With 1 May on a Monday, 3 leave days give 10 days, 7 give 16.',
    h1: 'Kurban Bayramı 2028 in Turkey: Friday 5 to Monday 8 May',
    intro: 'According to the Diyanet calendar, Kurban Bayramı (Eid al-Adha) 2028 starts on Friday 5 May. The tool shows the eve, the holiday days and other years.',
    resume: `Kurban Bayramı 2028, the Feast of Sacrifice, starts on ${dShort(b.ilk, 'en')} and ends on ${dShort(b.son, 'en')}, according to the Diyanet's list of religious days for 2028; the eve, ${dShort(b.arefe, 'en')}, is a holiday from 1 pm. Unlike 2027, the calendar is generous this time. The feast covers two working days and a weekend, so it gives ${t0.gun} days off without leave. Better still, Labour Day on 1 May falls on the Monday of the same week. Only Tuesday, Wednesday and the eve morning lie in between: take those three days as leave and you are off for ${t3.gun} days in a row, from ${dLong(t3.bas, 'en')} to ${dLong(t3.son, 'en')}. Add the week after the feast and seven leave days give ${t7.gun} days. On a six-day week the same three leave days give ${s3.gun} days. Because the Hijri year is shorter than the solar year, the feast moves about ${geri} days earlier each year: in 2027 it began on 16 May.`,
    faqs: [
      { q: 'When is Eid al-Adha 2028 in Turkey?', a: `From ${dShort(b.ilk, 'en')} to ${dShort(b.son, 'en')} 2028, four days, with the eve on ${dShort(b.arefe, 'en')}; the holiday starts at 1 pm that day and lasts 4.5 days by law. In the Hijri calendar that is 10 to 13 Dhu al-Hijjah 1449. The dates come from the Diyanet's 2028 list and sit ${geri} days earlier in the year than the 2027 feast.` },
      { q: 'How many days off can I get around Eid al-Adha 2028?', a: `${t0.gun} days without leave (${aralik(t0.bas, t0.son, 'en')}). ${t3.izin} leave days on 2, 3 and 4 May bring in 1 May as well, for ${t3.gun} days. Adding 9 to 12 May, ${t7.izin} leave days give ${t7.gun} days. On a six-day week the same ${s3.izin} leave days give ${s3.gun} days off. The calculator on this page shows the result for your own leave budget.` },
      { q: 'Does Eid al-Adha 2028 overlap with 19 May?', a: `No. In 2028, 19 May is a Friday and a separate holiday; the feast ends on ${dShort(b.son, 'en')}. That is one reason 2028 has a day more of public holidays than 2027. With 19 May on a Friday, anyone who has weekends off gets three days in a row that week without leave, a separate long weekend ${K.daysBetween(b.son, '2028-05-19')} days after the feast ends.` },
    ],
    body: (h) => `<h2>The 2028 calendar</h2>
${h.table(['Date', 'Day', 'Hijri date'], z.map((e) => [h.day(e.date), h.wd(e.date), e.hicri]), 'Kurban Bayramı 2028 (Diyanet 2028 list)')}
<h2>Three days between Labour Day and the feast</h2>
<p>The first week of May 2028 holds the best bridge of the year. Monday 1 May is a full holiday, the feast starts on Friday. Tuesday and Wednesday are normal working days and Thursday is the eve: work in the morning, holiday from 1 pm. Close those three days and you are free from Saturday 29 April to Monday 8 May, ${t3.gun} days without a break. If your employer books the eve morning as half a day, the same break costs two and a half days of leave.</p>
${h.mini('bt', { p: ['izin', 'arefe'], d: { tur: 'kurban', yil: 2028, izin: 3 }, c: 'Work out your Eid al-Adha 2028 break' })}
<h2>The week after the feast</h2>
<p>As the feast ends on a Monday, the four working days after it, 9 to 12 May, reach the next weekend. With the earlier bridge, seven leave days cover ${h.wday(t7.bas)} to ${h.wday(t7.son)}, ${t7.gun} days. The same month, 19 May falls on a Friday and adds another long weekend. Every bridge of the year is on ${h.a('kopru-gunleri-2028', 'bridge days 2028')}.</p>
<h2>Compared with 2027</h2>
<p>In 2027 the feast starts on a Sunday, its eve falls on a Saturday and its fourth day on 19 May: a short break that is hard to stretch. In 2028 the eve is a Thursday, two feast days are working days and Labour Day sits in the same week. The same law yields a very different break. Details on ${h.a('kurban-bayrami-2027', 'Kurban Bayramı 2027')}.</p>
<h2>Is the date final?</h2>
<p>Yes. The Diyanet computes the start of Hijri months in advance from crescent visibility and has published its 2028 list. In Turkey the feast is not announced the night before, so the date will not change. Later years are on ${h.a('bayram-tarihleri', 'bayram dates')}. Whether public employees get administrative leave is decided separately each year; nothing has been decided for 2028.</p>`,
  },
});
