/** İmsakiye 2027 : 81 il merkezi için hesaplanan vakitler ve Diyanet takvimiyle karşılaştırma (src/data/dogrulama.json). */
import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { dShort } from '../../lib/tool-specs';
import { formatDecimal } from '../../lib/format';

const r = K.ramazan(2027)!, D = K.DOGRULAMA;
const iller = [...K.IL].sort((a, b) => a.ad.localeCompare(b.ad, 'tr'));
const satirlar = iller.map((x) => { const o = K.ramazanOzet(x.slug, 2027); return { x, o }; });
const pct = (x: number, l: 'tr' | 'en') => (l === 'tr' ? `%${formatDecimal(x, 1, 'tr')}` : `${formatDecimal(x, 1, 'en')}%`);
const ornek = Object.entries(D.ornek).flatMap(([slug, gunler]) => Object.entries(gunler).map(([d, v]) => { const h = K.ilVakit(slug, d); return { slug, d, v, imsak: K.hhmm(h.imsak), aksam: K.hhmm(h.aksam) }; }));
const VK = ['imsak', 'gunes', 'ogle', 'ikindi', 'aksam', 'yatsi'] as const;
const ADI = { tr: { imsak: 'İmsak', gunes: 'Güneş', ogle: 'Öğle', ikindi: 'İkindi', aksam: 'Akşam (iftar)', yatsi: 'Yatsı' }, en: { imsak: 'Imsak', gunes: 'Sunrise', ogle: 'Dhuhr', ikindi: 'Asr', aksam: 'Maghrib (iftar)', yatsi: 'Isha' } };
const SEHIR = ['istanbul', 'ankara', 'izmir', 'bursa', 'antalya', 'konya', 'adana', 'gaziantep', 'diyarbakir', 'erzurum'];
const enIyi = Object.entries(D.ilBazinda).sort((a, b) => b[1] - a[1])[0], enKotu = Object.entries(D.ilBazinda).sort((a, b) => a[1] - b[1])[0];

