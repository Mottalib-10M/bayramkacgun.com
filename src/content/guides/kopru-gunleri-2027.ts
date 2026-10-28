/** Köprü günleri 2027 : en iyi izin dağılımı K.optimize (dinamik programlama, kesin sonuç), köprüler K.kopruler / K.kopruGunleri. */
import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { dShort, aralik } from '../../lib/tool-specs';
import { formatDecimal } from '../../lib/format';

type L = 'tr' | 'en';
const d1 = (x: number, l: L) => formatDecimal(x, 1, l);
const Y = 2027;
const p10 = K.optimize(Y, 10), p10y = K.optimize(Y, 10, { yarim: true }), p10s = K.optimize(Y, 10, { hafta: '6' });
const butceler = [3, 5, 10, 14, 20].map((b) => ({ b, p: K.optimize(Y, b) }));
const tek = K.kopruGunleri(Y);
const dort = K.kopruler(Y, {}, 4).filter((k) => k.izin >= 4);
const [ocak, mart, mayis, temmuz] = p10.bloklar;
const izinGun = (k: { izinBas: string; izinSon: string }) => {
  const m = K.tatilHaritasi([Y]); const out: string[] = [];
  for (let d = K.fromIso(k.izinBas); d <= K.fromIso(k.izinSon); d++) { const iso = K.toIso(d); const t = m.get(iso); if (!K.isWeekend(d) && !(t && t.sure >= 1)) out.push(iso); }
  return out;
};
const gl = (k: { izinBas: string; izinSon: string }, l: L) => izinGun(k).map((d) => dShort(d, l)).join(', ');
const AD = (ids: string[], l: L) => [...new Set(ids.map((id) => id.replace(/-\d$/, '').replace('-arefe', '')))].map((id) => (id === 'ramazan' ? (l === 'tr' ? 'Ramazan Bayramı' : 'Eid al-Fitr') : id === 'kurban' ? (l === 'tr' ? 'Kurban Bayramı' : 'Eid al-Adha') : K.TATIL_AD[id as keyof typeof K.TATIL_AD][l])).join(l === 'tr' ? ' ve ' : ' and ');

