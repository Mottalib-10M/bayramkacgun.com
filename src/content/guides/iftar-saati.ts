/** İftar saati : akşam vakti (güneş batışı + 7 dk temkin), il il ve ay ay ; engine/vakit.ts, engine/iller.ts. */
import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { dShort } from '../../lib/tool-specs';

const r = K.ramazan(2027)!;
const ORTA = K.addDays(r.ilk, 14);
const BUYUK = ['istanbul', 'ankara', 'izmir', 'bursa', 'antalya', 'konya', 'adana', 'gaziantep', 'diyarbakir', 'erzurum'];
const AYLAR = Array.from({ length: 12 }, (_, i) => `2027-${String(i + 1).padStart(2, '0')}-15`);
const ist = (d: string) => K.ilVakit('istanbul', d);
const yil = Array.from({ length: 365 }, (_, i) => K.addDays('2027-01-01', i)).map((d) => ({ d, v: ist(d) }));
const erken = [...yil].sort((a, b) => a.v.aksam - b.v.aksam)[0], gec = [...yil].sort((a, b) => b.v.aksam - a.v.aksam)[0];
const u = K.uclar(r.ilk), uO = K.uclar(ORTA);
const gunesBatis = (s: string, d: string) => K.ilVakit(s, d).aksam - 7;
const bugun = K.ilVakit('istanbul', K.OKUMA);