export default defineGuide({
  id: 'imsakiye-2027', group: 'ramazan', order: 21, tool: 'im', toolArg: { il: 'istanbul', yil: 2027 },
  countdown: { date: r.ilk, label: { tr: 'Ramazan 2027 (ilk oruç)', en: 'Ramadan 2027 (first fast)' } },
  related: ['ramazan-2027', 'iftara-kac-dakika-kaldi', 'imsak-sahur-vakti', 'iftar-saati', 'imsakiye-istanbul', 'imsakiye-ankara'],
  sources: ['namazvakitleri', 'imsak', 'temkin', 'kiyas', 'dg2027'],
  tr: {
    slug: 'imsakiye-2027', nav: 'İmsakiye 2027 (81 il)', card: '81 il için gün gün imsak ve iftar, Diyanet takvimiyle karşılaştırmalı',
    title: 'İmsakiye 2027: 81 il için Ramazan imsak ve iftar saatleri',
    description: 'Ramazan 2027 imsakiyesi, 81 il: gün gün imsak, güneş, iftar ve yatsı saatleri, oruç süresi. Diyanet ölçüleriyle hesaplandı, resmi takvimle en çok 1 dakika fark.',
    h1: 'İmsakiye 2027: 81 il için imsak ve iftar saatleri',
    intro: 'İlinizi seçin: araç Ramazan 2027\'nin 29 gününü imsak, güneş, iftar, yatsı ve oruç süresiyle listeler. Kadir Gecesi tabloda işaretlidir.',
    resume: `Ramazan 2027 imsakiyesi ${dShort(r.ilk, 'tr')} ile ${dShort(r.son, 'tr')} arasındaki ${r.gun} günü kapsar. Bu sayfadaki saatler kopyalanmamış, hesaplanmıştır: Diyanet İşleri Başkanlığının açıkladığı ölçülerle, yani imsak için güneşin ufkun 18 derece altına inmesi, yatsı için 17 derece ve resmi temkin süreleriyle 81 il merkezinin koordinatlarından üretilir. Sonuçları Diyanet'in resmi takvimiyle ${D.iller} il ve ${D.gunler.adet} gün boyunca, toplam ${D.karsilastirma.toLocaleString('tr-TR')} vakit üzerinden karşılaştırdık: imsak vakitlerinin ${pct(D.tam.imsak, 'tr')}, iftar vakitlerinin ${pct(D.tam.aksam, 'tr')} oranında dakikası dakikasına aynıdır, kalanlarda fark yalnızca bir dakikadır ve hiçbir vakitte bir dakikayı aşmaz. Ramazan 2027 günlerinde imsak uyumu ${pct(D.ramazan2027.imsak, 'tr')} oranındadır. Fark, dakikaya yuvarlamadan ve koordinat seçiminden gelir. İbadet için resmi takvim esastır; bu imsakiye planlamak, karşılaştırmak ve yazdırmak içindir. İl merkezinin doğusundaki ve batısındaki ilçelerde vakit birkaç dakika farklıdır. Hesap sizin cihazınızda yapılır; seçtiğiniz il hiçbir yere gönderilmez.`,
    faqs: [
      { q: 'İmsakiye 2027 ne zaman başlıyor?', a: `İlk imsak ${dShort(r.ilk, 'tr')} sabahıdır; ilk sahur o gece, ilk teravih bir önceki akşam yapılır. İmsakiye ${r.gun} gün sürer ve son oruçla ${dShort(r.son, 'tr')} günü biter. Kadir Gecesi tabloda ayrıca işaretlidir. İlinizi seçtiğinizde her gün için imsak, güneş, iftar ve yatsı saatleri ile o günün oruç süresi birlikte görünür ve sayfa yazdırılabilir.` },
      { q: 'Bu imsakiyedeki saatler Diyanet ile aynı mı?', a: `Saatler Diyanet'in açıkladığı ölçülerle hesaplanır ve resmi takvimle ${D.karsilastirma.toLocaleString('tr-TR')} vakit üzerinden karşılaştırılmıştır: imsakta ${pct(D.tam.imsak, 'tr')}, iftarda ${pct(D.tam.aksam, 'tr')} oranında aynı dakika çıkar, kalan günlerde fark tam bir dakikadır. Bir dakika oruç için önemli olabileceğinden, ibadette Diyanet'in resmi takvimi esas alınmalıdır. Karşılaştırmanın ayrıntısı ve il il uyum oranları yöntem sayfasında yayımlanır.` },
      { q: 'İlçemin imsak vakti il merkeziyle aynı mı?', a: 'Hayır, birkaç dakika farklı olabilir. Doğuya gidildikçe vakitler erkene, batıya gidildikçe geç saate kayar; bir boylam derecesi yaklaşık dört dakikaya karşılık gelir. Kuzey ile güney arasındaki fark ise mevsime göre değişir. Bu sayfa 81 il merkezinin saatlerini verir; ilçenizin kesin vakti için Diyanet\'in resmi namaz vakitlerinde ilçenizi seçin.' },
    ],
    body: (h) => `<h2>81 il: ilk ve son gün imsak ile iftar</h2>
<p>Her ilin Ramazan 2027'deki ilk ve son günü. Gün gün tam liste için yukarıdaki araçtan ilinizi seçin.</p>
${h.table(['İl', '8 Şubat imsak', '8 Şubat iftar', '8 Mart imsak', '8 Mart iftar'], satirlar.map(({ x, o }) => [x.ad, o.ilk.imsak, o.ilk.aksam, o.son.imsak, o.son.aksam]), 'Ramazan 2027, 81 il merkezi: hesaplanan vakitler, Türkiye saati')}
<h2>Büyük şehirlerin imsakiye sayfaları</h2>
<p>On büyük il için ayrı sayfalarda ilin coğrafyasına özgü farkları ve oruç sürelerini anlatıyoruz: ${SEHIR.map((s) => h.a(`imsakiye-${s}`, K.il(s).ad)).join(', ')}.</p>
<h2>Resmi takvimle karşılaştırma</h2>
<p>Hesabın doğruluğunu ölçmek için Diyanet'in yayımladığı namaz vakitlerini 81 il için ${h.day(D.gunler.ilk)} ile ${h.day(D.gunler.son)} arasında okuduk ve kendi sonuçlarımızla vakit vakit karşılaştırdık. Diyanet saatlerini sitede yayımlamıyoruz; aşağıdaki küçük örnek yalnızca karşılaştırmayı görünür kılmak içindir.</p>
${h.table(['Vakit', 'Aynı dakika', 'Ramazan 2027 günlerinde'], VK.map((k) => [ADI.tr[k], pct(D.tam[k], 'tr'), pct(D.ramazan2027[k], 'tr')]), `${D.karsilastirma.toLocaleString('tr-TR')} karşılaştırma; en büyük fark ${D.enFazlaFark} dakika`)}
${h.table(['İl', 'Tarih', 'Diyanet imsak', 'Hesap imsak', 'Diyanet iftar', 'Hesap iftar'], ornek.map((o) => [K.il(o.slug).ad, h.day(o.d), o.v.imsak, o.imsak, o.v.aksam, o.aksam]), 'Örnek: Diyanet takvimi ile hesap (Ramazan 2027\'nin ilk ve son günü)')}
<p>İl bazında en yüksek uyum ${K.il(enIyi[0]).ad} ilinde (${pct(enIyi[1], 'tr')}), en düşük ${K.il(enKotu[0]).ad} ilindedir (${pct(enKotu[1], 'tr')}); ikisinde de fark bir dakikayı geçmez. Düşük oran, vaktin dakikanın tam ortasına denk geldiği günlerde yuvarlamanın öbür yöne düşmesinden kaynaklanır.</p>
${h.mini('rm', { p: ['yil'], d: { yil: 2028 }, c: 'Ramazan 2028 ve sonraki yıllar' })}
<h2>İmsakiye nasıl okunur?</h2>
<p>İmsak, sahurun bittiği ve orucun başladığı vakittir; Ramazanda sabah ezanı bu vakitte okunur. Güneş, sabah namazı vaktinin bittiği andır. Akşam, yani iftar, orucun açıldığı vakittir. Yatsı, teravihin kılındığı yatsı namazının başladığı vakittir. Tablodaki oruç süresi imsak ile iftar arasındaki zamandır. Kadir Gecesi satırı, gecenin başladığı akşamı gösterir. Bir sonraki Ramazanın imsakiyesi ${h.a('imsakiye-2028', 'imsakiye 2028')} sayfasındadır.</p>
<h2>Neden il il farklı?</h2>
<p>Türkiye doğudan batıya yaklaşık 19 boylam derecesi uzanır, ama ülkenin tamamı tek saat dilimini, UTC+3'ü kullanır. Güneş Iğdır'da İzmir'den bir saatten fazla önce batar; bu yüzden iftar doğuda erken, batıda geç gelir. Kuzey ile güney arasındaki fark ise mevsime göre değişir: kışın kuzeydeki illerde gün daha kısadır, yazın daha uzun. Şubat ve Mart aylarına düşen Ramazan 2027'de bu ikinci etki küçüktür, asıl fark doğu ile batı arasındadır.</p>`,
  },
  en: {
    slug: 'ramadan-timetable-turkey-2027', nav: 'Ramadan timetable 2027 (81 provinces)', card: 'Fasting start and iftar for 81 provinces, checked against the Diyanet',
    title: 'Ramadan timetable Turkey 2027: imsak and iftar, 81 provinces',
    description: 'Ramadan 2027 timetable for all 81 Turkish provinces: imsak, sunrise, iftar and isha day by day, fast length. Diyanet parameters, at most 1 minute off.',
    h1: 'Ramadan timetable 2027: imsak and iftar in 81 provinces',
    intro: 'Choose your province: the tool lists the 29 days of Ramadan 2027 with imsak, sunrise, iftar, isha and the length of the fast. Laylat al-Qadr is marked.',
    resume: `The Ramadan 2027 timetable, called imsakiye in Turkish, covers the ${r.gun} days from ${dShort(r.ilk, 'en')} to ${dShort(r.son, 'en')}. The times on this page are computed, not copied: they are derived from the coordinates of the 81 provincial centres with the parameters published by the Presidency of Religious Affairs (Diyanet), namely the sun 18 degrees below the horizon for imsak, 17 degrees for isha, and the official safety margins. We compared the results with the Diyanet's official calendar for ${D.iller} provinces over ${D.gunler.adet} days, ${D.karsilastirma.toLocaleString('en-GB')} prayer times in all: ${pct(D.tam.imsak, 'en')} of imsak times and ${pct(D.tam.aksam, 'en')} of iftar times are identical to the minute, the rest differ by exactly one minute, and none differs by more. On the days of Ramadan 2027 imsak agrees ${pct(D.ramazan2027.imsak, 'en')} of the time. The difference comes from rounding to the minute and the choice of coordinates. For worship the official calendar prevails; this timetable is for planning, comparing and printing. Districts east or west of the provincial centre differ by a few minutes.`,
    faqs: [
      { q: 'When does the 2027 Ramadan timetable start?', a: `The first imsak is on the morning of ${dShort(r.ilk, 'en')}; the first sahur is that night and the first tarawih the evening before. The timetable runs for ${r.gun} days and ends with the last fast on ${dShort(r.son, 'en')}. Laylat al-Qadr is marked in the table. Choose your province to see imsak, sunrise, iftar, isha and the length of each day's fast, ready to print.` },
      { q: 'Are these times the same as the Diyanet\'s?', a: `They are computed with the Diyanet's published parameters and checked against its official calendar over ${D.karsilastirma.toLocaleString('en-GB')} prayer times: ${pct(D.tam.imsak, 'en')} of imsak and ${pct(D.tam.aksam, 'en')} of iftar times are identical to the minute, and the rest differ by exactly one minute. Because a minute can matter for a fast, use the official calendar for worship.` },
      { q: 'Is the time in my district the same as in the provincial centre?', a: 'Not exactly; it can differ by a few minutes. Times move earlier towards the east and later towards the west, about four minutes per degree of longitude, and the north-south difference changes with the season. This page gives the 81 provincial centres; for the exact time in your district, select it in the Diyanet\'s official prayer times.' },
    ],
    body: (h) => `<h2>81 provinces: imsak and iftar on the first and last day</h2>
<p>Each province on the first and last day of Ramadan 2027. Choose your province in the tool above for the full day-by-day list.</p>
${h.table(['Province', '8 Feb imsak', '8 Feb iftar', '8 Mar imsak', '8 Mar iftar'], satirlar.map(({ x, o }) => [x.en, o.ilk.imsak, o.ilk.aksam, o.son.imsak, o.son.aksam]), 'Ramadan 2027, 81 provincial centres: computed times, Turkey time')}
<h2>Pages for the largest cities</h2>
<p>For ten large provinces, separate pages explain local differences and fast lengths: ${SEHIR.map((s) => h.a(`imsakiye-${s}`, K.il(s).en)).join(', ')}.</p>
<h2>Comparison with the official calendar</h2>
<p>To measure accuracy we read the Diyanet's published prayer times for all 81 provinces from ${h.day(D.gunler.ilk)} to ${h.day(D.gunler.son)} and compared them with our results one by one. We do not publish the Diyanet's times on this site; the small sample below only makes the comparison visible.</p>
${h.table(['Prayer time', 'Same minute', 'During Ramadan 2027'], VK.map((k) => [ADI.en[k], pct(D.tam[k], 'en'), pct(D.ramazan2027[k], 'en')]), `${D.karsilastirma.toLocaleString('en-GB')} comparisons; largest gap ${D.enFazlaFark} minute`)}
${h.table(['Province', 'Date', 'Diyanet imsak', 'Computed imsak', 'Diyanet iftar', 'Computed iftar'], ornek.map((o) => [K.il(o.slug).en, h.day(o.d), o.v.imsak, o.imsak, o.v.aksam, o.aksam]), 'Sample: Diyanet calendar and computation (first and last day of Ramadan 2027)')}
<p>By province, agreement is highest in ${K.il(enIyi[0]).en} (${pct(enIyi[1], 'en')}) and lowest in ${K.il(enKotu[0]).en} (${pct(enKotu[1], 'en')}); in both the gap never exceeds a minute. A lower rate means more days on which the exact time falls near the middle of a minute and rounding goes the other way.</p>
${h.mini('rm', { p: ['yil'], d: { yil: 2028 }, c: 'Ramadan 2028 and later years' })}
<h2>How to read the timetable</h2>
<p>Imsak is when sahur ends and the fast begins; during Ramadan the dawn call to prayer is made at that moment. Sunrise marks the end of the dawn prayer time. Maghrib, iftar, is when the fast is broken. Isha is the start of the night prayer, after which tarawih is held. The fast length is the time between imsak and iftar. The Laylat al-Qadr row shows the evening the night begins. Next year's timetable is on ${h.a('imsakiye-2028', 'Ramadan timetable 2028')}.</p>`,
  },
});