export default defineGuide({
  id: 'kopru-gunleri-2027', group: 'tatil', order: 54, tool: 'kp', toolArg: { yil: Y, izin: 10 },
  related: ['resmi-tatiller-2027', 'yillik-izin', 'bayram-tatili-kac-gun', 'kurban-bayrami-2027', 'ramazan-bayrami-2027', 'kopru-gunleri-2028'],
  sources: ['k2429', 'rt2027', 'dg2027', 'k4857'],
  tr: {
    slug: 'kopru-gunleri-2027', nav: 'Köprü günleri 2027', card: `10 gün izinle ${p10.bos} gün tatil: 2027 izin planı`,
    title: `Köprü günleri 2027: 10 gün izinle ${p10.bos} gün tatil planı`,
    description: `Köprü günleri 2027 ve izin planı: 10 gün yıllık izni 1 Ocak, Ramazan, Kurban ve 15 Temmuz çevresine koyarak ${p10.bos} gün tatil. İzin alınacak günler tek tek.`,
    h1: `2027 izin planı: 10 gün izin, ${p10.bos} gün tatil`,
    intro: 'Planlayıcı, girdiğiniz izin günü sayısıyla 2027 yılında en çok kaç gün art arda tatil yapabileceğinizi hesaplar ve hangi tarihlere izin koymanız gerektiğini listeler.',
    resume: `2027'de 10 gün yıllık izni doğru yerlere koyan biri, hafta sonları ve resmi tatillerle birlikte ${p10.bloklar.length} ayrı dönemde toplam ${p10.bos} gün tatil yapar; her izin günü ortalama ${d1(p10.bos / p10.izin, 'tr')} gün getirir. En iyi dağılım şöyle: ${ocak.izin} gün izinle ${aralik(ocak.bosBas, ocak.bosSon, 'tr')} (${ocak.bos} gün), ${mart.izin} gün izinle Ramazan Bayramı çevresinde ${aralik(mart.bosBas, mart.bosSon, 'tr')} (${mart.bos} gün), ${mayis.izin} gün izinle Kurban Bayramı çevresinde ${aralik(mayis.bosBas, mayis.bosSon, 'tr')} (${mayis.bos} gün) ve ${temmuz.izin} gün izinle ${aralik(temmuz.bosBas, temmuz.bosSon, 'tr')} (${temmuz.bos} gün). Yılın gerçek köprü günleri, yani tatille hafta sonu arasında tek başına kalan iş günleri ${tek.length} tanedir: ${tek.map((k) => dShort(k.izinBas, 'tr')).join(', ')}. Hesap Cumartesi-Pazar tatil yapan, arefe sabahı için tam gün izin kullanan bir çalışana göredir. Yalnız Pazar tatil yapanlarda aynı 10 gün ${p10s.bos} gün eder.`,
    faqs: [
      { q: '2027\'de köprü günleri hangileri?', a: `Tek günlük köprüler ${tek.map((k) => `${dShort(k.izinBas, 'tr')} (${aralik(k.bosBas, k.bosSon, 'tr')} arası ${k.bos} gün)`).join(', ')}. Bunlar resmi tatil değildir; izin almanız gerekir. Kamuda bu günlere idari izin verilip verilmeyeceği henüz açıklanmadı.` },
      { q: '2027\'de 10 gün izinle en çok kaç gün tatil yapılır?', a: `${p10.bos} gün. Cumartesi-Pazar tatil yapan biri için en iyi dağılım ${p10.bloklar.map((b) => `${b.izin} gün → ${b.bos} gün`).join('; ')} şeklindedir. Arefe sabahı için yarım gün izin yazılan işyerlerinde aynı bütçe ${p10y.bos} güne çıkar. Haftada altı gün çalışan biri için aynı 10 gün ${p10s.bos} gün tatil eder. Kendi izin hakkınızı planlayıcıya girerek sonucu görebilirsiniz.` },
      { q: '2027\'de 4 gün izinle 9 gün tatil nerede yapılır?', a: `Tatil Pazartesi ya da Cuma gününe düştüğünde haftanın kalan dört iş günü izinle doldurulur ve iki hafta sonu birleşir. 2027'de bu kalıba uyan ${dort.length} dönem var: ${dort.map((k) => `${aralik(k.izinBas, k.izinSon, 'tr')} izni ${aralik(k.bosBas, k.bosSon, 'tr')} (${k.bos} gün, ${AD(k.tatiller, 'tr')})`).join('; ')}.` },
    ],
    body: (h) => `<h2>10 günlük bütçe için kesin sonuç</h2>
<p>Planlayıcı tahmin yürütmez: yılı tatil ve iş günü bloklarına ayırır ve verilen izin bütçesiyle elde edilebilecek en uzun boş günler toplamını dinamik programlamayla bulur; eşitlikte daha az izin kullanan seçeneği tercih eder. 10 gün için çıkan plan aşağıda.</p>
${h.table(['İzin alınacak günler', 'İzin', 'Tatil dönemi', 'Gün', 'Neyin sayesinde'], p10.bloklar.map((b) => [gl(b, 'tr'), d1(b.izin, 'tr'), aralik(b.bosBas, b.bosSon, 'tr'), b.bos, AD(b.tatiller, 'tr')]), '2027 için 10 günlük en iyi izin planı (Cumartesi-Pazar tatil)', ['l', 'r', 'l', 'r', 'l'])}
<p>Dikkat çeken nokta, Ocak blokunun tek başına beş izin günü yemesidir: yılbaşı Cumaya düştüğü için ertesi haftanın tamamını izinle kapatmak ${ocak.bos} günlük bir kış tatili verir. Mart ve Mayıs bloklarında ise ikişer gün yeter; bayramın kendisi hafta ortasını doldurduğu için izin yalnızca kenarlara konur.</p>
<h2>Gerçek köprüler: tek gün, dört günlük tatil</h2>
<p>Bir iş günü resmi tatille hafta sonu arasında sıkıştığında ona köprü denir. 2027'de bunlardan ${tek.length} tane var. ${h.wday('2027-03-08')} Ramazan Bayramı arefesidir; sabahı çalışılır, öğleden sonra tatildir, bu yüzden izin yazılır. ${h.wday('2027-03-12')} bayramın bitişiyle hafta sonu arasındadır. ${h.wday('2027-07-16')} ise Perşembeye düşen Demokrasi ve Milli Birlik Gününün ertesidir. 2026'da dört tek günlük köprü vardı; 2027'de 23 Nisan, 29 Ekim ve yılbaşı zaten Cumaya düştüğü için köprüye gerek kalmaz, kendiliğinden uzun hafta sonu olur.</p>
<h2>Daha uzun bloklar: dört gün izin, dokuz gün tatil</h2>
<p>Tek günlük köprü dışında, tatilin bir yanındaki dört iş gününü kapatarak iki hafta sonunu birleştirmek mümkündür. 2027'de bu kalıba uyan dönemler ${dort.map((k) => `${AD(k.tatiller, 'tr')} (${aralik(k.bosBas, k.bosSon, 'tr')})`).join(', ')}. Bu bloklar 10 günlük planda yer almaz, çünkü izin başına getirileri daha düşüktür; ama bütçe büyüdükçe devreye girerler.</p>
${h.table(['İzin bütçesi', 'Toplam tatil', 'İzin başına gün', 'Dönem sayısı'], butceler.map(({ b, p }) => [b, p.bos, d1(p.izin ? p.bos / p.izin : 0, 'tr'), p.bloklar.length]), '2027: izin bütçesine göre en iyi sonuç', ['r', 'r', 'r', 'r'])}
<h2>Cumartesi çalışıyorsanız ya da arefe yarım gün yazılıyorsa</h2>
<p>Haftada altı gün çalışan biri için bloklar kısalır; aynı 10 günlük bütçe ${p10s.bos} gün eder ve Kurban Bayramında Cumartesi de izinle kapatılmalıdır. Öte yandan arefe sabahı için yarım gün izin yazan işyerlerinde Ramazan arefesi daha ucuza gelir ve toplam ${p10y.bos} güne çıkar. İzin hakkınızı ${h.a('yillik-izin', 'yıllık izin hesabıyla')} bulun; İş Kanununa göre izin, bir bölümü en az 10 gün olmak üzere bölünebilir, bu yüzden küçük parçalar için işverenle anlaşmak gerekir.</p>
${h.mini('yi', { p: ['statu', 'kidem'], d: { statu: 'isci', kidem: 3, yas: 35 }, c: 'Yıllık izin hakkınızı hesaplayın' })}
<p>Bayramlara özel hesap için ${h.a('bayram-tatili-kac-gun', 'bayram tatili kaç gün')} aracını, ayrıntılı tarihler için ${h.a('ramazan-bayrami-2027', 'Ramazan Bayramı 2027')}, ${h.a('kurban-bayrami-2027', 'Kurban Bayramı 2027')} ve ${h.a('resmi-tatiller-2027', 'resmi tatiller 2027')} sayfalarını kullanın. Bir sonraki yılın planı ${h.a('kopru-gunleri-2028', 'köprü günleri 2028')} sayfasında.</p>`,
  },
  en: {
    slug: 'bridge-days-turkey-2027', nav: 'Bridge days 2027', card: `${p10.bos} days off for 10 days of leave in 2027`,
    title: `Bridge days Turkey 2027: ${p10.bos} days off for 10 leave days`,
    description: `Bridge days in Turkey 2027 and the best leave plan: put 10 days of annual leave around New Year, both Eids and 15 July for ${p10.bos} days off. The exact days to book.`,
    h1: `Turkey 2027 leave plan: 10 leave days, ${p10.bos} days off`,
    intro: 'The planner takes the number of leave days you have and works out the most days off in a row you can get in 2027, listing the dates to book.',
    resume: `In 2027, someone who places 10 days of annual leave well gets ${p10.bos} days off in total, over ${p10.bloklar.length} separate breaks, once weekends and public holidays are added: on average each leave day is worth ${d1(p10.bos / p10.izin, 'en')} days. The best split is ${ocak.izin} days of leave for ${aralik(ocak.bosBas, ocak.bosSon, 'en')} (${ocak.bos} days), ${mart.izin} days around Eid al-Fitr for ${aralik(mart.bosBas, mart.bosSon, 'en')} (${mart.bos} days), ${mayis.izin} days around Eid al-Adha for ${aralik(mayis.bosBas, mayis.bosSon, 'en')} (${mayis.bos} days) and ${temmuz.izin} day for ${aralik(temmuz.bosBas, temmuz.bosSon, 'en')} (${temmuz.bos} days). The year has ${tek.length} true bridge days, single working days stuck between a holiday and a weekend: ${tek.map((k) => dShort(k.izinBas, 'en')).join(', ')}. The calculation assumes Saturdays and Sundays off, and a full leave day for the morning of a festival eve. With only Sunday off, the same 10 days give ${p10s.bos} days.`,
    faqs: [
      { q: 'What are the bridge days in Turkey in 2027?', a: `The one-day bridges are ${tek.map((k) => `${dShort(k.izinBas, 'en')} (${k.bos} days off, ${aralik(k.bosBas, k.bosSon, 'en')})`).join(', ')}. They are not public holidays, so you need to book leave. No administrative leave has been announced for them in the public sector.` },
      { q: 'How many days off can 10 days of leave give in Turkey in 2027?', a: `${p10.bos} days. With weekends off, the best split is ${p10.bloklar.map((b) => `${b.izin} leave → ${b.bos} off`).join('; ')}. Where the eve morning counts as half a leave day, the same budget gives ${p10y.bos}. On a six-day week the same 10 days give ${p10s.bos} days off. Enter your own entitlement in the planner to see your result.` },
      { q: 'Where can 4 leave days make 9 days off in 2027?', a: `When a holiday falls on a Monday or a Friday, four leave days fill the rest of that week and join two weekends. In 2027 that pattern appears ${dort.length} times: ${dort.map((k) => `leave ${aralik(k.izinBas, k.izinSon, 'en')} for ${aralik(k.bosBas, k.bosSon, 'en')} (${k.bos} days, ${AD(k.tatiller, 'en')})`).join('; ')}.` },
    ],
    body: (h) => `<h2>The exact answer for a 10-day budget</h2>
<p>The planner does not guess. It splits the year into blocks of days off and working days, then uses dynamic programming to find the largest total of days off your leave budget can reach, preferring the option that uses less leave on a tie. Here is the plan for 10 days.</p>
${h.table(['Book leave on', 'Leave', 'Break', 'Days', 'Thanks to'], p10.bloklar.map((b) => [gl(b, 'en'), d1(b.izin, 'en'), aralik(b.bosBas, b.bosSon, 'en'), b.bos, AD(b.tatiller, 'en')]), 'Best 10-day leave plan for 2027 (Saturday and Sunday off)', ['l', 'r', 'l', 'r', 'l'])}
<p>One thing stands out: the January block takes five leave days on its own. New Year's Day falls on a Friday, so covering the whole of the following week gives a ${ocak.bos}-day winter break. In March and May two days are enough, because the festival already fills the middle of the week and leave only goes on the edges.</p>
<h2>True bridges: one day, four days off</h2>
<p>A bridge is a working day trapped between a holiday and a weekend. 2027 has ${tek.length}. ${h.wday('2027-03-08')} is the Eid al-Fitr eve: the morning is worked and the afternoon is off, so it still costs a leave day. ${h.wday('2027-03-12')} sits between the end of the festival and the weekend. ${h.wday('2027-07-16')} follows Democracy Day on a Thursday. 2026 had four one-day bridges; in 2027, 23 April, 29 October and New Year's Day already fall on Fridays, so they make long weekends without any leave.</p>
<h2>Longer blocks: four leave days, nine days off</h2>
<p>Beyond single bridges, covering the four working days on one side of a holiday joins two weekends. In 2027 that pattern works for ${dort.map((k) => `${AD(k.tatiller, 'en')} (${aralik(k.bosBas, k.bosSon, 'en')})`).join(', ')}. These blocks are not in the 10-day plan because they return less per leave day, but they come in as the budget grows.</p>
${h.table(['Leave budget', 'Days off', 'Days per leave day', 'Breaks'], butceler.map(({ b, p }) => [b, p.bos, d1(p.izin ? p.bos / p.izin : 0, 'en'), p.bloklar.length]), '2027: best result by leave budget', ['r', 'r', 'r', 'r'])}
<h2>If you work Saturdays, or the eve counts as half a day</h2>
<p>On a six-day week the blocks shrink: the same 10 days give ${p10s.bos} days off, and the Saturday of Kurban Bayramı week must be covered by leave too. Where the employer books the eve morning as half a leave day, the Eid al-Fitr eve gets cheaper and the total rises to ${p10y.bos}. Check your entitlement with the ${h.a('yillik-izin', 'annual leave calculator')}; under the Labour Act leave may be split only by agreement, with one part of at least 10 days, so short pieces need your employer's consent.</p>
${h.mini('yi', { p: ['statu', 'kidem'], d: { statu: 'isci', kidem: 3, yas: 35 }, c: 'Work out your annual leave' })}
<p>For festival-only plans use the ${h.a('bayram-tatili-kac-gun', 'holiday length calculator')}; the dates are on ${h.a('ramazan-bayrami-2027', 'Ramazan Bayramı 2027')}, ${h.a('kurban-bayrami-2027', 'Kurban Bayramı 2027')} and ${h.a('resmi-tatiller-2027', 'public holidays 2027')}. Next year's plan is on ${h.a('kopru-gunleri-2028', 'bridge days 2028')}.</p>`,
  },
});
