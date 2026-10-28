/** İmsakiye 2028 : Ramazan 2028 (Diyanet listesi) için 81 il, hesaplanan vakitler ; resmi takvim henüz yayımlanmadı. */
import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { dShort } from '../../lib/tool-specs';

const r = K.ramazan(2028)!, r27 = K.ramazan(2027)!;
const BUYUK = ['istanbul', 'ankara', 'izmir', 'bursa', 'antalya', 'konya', 'adana', 'gaziantep', 'diyarbakir', 'erzurum'];
const o = (s: string) => K.ramazanOzet(s, 2028), o27 = (s: string) => K.ramazanOzet(s, 2027);
const ist = o('istanbul'), ist27 = o27('istanbul');
const tum = K.IL.map((x) => ({ x, o: o(x.slug) }));
const enKisa = [...tum].sort((a, b) => a.o.ilk.oruc - b.o.ilk.oruc)[0], enUzun = [...tum].sort((a, b) => b.o.son.oruc - a.o.son.oruc)[0];
const u = K.uclar(r.ilk);
const once = K.addDays(r.ilk, -1);
const D = K.DOGRULAMA;
const kd = K.imsakiye('istanbul', 2028).rows.find((x) => x.kadir)!;

export default defineGuide({
  id: 'imsakiye-2028', group: 'ramazan', order: 25, tool: 'im', toolArg: { il: 'istanbul', yil: 2028 },
  countdown: { date: r.ilk, label: { tr: 'Ramazan 2028 (ilk oruç)', en: 'Ramadan 2028 (first fast)' } },
  related: ['imsakiye-2027', 'ramazan-bayrami-2028', 'ramazan-2027', 'iftar-saati', 'kurban-bayrami-2028', 'imsakiye-istanbul'],
  sources: ['dg2028', 'imsak', 'temkin', 'namazvakitleri'],
  tr: {
    slug: 'imsakiye-2028', nav: 'İmsakiye 2028', card: '28 Ocak–25 Şubat 2028: yılın en kısa oruçları, 81 il',
    title: 'İmsakiye 2028: Ramazan 2028 imsak ve iftar saatleri, 81 il',
    description: 'Ramazan 2028 imsakiyesi: 28 Ocak–25 Şubat, 29 gün. 81 il için gün gün imsak ve iftar saatleri; İstanbul ilk gün imsak 06:44, iftar 18:22, oruç 11 sa 38 dk.',
    h1: 'İmsakiye 2028: Ocak sonunda başlayan Ramazan',
    intro: 'İlinizi seçin: araç Ramazan 2028\'in her günü için imsak, güneş, iftar, yatsı ve oruç süresini verir. Kadir Gecesi satırı işaretlidir.',
    resume: `Ramazan 2028, Diyanet İşleri Başkanlığının 2028 dini günler listesine göre ${dShort(r.ilk, 'tr')} günü başlar ve ${dShort(r.son, 'tr')} günü son oruçla biter; ${r.gun} gün sürer. İlk teravih ${dShort(once, 'tr')} akşamı kılınır, Kadir Gecesi ${dShort(r.kadir, 'tr')} akşamıdır, Ramazan Bayramı ${dShort(r.bayram, 'tr')} günü başlar. Ay kışın ortasına düştüğü için oruçlar son yılların en kısalarındandır: İstanbul'da ilk gün imsak ${ist.ilk.imsak}, iftar ${ist.ilk.aksam}, oruç ${K.sure(ist.ilk.oruc, 'tr')}; son gün ${K.sure(ist.son.oruc, 'tr')}. Ortalama oruç, 2027'deki ${K.sure(ist27.ortalama, 'tr')} yerine ${K.sure(ist.ortalama, 'tr')} olur. Diyanet 2028 namaz vakitleri takvimini henüz yayımlamadığı için bu imsakiye tamamen hesaptır; aynı yöntem 2027 için resmi takvimle ${D.karsilastirma.toLocaleString('tr-TR')} vakit üzerinden karşılaştırıldı ve hiçbir vakitte bir dakikadan fazla sapmadı. Resmi takvim yayımlandığında karşılaştırmayı bu sayfada güncelleyeceğiz.`,
    faqs: [
      { q: 'Ramazan 2028 ne zaman başlıyor?', a: `Diyanet'in 2028 dini günler listesine göre ilk oruç ${dShort(r.ilk, 'tr')} günü tutulur; ilk teravih ve ilk sahur ${dShort(once, 'tr')} akşamı ve gecesidir. Ramazan ${r.gun} gün sürer: son oruç ${dShort(r.son, 'tr')}, Ramazan Bayramının ilk günü ${dShort(r.bayram, 'tr')} olur. Ramazan 2027'ye göre takvimde yaklaşık on bir gün öne gelmiştir.` },
      { q: '2028\'de oruç kaç saat sürecek?', a: `İstanbul'da ilk gün ${K.sure(ist.ilk.oruc, 'tr')}, son gün ${K.sure(ist.son.oruc, 'tr')}, ortalama ${K.sure(ist.ortalama, 'tr')}. Ülkede ilk gün en kısa oruç ${enKisa.x.ad} ilinde (${K.sure(enKisa.o.ilk.oruc, 'tr')}), son gün en uzun oruç ${enUzun.x.ad} ilindedir (${K.sure(enUzun.o.son.oruc, 'tr')}). Kışın ortasına denk geldiği için 2028 oruçları 2027'dekilerden kısadır.` },
      { q: 'İmsakiye 2028 resmi mi?', a: 'Hayır, hesaplanmıştır. Ramazanın başlangıç ve bitiş tarihleri Diyanet\'in 2028 dini günler listesinden alınır; vakitler ise Diyanet\'in açıkladığı ölçülerle hesaplanır. Aynı hesap 2027 için resmi takvimle karşılaştırıldı ve hiçbir vakitte bir dakikadan fazla sapmadı. Resmi 2028 namaz vakitleri yayımlandığında ibadet için onlar esas alınmalıdır ve karşılaştırmayı bu sayfada yayımlarız.' },
    ],
    body: (h) => `<h2>On büyük ilde ilk ve son gün</h2>
${h.table(['İl', 'İlk gün imsak', 'İlk gün iftar', 'Son gün imsak', 'Son gün iftar', 'Ortalama oruç'], BUYUK.map((s) => { const z = o(s); return [K.il(s).ad, z.ilk.imsak, z.ilk.aksam, z.son.imsak, z.son.aksam, K.sure(z.ortalama, 'tr')]; }), `Ramazan 2028, ${h.day(r.ilk)} – ${h.day(r.son)}, hesaplanan vakitler`)}
<p>İlk gün en erken iftar ${u.ilkIftar.il.ad} ilinde ${h.hhmm(u.ilkIftar.v.aksam)}, en geç ${u.sonIftar.il.ad} ilinde ${h.hhmm(u.sonIftar.v.aksam)}. Diğer iller için yukarıdaki araçtan ilinizi seçin.</p>
<h2>2027 ile 2028 karşılaştırması</h2>
${h.table(['', 'Ramazan 2027', 'Ramazan 2028'], [['İlk oruç', h.day(r27.ilk), h.day(r.ilk)], ['Gün sayısı', String(r27.gun), String(r.gun)], ['İstanbul ilk gün oruç', K.sure(ist27.ilk.oruc, 'tr'), K.sure(ist.ilk.oruc, 'tr')], ['İstanbul son gün oruç', K.sure(ist27.son.oruc, 'tr'), K.sure(ist.son.oruc, 'tr')], ['İstanbul ortalama', K.sure(ist27.ortalama, 'tr'), K.sure(ist.ortalama, 'tr')], ['Kadir Gecesi', h.day(r27.kadir), h.day(r.kadir)]], 'İki Ramazan yan yana (İstanbul)')}
<p>Ramazan bir yılda ${K.daysBetween(r.ilk, `2028${r27.ilk.slice(4)}`)} gün öne geldi. Kış gündönümüne yaklaştıkça günler kısaldığı için oruç da kısalır; Ramazan Aralık ayına kadar gerilediğinde, 2030'ların başında, oruçlar en kısa hâline ulaşır ve sonra yeniden uzamaya başlar.</p>
${h.mini('rm', { p: ['yil'], d: { yil: 2029 }, c: 'Sonraki Ramazanlar: 2029 ve sonrası' })}
<h2>Resmi takvim gelene kadar bu saatlere ne kadar güvenilir?</h2>
<p>Karşılaştırma için okuduğumuz Diyanet vakitleri ${h.day(D.gunler.son)} tarihine kadar uzanıyordu; 2028 vakitleri okuma tarihinde yayımlanmamıştı. Bu yüzden sayfadaki saatler, 2027 için resmi takvimle karşılaştırdığımız aynı hesapla üretilmiştir. Hesap yıla bağlı bir tahmin içermez: güneşin konumu yüzyıllar önceden bilinir, Diyanet'in ölçüleri de (18 derece, 17 derece ve temkin süreleri) yıldan yıla değişmez. 2027 karşılaştırmasında imsakta günlerin ${h.pct(D.tam.imsak)} kadarı, iftarda ${h.pct(D.tam.aksam)} kadarı aynı dakikaydı; kalan günlerde fark bir dakikaydı. 2028 için de benzer bir uyum beklenir, ama Diyanet ölçülerini değiştirirse saatler de değişir. Resmi takvim çıktığında karşılaştırmayı yeniden yapıp sonucu burada yayımlayacağız.</p>
<h2>Kadir Gecesi 2028</h2>
<p>Kadir Gecesi ${h.day(r.kadir)} akşamıdır: o günün iftarından sonra başlar ve sabaha kadar sürer. İstanbul'da o akşam iftar ${kd.aksam}, yatsı ${kd.yatsi} olarak hesaplanır. Ramazanın kalan günleri ve bayram arefesi tabloda gösterilir.</p>
<h2>Ocakta oruç: dikkat edilecekler</h2>
<p>Ocak sonunda sahur saati, birçok çalışanın normal kalkış saatine yakındır: İstanbul'da imsak ${ist.ilk.imsak} olduğu için sahur için çok erken kalkmak gerekmez. Buna karşılık iftar akşam yemeği saatinden erkendir ve iş çıkışına denk gelebilir; trafikte iftar etmemek için ${h.a('iftara-kac-dakika-kaldi', 'canlı iftar sayacı')} işe yarar. Ramazanın ardından gelen bayramın hafta sonuna denk gelişi ve izin planı ${h.a('ramazan-bayrami-2028', 'Ramazan Bayramı 2028')} sayfasında; bu yılki imsakiye ise ${h.a('imsakiye-2027', 'imsakiye 2027')} sayfasında.</p>`,
  },
  en: {
    slug: 'ramadan-timetable-turkey-2028', nav: 'Ramadan timetable 2028', card: '28 January–25 February 2028: the shortest fasts in years, 81 provinces',
    title: 'Ramadan timetable Turkey 2028: imsak and iftar, 81 provinces',
    description: 'Ramadan 2028 timetable for Turkey: 28 January to 25 February, 29 days. Imsak and iftar day by day in 81 provinces; Istanbul first day imsak 06:44, iftar 18:22.',
    h1: 'Ramadan timetable 2028: a Ramadan that starts in late January',
    intro: 'Choose your province: the tool gives imsak, sunrise, iftar, isha and the fast length for every day of Ramadan 2028. The Laylat al-Qadr row is marked.',
    resume: `Ramadan 2028 begins on ${dShort(r.ilk, 'en')} and ends with the last fast on ${dShort(r.son, 'en')}, according to the Diyanet's list of religious days for 2028; it lasts ${r.gun} days. The first tarawih is on the evening of ${dShort(once, 'en')}, Laylat al-Qadr is the evening of ${dShort(r.kadir, 'en')}, and Eid al-Fitr starts on ${dShort(r.bayram, 'en')}. Falling in midwinter, its fasts are among the shortest in recent years: in Istanbul, imsak on the first day is ${ist.ilk.imsak}, iftar ${ist.ilk.aksam}, a fast of ${K.sure(ist.ilk.oruc, 'en')}; on the last day ${K.sure(ist.son.oruc, 'en')}. The average fast is ${K.sure(ist.ortalama, 'en')}, against ${K.sure(ist27.ortalama, 'en')} in 2027. As the Diyanet has not yet published its 2028 prayer-time calendar, this timetable is entirely computed; the same method was checked for 2027 against the official calendar over ${D.karsilastirma.toLocaleString('en-GB')} prayer times and never differed by more than a minute. We will update the comparison on this page once the official calendar is out.`,
    faqs: [
      { q: 'When does Ramadan 2028 start in Turkey?', a: `According to the Diyanet's 2028 list of religious days, the first fast is on ${dShort(r.ilk, 'en')}; the first tarawih and sahur are on the evening and night of ${dShort(once, 'en')}. Ramadan lasts ${r.gun} days: the last fast is on ${dShort(r.son, 'en')} and Eid al-Fitr begins on ${dShort(r.bayram, 'en')}, about eleven days earlier in the calendar than in 2027.` },
      { q: 'How long will the fasts be in 2028?', a: `In Istanbul ${K.sure(ist.ilk.oruc, 'en')} on the first day, ${K.sure(ist.son.oruc, 'en')} on the last and ${K.sure(ist.ortalama, 'en')} on average. Nationally, the shortest first-day fast is in ${enKisa.x.en} (${K.sure(enKisa.o.ilk.oruc, 'en')}) and the longest last-day fast in ${enUzun.x.en} (${K.sure(enUzun.o.son.oruc, 'en')}). Falling in midwinter, the 2028 fasts are shorter than those of 2027.` },
      { q: 'Is the 2028 timetable official?', a: 'No, it is computed. The start and end dates of Ramadan come from the Diyanet\'s 2028 list of religious days, and the prayer times are computed with the Diyanet\'s parameters. The same computation was checked against the official 2027 calendar and never differed by more than a minute. Once the official 2028 prayer times are published, they prevail for worship.' },
    ],
    body: (h) => `<h2>First and last day in ten large provinces</h2>
${h.table(['Province', 'Day 1 imsak', 'Day 1 iftar', 'Last day imsak', 'Last day iftar', 'Average fast'], BUYUK.map((s) => { const z = o(s); return [K.il(s).en, z.ilk.imsak, z.ilk.aksam, z.son.imsak, z.son.aksam, K.sure(z.ortalama, 'en')]; }), `Ramadan 2028, ${h.day(r.ilk)} – ${h.day(r.son)}, computed times`)}
<p>On the first day the earliest iftar is in ${u.ilkIftar.il.en} at ${h.hhmm(u.ilkIftar.v.aksam)}, the latest in ${u.sonIftar.il.en} at ${h.hhmm(u.sonIftar.v.aksam)}. For other provinces, choose yours in the tool above.</p>
<h2>2027 and 2028 compared</h2>
${h.table(['', 'Ramadan 2027', 'Ramadan 2028'], [['First fast', h.day(r27.ilk), h.day(r.ilk)], ['Days', String(r27.gun), String(r.gun)], ['Istanbul, first-day fast', K.sure(ist27.ilk.oruc, 'en'), K.sure(ist.ilk.oruc, 'en')], ['Istanbul, last-day fast', K.sure(ist27.son.oruc, 'en'), K.sure(ist.son.oruc, 'en')], ['Istanbul, average', K.sure(ist27.ortalama, 'en'), K.sure(ist.ortalama, 'en')], ['Laylat al-Qadr', h.day(r27.kadir), h.day(r.kadir)]], 'Two Ramadans side by side (Istanbul)')}
<p>Ramadan moved ${K.daysBetween(r.ilk, `2028${r27.ilk.slice(4)}`)} days earlier in one year. Days shorten towards the winter solstice, so the fast shortens too; when Ramadan reaches December, in the early 2030s, fasts are at their shortest and then begin to lengthen again.</p>
${h.mini('rm', { p: ['yil'], d: { yil: 2029 }, c: 'The next Ramadans: 2029 and after' })}
<h2>How reliable are these times until the official calendar appears?</h2>
<p>The Diyanet prayer times we read for the comparison ran until ${h.day(D.gunler.son)}; the 2028 times had not been published on the reading date. The times on this page therefore come from the same computation we checked against the official 2027 calendar. Nothing in it is a forecast: the sun's position is known centuries ahead, and the Diyanet's parameters (18 degrees, 17 degrees and the safety margins) do not change from year to year. In the 2027 comparison ${h.pct(D.tam.imsak)} of imsak times and ${h.pct(D.tam.aksam)} of iftar times matched to the minute; the rest were one minute apart. Similar agreement is expected for 2028, unless the Diyanet changes its parameters. Once the official calendar is out we will rerun the comparison and publish it here.</p>
<h2>Laylat al-Qadr 2028</h2>
<p>Laylat al-Qadr is the evening of ${h.day(r.kadir)}: it begins after that day's iftar and lasts until morning. In Istanbul iftar that evening is computed at ${kd.aksam} and isha at ${kd.yatsi}.</p>
<h2>Fasting in January: practical points</h2>
<p>In late January the end of sahur is close to many people's usual waking time: with imsak at ${ist.ilk.imsak} in Istanbul, there is no need to get up very early. Iftar, on the other hand, comes before the usual dinner time and may coincide with the commute; the ${h.a('iftara-kac-dakika-kaldi', 'live iftar countdown')} helps avoid breaking the fast in traffic. The feast that follows, its weekend overlap and leave planning are on ${h.a('ramazan-bayrami-2028', 'Ramazan Bayramı 2028')}; this year's timetable is on ${h.a('imsakiye-2027', 'the 2027 Ramadan timetable')}.</p>`,
  },
});
