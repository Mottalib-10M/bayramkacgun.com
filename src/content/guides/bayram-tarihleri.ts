/** Bayram tarihleri 2026–2035 : Diyanet listeleri (dini-gunler.json), kayma ve 2033'te iki Ramazan Bayramı. */
import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { aralik, gunAdi } from '../../lib/tool-specs';

const R = K.bayramlar('ramazan'), Kb = K.bayramlar('kurban');
const yillar = K.DINI_YILLAR;
const satir = (l: 'tr' | 'en') => yillar.map((y) => {
  const r = R.filter((x) => x.ilk.startsWith(String(y))), k = Kb.filter((x) => x.ilk.startsWith(String(y)));
  return [String(y), r.map((x) => `${aralik(x.ilk, x.son, l)} (${gunAdi(x.ilk, l)})`).join(' · ') || '–', k.map((x) => `${aralik(x.ilk, x.son, l)} (${gunAdi(x.ilk, l)})`).join(' · ') || '–'];
});
const kayma = Math.round((K.fromIso(R[0].ilk) - K.fromIso(R[R.length - 1].ilk) + 365 * (R.length - 1) + 2) / (R.length - 1));
const iki = R.filter((x) => x.ilk.startsWith('2033'));
const ilkPazartesi = Kb.find((x) => K.weekday(K.fromIso(x.ilk)) === 1);