export default defineGuide({
  id: 'iftar-saati', group: 'ramazan', order: 22, tool: 'vakit',
  countdown: { date: r.ilk, label: { tr: 'Ramazan 2027 (ilk iftar)', en: 'Ramadan 2027 (first iftar)' } },
  related: ['iftara-kac-dakika-kaldi', 'imsak-sahur-vakti', 'imsakiye-2027', 'ramazan-2027', 'imsakiye-istanbul', 'imsakiye-izmir'],
  sources: ['temkin', 'kiyas', 'namazvakitleri', 'dg2027'],
  tr: {
    slug: 'iftar-saati', nav: 'İftar saati', card: 'Bugün ve Ramazan 2027 boyunca 81 ilde iftar vakti',
    title: 'İftar saati: bugün ve Ramazan 2027\'de 81 il için akşam vakti',
    description: 'İftar saati kaçta? İlinizi ve tarihi seçin: akşam vakti, yani iftar, Diyanet ölçüleriyle hesaplanır. Ramazan 2027 ilk gün İstanbul 18:36, Iğdır 17:37.',
    h1: 'İftar saati: ilinizde akşam ezanı kaçta?',
    intro: 'İl ve tarih seçin: araç o günün altı vaktini verir ve bugünse iftara kalan süreyi canlı sayar. Seçiminiz yalnızca adres satırında kalır.',
    resume: `İftar, akşam vaktinin girmesiyle, yani akşam ezanıyla açılır. Diyanet'in ölçüsüne göre akşam vakti, güneşin üst kenarının ufukta kaybolmasından 7 dakika sonradır; bu 7 dakika temkin denen güvenlik payıdır. Ramazan 2027'nin ilk günü, ${dShort(r.ilk, 'tr')}, İstanbul'da iftar ${K.hhmm(ist(r.ilk).aksam)}, son günü ${dShort(r.son, 'tr')} ise ${K.hhmm(ist(r.son).aksam)} olarak hesaplanır. Aynı gün en erken iftar ${u.ilkIftar.il.ad} ilinde ${K.hhmm(u.ilkIftar.v.aksam)}, en geç iftar ${u.sonIftar.il.ad} ilinde ${K.hhmm(u.sonIftar.v.aksam)}; aradaki ${u.sonIftar.v.aksam - u.ilkIftar.v.aksam} dakika, ülkenin doğu-batı genişliğinden gelir. Yıl içinde İstanbul'da akşam vakti en erken ${dShort(erken.d, 'tr')} günü ${K.hhmm(erken.v.aksam)}, en geç ${dShort(gec.d, 'tr')} günü ${K.hhmm(gec.v.aksam)} olur. Kış sonuna düşen 2027 Ramazanında iftar her gün bir dakikadan biraz fazla gecikir. Saatler 81 il merkezi için hesaplanır ve Diyanet takvimiyle karşılaştırıldığında en çok bir dakika farklıdır; ibadet için resmi takvim esastır.`,
    faqs: [
      { q: 'İftar saati nasıl belirlenir?', a: 'Güneşin üst kenarı ufukta kaybolduktan 7 dakika sonra akşam vakti girer ve oruç açılır. Bu 7 dakikalık temkini Diyanet uygular; amaç şehrin en yüksek ve en batıdaki noktalarında da güneşin kesin olarak batmış olmasıdır. Bu yüzden hava durumu uygulamasındaki gün batımı saati iftar saati değildir; o saate bakarak oruç açmak birkaç dakika erken açmak olur.' },
      { q: 'Ramazan 2027\'de İstanbul\'da iftar kaçta?', a: `İlk gün saat ${K.hhmm(ist(r.ilk).aksam)}, ayın ortasında saat ${K.hhmm(ist(ORTA).aksam)}, son gün saat ${K.hhmm(ist(r.son).aksam)}. Şubattan Marta günler uzadığı için iftar her gün yaklaşık bir dakika geç gelir. Avrupa yakası ile Anadolu yakası arasında küçük bir fark olabilir; gün gün liste İstanbul imsakiye sayfasında, canlı geri sayım ise iftara kaç dakika kaldı sayfasındadır.` },
      { q: 'Türkiye\'de iftarı en erken hangi il açıyor?', a: `En doğudaki iller. Ramazan 2027'nin ilk günü en erken iftar ${u.ilkIftar.il.ad} ilinde saat ${K.hhmm(u.ilkIftar.v.aksam)}, en geç iftar ${u.sonIftar.il.ad} ilinde saat ${K.hhmm(u.sonIftar.v.aksam)}. Türkiye doğudan batıya yaklaşık 19 boylam derecesi uzandığı hâlde tek saat dilimi kullandığı için aradaki fark bir saati aşar. Ay ilerledikçe sıralama aynı kalır, yalnızca saatler her gün biraz ileri kayar.` },
    ],
    body: (h) => `<h2>Ramazan 2027: on büyük ilde iftar</h2>
${h.table(['İl', h.day(r.ilk), h.day(ORTA), h.day(r.son)], BUYUK.map((s) => [K.il(s).ad, K.hhmm(K.ilVakit(s, r.ilk).aksam), K.hhmm(K.ilVakit(s, ORTA).aksam), K.hhmm(K.ilVakit(s, r.son).aksam)]), 'Akşam (iftar) vakti, hesaplanan, Türkiye saati')}
<p>Ayın ortasında da sıralama değişmez: ${h.day(ORTA)} günü en erken iftar ${uO.ilkIftar.il.ad} ilinde ${h.hhmm(uO.ilkIftar.v.aksam)}, en geç ${uO.sonIftar.il.ad} ilinde ${h.hhmm(uO.sonIftar.v.aksam)}. Diğer 71 il ve her gün için ${h.a('imsakiye-2027', 'imsakiye 2027')} sayfasına bakın.</p>
<h2>Güneş batışı ile iftar arasındaki 7 dakika</h2>
<p>Hava durumu uygulamalarının verdiği gün batımı ile iftar saati aynı değildir. Örneğin ${h.day(r.ilk)} günü İstanbul'da güneş ${h.hhmm(gunesBatis('istanbul', r.ilk))} sularında batar, akşam ezanı ${h.hhmm(ist(r.ilk).aksam)} vaktinde okunur. Diyanet, şehrin batıdaki ve yüksekteki kesimlerinde de güneşin kesin olarak batmış olması için akşama 7 dakika ekler. Bu yüzden gün batımına bakarak orucu açmak, iftarı birkaç dakika erkene almak demektir.</p>
<h2>İstanbul'da iftar saati ay ay</h2>
<p>Ramazan her yıl yaklaşık on bir gün öne geldiği için önümüzdeki yıllarda iftar saatleri de değişecek. Aşağıdaki tablo 2027'de her ayın 15'inde İstanbul, Ankara ve İzmir için akşam vaktini gösterir; Ramazanın düştüğü ayın satırına bakarak oruç gününün nasıl uzayıp kısalacağını görebilirsiniz. Bugün, ${h.day(K.OKUMA)}, İstanbul'da akşam vakti ${h.hhmm(bugun.aksam)}.</p>
${h.table(['Tarih', 'İstanbul', 'Ankara', 'İzmir'], AYLAR.map((d) => [h.day(d), K.hhmm(ist(d).aksam), K.hhmm(K.ilVakit('ankara', d).aksam), K.hhmm(K.ilVakit('izmir', d).aksam)]), 'Akşam vakti 2027, her ayın 15\'i, Türkiye saati (UTC+3)')}
${h.mini('im', { p: ['il'], d: { il: 'ankara', yil: 2027 }, c: 'İlinizin Ramazan 2027 iftar saatleri' })}
<h2>İlçede iftar il merkeziyle aynı mı?</h2>
<p>Değil. ${h.src('kiyas', 'Diyanet\'in vakit kıyaslamalarına')} göre bir boylam derecesi doğuya gidildikçe vakitler yaklaşık dört dakika erkene kayar. Geniş illerde doğudaki ilçe ile batıdaki ilçe arasında birkaç dakika fark olabilir. Enlem de etkiler: kışın kuzeydeki yerlerde güneş biraz daha erken batar. İlçenizin kesin saati için Diyanet'in resmi namaz vakitlerine bakın. Canlı geri sayım için ${h.a('iftara-kac-dakika-kaldi', 'iftara kaç dakika kaldı')} sayfası, sahur bitişi için ${h.a('imsak-sahur-vakti', 'imsak vakti')} sayfası hazır.</p>`,
  },
  en: {
    slug: 'iftar-time-turkey', nav: 'Iftar time', card: 'Iftar today and through Ramadan 2027 in all 81 provinces',
    title: 'Iftar time in Turkey today and in Ramadan 2027, 81 provinces',
    description: 'What time is iftar in Turkey? Pick a province and date: the maghrib time is computed with Diyanet rules. First day of Ramadan 2027: Istanbul 18:36, Iğdır 17:37.',
    h1: 'Iftar time in Turkey: when is maghrib in your province?',
    intro: 'Choose a province and a date: the tool gives the six prayer times and, for today, a live countdown to iftar. Your choice stays in the address bar only.',
    resume: `The fast is broken at iftar, when the maghrib time begins and the evening call to prayer is made. Under the Diyanet's rule, maghrib starts 7 minutes after the upper edge of the sun disappears below the horizon; those 7 minutes are a safety margin called temkin. On the first day of Ramadan 2027, ${dShort(r.ilk, 'en')}, iftar in Istanbul is computed at ${K.hhmm(ist(r.ilk).aksam)}, and on the last day, ${dShort(r.son, 'en')}, at ${K.hhmm(ist(r.son).aksam)}. That first day the earliest iftar is in ${u.ilkIftar.il.en} at ${K.hhmm(u.ilkIftar.v.aksam)} and the latest in ${u.sonIftar.il.en} at ${K.hhmm(u.sonIftar.v.aksam)}; the ${u.sonIftar.v.aksam - u.ilkIftar.v.aksam} minutes between them come from the country's east-west width under a single time zone. Over the year, maghrib in Istanbul is earliest on ${dShort(erken.d, 'en')} at ${K.hhmm(erken.v.aksam)} and latest on ${dShort(gec.d, 'en')} at ${K.hhmm(gec.v.aksam)}. During Ramadan 2027, at the end of winter, iftar moves a little over a minute later each day. Times are computed for the 81 provincial centres and differ from the official Diyanet calendar by one minute at most; for worship the official calendar prevails.`,
    faqs: [
      { q: 'How is the iftar time set in Turkey?', a: 'Maghrib, and so iftar, begins 7 minutes after the upper edge of the sun disappears below the horizon. The Diyanet adds those 7 minutes, called temkin, so that the sun has surely set even at the highest and westernmost points of a city. The sunset time in a weather app is therefore not the iftar time; breaking the fast by it means breaking it a few minutes early.' },
      { q: 'What time is iftar in Istanbul during Ramadan 2027?', a: `${K.hhmm(ist(r.ilk).aksam)} on the first day, ${K.hhmm(ist(ORTA).aksam)} in mid-month and ${K.hhmm(ist(r.son).aksam)} on the last day. As days lengthen from February to March, iftar comes about a minute later each day. The European and Asian sides can differ slightly; the full list is on the Istanbul timetable page and a live countdown on the iftar countdown page.` },
      { q: 'Which Turkish province breaks the fast first?', a: `The easternmost ones. On the first day of Ramadan 2027 the earliest iftar is in ${u.ilkIftar.il.en} at ${K.hhmm(u.ilkIftar.v.aksam)} and the latest in ${u.sonIftar.il.en} at ${K.hhmm(u.sonIftar.v.aksam)}. Turkey spans about 19 degrees of longitude but uses a single time zone, so the gap between east and west exceeds an hour.` },
    ],
    body: (h) => `<h2>Ramadan 2027: iftar in ten large provinces</h2>
${h.table(['Province', h.day(r.ilk), h.day(ORTA), h.day(r.son)], BUYUK.map((s) => [K.il(s).en, K.hhmm(K.ilVakit(s, r.ilk).aksam), K.hhmm(K.ilVakit(s, ORTA).aksam), K.hhmm(K.ilVakit(s, r.son).aksam)]), 'Maghrib (iftar) time, computed, Turkey time')}
<p>The order holds in mid-month too: on ${h.day(ORTA)} the earliest iftar is in ${uO.ilkIftar.il.en} at ${h.hhmm(uO.ilkIftar.v.aksam)}, the latest in ${uO.sonIftar.il.en} at ${h.hhmm(uO.sonIftar.v.aksam)}. For the other 71 provinces and every day, see ${h.a('imsakiye-2027', 'the 2027 Ramadan timetable')}.</p>
<h2>The 7 minutes between sunset and iftar</h2>
<p>The sunset time in a weather app is not the iftar time. On ${h.day(r.ilk)}, for instance, the sun sets in Istanbul around ${h.hhmm(gunesBatis('istanbul', r.ilk))}, while the evening call to prayer comes at ${h.hhmm(ist(r.ilk).aksam)}. The Diyanet adds 7 minutes to be sure the sun has set across the western and higher parts of the city as well. Breaking the fast at the weather-app sunset therefore means breaking it a few minutes early.</p>
<h2>Maghrib in Istanbul month by month</h2>
<p>Ramadan moves about eleven days earlier each year, so iftar times will shift in the coming years. The table shows the maghrib time on the 15th of each month of 2027 for Istanbul, Ankara and Izmir; the row for the month in which Ramadan falls shows how long the fasting day will be. Today, ${h.day(K.OKUMA)}, maghrib in Istanbul is at ${h.hhmm(bugun.aksam)}.</p>
${h.table(['Date', 'Istanbul', 'Ankara', 'Izmir'], AYLAR.map((d) => [h.day(d), K.hhmm(ist(d).aksam), K.hhmm(K.ilVakit('ankara', d).aksam), K.hhmm(K.ilVakit('izmir', d).aksam)]), 'Maghrib time 2027, 15th of each month, Turkey time (UTC+3)')}
${h.mini('im', { p: ['il'], d: { il: 'ankara', yil: 2027 }, c: 'Iftar times in your province, Ramadan 2027' })}
<h2>Is iftar in a district the same as in the provincial centre?</h2>
<p>No. According to ${h.src('kiyas', 'the Diyanet\'s comparison of prayer times')}, times move about four minutes earlier for each degree of longitude eastwards. In wide provinces an eastern and a western district can differ by several minutes. Latitude matters too: in winter the sun sets slightly earlier further north. For the exact time in your district, check the Diyanet's official prayer times. A live countdown is on ${h.a('iftara-kac-dakika-kaldi', 'how long until iftar')}, and the end of sahur on ${h.a('imsak-sahur-vakti', 'imsak time')}.</p>`,
  },
});