export default defineGuide({
  id: 'bayram-tarihleri', group: 'bayram', order: 8, tool: 'by', toolArg: { tur: 'ramazan', yil: 2029 },
  related: ['ramazan-bayrami-2027', 'kurban-bayrami-2027', 'dini-gunler-2027', 'ramazan-bayrami-2028', 'kurban-bayrami-2028'],
  sources: ['dg2026', 'dg2027', 'dg2028', 'dg2029', 'hilal', 'hicri-fark'],
  tr: {
    slug: 'bayram-tarihleri', nav: 'Bayram tarihleri 2026–2035', card: 'On yılın Ramazan ve Kurban Bayramları, 2033\'te iki bayram',
    title: 'Bayram tarihleri 2026–2035: Ramazan ve Kurban listesi',
    description: 'Ramazan ve Kurban Bayramı tarihleri 2026–2035, Diyanet listelerinden: her yıl hangi gün başlıyor, neden 11 gün erken geliyor, 2033\'teki iki Ramazan Bayramı.',
    h1: 'Bayram tarihleri 2026–2035: on yıllık liste',
    intro: 'Bayramı ve yılı seçin: araç arefeyi, bayram günlerini ve başladığı günü gösterir; aşağıdaki tablo on yılın tamamını yan yana koyar.',
    resume: `Diyanet İşleri Başkanlığı dini günler listelerini 2035 yılına kadar yayımlamıştır; bu sayfadaki tarihlerin hepsi bu listelerden gelir. Ramazan Bayramı 2026'da 20 Mart'ta başlamıştı, 2027'de 9 Mart'ta, 2028'de 26 Şubat'ta başlar ve 2035'te 1 Aralık'a kadar geriler. Kurban Bayramı aynı dönemde 27 Mayıs'tan 18 Şubat'a iner. Sebep, hicri takvimin ay yılı olmasıdır: on iki ay yaklaşık 354 gün sürer ve güneş yılından ortalama ${kayma} gün kısadır, bu yüzden her bayram bir önceki yıla göre o kadar öne gelir. Bu kayma 2033 yılında ilginç bir sonuç verir: Ramazan Bayramı hem ${aralik(iki[0].ilk, iki[0].son, 'tr')} hem de ${aralik(iki[1].ilk, iki[1].son, 'tr')} tarihlerinde, yani aynı yıl içinde iki kez kutlanır. Diyanet ay başlarını hesapla belirlediği için bu tarihler kesindir; Türkiye'de bayram son gece ilan edilmez. Yaklaşık 33 yılda bir bayram, takvimin bütün mevsimlerini dolaşıp aynı tarihe döner.`,
    faqs: [
      { q: 'Bayramlar neden her yıl 11 gün erken geliyor?', a: 'Hicri takvim ayın hareketine göre işler; on iki kamerî ay yaklaşık 354 gün eder. Miladi takvim ise güneş yılına göre 365 ya da 366 gündür. Aradaki fark nedeniyle her bayram bir önceki yıldan yaklaşık 11 gün önce gelir ve yaklaşık 33 yılda takvimi bir tur dolaşır.' },
      { q: '2033 yılında iki Ramazan Bayramı mı var?', a: `Evet. Diyanet listesine göre 2033'te Ramazan Bayramı ${aralik(iki[0].ilk, iki[0].son, 'tr')} ve ${aralik(iki[1].ilk, iki[1].son, 'tr')} tarihlerindedir. Hicri yıl kısa olduğu için iki bayram aynı miladi yıla sığar. İki bayramın ilk günleri arasında ${K.daysBetween(iki[0].ilk, iki[1].ilk)} gün vardır; bu, tam bir hicri yılın uzunluğudur. Bu sayfadaki tabloda her yıl ayrı satırda gösterilir ve 2033 satırında iki tarih yan yana yazılır.` },
      { q: 'Türkiye ile Suudi Arabistan\'da bayram neden farklı günlere denk gelebilir?', a: `Diyanet, hilalin dünyanın herhangi bir yerinde görülebilir olmasını esas alır ve ay başlarını önceden hesaplar. Ölçüt, güneşle ay arasında en az 8 derece açı ve gün batımında ayın ufuktan en az 5 derece yüksekliğidir. Bazı ülkeler ise hilalin kendi ülkelerinden görülmesini bekler ya da farklı ölçütler kullanır. Bu yüzden tarihler bazen bir gün ayrışır; bu sitedeki tüm tarihler Diyanet listesine dayanır.` },
    ],
    body: (h) => `<h2>2026–2035 bayram takvimi</h2>
${h.table(['Yıl', 'Ramazan Bayramı', 'Kurban Bayramı'], satir('tr'), 'Bayramlar ve başladıkları gün (Diyanet İşleri Başkanlığı dini günler listeleri)')}
<h2>Kayma nasıl işliyor?</h2>
<p>Ramazan Bayramı hicri Şevval ayının birinci günü, Kurban Bayramı Zilhicce ayının onuncu günüdür. Kamerî ay, iki yeni ay arasındaki süre olan ortalama 29,5 gündür; bu yüzden ayların bir kısmı 29, bir kısmı 30 gün çeker. On iki ay toplandığında güneş yılına on bir gün kadar eksik kalır. Takvime bakınca bu, bayramların yavaş yavaş kıştan sonbahara, sonbahardan yaza doğru gezinmesi demektir.</p>
<p>Bu kayma tatil planını da etkiler. Hafta sonuna denk gelen bayram günü Türkiye'de kaydırılmadığı için hangi yıl uzun, hangi yıl kısa tatil olacağı tamamen takvime bağlıdır. Örneğin Kurban Bayramı ${ilkPazartesi ? `${ilkPazartesi.ilk.slice(0, 4)} yılında Pazartesi başlar ve önündeki hafta sonuyla birleşir` : 'bazı yıllarda hafta sonuyla birleşir'}. Her yıl için gün gün plan ${h.a('bayram-tatili-kac-gun', 'bayram tatili hesaplayıcısındadır')}.</p>
${h.mini('bt', { p: ['tur', 'yil'], d: { tur: 'kurban', yil: 2028, izin: 2 }, c: 'Bir yılın bayram tatilini hesaplayın' })}
<h2>Diyanet tarihleri nasıl belirliyor?</h2>
<p>Diyanet'in tanımına göre yeni ay, güneş battıktan sonra ufukta hilal olarak görülebildiğinde başlar. Görülebilirlik için iki eşik kullanılır: ay ile güneş arasındaki açının en az 8 derece, güneş battığı anda ayın ufuktan yüksekliğinin en az 5 derece olması. Bu koşulun dünyanın herhangi bir yerinde sağlanması yeterlidir. Hesap önceden yapılabildiği için listeler yıllar öncesinden yayımlanır. Tarihin bazen başka ülkelerden bir gün farklı olmasının nedeni, o ülkelerin hilali kendi topraklarından görmeyi beklemesi ya da başka ölçütler kullanmasıdır.</p>
<h2>Bayram dışındaki dini günler</h2>
<p>Kandiller, Hicri yılbaşı ve Aşure Günü de aynı kayma ile her yıl öne gelir. 2027'nin bütün dini günleri ${h.a('dini-gunler-2027', 'dini günler 2027')} sayfasında, Kadir Gecesi ise ${h.a('kadir-gecesi-2027', 'Kadir Gecesi 2027')} sayfasındadır.</p>`,
  },
  en: {
    slug: 'eid-dates-turkey-2026-2035', nav: 'Bayram dates 2026–2035', card: 'Ten years of Eid al-Fitr and Eid al-Adha, two Eids in 2033',
    title: 'Eid dates in Turkey 2026–2035: Ramazan and Kurban Bayramı',
    description: 'Eid al-Fitr and Eid al-Adha dates in Turkey from 2026 to 2035, from the Diyanet lists: the weekday each starts, why it moves 11 days a year, two Eids in 2033.',
    h1: 'Bayram dates 2026–2035: a ten-year list',
    intro: 'Choose the holiday and the year: the tool shows the eve, the holiday days and the weekday it starts; the table below sets all ten years side by side.',
    resume: `The Presidency of Religious Affairs (Diyanet) has published its religious-day lists up to 2035, and every date on this page comes from them. Ramazan Bayramı, Eid al-Fitr, began on 20 March in 2026; it starts on 9 March in 2027, on 26 February in 2028 and moves back to 1 December by 2035. Kurban Bayramı, Eid al-Adha, moves from 27 May to 18 February over the same period. The reason is that the Hijri calendar is lunar: twelve months last about 354 days, on average ${kayma} days fewer than a solar year, so each feast comes that much earlier than the year before. In 2033 this produces a curiosity: Eid al-Fitr falls on ${aralik(iki[0].ilk, iki[0].son, 'en')} and again on ${aralik(iki[1].ilk, iki[1].son, 'en')}, twice in the same year. Because the Diyanet sets month starts by calculation, these dates are final; Turkey does not announce the feast the night before. About every 33 years a feast travels through all the seasons and comes back to the same date.`,
    faqs: [
      { q: 'Why does Eid come about 11 days earlier every year?', a: 'The Hijri calendar follows the moon, and twelve lunar months add up to about 354 days. The Gregorian calendar follows the sun with 365 or 366 days. Because of the gap each feast arrives about 11 days earlier than the year before and goes round the whole calendar in roughly 33 years.' },
      { q: 'Are there two Eid al-Fitr holidays in 2033?', a: `Yes. On the Diyanet list, Eid al-Fitr 2033 falls on ${aralik(iki[0].ilk, iki[0].son, 'en')} and on ${aralik(iki[1].ilk, iki[1].son, 'en')}. The short Hijri year fits two feasts into one Gregorian year. The first days of the two feasts are ${K.daysBetween(iki[0].ilk, iki[1].ilk)} days apart, exactly one Hijri year. The table on this page gives each year its own row, and the 2033 row lists both dates side by side.` },
      { q: 'Why can Eid in Turkey differ from Saudi Arabia?', a: `The Diyanet uses crescent visibility anywhere on Earth and computes month starts in advance. Its criterion is at least 8 degrees between sun and moon, with the moon at least 5 degrees above the horizon at sunset. Some countries wait for the crescent to be seen from their own territory or use other criteria. The dates therefore sometimes differ by a day; every date on this site follows the Diyanet list.` },
    ],
    body: (h) => `<h2>The 2026–2035 bayram calendar</h2>
${h.table(['Year', 'Ramazan Bayramı (Eid al-Fitr)', 'Kurban Bayramı (Eid al-Adha)'], satir('en'), 'Holidays and the weekday they start (Diyanet religious-day lists)')}
<h2>How the drift works</h2>
<p>Eid al-Fitr is the first day of the Hijri month of Shawwal and Eid al-Adha the tenth of Dhu al-Hijjah. A lunar month, from one new moon to the next, lasts 29.5 days on average, so months have either 29 or 30 days. Twelve of them fall about eleven days short of a solar year. On the calendar the feasts slowly drift from winter towards autumn and from autumn towards summer.</p>
<p>The drift also changes the length of the break. Turkey does not move a holiday that lands on a weekend, so whether a year brings a long or a short break depends entirely on the calendar. Kurban Bayramı, for example, ${ilkPazartesi ? `starts on a Monday in ${ilkPazartesi.ilk.slice(0, 4)} and joins the weekend before it` : 'joins a weekend in some years'}. The ${h.a('bayram-tatili-kac-gun', 'holiday length calculator')} gives the day-by-day plan for any year.</p>
${h.mini('bt', { p: ['tur', 'yil'], d: { tur: 'kurban', yil: 2028, izin: 2 }, c: 'Work out the break for a given year' })}
<h2>How the Diyanet sets the dates</h2>
<p>In the Diyanet's definition a new month starts when the crescent can be seen on the horizon after sunset. Two thresholds are used: at least 8 degrees between moon and sun, and the moon at least 5 degrees above the horizon at sunset. It is enough for this to happen anywhere on Earth. As the calculation can be done in advance, the lists are published years ahead. The date sometimes differs by a day from other countries because they wait to see the crescent from their own territory or use other criteria.</p>
<h2>Other religious days</h2>
<p>The kandil nights, the Islamic New Year and the Day of Ashura drift in the same way. All the religious days of 2027 are on ${h.a('dini-gunler-2027', 'religious days 2027')}, and Laylat al-Qadr on ${h.a('kadir-gecesi-2027', 'Laylat al-Qadr 2027')}.</p>`,
  },
});
