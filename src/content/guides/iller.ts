/**
 * İl imsakiyeleri 2027 (10 il). Tüm vakitler engine/iller.ts ile hesaplanır (Diyanet ölçüleri),
 * Diyanet takvimiyle karşılaştırma özeti src/data/dogrulama.json'dan gelir. Her il ayrı bir plan ve anlatımla yazıldı.
 */
import { defineGuide, type GuideDef } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { dShort, dLong } from '../../lib/tool-specs';

const SOURCES = ['dg2027', 'namazvakitleri', 'imsak', 'temkin', 'kiyas'];
const CD = { date: '2027-02-08', label: { tr: 'Ramazan 2027 (ilk oruç)', en: 'Ramadan 2027 (first fast)' } };
const ab = Math.abs;
/** a ilinde iftarın b iline göre farkı (dakika, + daha geç). */
const fk = (a: string, b: string, iso = '2027-02-08') => K.iftarFarki(a, iso, b);
/** a ilinde imsakın b iline göre farkı (dakika, + daha geç). */
const fi = (a: string, b: string, iso = '2027-02-08') => K.ilVakit(a, iso).imsak - K.ilVakit(b, iso).imsak;
const su = (dk: number, l: 'tr' | 'en') => K.sure(dk, l);
/** « 8 Mart » / « 8 March » (yıl ve gün adı olmadan) */
const gm = (iso: string, l: 'tr' | 'en') => (l === 'tr' ? dShort(iso, 'tr').split(' ').slice(0, 2) : dShort(iso, 'en').split(' ').slice(1, 3)).join(' ');

function veri(s: string) {
  const o = K.ramazanOzet(s, 2027), o28 = K.ramazanOzet(s, 2028);
  const { r, rows } = K.imsakiye(s, 2027);
  const kad = rows.find((z) => z.kadir)!;
  const oran = K.DOGRULAMA.ilBazinda[s];
  const v1 = K.ilVakit(s, r.ilk), v2 = K.ilVakit(s, r.son);
  return {
    r, rows, o, o28, kad, ilk: o.ilk, son: o.son, x: K.il(s), oran,
    trO: `%${String(oran).replace('.', ',')}`, enO: `${oran}%`,
    /** İstanbul'a göre ilk ve son gün iftar farkı, ilk gün imsak farkı */
    ff: K.iftarFarki(s, r.ilk), fl: K.iftarFarki(s, r.son), imf: fi(s, 'istanbul'),
    /** ay boyunca iftarın ileri, imsakın geri kayması ve orucun uzaması (dakika) */
    ileri: v2.aksam - v1.aksam, geri: v1.imsak - v2.imsak, uzama: o.son.oruc - o.ilk.oruc,
    arife: K.addDays(r.ilk, -1),
    ornek: K.DOGRULAMA.ornek[s],
  };
}
const yuzde = (oran: number) => oran / 100;

/* ------------------------------------------------------------------ İstanbul */
const istanbul = (() => {
  const d = veri('istanbul'), { r, ilk, son, kad, o28, x } = d;
  const koc = fk('kocaeli', 'istanbul'), sak = fk('sakarya', 'istanbul'), tek = fk('tekirdag', 'istanbul'), edi = fk('edirne', 'istanbul');
  const hafta = d.rows.filter((_, i) => i % 7 === 0);
  return defineGuide({
    id: 'imsakiye-istanbul', group: 'iller', order: 30, tool: 'im', toolArg: { il: 'istanbul', yil: 2027 }, countdown: CD,
    related: ['imsakiye-2027', 'iftara-kac-dakika-kaldi', 'ramazan-2027', 'imsak-sahur-vakti', 'imsakiye-bursa', 'kadir-gecesi-2027'],
    sources: SOURCES,
    tr: {
      slug: 'istanbul-imsakiye-2027', nav: 'İstanbul imsakiye', card: `İlk gün imsak ${ilk.imsak}, iftar ${ilk.aksam}; 29 günün tamamı`,
      title: 'İstanbul imsakiye 2027: iftar ve sahur saatleri, gün gün',
      description: `İstanbul imsakiye 2027: ilk oruç ${dShort(r.ilk, 'tr')}, imsak ${ilk.imsak}, iftar ${ilk.aksam}. Son oruç ${gm(r.son, 'tr')}, Kadir Gecesi ${gm(r.kadir, 'tr')} akşamı, bayram ${gm(r.bayram, 'tr')}. ${r.gun} günün tam listesi.`,
      h1: `İstanbul imsakiye 2027: ilk iftar ${ilk.aksam}, son iftar ${son.aksam}`,
      intro: `Araç, İstanbul il merkezi için 2027 Ramazanının ${r.gun} gününü tek tabloda verir: imsak, güneş, iftar, yatsı ve oruç süresi. İl ya da yıl değiştirerek başka bir takvime geçebilirsiniz.`,
      resume: `İstanbul'da 2027 Ramazanının ilk orucu ${dShort(r.ilk, 'tr')} günü tutulur. O sabah imsak ${ilk.imsak}, akşam iftar ${ilk.aksam} olarak hesaplanır; oruç ${su(ilk.oruc, 'tr')} sürer. İlk teravih ve ilk sahur bir önceki gece, ${dShort(d.arife, 'tr')} akşamından sonradır. Son oruç ${dShort(r.son, 'tr')} günüdür: imsak ${son.imsak}, iftar ${son.aksam}, oruç ${su(son.oruc, 'tr')}. Kadir Gecesi ${dShort(r.kadir, 'tr')} akşamıdır ve o gün İstanbul'da iftar ${kad.aksam} olur. Ramazan Bayramı ${dShort(r.bayram, 'tr')} günü başlar. Vakitleri bu site Diyanet'in kullandığı ölçülerle kendisi hesaplar ve sonucu Diyanet takviminin İstanbul sayfasıyla gün gün karşılaştırır: uyum oranı ${d.trO}, en büyük sapma 1 dakikadır. Oruca başlarken ve açarken yine de Diyanet'in yayımladığı resmi takvim esas alınmalıdır. Ay boyunca iftar ${d.ileri} dakika ileri kayar, imsak ${d.geri} dakika öne gelir.`,
      faqs: [
        { q: 'İstanbul\'da 2027 Ramazanının ilk iftarı saat kaçta?', a: `${dShort(r.ilk, 'tr')} günü İstanbul'da iftar saat ${ilk.aksam}, o sabahki imsak saat ${ilk.imsak} olarak hesaplanır; ilk oruç böylece ${su(ilk.oruc, 'tr')} sürer. İlk sahur bir önceki gece, ${dShort(d.arife, 'tr')} akşamından sonra yapılır. Saatler il merkezi içindir ve Diyanet'in İstanbul takvimiyle karşılaştırıldığında fark hiçbir gün ${K.DOGRULAMA.enFazlaFark} dakikayı geçmez. Akşama kalan süreyi görmek için sayfadaki aracı açık tutabilirsiniz.` },
        { q: 'İstanbul\'da 2027\'nin en uzun orucu hangi gün?', a: `Bayram arefesine denk gelen son gün, ${dShort(d.o.enUzun.date, 'tr')}: imsak saat ${son.imsak}, iftar saat ${son.aksam}, toplam ${su(d.o.enUzun.oruc, 'tr')}. En kısası ilk gün, ${su(d.o.enKisa.oruc, 'tr')}; ay ortalaması ${su(d.o.ortalama, 'tr')}. Aradaki ${d.o.enUzun.oruc - d.o.enKisa.oruc} dakikalık uzama, şafağın öne ve gün batımının ileri kaymasından gelir. 2429 sayılı Kanun gereği o arefe gününün öğleden sonrası, saat 13.00'ten itibaren resmi tatildir.` },
        { q: 'İstanbul\'da Anadolu yakasında iftar daha erken mi?', a: `Evet, biraz. Hesap Avrupa yakasındaki il merkezine göre yapılır ve boylamdaki 1 derecelik fark gün batımını yaklaşık 4 dakika kaydırır; bu yüzden Şile tarafındaki ilçelerde akşam merkezden önce girer. İlk oruç günü komşu Kocaeli merkezi ${ab(koc)}, Sakarya ${ab(sak)} dakika erken iftar eder; batıdaki Tekirdağ ise ${ab(tek)} dakika geriden gelir. İlçenizin kesin saati için Diyanet'in ilçe takvimine bakın.` },
      ],
      body: (h) => `<h2>Haftadan haftaya İstanbul'da imsak ve iftar</h2>
<p>Ramazan 2027 kışın sonuna, baharın başına denk gelir; günler her sabah ve her akşam birkaç dakika uzar. Aşağıdaki beş satır ayın ritmini özetler. Tam liste yukarıdaki araçtadır.</p>
${h.table(['Tarih', 'İmsak', 'İftar', 'Oruç süresi'], hafta.map((z) => [h.wday(z.date), z.imsak, z.aksam, h.sure(z.oruc, 'tr')]), 'İstanbul, Ramazan 2027: her yedi günde bir hesaplanan vakitler')}
<p>İlk hafta ile son hafta arasında sahur ${d.geri} dakika erkene çekilir, iftar ise ${d.ileri} dakika gecikir. Toplamda oruç ${d.uzama} dakika uzar. İş çıkışı iftara yetişmeye çalışanlar için Şubat'ın ilk günleri en sıkışık zamandır; Mart'ta akşam yemeği saatine daha rahat varılır. Anlık geri sayım için ${h.a('iftara-kac-dakika-kaldi', 'iftara kaç dakika kaldı')} sayfasını açık tutabilirsiniz.</p>
<h2>Avrupa yakası, Anadolu yakası ve komşu iller</h2>
<p>Hesap tek bir noktaya göre yapılır: Avrupa yakasındaki il merkezi (enlem ${h.n(x.lat, 2)}, boylam ${h.n(x.lng, 2)}). Güneş doğudan batıya ilerlediği için boylamdaki her derece yaklaşık 4 dakikalık fark yaratır. İl doğu–batı yönünde geniş olduğundan Şile tarafındaki ilçelerde akşam merkezden önce, Silivri ve Çatalca tarafında sonra girer. Diyanet bu nedenle ilçe ilçe ayrı takvim yayımlar.</p>
<p>Aynı mantık il sınırının dışında da geçerlidir. İlk oruç günü Kocaeli'de iftar ${ab(koc)}, Sakarya'da ${ab(sak)} dakika önce açılır; batıda Tekirdağ ${ab(tek)}, Edirne ${ab(edi)} dakika geriden gelir. Marmara'nın güney kıyısındaki ${h.a('imsakiye-bursa', 'Bursa imsakiyesi')} ise İstanbul'la neredeyse aynıdır.</p>
<h2>Hesap ile resmi takvim yan yana</h2>
<p>Bu sayfadaki saatler bir hesaplama sonucudur: imsak, güneşin ufkun 18 derece altına geldiği an (${h.src('imsak', 'fecr-i sâdık')}), iftar ise gün batımına 7 dakikalık ${h.src('temkin', 'temkin')} eklenerek bulunur. Sonuç, Diyanet'in yayımladığı İstanbul takvimiyle 403 gün boyunca karşılaştırıldı; uyum ${h.pct(yuzde(d.oran))}, fark hiçbir gün 1 dakikayı aşmadı. İki örnek gün:</p>
${h.table(['Tarih', 'İmsak (hesap)', 'İmsak (Diyanet)', 'İftar (hesap)', 'İftar (Diyanet)'], [r.ilk, r.son].map((t) => { const v = K.ilVakit('istanbul', t); return [h.day(t), h.hhmm(v.imsak), d.ornek[t].imsak, h.hhmm(v.aksam), d.ornek[t].aksam]; }), 'İstanbul: hesaplanan vakit ve Diyanet takvimi')}
<p>Oruç bir ibadettir ve dakikası önemlidir; bu yüzden tereddüt ettiğiniz her an ${h.src('namazvakitleri', 'Diyanet namaz vakitleri')} sayfasındaki resmi takvime uyun. Sahurun ne zaman bittiğini ${h.a('imsak-sahur-vakti', 'imsak ve sahur vakti')} sayfası ayrıntılı anlatır.</p>
<h2>Kadir Gecesi, arefe ve bayram</h2>
<p>Kadir Gecesi ${h.wday(r.kadir)} akşamıdır; o gün İstanbul'da iftar ${kad.aksam}, gece teravihten sonra ihya edilir (${h.a('kadir-gecesi-2027', 'Kadir Gecesi 2027')}). ${h.wday(r.son)} hem son oruç hem bayram arefesidir: iftar ${son.aksam}. Bayramın ilk günü ${h.wday(r.bayram)}; tatil süresi ${h.a('ramazan-bayrami-2027', 'Ramazan Bayramı 2027')} sayfasındadır.</p>
<h2>Bir yıl sonra: İstanbul'da 2028 Ramazanı</h2>
<p>Hicri takvim her yıl yaklaşık 11 gün geri geldiği için 2028'de oruç ocak ayında başlar. ${h.wday(o28.r.ilk)} günü İstanbul'da imsak ${o28.ilk.imsak}, iftar ${o28.ilk.aksam}; oruç ${h.sure(o28.ilk.oruc, 'tr')} ile 2027'nin ilk gününden kısadır. Son oruç ${h.wday(o28.r.son)}, iftar ${o28.son.aksam}. Tüm Türkiye için ${h.a('imsakiye-2027', 'imsakiye 2027')} ve ${h.a('ramazan-2027', 'Ramazan 2027')} sayfalarına bakabilirsiniz.</p>
${h.mini('im', { p: ['il'], d: { il: 'bursa', yil: 2027 }, c: 'Bursa ile İstanbul\'u karşılaştırın' })}`,
    },
    en: {
      slug: 'istanbul-ramadan-times-2027', nav: 'Istanbul Ramadan times', card: `First day: imsak ${ilk.imsak}, iftar ${ilk.aksam}; all 29 days`,
      title: 'Istanbul Ramadan times 2027: imsakiye, iftar and suhoor',
      description: `Istanbul Ramadan 2027 timetable: first fast on Monday 8 February, imsak ${ilk.imsak}, iftar ${ilk.aksam}. Last fast ${gm(r.son, 'en')}, Qadr night ${gm(r.kadir, 'en')}, Eid ${gm(r.bayram, 'en')}. Full list.`,
      h1: `Istanbul Ramadan 2027: first iftar ${ilk.aksam}, last iftar ${son.aksam}`,
      intro: `The tool lists all ${r.gun} days of Ramadan 2027 for central Istanbul: imsak (end of suhoor), sunrise, iftar, isha and the length of the fast. Change the province or the year to see another timetable.`,
      resume: `In Istanbul the first fast of Ramadan 2027 falls on ${dLong(r.ilk, 'en')}, a Monday. That morning the fast begins at ${ilk.imsak} (imsak) and ends at ${ilk.aksam} (iftar), so it lasts ${su(ilk.oruc, 'en')}. The first suhoor and the first tarawih prayer come the night before, on Sunday 7 February. The last fast is ${dShort(r.son, 'en')}: imsak ${son.imsak}, iftar ${son.aksam}, ${su(son.oruc, 'en')} without food or drink. Laylat al-Qadr is the evening of ${dShort(r.kadir, 'en')}, when iftar is at ${kad.aksam}, and Eid al-Fitr (Ramazan Bayramı) starts on ${dShort(r.bayram, 'en')}. We compute every time ourselves with the parameters the Diyanet uses, then check them against the official Diyanet calendar for Istanbul: ${d.enO} of the values match to the minute and none is more than 1 minute out. For the fast itself, follow the official calendar. Across the month iftar moves ${d.ileri} minutes later and imsak ${d.geri} minutes earlier.`,
      faqs: [
        { q: 'What time is the first iftar in Istanbul in 2027?', a: `On ${dShort(r.ilk, 'en')} iftar in Istanbul is at ${ilk.aksam} and imsak that morning at ${ilk.imsak}, so the first fast lasts ${su(ilk.oruc, 'en')}. The first suhoor is eaten the night before, after the evening of ${dShort(d.arife, 'en')}. The times are computed for the city centre and never differ by more than ${K.DOGRULAMA.enFazlaFark} minute from the Diyanet's Istanbul calendar. Keep the tool on this page open to see how long remains until evening.` },
        { q: 'Which is the longest fast in Istanbul in Ramadan 2027?', a: `The last one, on ${dShort(d.o.enUzun.date, 'en')}, which is also the eve of Eid: imsak at ${son.imsak}, iftar at ${son.aksam}, ${su(d.o.enUzun.oruc, 'en')} in total. The shortest is the first day at ${su(d.o.enKisa.oruc, 'en')}, and the monthly average is ${su(d.o.ortalama, 'en')}. The ${d.o.enUzun.oruc - d.o.enKisa.oruc}-minute gain comes from dawn moving earlier and sunset later. Under Law 2429 the afternoon of that eve, from 13:00, is an official holiday.` },
        { q: 'Is iftar earlier on the Asian side of Istanbul?', a: `Slightly, yes. The computation uses the city centre on the European side, and each degree of longitude shifts sunset by about 4 minutes, so districts towards Şile break the fast a little earlier. On the first fast the centre of neighbouring Kocaeli has iftar ${ab(koc)} minutes earlier and Sakarya ${ab(sak)} minutes earlier, while Tekirdağ to the west is ${ab(tek)} minutes behind. Check the Diyanet district calendar for your exact time.` },
      ],
      body: (h) => `<h2>Week by week</h2>
<p>Ramadan 2027 runs from late winter into early spring, so each day gains a few minutes of light at both ends. Five dates sum up the month; the full list sits in the tool above.</p>
${h.table(['Date', 'Imsak', 'Iftar', 'Length of fast'], hafta.map((z) => [h.wday(z.date), z.imsak, z.aksam, h.sure(z.oruc, 'en')]), 'Istanbul, Ramadan 2027: computed times every seventh day')}
<p>From the first week to the last, suhoor ends ${d.geri} minutes earlier and iftar arrives ${d.ileri} minutes later, a fast ${d.uzama} minutes longer overall. Early February is the tightest for commuters trying to be home for iftar. The ${h.a('iftara-kac-dakika-kaldi', 'iftar countdown')} shows the minutes left in real time.</p>
<h2>European side, Asian side, neighbouring provinces</h2>
<p>The calculation uses one point: the provincial centre on the European side (latitude ${h.n(x.lat, 2)}, longitude ${h.n(x.lng, 2)}). Because the sun travels east to west, every degree of longitude is worth about 4 minutes. Istanbul is wide, so districts out towards Şile see sunset before the centre, while Silivri and Çatalca see it later. That is why the Diyanet publishes a separate calendar for each district.</p>
<p>The same rule applies beyond the city. On the first fast, iftar comes ${ab(koc)} minutes earlier in Kocaeli and ${ab(sak)} in Sakarya, but ${ab(tek)} minutes later in Tekirdağ and ${ab(edi)} in Edirne. Across the Sea of Marmara, the ${h.a('imsakiye-bursa', 'Bursa timetable')} is almost identical to Istanbul's.</p>
<h2>Our figures against the official calendar</h2>
<p>Imsak is the moment the sun is 18 degrees below the horizon (${h.src('imsak', 'true dawn')}); iftar is sunset plus a 7-minute ${h.src('temkin', 'safety margin')}. We compared the results with the Diyanet calendar for Istanbul over 403 days: ${h.pct(yuzde(d.oran))} match exactly and the largest gap is 1 minute. Two sample days:</p>
${h.table(['Date', 'Imsak (computed)', 'Imsak (Diyanet)', 'Iftar (computed)', 'Iftar (Diyanet)'], [r.ilk, r.son].map((t) => { const v = K.ilVakit('istanbul', t); return [h.day(t), h.hhmm(v.imsak), d.ornek[t].imsak, h.hhmm(v.aksam), d.ornek[t].aksam]; }), 'Istanbul: computed time and Diyanet calendar')}
<p>When in doubt, the official ${h.src('namazvakitleri', 'Diyanet prayer times')} take precedence for worship. The ${h.a('imsak-sahur-vakti', 'imsak and suhoor page')} explains exactly when the pre-dawn meal must end.</p>
<h2>Qadr night, the eve and Eid</h2>
<p>Laylat al-Qadr is the evening of ${h.wday(r.kadir)}; Istanbul breaks the fast at ${kad.aksam} and the night of prayer follows tarawih (${h.a('kadir-gecesi-2027', 'Laylat al-Qadr 2027')}). ${h.wday(r.son)} is both the last fast and the eve of Eid, with iftar at ${son.aksam}. The first day of Eid is ${h.wday(r.bayram)}; the days off are on ${h.a('ramazan-bayrami-2027', 'Eid al-Fitr 2027')}.</p>
<h2>A year later: Ramadan 2028 in Istanbul</h2>
<p>The Hijri year is about 11 days shorter, so in 2028 the fast starts in January. On ${h.wday(o28.r.ilk)} Istanbul has imsak at ${o28.ilk.imsak} and iftar at ${o28.ilk.aksam}, a fast of ${h.sure(o28.ilk.oruc, 'en')}. The last fast is ${h.wday(o28.r.son)}, iftar ${o28.son.aksam}. For the whole country see ${h.a('imsakiye-2027', 'Ramadan timetable 2027')} and ${h.a('ramazan-2027', 'Ramadan 2027')}.</p>
${h.mini('im', { p: ['il'], d: { il: 'bursa', yil: 2027 }, c: 'Compare Bursa with Istanbul' })}`,
    },
  });
})();

/* ------------------------------------------------------------------ Ankara */
const ankara = (() => {
  const d = veri('ankara'), { r, ilk, son, kad, o28, x } = d;
  const esk = fk('eskisehir', 'ankara'), kir = fk('kirikkale', 'ankara'), can = fk('cankiri', 'ankara'), kay = fk('kayseri', 'ankara'), kon = fk('konya', 'ankara');
  const gunler = [r.ilk, r.kadir, r.son];
  const sat = (s: string, t: string) => K.hhmm(K.ilVakit(s, t).aksam);
  return defineGuide({
    id: 'imsakiye-ankara', group: 'iller', order: 31, tool: 'im', toolArg: { il: 'ankara', yil: 2027 }, countdown: CD,
    related: ['imsakiye-2027', 'iftara-kac-dakika-kaldi', 'ramazan-2027', 'kadir-gecesi-2027', 'imsakiye-konya', 'imsakiye-istanbul'],
    sources: SOURCES,
    tr: {
      slug: 'ankara-imsakiye-2027', nav: 'Ankara imsakiye', card: `İftar İstanbul'dan ${ab(d.ff)} dakika önce: ilk gün ${ilk.aksam}`,
      title: 'Ankara imsakiye 2027: iftar saati ve sahur vakti, 29 gün',
      description: `Ankara imsakiye 2027: Ramazan 8 Şubat Pazartesi başlar, ilk imsak ${ilk.imsak}, ilk iftar ${ilk.aksam}. Son oruç ${gm(r.son, 'tr')}, Kadir Gecesi ${gm(r.kadir, 'tr')}, bayram ${dShort(r.bayram, 'tr')}. Tüm liste.`,
      h1: `Ankara imsakiye 2027: sahur ${ilk.imsak}, iftar ${ilk.aksam} ile başlıyor`,
      intro: 'Başkent için hesaplanmış 2027 Ramazan takviminin tamamı araçta: her gün imsak, güneş, akşam ve yatsı vakitleri ile orucun kaç saat sürdüğü.',
      resume: `Ankara'da Ramazan 2027 ${dShort(r.ilk, 'tr')} sabahı başlar. İlk sahur ${ilk.imsak} itibarıyla biter, ilk iftar ${ilk.aksam} vaktindedir ve ilk oruç ${su(ilk.oruc, 'tr')} sürer. Başkentte akşam İstanbul'dan ${ab(d.ff)} dakika önce girer; ay sonunda bu fark ${ab(d.fl)} dakikaya çıkar. Ayın son orucu ${dShort(r.son, 'tr')} günü tutulur: imsak ${son.imsak}, iftar ${son.aksam}, süre ${su(son.oruc, 'tr')}. Kadir Gecesi ${dShort(r.kadir, 'tr')} akşamına denk gelir, o günkü iftar ${kad.aksam}. Bayram namazı sabahı ${dShort(r.bayram, 'tr')} günüdür. Bu takvim hazır bir listeden kopyalanmadı: Diyanet'in açı ve temkin ölçüleriyle hesaplandı, sonra Diyanet'in Ankara takvimiyle karşılaştırıldı. Ankara için uyum ${d.trO} ile on büyük il arasında en yüksek orandır; kalan farklar 1 dakikadır. İbadet söz konusu olduğunda Diyanet'in resmi takvimine uyulmalıdır. Ay boyunca başkentte oruç ${d.uzama} dakika uzar; ortalama oruç ${su(d.o.ortalama, 'tr')} kadardır.`,
      faqs: [
        { q: 'Ankara\'da 2027\'de ilk sahur ne zaman bitiyor?', a: `${dShort(r.ilk, 'tr')} sabahı Ankara'da imsak saat ${ilk.imsak} olarak hesaplanır; sahur yemeği bu saatten önce bitirilmelidir. İlk sahur, ${dShort(d.arife, 'tr')} akşamını sabaha bağlayan gecededir. Aynı akşam iftar saat ${ilk.aksam}, oruç ${su(ilk.oruc, 'tr')} sürer. Ay boyunca imsak ${d.geri} dakika öne gelir ve son gün saat ${son.imsak} olur. Hesaplanan vakitlerin Diyanet'in Ankara takvimiyle aynı dakikaya düşme oranı ${d.trO}.` },
        { q: 'Ankara ile İstanbul arasında iftar farkı kaç dakika?', a: `İlk oruç günü Ankara'da iftar İstanbul'dan ${ab(d.ff)} dakika önce, son gün ${ab(d.fl)} dakika önce açılır. Sahurda fark biraz daha büyüktür: ilk gün imsak ${ab(d.imf)} dakika erkendir. Nedeni boylamdır: Ankara, İstanbul'un yaklaşık ${Math.round(x.lng - K.il('istanbul').lng)} derece doğusundadır ve her derece güneşin batışını 4 dakika kadar öne alır. Batıdaki Eskişehir ise Ankara'dan ${ab(esk)} dakika sonra iftar eder.` },
        { q: 'Ankara\'da Kadir Gecesi 2027 iftarı kaçta?', a: `Kadir Gecesi ${dShort(r.kadir, 'tr')} akşamıdır, yani o günün iftarından sonra başlayan gecedir. O gün Ankara'da imsak saat ${kad.imsak}, iftar saat ${kad.aksam}, yatsı saat ${kad.yatsi} olarak hesaplanır. Bu geceden sonra ${d.rows.length - d.rows.indexOf(kad) - 1} oruç daha kalır; son iftar ${dShort(r.son, 'tr')} günü saat ${son.aksam} vaktindedir. Tarih, Diyanet'in 2027 dini günler takviminden alınmıştır.` },
      ],
      body: (h) => `<h2>Başkentte üç kritik gün</h2>
<p>Ramazanın başı, Kadir Gecesi ve arefe, takvimde en çok aranan günlerdir. Tabloda bu üç günün Ankara iftarı, karşılaştırma için İstanbul ve Konya ile yan yana.</p>
${h.table(['Gün', 'Ankara', 'İstanbul', 'Konya'], gunler.map((t) => [h.wday(t), sat('ankara', t), sat('istanbul', t), sat('konya', t)]), 'İftar saatleri, Ramazan 2027 (hesaplanan, Türkiye saati)')}
<p>Ankara'da ilk orucun süresi ${h.sure(ilk.oruc, 'tr')}, sonuncusununki ${h.sure(son.oruc, 'tr')}. Ortalama ${h.sure(d.o.ortalama, 'tr')} ile İstanbul'dan pek farklı değildir; değişen, başlangıç ve bitiş saatleridir.</p>
<h2>İstanbul'la neden çeyrek saate yakın fark var?</h2>
<p>Ankara il merkezinin boylamı ${h.n(x.lng, 2)} derece, İstanbul'unki 28,96 civarındadır. Aradaki yaklaşık 4 derecelik fark, dereceye 4 dakika hesabıyla ${ab(d.ff)}–${ab(d.fl)} dakikalık iftar farkını açıklar. Sahurdaki ${ab(d.imf)} dakikalık fark biraz daha büyüktür, çünkü Ankara İstanbul'dan güneyde kalır ve kış sonunda güneyde şafak biraz daha erken söker. Diyanet bu etkileri ${h.src('kiyas', 'vakit kıyaslamaları')} sayfasında örneklerle anlatır.</p>
<h2>Eskişehir'den Kayseri'ye çevre iller</h2>
<p>İlk gün Ankara'ya göre iftar: Eskişehir ${ab(esk)} dakika sonra, Konya ${ab(kon)} dakika sonra; Kırıkkale ${ab(kir)}, Çankırı ${ab(can)}, Kayseri ${ab(kay)} dakika önce. Polatlı ya da Beypazarı gibi batı ilçelerinde akşam merkezden biraz geç, Elmadağ yönündeki doğu ilçelerinde biraz erken girer. İlçe saatleri için Diyanet'in ilçe takvimi geçerlidir. Güneydeki komşunun tam takvimi ${h.a('imsakiye-konya', 'Konya imsakiyesi')} sayfasında.</p>
${h.mini('im', { p: ['il'], d: { il: 'konya', yil: 2027 }, c: 'Konya ve diğer illerin imsakiyesi' })}
<h2>Resmi takvimle uyum</h2>
<p>Hesap, ${h.src('imsak', 'imsak')} için güneşin ufkun 18 derece altında olduğu anı, iftar için gün batımı artı 7 dakikalık ${h.src('temkin', 'temkini')} kullanır. Ankara'da 2026 sonundan 2027 sonuna kadar bütün vakitler Diyanet takvimiyle tek tek kıyaslandı: ${h.pct(yuzde(d.oran))} aynı dakika, gerisi 1 dakika fark. Örneğin ilk gün resmi takvim imsak ${d.ornek[r.ilk].imsak}, iftar ${d.ornek[r.ilk].aksam} verir. Oruç için son söz ${h.src('namazvakitleri', 'Diyanet\'in resmi namaz vakitleri')} sayfasındadır.</p>
<h2>2028'de Ankara'da Ramazan</h2>
<p>Bir sonraki Ramazan ${h.wday(o28.r.ilk)} günü başlar ve kış ortasına düşer: imsak ${o28.ilk.imsak}, iftar ${o28.ilk.aksam}, oruç ${h.sure(o28.ilk.oruc, 'tr')}. Kadir Gecesi ve bayram için ${h.a('kadir-gecesi-2027', 'Kadir Gecesi 2027')}, ${h.a('ramazan-bayrami-2027', 'Ramazan Bayramı 2027')}; anlık sayaç için ${h.a('iftara-kac-dakika-kaldi', 'iftara kalan süre')}. Ülke geneli: ${h.a('imsakiye-2027', 'imsakiye 2027')}, ${h.a('ramazan-2027', 'Ramazan 2027')}, ${h.a('imsak-sahur-vakti', 'sahur vakti')}.</p>`,
    },
    en: {
      slug: 'ankara-ramadan-times-2027', nav: 'Ankara Ramadan times', card: `Iftar ${ab(d.ff)} minutes before Istanbul: ${ilk.aksam} on day one`,
      title: 'Ankara Ramadan times 2027: iftar and suhoor, all 29 days',
      description: `Ankara Ramadan 2027 timetable: the fast starts Monday 8 February with imsak at ${ilk.imsak} and iftar at ${ilk.aksam}. Last fast ${gm(r.son, 'en')}, Qadr night ${gm(r.kadir, 'en')}, Eid ${gm(r.bayram, 'en')}.`,
      h1: `Ankara Ramadan 2027: suhoor ends ${ilk.imsak}, iftar ${ilk.aksam} on day one`,
      intro: 'The full computed Ramadan 2027 calendar for the capital is in the tool: imsak, sunrise, sunset (iftar) and isha for every day, plus how long each fast lasts.',
      resume: `Ramadan 2027 begins in Ankara on the morning of ${dShort(r.ilk, 'en')}. The first suhoor must end by ${ilk.imsak}, the first iftar is at ${ilk.aksam}, and that fast lasts ${su(ilk.oruc, 'en')}. The capital breaks its fast ${ab(d.ff)} minutes before Istanbul at the start of the month and ${ab(d.fl)} minutes before it at the end. The final fast falls on ${dShort(r.son, 'en')}: imsak ${son.imsak}, iftar ${son.aksam}, ${su(son.oruc, 'en')} in all. Laylat al-Qadr is the evening of ${dShort(r.kadir, 'en')}, with iftar at ${kad.aksam}, and Eid al-Fitr begins on ${dShort(r.bayram, 'en')}. This timetable was not copied from a list: we computed it with the Diyanet's angles and safety margins, then compared it with the Diyanet's own Ankara calendar. Ankara scores ${d.enO}, the best match among the ten largest cities; every other value is 1 minute out. For worship, the official Diyanet calendar remains the reference.`,
      faqs: [
        { q: 'When does the first suhoor end in Ankara in 2027?', a: `Imsak on ${dShort(r.ilk, 'en')} is computed at ${ilk.imsak} in Ankara, so the pre-dawn meal must be finished before then. The first suhoor falls in the night that follows the evening of ${dShort(d.arife, 'en')}. Iftar that day is at ${ilk.aksam}, a fast of ${su(ilk.oruc, 'en')}. Over the month imsak moves ${d.geri} minutes earlier, reaching ${son.imsak} on the last day. ${d.enO} of the computed times match the Diyanet's Ankara calendar to the minute.` },
        { q: 'How many minutes apart are iftar in Ankara and Istanbul?', a: `On the first fast Ankara breaks its fast ${ab(d.ff)} minutes before Istanbul, on the last ${ab(d.fl)} minutes before. The gap is a little wider at dawn: on day one imsak is ${ab(d.imf)} minutes earlier. The reason is longitude: Ankara lies about ${Math.round(x.lng - K.il('istanbul').lng)} degrees east of Istanbul, and each degree brings sunset forward by roughly 4 minutes. Eskişehir, to the west, has iftar ${ab(esk)} minutes after Ankara.` },
        { q: 'What time is iftar in Ankara on Laylat al-Qadr 2027?', a: `Laylat al-Qadr is the evening of ${dShort(r.kadir, 'en')}, the night that begins after that day's iftar. Ankara has imsak at ${kad.imsak}, iftar at ${kad.aksam} and yatsı at ${kad.yatsi} that day. ${d.rows.length - d.rows.indexOf(kad) - 1} more fasts remain after it, and the last iftar is at ${son.aksam} on ${dShort(r.son, 'en')}. The date comes from the Diyanet's 2027 calendar of religious days.` },
      ],
      body: (h) => `<h2>Three key days in the capital</h2>
<p>The first fast, Laylat al-Qadr and the eve of Eid are the dates people look up most. The table puts Ankara's iftar next to Istanbul and Konya for comparison.</p>
${h.table(['Day', 'Ankara', 'Istanbul', 'Konya'], gunler.map((t) => [h.wday(t), sat('ankara', t), sat('istanbul', t), sat('konya', t)]), 'Iftar times, Ramadan 2027 (computed, Turkey time)')}
<p>Ankara's first fast lasts ${h.sure(ilk.oruc, 'en')} and its last ${h.sure(son.oruc, 'en')}. The average, ${h.sure(d.o.ortalama, 'en')}, is close to Istanbul's; what differs is the clock time at which each fast starts and ends.</p>
<h2>Why a quarter of an hour separates Ankara and Istanbul</h2>
<p>Central Ankara lies at ${h.n(x.lng, 2)} degrees east, Istanbul at about 28.96. Roughly 4 degrees at 4 minutes a degree explains the ${ab(d.ff)} to ${ab(d.fl)} minute gap at iftar. At dawn the gap grows to ${ab(d.imf)} minutes because Ankara is further south, where late-winter daybreak comes a little sooner. The Diyanet gives worked examples on its ${h.src('kiyas', 'latitude and longitude page')}.</p>
<h2>From Eskişehir to Kayseri</h2>
<p>On the first day, relative to Ankara: Eskişehir breaks the fast ${ab(esk)} minutes later and Konya ${ab(kon)} later, while Kırıkkale is ${ab(kir)}, Çankırı ${ab(can)} and Kayseri ${ab(kay)} minutes earlier. Inside the province, western districts such as Polatlı or Beypazarı see sunset slightly after the centre and eastern ones slightly before, so district calendars from the Diyanet apply there. The full southern neighbour is on the ${h.a('imsakiye-konya', 'Konya timetable')}.</p>
${h.mini('im', { p: ['il'], d: { il: 'konya', yil: 2027 }, c: 'Timetables for Konya and other provinces' })}
<h2>How close to the official calendar?</h2>
<p>Imsak is computed with the sun 18 degrees below the horizon (${h.src('imsak', 'imsak')}), iftar as sunset plus a 7-minute ${h.src('temkin', 'margin')}. Every Ankara time from late 2026 to the end of 2027 was checked against the Diyanet: ${h.pct(yuzde(d.oran))} identical, the rest 1 minute apart. On day one, for instance, the official calendar shows imsak ${d.ornek[r.ilk].imsak} and iftar ${d.ornek[r.ilk].aksam}. The ${h.src('namazvakitleri', 'official Diyanet prayer times')} have the final word.</p>
<h2>Ramadan 2028 in Ankara</h2>
<p>The next Ramadan starts on ${h.wday(o28.r.ilk)}, in midwinter: imsak ${o28.ilk.imsak}, iftar ${o28.ilk.aksam}, a fast of ${h.sure(o28.ilk.oruc, 'en')}. For the night of Qadr and the holiday see ${h.a('kadir-gecesi-2027', 'Laylat al-Qadr 2027')} and ${h.a('ramazan-bayrami-2027', 'Eid al-Fitr 2027')}; for a live clock, ${h.a('iftara-kac-dakika-kaldi', 'time left to iftar')}. Nationwide: ${h.a('imsakiye-2027', 'Ramadan timetable 2027')}, ${h.a('ramazan-2027', 'Ramadan 2027')}, ${h.a('imsak-sahur-vakti', 'suhoor time')}.</p>`,
    },
  });
})();

/* ------------------------------------------------------------------ İzmir */
const izmir = (() => {
  const d = veri('izmir'), { r, ilk, son, kad, o28, x } = d;
  const u1 = K.uclar(r.ilk), u2 = K.uclar(r.son);
  const man = fk('manisa', 'izmir'), ayd = fk('aydin', 'izmir'), mug = fk('mugla', 'izmir'), usa = fk('usak', 'izmir');
  const canF = fk('canakkale', 'izmir'), canL = fk('canakkale', 'izmir', r.son);
  const yayilma1 = u1.sonIftar.v.aksam - u1.ilkIftar.v.aksam, yayilma2 = u2.sonIftar.v.aksam - u2.ilkIftar.v.aksam;
  return defineGuide({
    id: 'imsakiye-izmir', group: 'iller', order: 32, tool: 'im', toolArg: { il: 'izmir', yil: 2027 }, countdown: CD,
    related: ['imsakiye-2027', 'iftara-kac-dakika-kaldi', 'ramazan-bayrami-2027', 'imsak-sahur-vakti', 'imsakiye-bursa', 'imsakiye-antalya'],
    sources: SOURCES,
    tr: {
      slug: 'izmir-imsakiye-2027', nav: 'İzmir imsakiye', card: `Türkiye'nin en geç ilk iftarı: ${ilk.aksam}`,
      title: 'İzmir imsakiye 2027: iftar saati, sahur ve Kadir Gecesi',
      description: `İzmir imsakiye 2027: 8 Şubat Pazartesi ilk oruç, imsak ${ilk.imsak}, iftar ${ilk.aksam}, ülkenin en geç iftarı. Son oruç ${gm(r.son, 'tr')}, Kadir ${gm(r.kadir, 'tr')}, bayram ${gm(r.bayram, 'tr')}. Tam liste.`,
      h1: `İzmir imsakiye 2027: ilk gün iftar ${ilk.aksam}, Türkiye'de en son`,
      intro: 'Araç İzmir merkezi için Ramazan 2027 boyunca her günün imsak, güneş, iftar ve yatsı vaktini, oruç süresiyle birlikte listeler.',
      resume: `İzmirliler 2027'de ilk orucu ${dShort(r.ilk, 'tr')} günü tutar ve o akşam Türkiye'nin en geç iftarını yapar: akşam vakti ${ilk.aksam}, yani İstanbul'dan ${d.ff} dakika sonra. Aynı sabah imsak ${ilk.imsak} olarak hesaplanır; ilk oruç ${su(ilk.oruc, 'tr')} sürer. Ramazanın son günü ${dShort(r.son, 'tr')}: imsak ${son.imsak}, iftar ${son.aksam}, oruç ${su(son.oruc, 'tr')}. Kadir Gecesi ${dShort(r.kadir, 'tr')} akşamıdır (iftar ${kad.aksam}), Ramazan Bayramı ise ${dShort(r.bayram, 'tr')} günü. Saatler, Diyanet'in imsak açısı ve temkin süreleri kullanılarak tarafımızdan hesaplandı. Ardından Diyanet'in İzmir takvimiyle karşılaştırıldı: vakitlerin ${d.trO} kadarı birebir aynı, geri kalanında sapma tek dakika. Orucu açmadan önce yine de resmi Diyanet takvimine bakmak gerekir; bu sayfa planlama içindir. İzmir'de oruç ay boyunca ${d.uzama} dakika uzar. İlk teravih ve ilk sahur ise bir önceki gece, ${dShort(d.arife, 'tr')} akşamından sonradır.`,
      faqs: [
        { q: 'İzmir\'de 2027 Ramazanında ilk iftar kaçta?', a: `${dShort(r.ilk, 'tr')} akşamı İzmir'de iftar saat ${ilk.aksam}, sabah imsak saat ${ilk.imsak}; ilk oruç ${su(ilk.oruc, 'tr')} sürer. Bu, o gün Türkiye'deki 81 il merkezi arasında en geç akşam vaktidir: en erken iftar eden ${u1.ilkIftar.il.ad} ilinde oruç ${yayilma1} dakika önce açılır. Ay boyunca iftar ${d.ileri} dakika ileri kayar ve son gün, ${dShort(r.son, 'tr')}, saat ${son.aksam} olur.` },
        { q: 'İzmir ile İstanbul arasında imsak farkı ne kadar?', a: `İlk gün İzmir'de imsak İstanbul'dan ${d.imf} dakika, iftar ${d.ff} dakika sonradır. Son gün imsak farkı ${fi('izmir', 'istanbul', r.son)} dakikaya çıkar, iftar farkı ise ${d.fl} dakikaya iner. İki etki üst üste biner: İzmir daha batıda olduğu için iki vakit de gecikir; daha güneyde olduğu için kışın şafak öne, gün batımı geriye çekilir. Bahara yaklaştıkça enlem etkisi zayıflar.` },
        { q: 'İzmir\'de Ramazan 2027\'nin son orucu kaç saat sürüyor?', a: `${dShort(r.son, 'tr')} günü İzmir'de oruç ${su(son.oruc, 'tr')} sürer: imsak saat ${son.imsak}, iftar saat ${son.aksam}. İlk günkü ${su(ilk.oruc, 'tr')} ile karşılaştırınca ${d.uzama} dakika uzundur ve ayın en uzun orucudur. Bu gün aynı zamanda bayram arefesidir; 2429 sayılı Kanun'a göre tatil saat 13.00'te başlar. Ramazan Bayramı ertesi gün, ${dShort(r.bayram, 'tr')} günü girer.` },
      ],
      body: (h) => `<h2>Ülkenin en batısında akşam en geç girer</h2>
<p>Türkiye tek saat dilimi kullanır, ama güneş Iğdır'da batarken Ege'de hâlâ ufkun üstündedir. Ramazanın ilk günü bu fark ${yayilma1} dakikadır ve en uçta İzmir vardır. Ay ilerledikçe güneşin batış noktası kuzeye kayar ve en geç iftar, daha kuzeydeki Çanakkale'ye geçer; son gün yelpaze ${yayilma2} dakikadır.</p>
${h.table(['Gün', 'En erken iftar', 'Saat', 'En geç iftar', 'Saat'], [[h.wday(r.ilk), u1.ilkIftar.il.ad, h.hhmm(u1.ilkIftar.v.aksam), u1.sonIftar.il.ad, h.hhmm(u1.sonIftar.v.aksam)], [h.wday(r.son), u2.ilkIftar.il.ad, h.hhmm(u2.ilkIftar.v.aksam), u2.sonIftar.il.ad, h.hhmm(u2.sonIftar.v.aksam)]], 'Türkiye\'nin iki ucu: 81 il merkezi içinde en erken ve en geç iftar (hesaplanan)')}
<p>İzmir merkezinin koordinatları enlem ${h.n(x.lat, 2)}, boylam ${h.n(x.lng, 2)}. Diyanet'in ${h.src('kiyas', 'vakit kıyaslamaları')} da aynı ilkeyi anlatır: doğu–batı farkı dakikayı belirler, kuzey–güney farkı ise mevsime göre sabah ve akşamı farklı yönlere iter.</p>
<h2>Ege'de komşu illerle karşılaştırma</h2>
<p>İlk oruç günü İzmir'e göre: Manisa ${ab(man)}, Aydın ${ab(ayd)}, Muğla ${ab(mug)}, Uşak ${ab(usa)} dakika önce iftar eder. Çanakkale'de ilk gün iftar ${ab(canF)} dakika önce açılırken son gün ${ab(canL)} dakika sonra açılır; kuzeyde olmanın etkisi Mart'ta öne çıkar. Çeşme ve Karaburun gibi batı ilçelerinde akşam merkezden biraz geç, Kemalpaşa ve Kiraz yönünde biraz erken girer; ilçe saatleri Diyanet'in ilçe takvimindedir. Güneydeki Akdeniz kıyısı için ${h.a('imsakiye-antalya', 'Antalya imsakiyesi')}, Marmara için ${h.a('imsakiye-bursa', 'Bursa imsakiyesi')}.</p>
${h.mini('im', { p: ['il'], d: { il: 'antalya', yil: 2027 }, c: 'Antalya veya başka bir il seçin' })}
<h2>Bu saatler nasıl bulundu?</h2>
<p>İmsak, güneşin ufkun 18 derece altına indiği andır; Diyanet bu ana ${h.src('imsak', 'fecr-i sâdık')} der ve temkin eklemez. İftar, gün batımına 7 dakikalık ${h.src('temkin', 'temkin')} eklenerek bulunur. Bu formülle İzmir'in her günü hesaplandı ve Diyanet takvimiyle kıyaslandı: uyum ${h.pct(yuzde(d.oran))}. Örnek olarak son oruç günü resmi takvim iftarı ${d.ornek[r.son].aksam} verir; bizim hesap ${son.aksam}. İbadet için geçerli olan, ${h.src('namazvakitleri', 'Diyanet\'in resmi takvimidir')}. Sahurun son dakikası için ${h.a('imsak-sahur-vakti', 'imsak ve sahur vakti')}, canlı sayaç için ${h.a('iftara-kac-dakika-kaldi', 'iftara kaç dakika kaldı')}.</p>
<h2>Kadir Gecesi'nden bayrama</h2>
<p>${h.wday(r.kadir)} günü İzmir'de iftar ${kad.aksam}; Kadir Gecesi bu iftardan sonra başlar (${h.a('kadir-gecesi-2027', 'Kadir Gecesi 2027')}). Üç gün sonra son oruç tutulur, ertesi gün ${h.wday(r.bayram)} bayramdır: ${h.a('ramazan-bayrami-2027', 'Ramazan Bayramı 2027')}. Ayın genel takvimi ${h.a('ramazan-2027', 'Ramazan 2027')} sayfasında.</p>
<h2>2028: İzmir'de ocak ayında oruç</h2>
<p>Ramazan 2028 ${h.wday(o28.r.ilk)} günü başlar. İzmir'de ilk gün imsak ${o28.ilk.imsak}, iftar ${o28.ilk.aksam}; oruç ${h.sure(o28.ilk.oruc, 'tr')} ile 2027'dekinden kısadır. Ay ${h.wday(o28.r.son)} biter (iftar ${o28.son.aksam}). Bütün iller: ${h.a('imsakiye-2027', 'imsakiye 2027')}.</p>`,
    },
    en: {
      slug: 'izmir-ramadan-times-2027', nav: 'Izmir Ramadan times', card: `Turkey's latest first iftar: ${ilk.aksam}`,
      title: 'Izmir Ramadan times 2027: iftar, suhoor and Qadr night',
      description: `Izmir Ramadan 2027: first fast Monday 8 February, imsak ${ilk.imsak}, iftar ${ilk.aksam}, the latest in Turkey. Last fast ${gm(r.son, 'en')}, Qadr night ${gm(r.kadir, 'en')}, Eid ${gm(r.bayram, 'en')}. All days.`,
      h1: `Izmir Ramadan 2027: iftar at ${ilk.aksam} on day one, the last in Turkey`,
      intro: 'For central Izmir the tool lists imsak, sunrise, iftar and isha for every day of Ramadan 2027, with the length of each fast.',
      resume: `Izmir starts Ramadan 2027 on ${dShort(r.ilk, 'en')} and has the latest iftar in the whole country that evening: ${ilk.aksam}, ${d.ff} minutes after Istanbul. Imsak that morning is ${ilk.imsak}, so the first fast lasts ${su(ilk.oruc, 'en')}. The month ends on ${dShort(r.son, 'en')} with imsak at ${son.imsak}, iftar at ${son.aksam} and a fast of ${su(son.oruc, 'en')}. Laylat al-Qadr is the evening of ${dShort(r.kadir, 'en')} (iftar ${kad.aksam}) and Eid al-Fitr falls on ${dShort(r.bayram, 'en')}. We calculated these times using the Diyanet's dawn angle and safety margins, and then lined them up with the Diyanet's own Izmir calendar: ${d.enO} are identical, and where they differ it is by a single minute. Use this page to plan; for the fast itself, the official calendar is the one to follow. Over the month the fast in Izmir grows by ${d.uzama} minutes.`,
      faqs: [
        { q: 'What time is the first iftar in Izmir in Ramadan 2027?', a: `${ilk.aksam} on ${dShort(r.ilk, 'en')}, with imsak at ${ilk.imsak} that morning, a first fast of ${su(ilk.oruc, 'en')}. That is the latest sunset-based iftar of all 81 provincial centres that day: ${u1.ilkIftar.il.en}, the earliest, breaks its fast ${yayilma1} minutes before. Over the month iftar in Izmir moves ${d.ileri} minutes later and reaches ${son.aksam} on the last day, ${dShort(r.son, 'en')}.` },
        { q: 'How far apart are imsak times in Izmir and Istanbul?', a: `On day one imsak in Izmir is ${d.imf} minutes after Istanbul and iftar ${d.ff} minutes after. On the last day the imsak gap widens to ${fi('izmir', 'istanbul', r.son)} minutes while the iftar gap shrinks to ${d.fl}. Two effects overlap: being further west delays both times, while being further south pulls winter dawn earlier and sunset later. The latitude effect fades as spring approaches.` },
        { q: 'How long is the last fast of Ramadan 2027 in Izmir?', a: `${su(son.oruc, 'en')} on ${dShort(r.son, 'en')}, from ${son.imsak} to ${son.aksam}. That is ${d.uzama} minutes longer than the ${su(ilk.oruc, 'en')} of the first day, and the longest fast of the month. The same day is the eve of Eid: under Law 2429 the holiday starts at 13:00. Eid al-Fitr itself begins the next day, ${dShort(r.bayram, 'en')}.` },
      ],
      body: (h) => `<h2>Sunset comes last in the far west</h2>
<p>Turkey keeps a single time zone, yet when the sun has set in Iğdır it is still above the horizon on the Aegean. On the first fast the spread is ${yayilma1} minutes, with Izmir at the late end. As the month goes on, the sunset point moves north and the latest iftar passes to Çanakkale; on the last day the spread is ${yayilma2} minutes.</p>
${h.table(['Day', 'Earliest iftar', 'Time', 'Latest iftar', 'Time'], [[h.wday(r.ilk), u1.ilkIftar.il.en, h.hhmm(u1.ilkIftar.v.aksam), u1.sonIftar.il.en, h.hhmm(u1.sonIftar.v.aksam)], [h.wday(r.son), u2.ilkIftar.il.en, h.hhmm(u2.ilkIftar.v.aksam), u2.sonIftar.il.en, h.hhmm(u2.sonIftar.v.aksam)]], 'Both ends of Turkey: earliest and latest iftar among 81 provincial centres (computed)')}
<p>Central Izmir sits at latitude ${h.n(x.lat, 2)}, longitude ${h.n(x.lng, 2)}. The Diyanet's ${h.src('kiyas', 'note on latitude and longitude')} sets out the same idea: east–west distance fixes the minutes, while north–south distance pushes morning and evening in different directions depending on the season.</p>
<h2>Aegean neighbours</h2>
<p>On day one, relative to Izmir, iftar comes ${ab(man)} minutes earlier in Manisa, ${ab(ayd)} in Aydın, ${ab(mug)} in Muğla and ${ab(usa)} in Uşak. Çanakkale is ${ab(canF)} minutes earlier on the first day but ${ab(canL)} minutes later on the last, which shows the effect of its northern position in March. Western districts such as Çeşme and Karaburun see sunset a little after the centre, eastern ones such as Kemalpaşa a little before; the Diyanet district calendars give their times. For the Mediterranean coast see the ${h.a('imsakiye-antalya', 'Antalya timetable')}, for the Marmara the ${h.a('imsakiye-bursa', 'Bursa timetable')}.</p>
${h.mini('im', { p: ['il'], d: { il: 'antalya', yil: 2027 }, c: 'Pick Antalya or any other province' })}
<h2>Where the numbers come from</h2>
<p>Imsak is the moment the sun reaches 18 degrees below the horizon, which the Diyanet calls ${h.src('imsak', 'true dawn')} and to which it adds no margin. Iftar is sunset plus a 7-minute ${h.src('temkin', 'safety margin')}. Every Izmir day was computed this way and checked against the Diyanet: a ${h.pct(yuzde(d.oran))} match. On the last fast, for example, the official calendar gives iftar at ${d.ornek[r.son].aksam}; we compute ${son.aksam}. The ${h.src('namazvakitleri', 'official Diyanet calendar')} prevails for worship. See ${h.a('imsak-sahur-vakti', 'imsak and suhoor')} for the last minute to eat and ${h.a('iftara-kac-dakika-kaldi', 'the iftar countdown')} for a live clock.</p>
<h2>From the night of Qadr to Eid</h2>
<p>On ${h.wday(r.kadir)} Izmir breaks its fast at ${kad.aksam}, and Laylat al-Qadr begins after that meal (${h.a('kadir-gecesi-2027', 'Laylat al-Qadr 2027')}). Three days later comes the last fast, and ${h.wday(r.bayram)} is Eid: ${h.a('ramazan-bayrami-2027', 'Eid al-Fitr 2027')}. The overall calendar is on ${h.a('ramazan-2027', 'Ramadan 2027')}.</p>
<h2>2028: a January Ramadan in Izmir</h2>
<p>Ramadan 2028 begins on ${h.wday(o28.r.ilk)}. Izmir then has imsak at ${o28.ilk.imsak} and iftar at ${o28.ilk.aksam}, a fast of ${h.sure(o28.ilk.oruc, 'en')}, shorter than in 2027. The month ends on ${h.wday(o28.r.son)} (iftar ${o28.son.aksam}). All provinces: ${h.a('imsakiye-2027', 'Ramadan timetable 2027')}.</p>`,
    },
  });
})();

/* ------------------------------------------------------------------ Bursa */
const bursa = (() => {
  const d = veri('bursa'), { r, ilk, son, kad, o28, x } = d;
  const yal = fk('yalova', 'bursa'), bal = fk('balikesir', 'bursa'), bil = fk('bilecik', 'bursa'), koc = fk('kocaeli', 'bursa');
  const fark = d.rows.map((z) => K.iftarFarki('bursa', z.date));
  const ayni = fark.filter((f) => f === 0).length;
  const imsFark = d.rows.map((z) => fi('bursa', 'istanbul', z.date));
  const secim = d.rows.filter((_, i) => i % 4 === 0);
  return defineGuide({
    id: 'imsakiye-bursa', group: 'iller', order: 33, tool: 'im', toolArg: { il: 'bursa', yil: 2027 }, countdown: CD,
    related: ['imsakiye-2027', 'iftara-kac-dakika-kaldi', 'kadir-gecesi-2027', 'imsakiye-istanbul', 'imsakiye-izmir', 'ramazan-2027'],
    sources: SOURCES,
    tr: {
      slug: 'bursa-imsakiye-2027', nav: 'Bursa imsakiye', card: `İlk iftar ${ilk.aksam}, İstanbul'la neredeyse aynı dakika`,
      title: 'Bursa imsakiye 2027: Ramazan iftar ve imsak vakitleri',
      description: `Bursa imsakiye 2027: ilk oruç 8 Şubat Pazartesi, sahur ${ilk.imsak} biter, iftar ${ilk.aksam}. Kadir Gecesi ${gm(r.kadir, 'tr')} akşamı, son oruç ${gm(r.son, 'tr')}, bayram ${gm(r.bayram, 'tr')}. Gün gün liste.`,
      h1: `Bursa imsakiye 2027: oruç ${ilk.aksam} ile ${son.aksam} arasında açılıyor`,
      intro: 'Bursa merkezi için hesaplanan Ramazan 2027 vakitleri araçta gün gün yer alıyor; il ya da yıl seçerek başka bir takvimi açabilirsiniz.',
      resume: `Bursa'da Ramazan 2027'nin ilk günü ${dShort(r.ilk, 'tr')}: sahur ${ilk.imsak} vaktinde sona erer, oruç ${ilk.aksam} vaktinde açılır ve ${su(ilk.oruc, 'tr')} sürer. Son oruç ${dShort(r.son, 'tr')} günü, imsak ${son.imsak} ile iftar ${son.aksam} arasında ${su(son.oruc, 'tr')} tutulur. Kadir Gecesi ${dShort(r.kadir, 'tr')} akşamıdır (o gün iftar ${kad.aksam}), bayramın birinci günü ${dShort(r.bayram, 'tr')}. Bursa'nın saatleri İstanbul'unkiyle neredeyse çakışır: ${r.gun} günün ${ayni} gününde iftar aynı dakikaya düşer, diğerlerinde fark bir dakikadır. Bu vakitler sitede Diyanet'in ölçüleriyle hesaplanıyor ve Diyanet'in Bursa takvimiyle denetleniyor. Bursa'da birebir uyum ${d.trO} ile on ilin en düşüğü, ama hiçbir gün fark 1 dakikayı geçmiyor. Bu yüzden ibadet saatinde tereddüde düşmemek için resmi takvime bakmanızı özellikle öneririz. Bursa'da ortalama oruç ${su(d.o.ortalama, 'tr')} olarak hesaplanır; ilk teravih ${dShort(d.arife, 'tr')} akşamı kılınır.`,
      faqs: [
        { q: 'Bursa\'da 2027 Ramazanında ilk sahur kaçta biter?', a: `${dShort(r.ilk, 'tr')} sabahı Bursa'da imsak saat ${ilk.imsak}; sahur bu saatten önce bitmelidir. Aynı gün iftar saat ${ilk.aksam}, oruç ${su(ilk.oruc, 'tr')} sürer. İmsak Ramazan boyunca ${d.geri} dakika öne gelir ve son gün saat ${son.imsak} olur; ayın sonuna doğru sahur için daha erken kalkmak gerekir. Hesaplanan vakitlerin ${d.trO} kadarı Diyanet'in Bursa takvimiyle aynı dakikadadır.` },
        { q: 'Bursa ve İstanbul\'un iftar saati aynı mı?', a: `Hemen hemen. Ramazan 2027'nin ${r.gun} gününden ${ayni} gününde iki ilin hesaplanan iftarı aynı dakikadır, kalan günlerde fark 1 dakikadır. Fark olan günlerde Bursa iftarı ${Math.max(...fark)} dakika geç okunur; sahurda ise Bursa ya aynı dakikada ya da ${ab(Math.min(...imsFark))} dakika önce imsak eder. Körfezin karşısındaki Yalova'da iftar Bursa'dan ${ab(yal)} dakika önce açılır.` },
        { q: 'Bursa\'da Kadir Gecesi 2027 hangi akşam?', a: `${dShort(r.kadir, 'tr')} akşamı; Kadir Gecesi o günün iftarından sonra başlar. Bursa'da o gün iftar saat ${kad.aksam}, yatsı saat ${kad.yatsi}, ertesi sabah imsak saat ${d.rows[d.rows.indexOf(kad) + 1].imsak} olarak hesaplanır. Tarih Diyanet'in 2027 dini günler takviminden alınmıştır. Bu geceden sonra ${d.rows.length - d.rows.indexOf(kad) - 1} oruç daha tutulur ve Ramazan Bayramı ${dShort(r.bayram, 'tr')} günü başlar.` },
      ],
      body: (h) => `<h2>Dört günde bir: Bursa takviminden kesitler</h2>
${h.table(['Tarih', 'İmsak', 'Güneş', 'İftar', 'Yatsı'], secim.map((z) => [h.wday(z.date), z.imsak, z.gunes, z.aksam, z.yatsi]), 'Bursa, Ramazan 2027: hesaplanan vakitler (Türkiye saati)')}
<p>Tablo, ayı dört günlük adımlarla gösterir. Yatsı sütunu teravih için fikir verir; teravih yatsı namazından sonra kılınır. Bursa'da ay boyunca iftar ${d.ileri} dakika gecikir, imsak ${d.geri} dakika erkene çekilir.</p>
<h2>Marmara'nın iki yakası: Bursa ve İstanbul</h2>
<p>Bursa merkezi (boylam ${h.n(x.lng, 2)}) İstanbul'un hemen hemen tam güneyinde kalır. Doğu–batı farkı yok denecek kadar azdır; bu yüzden ${r.gun} günün ${ayni} gününde iftar aynı dakikada okunur. Sahurda Bursa bazı günler İstanbul'la aynı dakikada, bazı günler ${ab(Math.min(...imsFark))} dakika önce imsak eder: güneyde kış sonunda şafak biraz erken söker, bu da enlem farkının sabaha yansımasıdır. İki şehir arasında gidip gelenler için pratik sonuç şu: aynı saatte oruç açarsınız, sahurda ise bir dakikalık pay bırakmak yeterlidir. İstanbul'un tam listesi ${h.a('imsakiye-istanbul', 'İstanbul imsakiyesi')} sayfasında.</p>
<h2>Yalova, Balıkesir, Bilecik ve Kocaeli</h2>
<p>İlk gün Bursa'ya göre iftar: Yalova ${ab(yal)}, Bilecik ${ab(bil)}, Kocaeli ${ab(koc)} dakika önce; batıdaki Balıkesir ${ab(bal)} dakika sonra. İl içinde de benzer bir fark vardır: Mudanya ve Karacabey gibi batı ilçeleri merkezden biraz geç, İnegöl tarafı biraz erken iftar eder. Kesin ilçe saati Diyanet'in ilçe takvimindedir. Ege'ye inenler ${h.a('imsakiye-izmir', 'İzmir imsakiyesine')} bakabilir.</p>
${h.mini('im', { p: ['il'], d: { il: 'istanbul', yil: 2027 }, c: 'İstanbul ile Bursa\'yı yan yana görün' })}
<h2>Uyum oranı neden ${h.pct(yuzde(d.oran))}?</h2>
<p>Hesap iki kurala dayanır: imsakta güneş ufkun 18 derece altındadır (${h.src('imsak', 'Diyanet: imsak')}), akşam vaktine 7 dakikalık ${h.src('temkin', 'temkin')} eklenir. Bursa'nın 403 günlük karşılaştırmasında bu iki kuralla bulunan dakikaların ${h.pct(yuzde(d.oran))} kadarı Diyanet'le aynıdır. Oran on büyük il içinde en düşüğüdür, fakat farkın tamamı 1 dakikadır; hiçbir vakit 2 dakika kaymaz. Bir dakikanın bile önemli olduğu sahur ve iftarda karar ${h.src('namazvakitleri', 'Diyanet\'in resmi takvimine')} aittir. Sahurun ne zaman bittiği ${h.a('imsak-sahur-vakti', 'imsak ve sahur')} sayfasında anlatılır.</p>
<h2>Kadir Gecesi, bayram ve 2028</h2>
<p>Kadir Gecesi ${h.wday(r.kadir)} iftarından (${kad.aksam}) sonra başlar: ${h.a('kadir-gecesi-2027', 'Kadir Gecesi 2027')}. Bayram ${h.wday(r.bayram)} günüdür (${h.a('ramazan-bayrami-2027', 'Ramazan Bayramı 2027')}). 2028'de Ramazan ${h.wday(o28.r.ilk)} günü başlar; Bursa'da ilk gün imsak ${o28.ilk.imsak}, iftar ${o28.ilk.aksam}. Geri sayım için ${h.a('iftara-kac-dakika-kaldi', 'iftara kaç dakika kaldı')}, bütün iller için ${h.a('imsakiye-2027', 'imsakiye 2027')}, ay takvimi için ${h.a('ramazan-2027', 'Ramazan 2027')}.</p>`,
    },
    en: {
      slug: 'bursa-ramadan-times-2027', nav: 'Bursa Ramadan times', card: `First iftar ${ilk.aksam}, practically the same minute as Istanbul`,
      title: 'Bursa Ramadan times 2027: imsakiye with iftar and imsak',
      description: `Bursa Ramadan 2027: first fast Monday 8 February, suhoor ends ${ilk.imsak}, iftar ${ilk.aksam}. Qadr night on the evening of ${gm(r.kadir, 'en')}, last fast ${gm(r.son, 'en')}, Eid ${gm(r.bayram, 'en')}.`,
      h1: `Bursa Ramadan 2027: iftar from ${ilk.aksam} to ${son.aksam}`,
      intro: 'Computed Ramadan 2027 times for central Bursa, day by day, are in the tool; choose another province or year to switch timetables.',
      resume: `Ramadan 2027 starts in Bursa on ${dShort(r.ilk, 'en')}: suhoor ends at ${ilk.imsak}, the fast is broken at ${ilk.aksam} and lasts ${su(ilk.oruc, 'en')}. The last fast, on ${dShort(r.son, 'en')}, runs from ${son.imsak} to ${son.aksam}, ${su(son.oruc, 'en')} in total. Laylat al-Qadr is the evening of ${dShort(r.kadir, 'en')} (iftar ${kad.aksam}), and the first day of Eid is ${dShort(r.bayram, 'en')}. Bursa's times almost coincide with Istanbul's: on ${ayni} of the ${r.gun} days iftar falls in the same minute, on the others one minute apart. The site computes these times with the Diyanet's parameters and audits them against the Diyanet's Bursa calendar. Bursa's exact-match rate, ${d.enO}, is the lowest of the ten cities, although no value is ever more than 1 minute out. That is one more reason to check the official calendar whenever a minute matters for your fast.`,
      faqs: [
        { q: 'When does the first suhoor end in Bursa in Ramadan 2027?', a: `Imsak on ${dShort(r.ilk, 'en')} is ${ilk.imsak} in Bursa, so suhoor must be over by then; iftar that day is at ${ilk.aksam}, a fast of ${su(ilk.oruc, 'en')}. Imsak moves ${d.geri} minutes earlier across the month and reaches ${son.imsak} on the last day, so getting up for suhoor gets earlier towards the end. ${d.enO} of the computed times fall on the same minute as the Diyanet's Bursa calendar.` },
        { q: 'Do Bursa and Istanbul have the same iftar time?', a: `Nearly. On ${ayni} of the ${r.gun} days of Ramadan 2027 the computed iftar is the same minute in both cities, and on the remaining days it differs by 1 minute. Where they differ, Bursa's iftar is ${Math.max(...fark)} minute later, while its imsak is either the same minute or ${ab(Math.min(...imsFark))} minute earlier. Across the gulf, Yalova breaks the fast ${ab(yal)} minutes before Bursa.` },
        { q: 'Which evening is Laylat al-Qadr 2027 in Bursa?', a: `The evening of ${dShort(r.kadir, 'en')}; the night begins after that day's iftar. Bursa breaks the fast at ${kad.aksam} that day, yatsı is at ${kad.yatsi}, and imsak the next morning is computed at ${d.rows[d.rows.indexOf(kad) + 1].imsak}. The date comes from the Diyanet's 2027 calendar of religious days. ${d.rows.length - d.rows.indexOf(kad) - 1} more fasts follow, and Eid al-Fitr begins on ${dShort(r.bayram, 'en')}.` },
      ],
      body: (h) => `<h2>Every fourth day in Bursa</h2>
${h.table(['Date', 'Imsak', 'Sunrise', 'Iftar', 'Isha'], secim.map((z) => [h.wday(z.date), z.imsak, z.gunes, z.aksam, z.yatsi]), 'Bursa, Ramadan 2027: computed times (Turkey time)')}
<p>The table steps through the month four days at a time. The isha column is useful for tarawih, which is prayed after isha. Over the month iftar in Bursa moves ${d.ileri} minutes later and imsak ${d.geri} minutes earlier.</p>
<h2>Two shores of the Marmara</h2>
<p>Central Bursa (longitude ${h.n(x.lng, 2)}) lies almost due south of Istanbul. The east–west offset is tiny, which is why iftar is called in the same minute on ${ayni} of the ${r.gun} days. At dawn Bursa reaches imsak either in the same minute or ${ab(Math.min(...imsFark))} minute ahead: further south, late-winter daybreak comes a touch earlier, the latitude effect showing up in the morning. In practice, commuters between the two cities break the fast at the same moment and only need a one-minute cushion at suhoor. Istanbul's full list is on the ${h.a('imsakiye-istanbul', 'Istanbul timetable')}.</p>
<h2>Yalova, Balıkesir, Bilecik and Kocaeli</h2>
<p>On day one, relative to Bursa, iftar is ${ab(yal)} minutes earlier in Yalova, ${ab(bil)} in Bilecik and ${ab(koc)} in Kocaeli, and ${ab(bal)} minutes later in Balıkesir to the west. The same happens inside the province: western districts such as Mudanya and Karacabey break the fast slightly after the centre, İnegöl slightly before. Exact district times are in the Diyanet district calendars. Heading to the Aegean? See the ${h.a('imsakiye-izmir', 'Izmir timetable')}.</p>
${h.mini('im', { p: ['il'], d: { il: 'istanbul', yil: 2027 }, c: 'See Istanbul next to Bursa' })}
<h2>Why a ${h.pct(yuzde(d.oran))} match?</h2>
<p>Two rules drive the calculation: at imsak the sun is 18 degrees below the horizon (${h.src('imsak', 'Diyanet on imsak')}), and 7 minutes of ${h.src('temkin', 'margin')} are added to sunset. Over 403 days of comparison, ${h.pct(yuzde(d.oran))} of the Bursa minutes found this way equal the Diyanet's. That is the lowest rate of the ten big cities, but every difference is exactly 1 minute; nothing drifts by 2. Where a single minute counts, at suhoor and iftar, the ${h.src('namazvakitleri', 'official Diyanet calendar')} decides. The ${h.a('imsak-sahur-vakti', 'imsak and suhoor')} page explains when eating must stop.</p>
<h2>Qadr night, Eid and 2028</h2>
<p>Laylat al-Qadr begins after iftar (${kad.aksam}) on ${h.wday(r.kadir)}: ${h.a('kadir-gecesi-2027', 'Laylat al-Qadr 2027')}. Eid is on ${h.wday(r.bayram)} (${h.a('ramazan-bayrami-2027', 'Eid al-Fitr 2027')}). In 2028 Ramadan starts on ${h.wday(o28.r.ilk)}; Bursa's first imsak is ${o28.ilk.imsak} and its first iftar ${o28.ilk.aksam}. Live countdown: ${h.a('iftara-kac-dakika-kaldi', 'minutes to iftar')}; all provinces: ${h.a('imsakiye-2027', 'Ramadan timetable 2027')}; the month at a glance: ${h.a('ramazan-2027', 'Ramadan 2027')}.</p>`,
    },
  });
})();

/* ------------------------------------------------------------------ Antalya */
const antalya = (() => {
  const d = veri('antalya'), { r, ilk, son, kad, o28, x } = d;
  const ist = veri('istanbul');
  const isp = fk('isparta', 'antalya'), bur = fk('burdur', 'antalya'), mug = fk('mugla', 'antalya'), mer = fk('mersin', 'antalya');
  const hafta = d.rows.filter((_, i) => i % 7 === 0).map((z, i) => ({ z, ist: ist.rows[i * 7] }));
  return defineGuide({
    id: 'imsakiye-antalya', group: 'iller', order: 34, tool: 'im', toolArg: { il: 'antalya', yil: 2027 }, countdown: CD,
    related: ['imsakiye-2027', 'imsak-sahur-vakti', 'ramazan-bayrami-2027', 'iftara-kac-dakika-kaldi', 'imsakiye-konya', 'imsakiye-izmir'],
    sources: SOURCES,
    tr: {
      slug: 'antalya-imsakiye-2027', nav: 'Antalya imsakiye', card: `İftar İstanbul'la aynı (${ilk.aksam}), sahur ${ab(d.imf)} dk erken`,
      title: 'Antalya imsakiye 2027: sahur vakti ve iftar saatleri',
      description: `Antalya imsakiye 2027: ilk oruç 8 Şubat, imsak ${ilk.imsak}, iftar ${ilk.aksam}; oruç İstanbul'dan uzun. Son oruç ${gm(r.son, 'tr')}, Kadir Gecesi ${gm(r.kadir, 'tr')}, bayram ${gm(r.bayram, 'tr')}. Tam liste.`,
      h1: `Antalya imsakiye 2027: sahur ${ilk.imsak}, iftar ${ilk.aksam}`,
      intro: 'Antalya merkezi için hesaplanan 29 günlük Ramazan 2027 takvimi: imsak, güneş, iftar, yatsı ve günlük oruç süresi.',
      resume: `Antalya'da 2027'nin ilk orucu ${dShort(r.ilk, 'tr')} günüdür. Sahur ${ilk.imsak} vaktinde biter, iftar ${ilk.aksam} vaktinde yapılır; oruç ${su(ilk.oruc, 'tr')} sürer. İlginç olan, ilk gün iftarın İstanbul'la aynı dakikaya düşmesi, sahurun ise ${ab(d.imf)} dakika erken bitmesidir; bu yüzden Antalya'da ilk oruç İstanbul'dakinden ${ilk.oruc - ist.ilk.oruc} dakika uzundur. Ay sonunda tablo tersine döner: ${dShort(r.son, 'tr')} günü iftar ${son.aksam}, İstanbul'dan ${ab(d.fl)} dakika önce, oruç ${su(son.oruc, 'tr')}. Kadir Gecesi ${dShort(r.kadir, 'tr')} akşamıdır (iftar ${kad.aksam}), bayram ${dShort(r.bayram, 'tr')}. Takvimdeki her saat, Diyanet'in kullandığı ölçülerle bu sitede hesaplandı ve Diyanet'in Antalya takvimiyle kıyaslandı: tam uyum ${d.trO}, en büyük fark 1 dakika. İbadet açısından bağlayıcı olan resmi Diyanet takvimidir. Ay genelinde Antalya'da ortalama oruç ${su(d.o.ortalama, 'tr')} sürer, İstanbul ortalamasından ${d.o.ortalama - ist.o.ortalama} dakika fazla; ilk sahur ise ${dShort(d.arife, 'tr')} gecesi yenir.`,
      faqs: [
        { q: 'Antalya\'da 2027\'de iftar İstanbul\'la aynı saatte mi?', a: `İlk oruç günü, ${dShort(r.ilk, 'tr')}, evet: iki ilde de iftar saat ${ilk.aksam} olarak hesaplanır. Ay ilerledikçe Antalya öne geçer ve son gün İstanbul'dan ${ab(d.fl)} dakika önce, saat ${son.aksam} vaktinde iftar eder. Sahurda tablo farklıdır: ilk gün Antalya'da imsak ${ab(d.imf)} dakika erkendir. Doğudaki Mersin'de ise iftar Antalya'dan ${ab(mer)} dakika önce açılır.` },
        { q: 'Antalya\'da oruç neden İstanbul\'dan uzun sürüyor?', a: `Antalya İstanbul'dan daha güneydedir; kış sonunda güneyde şafak daha erken söker. İlk gün imsak ${ab(d.imf)} dakika erken, saat ${ilk.imsak} olduğu için oruç ${su(ilk.oruc, 'tr')} sürer; İstanbul'da ${su(ist.ilk.oruc, 'tr')}. Gündüzler uzadıkça enlem farkı etkisini yitirir: son gün Antalya'da oruç ${su(son.oruc, 'tr')}, İstanbul'da ${su(ist.son.oruc, 'tr')}. Ay ortalaması Antalya'da ${su(d.o.ortalama, 'tr')}.` },
        { q: 'Antalya\'da Ramazan Bayramı 2027 hangi gün?', a: `Ramazan Bayramı ${dShort(r.bayram, 'tr')} günü başlar; tarih tüm illerde aynıdır. Son oruç bir gün önce, ${dShort(r.son, 'tr')} günü tutulur ve Antalya'da iftar saat ${son.aksam} olur. 2429 sayılı Kanun'a göre arefe günü saat 13.00'ten itibaren yarım gün ve bayramın üç günü resmi tatildir; hafta sonuna denk gelen gün için telafi yoktur. Bayram sabahı güneş saat ${K.hhmm(K.ilVakit('antalya', r.bayram).gunes)} vaktinde doğar.` },
      ],
      body: (h) => `<h2>Aynı iftar, farklı oruç: enlemin etkisi</h2>
<p>Antalya merkezi (enlem ${h.n(x.lat, 2)}, boylam ${h.n(x.lng, 2)}) İstanbul'dan yaklaşık 4 derece güneyde, 1,7 derece doğudadır. Doğuda olmak akşamı erkene çeker; güneyde olmak ise şubatta gün batımını biraz geciktirir. İki etki ilk gün birbirini götürür ve iftar aynı dakikaya düşer. Sabah ise iki etki aynı yöne çalışır: imsak ${ab(d.imf)} dakika erkendir. Haftalık karşılaştırma bu dengenin nasıl değiştiğini gösteriyor:</p>
${h.table(['Tarih', 'Antalya iftar', 'İstanbul iftar', 'Antalya oruç', 'İstanbul oruç'], hafta.map(({ z, ist: y }) => [h.wday(z.date), z.aksam, y.aksam, h.sure(z.oruc, 'tr'), h.sure(y.oruc, 'tr')]), 'Antalya ve İstanbul, Ramazan 2027 (hesaplanan)')}
<p>Mart'a girildikçe günler eşitlenir, enlemin akşama etkisi azalır ve Antalya iftarı İstanbul'un önüne geçer. Diyanet bu konuyu ${h.src('kiyas', 'vakit kıyaslamaları')} sayfasında anlatır.</p>
<h2>Isparta, Burdur, Muğla, Mersin</h2>
<p>İlk gün Antalya'ya göre: Isparta'da iftar ${ab(isp)} dakika önce, Burdur'da aynı dakikada; batıda Muğla ${ab(mug)} dakika sonra, doğuda Mersin ${ab(mer)} dakika önce. Kıyı boyunca uzanan ilde Kaş ve Kemer gibi batı ilçelerinde akşam merkezden biraz geç, Alanya ve Gazipaşa tarafında biraz erken girer; ilçenizin saatini Diyanet'in ilçe takviminden kontrol edin. Göller bölgesinin ötesindeki ${h.a('imsakiye-konya', 'Konya imsakiyesi')}, Ege için ${h.a('imsakiye-izmir', 'İzmir imsakiyesi')}.</p>
${h.mini('im', { p: ['il'], d: { il: 'konya', yil: 2027 }, c: 'Konya ya da başka bir ilin takvimi' })}
<h2>Hesap ve resmi takvim</h2>
<p>Takvimdeki imsak, güneşin ufkun 18 derece altına indiği an; Diyanet bunu ${h.src('imsak', 'imsak vakti')} olarak tanımlar. Akşam vaktine ${h.src('temkin', '7 dakika temkin')} eklenir. Antalya'da bu yöntemle elde edilen dakikalar Diyanet takvimiyle ${h.pct(yuzde(d.oran))} oranında örtüşür; kalan farklar 1 dakikadır. Oruca başlama ve bitirme kararı için ${h.src('namazvakitleri', 'Diyanet\'in resmi takvimini')} kullanın; ayrıntı ${h.a('imsak-sahur-vakti', 'sahur vakti')} sayfasında.</p>
<h2>Kadir Gecesi ve bayram</h2>
<p>${h.wday(r.kadir)} akşamı iftar ${kad.aksam}, Kadir Gecesi o akşam başlar. Son oruç ${h.wday(r.son)}, bayramın ilk günü ${h.wday(r.bayram)}; tatil süresi ${h.a('ramazan-bayrami-2027', 'Ramazan Bayramı 2027')} sayfasında, geri sayım ${h.a('iftara-kac-dakika-kaldi', 'iftara kaç dakika kaldı')} sayfasında. Türkiye geneli: ${h.a('imsakiye-2027', 'imsakiye 2027')}.</p>
<h2>Antalya'da 2028 Ramazanı</h2>
<p>${h.wday(o28.r.ilk)} günü başlayan Ramazan 2028'de Antalya'nın ilk imsakı ${o28.ilk.imsak}, ilk iftarı ${o28.ilk.aksam}; oruç ${h.sure(o28.ilk.oruc, 'tr')} sürer. Son oruç ${h.wday(o28.r.son)}, iftar ${o28.son.aksam}.</p>`,
    },
    en: {
      slug: 'antalya-ramadan-times-2027', nav: 'Antalya Ramadan times', card: `Iftar as in Istanbul (${ilk.aksam}), suhoor ${ab(d.imf)} min earlier`,
      title: 'Antalya Ramadan times 2027: suhoor ends, iftar begins',
      description: `Antalya Ramadan 2027: first fast 8 February, imsak ${ilk.imsak}, iftar ${ilk.aksam}, a longer fast than Istanbul. Last fast ${gm(r.son, 'en')}, Qadr night ${gm(r.kadir, 'en')}, Eid ${gm(r.bayram, 'en')}.`,
      h1: `Antalya Ramadan 2027: suhoor until ${ilk.imsak}, iftar at ${ilk.aksam}`,
      intro: 'The 29-day Ramadan 2027 timetable computed for central Antalya: imsak, sunrise, iftar, isha and the length of each day\'s fast.',
      resume: `In Antalya the first fast of 2027 is on ${dShort(r.ilk, 'en')}. Suhoor ends at ${ilk.imsak}, iftar is at ${ilk.aksam} and the fast lasts ${su(ilk.oruc, 'en')}. The curious part: on day one iftar falls in the same minute as Istanbul, yet suhoor ends ${ab(d.imf)} minutes earlier, so Antalya's first fast is ${ilk.oruc - ist.ilk.oruc} minutes longer. By the end of the month the picture reverses. On ${dShort(r.son, 'en')} iftar is at ${son.aksam}, ${ab(d.fl)} minutes ahead of Istanbul, after a fast of ${su(son.oruc, 'en')}. Laylat al-Qadr is the evening of ${dShort(r.kadir, 'en')} (iftar ${kad.aksam}) and Eid al-Fitr is ${dShort(r.bayram, 'en')}. Every time here was worked out by this site with the Diyanet's parameters and compared with the Diyanet's Antalya calendar: ${d.enO} match exactly, the widest gap is 1 minute. For worship, the official Diyanet calendar is binding.`,
      faqs: [
        { q: 'Is iftar in Antalya at the same time as in Istanbul in 2027?', a: `On the first fast, ${dShort(r.ilk, 'en')}, yes: both are computed at ${ilk.aksam}. Antalya then pulls ahead, and on the last day its iftar at ${son.aksam} is ${ab(d.fl)} minutes before Istanbul. Dawn tells a different story: on day one imsak in Antalya is ${ab(d.imf)} minutes earlier. Mersin, further east, breaks the fast ${ab(mer)} minutes before Antalya.` },
        { q: 'Why is the fast longer in Antalya than in Istanbul?', a: `Antalya lies further south than Istanbul, and in late winter dawn comes earlier in the south. Imsak on day one is ${ab(d.imf)} minutes earlier, at ${ilk.imsak}, so the fast lasts ${su(ilk.oruc, 'en')} against ${su(ist.ilk.oruc, 'en')} in Istanbul. As the days lengthen the latitude effect wears off: on the last day the fast is ${su(son.oruc, 'en')} in Antalya and ${su(ist.son.oruc, 'en')} in Istanbul. The monthly average in Antalya is ${su(d.o.ortalama, 'en')}.` },
        { q: 'What day is Eid al-Fitr 2027 in Antalya?', a: `Eid al-Fitr begins on ${dShort(r.bayram, 'en')}; the date is the same in every province. The last fast is the day before, ${dShort(r.son, 'en')}, with iftar at ${son.aksam} in Antalya. Under Law 2429 the eve is a holiday from 13:00 and the three days of Eid are public holidays; a day falling on a weekend is not made up. Sunrise on Eid morning is at ${K.hhmm(K.ilVakit('antalya', r.bayram).gunes)}.` },
      ],
      body: (h) => `<h2>Same iftar, different fast: what latitude does</h2>
<p>Central Antalya (latitude ${h.n(x.lat, 2)}, longitude ${h.n(x.lng, 2)}) is about 4 degrees south and 1.7 degrees east of Istanbul. Being east pulls sunset earlier; being south in February pushes it slightly later. On day one the two effects cancel out and iftar lands in the same minute. In the morning they add up instead, and imsak comes ${ab(d.imf)} minutes earlier. The weekly comparison shows the balance shifting:</p>
${h.table(['Date', 'Antalya iftar', 'Istanbul iftar', 'Antalya fast', 'Istanbul fast'], hafta.map(({ z, ist: y }) => [h.wday(z.date), z.aksam, y.aksam, h.sure(z.oruc, 'en'), h.sure(y.oruc, 'en')]), 'Antalya and Istanbul, Ramadan 2027 (computed)')}
<p>As March approaches the equinox, day lengths even out, latitude matters less in the evening and Antalya's iftar moves ahead of Istanbul's. The Diyanet covers this on its ${h.src('kiyas', 'comparison page')}.</p>
<h2>Isparta, Burdur, Muğla, Mersin</h2>
<p>On day one, relative to Antalya: Isparta breaks the fast ${ab(isp)} minute earlier and Burdur in the same minute; Muğla to the west is ${ab(mug)} minutes later and Mersin to the east ${ab(mer)} minutes earlier. Along the coast, western districts such as Kaş and Kemer see sunset a little after the centre, and Alanya or Gazipaşa a little before, so check the Diyanet district calendar for your own. Beyond the lakes lies the ${h.a('imsakiye-konya', 'Konya timetable')}; on the Aegean, the ${h.a('imsakiye-izmir', 'Izmir timetable')}.</p>
${h.mini('im', { p: ['il'], d: { il: 'konya', yil: 2027 }, c: 'Timetable for Konya or another province' })}
<h2>Computed times and the official calendar</h2>
<p>Imsak here is the moment the sun reaches 18 degrees below the horizon, the Diyanet's definition of ${h.src('imsak', 'imsak')}. Sunset gets a ${h.src('temkin', '7-minute margin')}. In Antalya the minutes obtained this way agree with the Diyanet calendar ${h.pct(yuzde(d.oran))} of the time, with 1-minute gaps otherwise. Use the ${h.src('namazvakitleri', 'official Diyanet calendar')} to start and end your fast; the details are on ${h.a('imsak-sahur-vakti', 'suhoor time')}.</p>
<h2>Qadr night and Eid</h2>
<p>On the evening of ${h.wday(r.kadir)} iftar is at ${kad.aksam} and Laylat al-Qadr begins. The last fast is ${h.wday(r.son)} and the first day of Eid ${h.wday(r.bayram)}; days off are on ${h.a('ramazan-bayrami-2027', 'Eid al-Fitr 2027')}, a live clock on ${h.a('iftara-kac-dakika-kaldi', 'iftar countdown')}. Nationwide: ${h.a('imsakiye-2027', 'Ramadan timetable 2027')}.</p>
<h2>Ramadan 2028 in Antalya</h2>
<p>When Ramadan 2028 begins on ${h.wday(o28.r.ilk)}, Antalya's first imsak is ${o28.ilk.imsak} and its first iftar ${o28.ilk.aksam}, a fast of ${h.sure(o28.ilk.oruc, 'en')}. The last fast is ${h.wday(o28.r.son)}, iftar ${o28.son.aksam}.</p>`,
    },
  });
})();

/* ------------------------------------------------------------------ Konya */
const konya = (() => {
  const d = veri('konya'), { r, ilk, son, kad, o28, x } = d;
  const kar = fk('karaman', 'konya'), aks = fk('aksaray', 'konya'), nig = fk('nigde', 'konya'), ant = fk('antalya', 'konya'), ank = fk('ankara', 'konya');
  const imsSon = fi('konya', 'istanbul', r.son);
  const hafta = d.rows.filter((_, i) => i % 7 === 0);
  return defineGuide({
    id: 'imsakiye-konya', group: 'iller', order: 35, tool: 'im', toolArg: { il: 'konya', yil: 2027 }, countdown: CD,
    related: ['imsakiye-2027', 'ramazan-2027', 'kadir-gecesi-2027', 'iftara-kac-dakika-kaldi', 'imsakiye-ankara', 'imsakiye-antalya'],
    sources: SOURCES,
    tr: {
      slug: 'konya-imsakiye-2027', nav: 'Konya imsakiye', card: `İlk iftar ${ilk.aksam}, imsak Ankara'yla aynı: ${ilk.imsak}`,
      title: 'Konya imsakiye 2027: iftar vakti, sahur ve oruç süresi',
      description: `Konya imsakiye 2027: Ramazan 8 Şubat Pazartesi başlar; imsak ${ilk.imsak}, iftar ${ilk.aksam}. Son iftar ${gm(r.son, 'tr')} ${son.aksam}, Kadir Gecesi ${gm(r.kadir, 'tr')}, bayram ${gm(r.bayram, 'tr')}. Tam liste.`,
      h1: `Konya imsakiye 2027: ilk sahur ${ilk.imsak}, ilk iftar ${ilk.aksam}`,
      intro: 'Konya merkezinin Ramazan 2027 takvimi araçta: 29 günün her biri için imsak, güneş, iftar ve yatsı vakti ile orucun süresi.',
      resume: `Konya'da 2027 Ramazanı ${dShort(r.ilk, 'tr')} sabahı başlar. İlk gün sahur ${ilk.imsak} vaktinde biter, oruç ${ilk.aksam} vaktinde açılır ve ${su(ilk.oruc, 'tr')} sürer. İlk sahur ve ilk teravih bir önceki gece, ${dShort(d.arife, 'tr')} akşamından sonradır. Son oruç ${dShort(r.son, 'tr')} günü: imsak ${son.imsak}, iftar ${son.aksam}, süre ${su(son.oruc, 'tr')}. Kadir Gecesi ${dShort(r.kadir, 'tr')} akşamına denk gelir ve o gün iftar ${kad.aksam}; Ramazan Bayramı ${dShort(r.bayram, 'tr')} günü başlar. Konya'nın ilginç yanı, İstanbul'la arasındaki iki farkın ters yönde ilerlemesidir: iftar farkı ay boyunca ${ab(d.ff)} dakikadan ${ab(d.fl)} dakikaya büyür, imsak farkı ise ${ab(d.imf)} dakikadan ${ab(imsSon)} dakikaya küçülür. Vakitler Diyanet'in açı ve temkin değerleriyle sitede hesaplanır ve Diyanet'in Konya takvimiyle karşılaştırılır; aynı dakika oranı ${d.trO}, en büyük fark 1 dakika. Orucunuzu Diyanet'in resmi takvimine göre tutun.`,
      faqs: [
        { q: 'Konya\'da 2027\'de ilk iftar ve imsak saati nedir?', a: `${dShort(r.ilk, 'tr')} günü Konya'da imsak saat ${ilk.imsak}, iftar saat ${ilk.aksam}; ilk oruç ${su(ilk.oruc, 'tr')} sürer. İftar İstanbul'dan ${ab(d.ff)} dakika, imsak ${ab(d.imf)} dakika erkendir. İlk sahur, ${dShort(d.arife, 'tr')} akşamını izleyen gecededir. Hesaplanan vakitlerin ${d.trO} kadarı Diyanet'in Konya takvimiyle aynı dakikadır; ibadette yine de resmi takvim esas alınır.` },
        { q: 'Konya ile Ankara\'nın sahur saati aynı mı?', a: `İlk oruç günü evet: iki ilde de imsak saat ${ilk.imsak} olarak hesaplanır. Bu eşitlik sürmez; son gün Konya'da imsak Ankara'dan ${fi('konya', 'ankara', r.son)} dakika sonradır. İftarda Konya ilk gün ${ab(fk('konya', 'ankara'))} dakika geç kalır. Konya daha batıda olduğu için iki vakit de gecikir, daha güneyde olması ise kışın şafağı öne çeker; ilk gün sahurda bu iki etki birbirini dengeler.` },
        { q: 'Konya\'da Ramazan 2027 boyunca oruç kaç dakika uzuyor?', a: `${d.uzama} dakika: ilk gün ${su(ilk.oruc, 'tr')}, son gün ${su(son.oruc, 'tr')}. İmsak ${d.geri} dakika erkene, iftar ${d.ileri} dakika geçe kayar; ayın ortalama orucu ${su(d.o.ortalama, 'tr')}. Bu, günde ortalama ${(d.uzama / (r.gun - 1)).toFixed(1).replace('.', ',')} dakikalık bir artış demektir. Bir yıl sonra tablo değişir: 2028'de Ramazan ocakta başlar ve Konya'da ilk oruç ${su(o28.ilk.oruc, 'tr')} sürer.` },
      ],
      body: (h) => `<h2>İstanbul'a göre iki fark, iki ayrı yön</h2>
<p>Konya merkezi (enlem ${h.n(x.lat, 2)}, boylam ${h.n(x.lng, 2)}) İstanbul'dan hem doğuda hem de 3 dereceden fazla güneydedir. Boylam farkı her gün aynıdır ve iki vakti de erkene çeker. Enlem farkının etkisi ise mevsimle değişir: Şubat'ta günler güneyde daha uzundur, bu da sabahı daha da öne alırken akşamı biraz geciktirir. Ekinoksa yaklaştıkça bu etki zayıflar. Sonuç aşağıda:</p>
${h.table(['Tarih', 'İmsak', 'İftar', 'İmsak farkı', 'İftar farkı'], hafta.map((z) => [h.wday(z.date), z.imsak, z.aksam, fi('konya', 'istanbul', z.date), K.iftarFarki('konya', z.date)]), 'Konya, Ramazan 2027: hesaplanan vakitler ve İstanbul\'a göre fark (dakika, eksi = daha erken)')}
<p>Pratikte Konya'da sahur ay başında İstanbul'dan çeyrek saatten fazla önce biter; ay sonunda bu pay azalır. Diyanet aynı olguyu ${h.src('kiyas', 'vakit kıyaslamaları')} başlıklı sayfasında anlatır.</p>
<h2>Ankara'yla aynı imsak, farklı iftar</h2>
<p>İlk oruç günü Konya ile Ankara'nın imsakı aynı dakikaya düşer; buna karşılık iftar Konya'da ${ab(fk('konya', 'ankara'))} dakika geçtir. Ankara daha doğuda olduğu için akşamı erken yaşar, Konya daha güneyde olduğu için şafağı erken görür; iki etki sabah birbirini dengeler. Başkentin takvimi ${h.a('imsakiye-ankara', 'Ankara imsakiyesi')} sayfasında.</p>
<h2>Geniş bir il: ilçeler ve komşular</h2>
<p>Konya, yüz ölçümü en büyük ildir ve doğu–batı yönünde uzun bir alana yayılır. Akşehir ve Beyşehir gibi batı ilçelerinde akşam merkezden birkaç dakika geç, Ereğli tarafında birkaç dakika erken girer; kesin saat Diyanet'in ilçe takvimindedir. Komşu illerde ilk gün iftar, Konya'ya göre: Karaman ${ab(kar)}, Aksaray ${ab(aks)}, Niğde ${ab(nig)} dakika önce; Antalya ${ab(ant)} dakika sonra, Ankara ${ab(ank)} dakika önce.</p>
${h.mini('im', { p: ['il'], d: { il: 'antalya', yil: 2027 }, c: 'Antalya ya da başka bir ili açın' })}
<h2>Saatlerin güvenilirliği</h2>
<p>Hesapta ${h.src('imsak', 'imsak')} güneşin ufkun 18 derece altına indiği an, iftar gün batımı artı ${h.src('temkin', '7 dakika temkindir')}. Konya'nın 403 gününde bu yöntemle bulunan dakikaların ${h.pct(yuzde(d.oran))} kadarı Diyanet'inkiyle aynı çıktı, kalanında fark 1 dakika. İbadette ölçü ${h.src('namazvakitleri', 'Diyanet\'in resmi namaz vakitleridir')}.</p>
<h2>Kadir Gecesi, bayram ve Ocak 2028</h2>
<p>Kadir Gecesi ${h.wday(r.kadir)} iftarından (${kad.aksam}) sonra başlar: ${h.a('kadir-gecesi-2027', 'Kadir Gecesi 2027')}. Bayram ${h.wday(r.bayram)} (${h.a('ramazan-bayrami-2027', 'Ramazan Bayramı 2027')}). 2028'de oruç ${h.wday(o28.r.ilk)} günü başlar; Konya'da ilk imsak ${o28.ilk.imsak}, ilk iftar ${o28.ilk.aksam}, son iftar ${o28.son.aksam}. Diğer sayfalar: ${h.a('imsakiye-2027', 'imsakiye 2027')}, ${h.a('ramazan-2027', 'Ramazan 2027')}, ${h.a('imsak-sahur-vakti', 'sahur vakti')}, ${h.a('iftara-kac-dakika-kaldi', 'iftara kalan dakika')}.</p>`,
    },
    en: {
      slug: 'konya-ramadan-times-2027', nav: 'Konya Ramadan times', card: `First iftar ${ilk.aksam}, imsak equal to Ankara: ${ilk.imsak}`,
      title: 'Konya Ramadan times 2027: iftar, suhoor, length of fast',
      description: `Konya Ramadan 2027 begins Monday 8 February: imsak ${ilk.imsak}, iftar ${ilk.aksam}. Last iftar ${gm(r.son, 'en')} at ${son.aksam}, Qadr night ${gm(r.kadir, 'en')}, Eid ${gm(r.bayram, 'en')}. The full daily list.`,
      h1: `Konya Ramadan 2027: first suhoor ends ${ilk.imsak}, first iftar ${ilk.aksam}`,
      intro: 'Central Konya\'s Ramadan 2027 calendar is in the tool: imsak, sunrise, iftar and isha for all 29 days, and the length of every fast.',
      resume: `Ramadan 2027 starts in Konya on the morning of ${dShort(r.ilk, 'en')}. On day one suhoor ends at ${ilk.imsak} and the fast is broken at ${ilk.aksam}, after ${su(ilk.oruc, 'en')}. The first suhoor and first tarawih belong to the night before. The last fast is on ${dShort(r.son, 'en')}: imsak ${son.imsak}, iftar ${son.aksam}, ${su(son.oruc, 'en')}. Laylat al-Qadr is the evening of ${dShort(r.kadir, 'en')} (iftar ${kad.aksam}) and Eid al-Fitr begins on ${dShort(r.bayram, 'en')}. What makes Konya interesting is that its two gaps with Istanbul move in opposite directions: the iftar gap widens from ${ab(d.ff)} to ${ab(d.fl)} minutes over the month, while the imsak gap narrows from ${ab(d.imf)} to ${ab(imsSon)}. We compute the times with the Diyanet's angles and margins and compare them with the Diyanet's Konya calendar: ${d.enO} identical, never more than 1 minute apart. Keep your fast by the official Diyanet calendar.`,
      faqs: [
        { q: 'What are the first iftar and imsak times in Konya in 2027?', a: `On ${dShort(r.ilk, 'en')} Konya has imsak at ${ilk.imsak} and iftar at ${ilk.aksam}, a first fast of ${su(ilk.oruc, 'en')}. Iftar comes ${ab(d.ff)} minutes and imsak ${ab(d.imf)} minutes before Istanbul. The first suhoor is in the night after the evening of ${dShort(d.arife, 'en')}. ${d.enO} of the computed times match the Diyanet's Konya calendar to the minute; for worship the official calendar still prevails.` },
        { q: 'Do Konya and Ankara share the same suhoor time?', a: `On the first fast, yes: both are computed at ${ilk.imsak}. That does not last; on the last day imsak in Konya is ${fi('konya', 'ankara', r.son)} minutes after Ankara. At iftar Konya is ${ab(fk('konya', 'ankara'))} minutes behind on day one. Lying further west delays both times, while lying further south pulls winter dawn earlier; at suhoor on the first day the two effects cancel out.` },
        { q: 'By how much does the fast grow in Konya during Ramadan 2027?', a: `${d.uzama} minutes, from ${su(ilk.oruc, 'en')} to ${su(son.oruc, 'en')}. Imsak moves ${d.geri} minutes earlier and iftar ${d.ileri} minutes later; the average fast is ${su(d.o.ortalama, 'en')}. That works out at about ${(d.uzama / (r.gun - 1)).toFixed(1)} minutes more each day. A year later the picture changes: in 2028 Ramadan starts in January and the first fast in Konya lasts ${su(o28.ilk.oruc, 'en')}.` },
      ],
      body: (h) => `<h2>Two gaps with Istanbul, moving opposite ways</h2>
<p>Central Konya (latitude ${h.n(x.lat, 2)}, longitude ${h.n(x.lng, 2)}) lies east of Istanbul and more than 3 degrees south of it. The longitude offset is constant and pulls both times earlier. The latitude effect depends on the season: in February days are longer further south, which brings dawn even earlier but holds sunset back a little. Nearer the equinox that effect fades. The result:</p>
${h.table(['Date', 'Imsak', 'Iftar', 'Imsak gap', 'Iftar gap'], hafta.map((z) => [h.wday(z.date), z.imsak, z.aksam, fi('konya', 'istanbul', z.date), K.iftarFarki('konya', z.date)]), 'Konya, Ramadan 2027: computed times and gap with Istanbul (minutes, minus = earlier)')}
<p>In practice suhoor in Konya ends more than a quarter of an hour before Istanbul at the start of the month, and that margin shrinks by the end. The Diyanet describes the same pattern on its ${h.src('kiyas', 'comparison page')}.</p>
<h2>Same imsak as Ankara, different iftar</h2>
<p>On the first fast Konya and Ankara reach imsak in the same minute, yet Konya's iftar is ${ab(fk('konya', 'ankara'))} minutes later. Ankara, further east, sees sunset sooner; Konya, further south, sees dawn sooner, and in the morning the two effects balance out. The capital's calendar is on the ${h.a('imsakiye-ankara', 'Ankara timetable')}.</p>
<h2>A wide province: districts and neighbours</h2>
<p>Konya is Turkey's largest province by area and stretches a long way east to west. Western districts such as Akşehir and Beyşehir see sunset a few minutes after the centre, Ereğli a few minutes before; the Diyanet district calendar has the exact time. On day one, relative to Konya, iftar is ${ab(kar)} minutes earlier in Karaman, ${ab(aks)} in Aksaray, ${ab(nig)} in Niğde and ${ab(ank)} in Ankara, but ${ab(ant)} minutes later in Antalya.</p>
${h.mini('im', { p: ['il'], d: { il: 'antalya', yil: 2027 }, c: 'Open Antalya or another province' })}
<h2>How far to trust these times</h2>
<p>The calculation takes ${h.src('imsak', 'imsak')} as the sun 18 degrees below the horizon and iftar as sunset plus a ${h.src('temkin', '7-minute margin')}. Over 403 Konya days, ${h.pct(yuzde(d.oran))} of the minutes found this way equal the Diyanet's, the rest differ by 1. For worship the yardstick is the ${h.src('namazvakitleri', 'official Diyanet prayer times')}.</p>
<h2>Qadr night, Eid and January 2028</h2>
<p>Laylat al-Qadr starts after iftar (${kad.aksam}) on ${h.wday(r.kadir)}: ${h.a('kadir-gecesi-2027', 'Laylat al-Qadr 2027')}. Eid is ${h.wday(r.bayram)} (${h.a('ramazan-bayrami-2027', 'Eid al-Fitr 2027')}). In 2028 the fast begins on ${h.wday(o28.r.ilk)}; Konya's first imsak is ${o28.ilk.imsak}, first iftar ${o28.ilk.aksam}, last iftar ${o28.son.aksam}. See also ${h.a('imsakiye-2027', 'Ramadan timetable 2027')}, ${h.a('ramazan-2027', 'Ramadan 2027')}, ${h.a('imsak-sahur-vakti', 'suhoor time')} and ${h.a('iftara-kac-dakika-kaldi', 'minutes to iftar')}.</p>`,
    },
  });
})();

/* ------------------------------------------------------------------ Adana */
const adana = (() => {
  const d = veri('adana'), { r, ilk, son, kad, o28, x } = d;
  const mer = fk('mersin', 'adana'), osm = fk('osmaniye', 'adana'), hat = fk('hatay', 'adana'), kay = fk('kayseri', 'adana'), gaz = fk('gaziantep', 'adana');
  const uc = [r.ilk, r.kadir, r.son];
  const vk = (s: string, t: string) => K.ilVakit(s, t);
  return defineGuide({
    id: 'imsakiye-adana', group: 'iller', order: 36, tool: 'im', toolArg: { il: 'adana', yil: 2027 }, countdown: CD,
    related: ['imsakiye-2027', 'imsak-sahur-vakti', 'iftara-kac-dakika-kaldi', 'ramazan-bayrami-2027', 'imsakiye-gaziantep', 'imsakiye-konya'],
    sources: SOURCES,
    tr: {
      slug: 'adana-imsakiye-2027', nav: 'Adana imsakiye', card: `Sahur İstanbul'dan ${ab(d.imf)} dk önce biter, ilk iftar ${ilk.aksam}`,
      title: 'Adana imsakiye 2027: sahur bitişi ve iftar saati, gün gün',
      description: `Adana imsakiye 2027: ilk oruç 8 Şubat Pazartesi, sahur ${ilk.imsak} biter, iftar ${ilk.aksam}. Son oruç ${gm(r.son, 'tr')}, Kadir Gecesi ${gm(r.kadir, 'tr')} akşamı, bayram ${gm(r.bayram, 'tr')}. Tam liste.`,
      h1: `Adana imsakiye 2027: imsak ${ilk.imsak}, iftar ${ilk.aksam}`,
      intro: 'Araç, Adana merkezi için hesaplanmış Ramazan 2027 vakitlerini gün gün sunar: imsak, güneş, iftar, yatsı ve oruç süresi.',
      resume: `Adana'da 2027 Ramazanı ${dShort(r.ilk, 'tr')} günü başlar. İlk sabah imsak ${ilk.imsak}, akşam iftar ${ilk.aksam}; oruç ${su(ilk.oruc, 'tr')} sürer. Ayın son orucu ${dShort(r.son, 'tr')} günü tutulur: sahur ${son.imsak} vaktinde biter, iftar ${son.aksam} vaktindedir, oruç ${su(son.oruc, 'tr')}. Kadir Gecesi ${dShort(r.kadir, 'tr')} akşamıdır ve o gün Adana'da iftar ${kad.aksam}. Bayramın ilk günü ${dShort(r.bayram, 'tr')}. Çukurova'da sahur, İstanbul'a göre iftardan daha büyük bir farkla erken biter: ilk gün imsak ${ab(d.imf)} dakika, iftar ise ${ab(d.ff)} dakika öndedir. Bu iki fark ay sonunda birbirine yaklaşır. Saatler sitede Diyanet'in ölçüleriyle hesaplanmıştır ve Diyanet'in Adana takvimiyle kıyaslanmıştır; tam uyum ${d.trO}, olası fark yalnızca 1 dakika. Orucu başlatırken ve açarken resmi Diyanet takvimini esas alın. Adana'da ortalama oruç ${su(d.o.ortalama, 'tr')} sürer.`,
      faqs: [
        { q: 'Adana\'da 2027 Ramazanında sahur kaçta bitiyor?', a: `İlk gün, ${dShort(r.ilk, 'tr')}, Adana'da imsak saat ${ilk.imsak}; son gün, ${dShort(r.son, 'tr')}, saat ${son.imsak}. Sahur yemeği imsaktan önce bitmelidir. Ay boyunca imsak ${d.geri} dakika erkene kayar. Adana İstanbul'dan ${ab(d.imf)} dakika önce imsak eder: hem daha doğuda hem daha güneydedir, iki etki de kışın şafağı öne alır. Hesap ile Diyanet takviminin aynı dakikaya düşme oranı ${d.trO}.` },
        { q: 'Adana ile Mersin arasında iftar farkı var mı?', a: `Var ama küçüktür: ilk gün Mersin'de iftar Adana'dan ${ab(mer)} dakika sonra açılır, çünkü Mersin batıdadır. Doğudaki Osmaniye ${ab(osm)}, Hatay ${ab(hat)} dakika önce iftar eder. Birkaç dakikalık bu farklar iller arasında yolculuk yaparken önem kazanır: iftarı hangi ilde açacaksanız o ilin saatine bakın. Sayfadaki araçta ili değiştirerek iki takvimi ayrı ayrı görebilirsiniz.` },
        { q: 'Adana\'da Kadir Gecesi 2027\'de iftar saat kaçta?', a: `Kadir Gecesi ${dShort(r.kadir, 'tr')} akşamıdır ve o günün iftarından sonra başlar. O gün Adana'da imsak saat ${kad.imsak}, iftar saat ${kad.aksam}, yatsı saat ${kad.yatsi} olarak hesaplanır. Aynı akşam Adana, İstanbul'dan ${ab(K.iftarFarki('adana', r.kadir))} dakika önce iftar eder. Kadir Gecesi'nden sonra ${d.rows.length - d.rows.indexOf(kad) - 1} oruç daha kalır; son oruç ${dShort(r.son, 'tr')} günüdür.` },
      ],
      body: (h) => `<h2>Çukurova'da sahur neden bu kadar erken?</h2>
<p>Adana merkezi (enlem ${h.n(x.lat, 2)}, boylam ${h.n(x.lng, 2)}) İstanbul'dan 6 dereceden fazla doğuda ve 4 derece güneydedir. Doğuda olmak hem imsakı hem iftarı öne çeker; dereceye 4 dakika hesabıyla bu yaklaşık yarım saate yakın bir etkidir. Güneyde olmak ise kış sonunda şafağı daha da öne alır, akşamı biraz geciktirir. Bu yüzden imsak farkı iftar farkından büyüktür. Ekinoksa yaklaştıkça enlem etkisi zayıflar ve iki fark birbirine yaklaşır:</p>
${h.table(['Gün', 'Adana imsak', 'İstanbul imsak', 'Adana iftar', 'İstanbul iftar'], uc.map((t) => [h.wday(t), h.hhmm(vk('adana', t).imsak), h.hhmm(vk('istanbul', t).imsak), h.hhmm(vk('adana', t).aksam), h.hhmm(vk('istanbul', t).aksam)]), 'Adana ve İstanbul: ilk gün, Kadir Gecesi ve son gün (hesaplanan)')}
<p>İstanbul'dan Adana'ya ya da tersi yönde seyahat edenler için sahur alarmını ayarlarken bu farkı unutmamak gerekir. ${h.a('imsak-sahur-vakti', 'İmsak ve sahur vakti')} sayfası imsakın tam olarak neyi ifade ettiğini anlatır.</p>
<h2>Mersin, Osmaniye, Hatay ve ötesi</h2>
<p>İlk oruç günü Adana'ya göre iftar: Mersin ${ab(mer)} dakika sonra; Osmaniye ${ab(osm)}, Hatay ${ab(hat)}, Kayseri ${ab(kay)}, Gaziantep ${ab(gaz)} dakika önce. İl içinde Pozantı ve Karaisalı tarafı merkezin batısında kalır ve biraz geç iftar eder; Ceyhan ve Kozan doğuda olduğundan biraz erken. İlçe takvimi için Diyanet'e bakın. Doğudaki büyükşehrin tam listesi ${h.a('imsakiye-gaziantep', 'Gaziantep imsakiyesi')}, İç Anadolu için ${h.a('imsakiye-konya', 'Konya imsakiyesi')}.</p>
${h.mini('im', { p: ['il'], d: { il: 'gaziantep', yil: 2027 }, c: 'Gaziantep ile karşılaştırın' })}
<h2>Diyanet takvimiyle ne kadar örtüşüyor?</h2>
<p>Bu takvim Diyanet'in tanımlarını izler: ${h.src('imsak', 'imsak')} için güneş ufkun 18 derece altında, akşam için gün batımına ${h.src('temkin', '7 dakika temkin')} eklenir. Adana'da 2026 sonu ile 2027 sonu arasındaki tüm günler resmi takvimle karşılaştırıldı; ${h.pct(yuzde(d.oran))} uyum, en fazla 1 dakika fark. Ezan ve oruç için yine de ${h.src('namazvakitleri', 'Diyanet\'in resmi takvimi')} esastır.</p>
<h2>Son on gün, bayram, 2028</h2>
<p>Kadir Gecesi ${h.wday(r.kadir)} akşamıdır (${h.a('kadir-gecesi-2027', 'Kadir Gecesi 2027')}). Son iftar ${h.wday(r.son)} ${son.aksam}, bayram ${h.wday(r.bayram)}: ${h.a('ramazan-bayrami-2027', 'Ramazan Bayramı 2027')}. Bir sonraki yıl Ramazan ${h.wday(o28.r.ilk)} günü başlar; Adana'da ilk gün imsak ${o28.ilk.imsak}, iftar ${o28.ilk.aksam}, oruç ${h.sure(o28.ilk.oruc, 'tr')}. Canlı sayaç: ${h.a('iftara-kac-dakika-kaldi', 'iftara kaç dakika kaldı')}; tüm iller: ${h.a('imsakiye-2027', 'imsakiye 2027')}; ay takvimi: ${h.a('ramazan-2027', 'Ramazan 2027')}.</p>`,
    },
    en: {
      slug: 'adana-ramadan-times-2027', nav: 'Adana Ramadan times', card: `Suhoor ends ${ab(d.imf)} min before Istanbul; first iftar ${ilk.aksam}`,
      title: 'Adana Ramadan times 2027: suhoor end and iftar, daily',
      description: `Adana Ramadan 2027: first fast Monday 8 February, suhoor ends ${ilk.imsak}, iftar at ${ilk.aksam}. Last fast ${gm(r.son, 'en')}, Qadr night the evening of ${gm(r.kadir, 'en')}, Eid ${gm(r.bayram, 'en')}.`,
      h1: `Adana Ramadan 2027: imsak ${ilk.imsak}, iftar ${ilk.aksam}`,
      intro: 'The tool gives the computed Ramadan 2027 times for central Adana day by day: imsak, sunrise, iftar, isha and the length of the fast.',
      resume: `Ramadan 2027 begins in Adana on ${dShort(r.ilk, 'en')}. Imsak that first morning is ${ilk.imsak}, iftar ${ilk.aksam}, and the fast lasts ${su(ilk.oruc, 'en')}. The last fast falls on ${dShort(r.son, 'en')}: suhoor ends at ${son.imsak}, iftar is at ${son.aksam}, a fast of ${su(son.oruc, 'en')}. Laylat al-Qadr is the evening of ${dShort(r.kadir, 'en')}, with iftar at ${kad.aksam}, and Eid starts on ${dShort(r.bayram, 'en')}. On the Çukurova plain suhoor ends earlier relative to Istanbul than iftar does: on day one imsak is ${ab(d.imf)} minutes ahead, iftar only ${ab(d.ff)}. The two gaps converge by the end of the month. These times were calculated on this site with the Diyanet's parameters and compared with the Diyanet's Adana calendar: ${d.enO} exact matches, and any difference is just 1 minute. Base the start and end of your fast on the official Diyanet calendar. The average fast in Adana lasts ${su(d.o.ortalama, 'en')}.`,
      faqs: [
        { q: 'What time does suhoor end in Adana in Ramadan 2027?', a: `On the first day, ${dShort(r.ilk, 'en')}, imsak in Adana is ${ilk.imsak}; on the last day, ${dShort(r.son, 'en')}, it is ${son.imsak}. The meal must be finished before imsak, which moves ${d.geri} minutes earlier over the month. Adana reaches imsak ${ab(d.imf)} minutes before Istanbul: it lies both further east and further south, and both pull winter dawn earlier. ${d.enO} of the computed times match the Diyanet calendar to the minute.` },
        { q: 'Is there an iftar difference between Adana and Mersin?', a: `A small one: on day one Mersin breaks the fast ${ab(mer)} minutes after Adana, because it lies further west. Osmaniye to the east is ${ab(osm)} minutes earlier and Hatay ${ab(hat)} minutes earlier. These few minutes matter when you travel between provinces: check the time of the province where you will actually break the fast. The tool on this page lets you switch province to see each timetable.` },
        { q: 'What time is iftar in Adana on Laylat al-Qadr 2027?', a: `Laylat al-Qadr is the evening of ${dShort(r.kadir, 'en')} and begins after that day's iftar. Adana has imsak at ${kad.imsak}, iftar at ${kad.aksam} and yatsı at ${kad.yatsi} that day. That evening Adana breaks the fast ${ab(K.iftarFarki('adana', r.kadir))} minutes before Istanbul. ${d.rows.length - d.rows.indexOf(kad) - 1} more fasts remain after the night; the last is on ${dShort(r.son, 'en')}.` },
      ],
      body: (h) => `<h2>Why suhoor ends so early on the Çukurova plain</h2>
<p>Central Adana (latitude ${h.n(x.lat, 2)}, longitude ${h.n(x.lng, 2)}) lies more than 6 degrees east and 4 degrees south of Istanbul. Being east brings both imsak and iftar forward; at 4 minutes a degree that is close to half an hour. Being south in late winter pushes dawn even earlier and holds sunset back a little. So the imsak gap is larger than the iftar gap, and as the equinox approaches the latitude effect fades and the two gaps draw together:</p>
${h.table(['Day', 'Adana imsak', 'Istanbul imsak', 'Adana iftar', 'Istanbul iftar'], uc.map((t) => [h.wday(t), h.hhmm(vk('adana', t).imsak), h.hhmm(vk('istanbul', t).imsak), h.hhmm(vk('adana', t).aksam), h.hhmm(vk('istanbul', t).aksam)]), 'Adana and Istanbul: first day, Qadr night and last day (computed)')}
<p>Anyone travelling between the two cities should keep this in mind when setting a suhoor alarm. The ${h.a('imsak-sahur-vakti', 'imsak and suhoor')} page explains what imsak means exactly.</p>
<h2>Mersin, Osmaniye, Hatay and beyond</h2>
<p>On the first fast, relative to Adana, iftar is ${ab(mer)} minutes later in Mersin and earlier by ${ab(osm)} minutes in Osmaniye, ${ab(hat)} in Hatay, ${ab(kay)} in Kayseri and ${ab(gaz)} in Gaziantep. Within the province, Pozantı and Karaisalı lie west of the centre and break the fast slightly later, while Ceyhan and Kozan to the east do so slightly earlier; the Diyanet district calendar has their times. The big city to the east has its own ${h.a('imsakiye-gaziantep', 'Gaziantep timetable')}, and Central Anatolia the ${h.a('imsakiye-konya', 'Konya timetable')}.</p>
${h.mini('im', { p: ['il'], d: { il: 'gaziantep', yil: 2027 }, c: 'Compare with Gaziantep' })}
<h2>How closely does it follow the Diyanet?</h2>
<p>The timetable follows the Diyanet's definitions: for ${h.src('imsak', 'imsak')} the sun is 18 degrees below the horizon, and sunset gets a ${h.src('temkin', '7-minute margin')}. Every Adana day from late 2026 to late 2027 was compared with the official calendar: ${h.pct(yuzde(d.oran))} agreement, at most 1 minute apart. For the call to prayer and the fast, the ${h.src('namazvakitleri', 'official Diyanet calendar')} still rules.</p>
<h2>The last ten days, Eid and 2028</h2>
<p>Laylat al-Qadr is the evening of ${h.wday(r.kadir)} (${h.a('kadir-gecesi-2027', 'Laylat al-Qadr 2027')}). The last iftar is on ${h.wday(r.son)} at ${son.aksam}, and Eid is ${h.wday(r.bayram)}: ${h.a('ramazan-bayrami-2027', 'Eid al-Fitr 2027')}. The following year Ramadan opens on ${h.wday(o28.r.ilk)}; Adana's first imsak is ${o28.ilk.imsak} and iftar ${o28.ilk.aksam}, a fast of ${h.sure(o28.ilk.oruc, 'en')}. Live clock: ${h.a('iftara-kac-dakika-kaldi', 'minutes to iftar')}; every province: ${h.a('imsakiye-2027', 'Ramadan timetable 2027')}; the month: ${h.a('ramazan-2027', 'Ramadan 2027')}.</p>`,
    },
  });
})();

/* ------------------------------------------------------------------ Gaziantep */
const gaziantep = (() => {
  const d = veri('gaziantep'), { r, ilk, son, kad, o28, x } = d;
  const urf = fk('sanliurfa', 'gaziantep'), kil = fk('kilis', 'gaziantep'), mar = fk('kahramanmaras', 'gaziantep'), ady = fk('adiyaman', 'gaziantep'), ada = fk('adana', 'gaziantep');
  const son10 = d.rows.slice(-10);
  const ist = veri('istanbul');
  return defineGuide({
    id: 'imsakiye-gaziantep', group: 'iller', order: 37, tool: 'im', toolArg: { il: 'gaziantep', yil: 2027 }, countdown: CD,
    related: ['imsakiye-2027', 'kadir-gecesi-2027', 'ramazan-bayrami-2027', 'iftara-kac-dakika-kaldi', 'imsakiye-adana', 'imsakiye-diyarbakir'],
    sources: SOURCES,
    tr: {
      slug: 'gaziantep-imsakiye-2027', nav: 'Gaziantep imsakiye', card: `İlk iftar ${ilk.aksam}; son on gün ve Kadir Gecesi tablosu`,
      title: 'Gaziantep imsakiye 2027: iftar ve sahur, son on gün listesi',
      description: `Gaziantep imsakiye 2027: Ramazan 8 Şubat Pazartesi başlar, imsak ${ilk.imsak}, iftar ${ilk.aksam}. Kadir Gecesi ${gm(r.kadir, 'tr')} akşamı, son oruç ${gm(r.son, 'tr')}, bayram ${gm(r.bayram, 'tr')}. Tam liste.`,
      h1: `Gaziantep imsakiye 2027: ilk iftar ${ilk.aksam}, Kadir Gecesi iftarı ${kad.aksam}`,
      intro: 'Gaziantep merkezi için Ramazan 2027 takvimi araçta eksiksiz: her gün imsak, güneş doğuşu, iftar, yatsı ve oruç süresi.',
      resume: `Gaziantep'te 2027'nin ilk orucu ${dShort(r.ilk, 'tr')} günüdür; imsak ${ilk.imsak}, iftar ${ilk.aksam}, oruç ${su(ilk.oruc, 'tr')}. Antep'te akşam İstanbul'dan ${ab(d.ff)} dakika önce girer, ay sonunda fark ${ab(d.fl)} dakikaya ulaşır. Son oruç ${dShort(r.son, 'tr')} günü: imsak ${son.imsak}, iftar ${son.aksam}, süre ${su(son.oruc, 'tr')}. Kadir Gecesi ${dShort(r.kadir, 'tr')} akşamı, o gün iftar ${kad.aksam}; bayramın birinci günü ${dShort(r.bayram, 'tr')}. Güneyde olduğu için Gaziantep'te ortalama oruç ${su(d.o.ortalama, 'tr')} sürer, bu da İstanbul'dan ${d.o.ortalama - ist.o.ortalama} dakika fazladır. Tablolardaki saatler Diyanet'in ölçüleri uygulanarak sitede hesaplandı; ardından Diyanet'in Gaziantep takvimiyle gün gün karşılaştırıldı. Dakikası dakikasına uyum ${d.trO}, sapma hiçbir zaman 1 dakikayı geçmiyor. Oruca başlarken ve açarken Diyanet'in resmi takvimi geçerlidir. İlk teravih ${dShort(d.arife, 'tr')} akşamı kılınır, ilk sahur da aynı gecenin sonundadır.`,
      faqs: [
        { q: 'Gaziantep\'te 2027 Ramazanının ilk iftarı kaçta?', a: `${dShort(r.ilk, 'tr')} akşamı Gaziantep'te iftar saat ${ilk.aksam}, aynı sabah imsak saat ${ilk.imsak}. İlk oruç ${su(ilk.oruc, 'tr')} sürer; İstanbul'daki ilk orucun ${su(ist.ilk.oruc, 'tr')} olduğu düşünülürse ${ilk.oruc - ist.ilk.oruc} dakika daha uzundur. Ay boyunca iftar ${d.ileri} dakika ileri kayar ve son gün saat ${son.aksam} olur. Hesaplanan vakitlerin Diyanet takvimiyle uyumu ${d.trO}.` },
        { q: 'Gaziantep ile Şanlıurfa arasında iftar farkı kaç dakika?', a: `İlk oruç günü Şanlıurfa'da iftar Gaziantep'ten ${ab(urf)} dakika önce açılır; Şanlıurfa daha doğudadır ve boylamdaki her derece yaklaşık 4 dakika eder. Son gün bu fark ${ab(fk('sanliurfa', 'gaziantep', r.son))} dakikadır. Adıyaman ${ab(ady)} dakika önce iftar eder. Kilis ve Kahramanmaraş ise Gaziantep'le neredeyse aynıdır: ilk gün Kilis'te iftar ${ab(kil)}, Kahramanmaraş'ta ${ab(mar)} dakika sonra açılır.` },
        { q: 'Gaziantep\'te Ramazan Bayramı 2027 sabahı güneş kaçta doğar?', a: `Bayramın ilk günü, ${dShort(r.bayram, 'tr')}, Gaziantep'te güneş saat ${K.hhmm(K.ilVakit('gaziantep', r.bayram).gunes)} vaktinde doğar (hesaplanan); aynı sabah imsak saat ${K.hhmm(K.ilVakit('gaziantep', r.bayram).imsak)}. Bir gün önceki son iftar saat ${son.aksam}. Tatil, 2429 sayılı Kanun'a göre arefe günü saat 13.00'te başlar ve bayramın üç gününü kapsar. Ay boyunca güneş doğuşu ${K.hhmm(K.ilVakit('gaziantep', r.ilk).gunes)} vaktinden bu saate gelmiştir.` },
      ],
      body: (h) => `<h2>Son on gün ve Kadir Gecesi</h2>
<p>Ramazanın son on günü itikâf ve Kadir Gecesi nedeniyle en yoğun dönemdir. Gaziantep için bu on günün hesaplanan saatleri aşağıda; Kadir Gecesi işaretli satırın akşamıdır.</p>
${h.table(['Gün', 'Tarih', 'İmsak', 'İftar', 'Yatsı', 'Oruç'], son10.map((z) => [z.gun, h.wday(z.date) + (z.kadir ? ' (Kadir Gecesi)' : ''), z.imsak, z.aksam, z.yatsi, h.sure(z.oruc, 'tr')]), 'Gaziantep, Ramazan 2027\'nin son on günü (hesaplanan, Türkiye saati)')}
<p>Kadir Gecesi Diyanet listesindeki tarihin akşamıdır, yani ${h.wday(r.kadir)} iftarından sonra başlar. Ayrıntı ${h.a('kadir-gecesi-2027', 'Kadir Gecesi 2027')} sayfasında; bayram tatili ${h.a('ramazan-bayrami-2027', 'Ramazan Bayramı 2027')} sayfasında.</p>
<h2>Antep ve çevresi: Kilis, Maraş, Urfa, Adıyaman</h2>
<p>Gaziantep merkezi enlem ${h.n(x.lat, 2)}, boylam ${h.n(x.lng, 2)} noktasındadır. İlk gün çevre illerde iftar, Gaziantep'e göre: Kilis ${ab(kil)}, Kahramanmaraş ${ab(mar)} dakika sonra; Adıyaman ${ab(ady)}, Şanlıurfa ${ab(urf)} dakika önce. Batıdaki Adana ${ab(ada)} dakika geriden gelir. İl içinde İslahiye merkezin batısında olduğundan biraz geç, Nizip doğuda olduğundan biraz erken iftar eder; boylamda her derece yaklaşık 4 dakikadır. İlçe saatleri Diyanet'in ilçe takvimindedir. Komşu büyükşehirler: ${h.a('imsakiye-adana', 'Adana imsakiyesi')}, ${h.a('imsakiye-diyarbakir', 'Diyarbakır imsakiyesi')}.</p>
${h.mini('im', { p: ['il'], d: { il: 'diyarbakir', yil: 2027 }, c: 'Diyarbakır veya başka bir il' })}
<h2>Güneyde oruç neden daha uzun?</h2>
<p>Kış sonunda güneydeki şehirlerde gün daha uzundur: şafak erken söker, güneş biraz geç batar. Gaziantep'in ilk orucu bu yüzden İstanbul'dakinden uzundur; Mart'a doğru gün ile gece eşitlendikçe fark kapanır ve son gün süreler neredeyse aynıdır (Gaziantep ${h.sure(son.oruc, 'tr')}, İstanbul ${h.sure(ist.son.oruc, 'tr')}). Diyanet bu etkiyi ${h.src('kiyas', 'vakit kıyaslamaları')} sayfasında açıklar.</p>
<h2>Hesap yöntemi ve resmi takvim</h2>
<p>İmsak, güneşin ufkun 18 derece altına indiği andır (${h.src('imsak', 'Diyanet: imsak vakti')}); iftar, gün batımına eklenen ${h.src('temkin', '7 dakikalık temkinle')} bulunur. Gaziantep'in hesaplanan saatleri Diyanet takvimiyle ${h.pct(yuzde(d.oran))} oranında aynı; kalan günlerde fark 1 dakika. İbadet için ${h.src('namazvakitleri', 'Diyanet\'in resmi takvimine')} uyun. Anlık geri sayım: ${h.a('iftara-kac-dakika-kaldi', 'iftara kaç dakika kaldı')}.</p>
<h2>2028'de Gaziantep</h2>
<p>Ramazan 2028 ${h.wday(o28.r.ilk)} günü başlar; Gaziantep'te ilk imsak ${o28.ilk.imsak}, ilk iftar ${o28.ilk.aksam}, son iftar ${o28.son.aksam}. Tüm iller için ${h.a('imsakiye-2027', 'imsakiye 2027')}, Ramazan takvimi için ${h.a('ramazan-2027', 'Ramazan 2027')}, sahur kuralları için ${h.a('imsak-sahur-vakti', 'imsak ve sahur vakti')}.</p>`,
    },
    en: {
      slug: 'gaziantep-ramadan-times-2027', nav: 'Gaziantep Ramadan times', card: `First iftar ${ilk.aksam}; the last ten days and Qadr night`,
      title: 'Gaziantep Ramadan times 2027: iftar, suhoor, last 10 days',
      description: `Gaziantep Ramadan 2027 starts Monday 8 February: imsak ${ilk.imsak}, iftar ${ilk.aksam}. Qadr night the evening of ${gm(r.kadir, 'en')}, last fast ${gm(r.son, 'en')}, Eid ${gm(r.bayram, 'en')}. Full list.`,
      h1: `Gaziantep Ramadan 2027: first iftar ${ilk.aksam}, Qadr night iftar ${kad.aksam}`,
      intro: 'The complete Ramadan 2027 calendar for central Gaziantep is in the tool: imsak, sunrise, iftar, isha and fast length for every day.',
      resume: `Gaziantep's first fast of 2027 is on ${dShort(r.ilk, 'en')}: imsak ${ilk.imsak}, iftar ${ilk.aksam}, ${su(ilk.oruc, 'en')} of fasting. Sunset there comes ${ab(d.ff)} minutes before Istanbul, and the gap reaches ${ab(d.fl)} minutes by the end of the month. The last fast is on ${dShort(r.son, 'en')}: imsak ${son.imsak}, iftar ${son.aksam}, ${su(son.oruc, 'en')}. Laylat al-Qadr is the evening of ${dShort(r.kadir, 'en')}, with iftar at ${kad.aksam}, and the first day of Eid is ${dShort(r.bayram, 'en')}. Because it lies in the south, Gaziantep's average fast is ${su(d.o.ortalama, 'en')}, ${d.o.ortalama - ist.o.ortalama} minutes more than Istanbul's. The times in these tables were worked out on this site by applying the Diyanet's parameters, then compared day by day with the Diyanet's Gaziantep calendar. They agree to the minute ${d.enO} of the time and never more than 1 minute apart. The official Diyanet calendar governs the start and end of the fast.`,
      faqs: [
        { q: 'What time is the first iftar in Gaziantep in Ramadan 2027?', a: `${ilk.aksam} on ${dShort(r.ilk, 'en')}, with imsak at ${ilk.imsak} that morning. The first fast lasts ${su(ilk.oruc, 'en')}, ${ilk.oruc - ist.ilk.oruc} minutes longer than Istanbul's first fast of ${su(ist.ilk.oruc, 'en')}. Over the month iftar moves ${d.ileri} minutes later and reaches ${son.aksam} on the last day. ${d.enO} of the computed times agree with the Diyanet calendar to the minute.` },
        { q: 'How many minutes apart are iftar in Gaziantep and Şanlıurfa?', a: `On the first fast Şanlıurfa breaks its fast ${ab(urf)} minutes before Gaziantep: it lies further east, and each degree of longitude is worth about 4 minutes. On the last day the gap is ${ab(fk('sanliurfa', 'gaziantep', r.son))} minutes. Adıyaman has iftar ${ab(ady)} minutes earlier. Kilis and Kahramanmaraş are almost the same as Gaziantep: on day one Kilis is ${ab(kil)} minute and Kahramanmaraş ${ab(mar)} minute later.` },
        { q: 'What time is sunrise in Gaziantep on Eid morning 2027?', a: `On the first day of Eid, ${dShort(r.bayram, 'en')}, the sun rises in Gaziantep at ${K.hhmm(K.ilVakit('gaziantep', r.bayram).gunes)} (computed), with imsak at ${K.hhmm(K.ilVakit('gaziantep', r.bayram).imsak)} that morning. The last iftar the evening before is at ${son.aksam}. Under Law 2429 the holiday starts at 13:00 on the eve and covers the three days of Eid. Over the month sunrise has moved from ${K.hhmm(K.ilVakit('gaziantep', r.ilk).gunes)} to this time.` },
      ],
      body: (h) => `<h2>The last ten days and Laylat al-Qadr</h2>
<p>The final ten days of Ramadan, with retreat (itikaf) and the night of Qadr, are the most intense. Here are Gaziantep's computed times for those days; Laylat al-Qadr is the evening of the marked row.</p>
${h.table(['Day', 'Date', 'Imsak', 'Iftar', 'Isha', 'Fast'], son10.map((z) => [z.gun, h.wday(z.date) + (z.kadir ? ' (Qadr night)' : ''), z.imsak, z.aksam, z.yatsi, h.sure(z.oruc, 'en')]), 'Gaziantep, the last ten days of Ramadan 2027 (computed, Turkey time)')}
<p>Laylat al-Qadr is the evening of the date in the Diyanet list, so it starts after iftar on ${h.wday(r.kadir)}. More on ${h.a('kadir-gecesi-2027', 'Laylat al-Qadr 2027')}; the holiday is on ${h.a('ramazan-bayrami-2027', 'Eid al-Fitr 2027')}.</p>
<h2>Around Antep: Kilis, Maraş, Urfa, Adıyaman</h2>
<p>Central Gaziantep sits at latitude ${h.n(x.lat, 2)}, longitude ${h.n(x.lng, 2)}. On day one, relative to Gaziantep, iftar is ${ab(kil)} minute later in Kilis and ${ab(mar)} in Kahramanmaraş, but ${ab(ady)} minutes earlier in Adıyaman and ${ab(urf)} in Şanlıurfa. Adana to the west trails by ${ab(ada)} minutes. Within the province, İslahiye lies west of the centre and breaks the fast a little later, Nizip to the east a little earlier, at roughly 4 minutes per degree of longitude. District times are in the Diyanet district calendars. Neighbouring big cities: ${h.a('imsakiye-adana', 'Adana timetable')}, ${h.a('imsakiye-diyarbakir', 'Diyarbakır timetable')}.</p>
${h.mini('im', { p: ['il'], d: { il: 'diyarbakir', yil: 2027 }, c: 'Diyarbakır or any other province' })}
<h2>Why fasts run longer in the south</h2>
<p>In late winter, days are longer in southern cities: dawn breaks earlier and the sun sets a bit later. That is why Gaziantep's first fast is longer than Istanbul's. Towards March, as day and night even out, the gap closes, and on the last day the two are almost equal (Gaziantep ${h.sure(son.oruc, 'en')}, Istanbul ${h.sure(ist.son.oruc, 'en')}). The Diyanet explains the effect on its ${h.src('kiyas', 'comparison page')}.</p>
<h2>Method and the official calendar</h2>
<p>Imsak is when the sun reaches 18 degrees below the horizon (${h.src('imsak', 'Diyanet on imsak')}); iftar is sunset plus a ${h.src('temkin', '7-minute margin')}. Gaziantep's computed times match the Diyanet calendar ${h.pct(yuzde(d.oran))} of the time, 1 minute off otherwise. For worship follow the ${h.src('namazvakitleri', 'official Diyanet calendar')}. Live countdown: ${h.a('iftara-kac-dakika-kaldi', 'minutes to iftar')}.</p>
<h2>Gaziantep in 2028</h2>
<p>Ramadan 2028 opens on ${h.wday(o28.r.ilk)}; Gaziantep's first imsak is ${o28.ilk.imsak}, first iftar ${o28.ilk.aksam} and last iftar ${o28.son.aksam}. Every province: ${h.a('imsakiye-2027', 'Ramadan timetable 2027')}; the month: ${h.a('ramazan-2027', 'Ramadan 2027')}; suhoor rules: ${h.a('imsak-sahur-vakti', 'imsak and suhoor time')}.</p>`,
    },
  });
})();

/* ------------------------------------------------------------------ Diyarbakır */
const diyarbakir = (() => {
  const d = veri('diyarbakir'), { r, ilk, son, kad, o28, x } = d;
  const bat = fk('batman', 'diyarbakir'), mar = fk('mardin', 'diyarbakir'), ela = fk('elazig', 'diyarbakir'), urf = fk('sanliurfa', 'diyarbakir'), erz = fk('erzurum', 'diyarbakir');
  const ornekSatir = (l: 'tr' | 'en') => [r.ilk, r.son].flatMap((t) => { const v = K.ilVakit('diyarbakir', t); return [[K.hhmm(v.imsak), d.ornek[t].imsak, l === 'tr' ? 'İmsak' : 'Imsak', t], [K.hhmm(v.aksam), d.ornek[t].aksam, l === 'tr' ? 'İftar' : 'Iftar', t]]; });
  const sapma = [r.ilk, r.son].flatMap((t) => { const v = K.ilVakit('diyarbakir', t); return [d.ornek[t].imsak !== K.hhmm(v.imsak), d.ornek[t].aksam !== K.hhmm(v.aksam)]; }).filter(Boolean).length;
  return defineGuide({
    id: 'imsakiye-diyarbakir', group: 'iller', order: 38, tool: 'im', toolArg: { il: 'diyarbakir', yil: 2027 }, countdown: CD,
    related: ['imsakiye-2027', 'imsak-sahur-vakti', 'ramazan-2027', 'kadir-gecesi-2027', 'imsakiye-gaziantep', 'imsakiye-erzurum'],
    sources: SOURCES,
    tr: {
      slug: 'diyarbakir-imsakiye-2027', nav: 'Diyarbakır imsakiye', card: `İlk iftar ${ilk.aksam}, İstanbul'dan ${ab(d.ff)} dakika önce`,
      title: 'Diyarbakır imsakiye 2027: iftar saati ve imsak vakitleri',
      description: `Diyarbakır imsakiye 2027: ilk oruç 8 Şubat Pazartesi, imsak ${ilk.imsak}, iftar ${ilk.aksam}. Son iftar ${gm(r.son, 'tr')} ${son.aksam}, Kadir Gecesi ${gm(r.kadir, 'tr')}, bayram ${gm(r.bayram, 'tr')}. Gün gün liste.`,
      h1: `Diyarbakır imsakiye 2027: imsak ${ilk.imsak}, iftar ${ilk.aksam}`,
      intro: 'Diyarbakır merkezi için hesaplanan Ramazan 2027 imsakiyesi araçta: 29 gün boyunca imsak, güneş, iftar, yatsı ve oruç süresi.',
      resume: `Diyarbakır'da Ramazan 2027 ${dShort(r.ilk, 'tr')} günü başlar. O sabah imsak ${ilk.imsak}, akşam iftar ${ilk.aksam} ve oruç ${su(ilk.oruc, 'tr')}. Şehirde akşam vakti İstanbul'dan ${ab(d.ff)} dakika önce girer; ayın son günü fark ${ab(d.fl)} dakikadır. Son oruç ${dShort(r.son, 'tr')} günü tutulur: imsak ${son.imsak}, iftar ${son.aksam}, oruç ${su(son.oruc, 'tr')}. Kadir Gecesi ${dShort(r.kadir, 'tr')} akşamıdır (o gün iftar ${kad.aksam}), Ramazan Bayramı ${dShort(r.bayram, 'tr')} günü başlar. Bu sayfadaki saatleri biz hesaplıyoruz: Diyanet'in imsak açısı ve temkin süreleri kullanılıyor, sonuç Diyanet'in Diyarbakır takvimiyle karşılaştırılıyor. Uyum oranı ${d.trO}; aşağıda bir dakikalık farkın gerçek bir örneğini de gösteriyoruz. Oruç gibi bir ibadette son söz Diyanet'in resmi takvimindedir. Diyarbakır'da ortalama oruç ${su(d.o.ortalama, 'tr')}; ilk teravih ve ilk sahur ${dShort(d.arife, 'tr')} akşamından sonraki gecededir.`,
      faqs: [
        { q: 'Diyarbakır\'da 2027 Ramazanında iftar saat kaçta başlıyor?', a: `İlk gün, ${dShort(r.ilk, 'tr')}, Diyarbakır'da iftar saat ${ilk.aksam}; son gün, ${dShort(r.son, 'tr')}, saat ${son.aksam}. Ay boyunca iftar ${d.ileri} dakika ileri kayar. Diyarbakır İstanbul'dan ${ab(d.ff)} dakika önce iftar eder; fark il merkezlerinin doğu–batı konumundan gelir. İlk gün imsak saat ${ilk.imsak} olduğu için oruç ${su(ilk.oruc, 'tr')}, son gün ${su(son.oruc, 'tr')} sürer.` },
        { q: 'Diyarbakır imsakiyesi Diyanet\'le birebir aynı mı?', a: `Çoğunlukla: karşılaştırılan vakitlerin ${d.trO} kadarı aynı dakikadır, kalanında fark ${K.DOGRULAMA.enFazlaFark} dakikadır. Örneğin ${dShort(r.son, 'tr')} akşamı hesap ${son.aksam}, Diyanet takvimi ${d.ornek[r.son].aksam} verir. Karşılaştırma ${K.DOGRULAMA.gunler.adet} günü kapsar ve 81 il merkezinin tamamı için yapılmıştır. Oruca başlarken ve açarken Diyanet'in namaz vakitleri sayfasındaki resmi takvim esas alınmalıdır.` },
        { q: 'Diyarbakır ile Batman arasında iftar farkı ne kadar?', a: `İlk oruç günü Batman'da iftar Diyarbakır'dan ${ab(bat)} dakika önce açılır, çünkü Batman daha doğudadır; son gün fark ${ab(fk('batman', 'diyarbakir', r.son))} dakikadır. Güneydeki Mardin ${ab(mar)} dakika önce, kuzeybatıdaki Elazığ ${ab(ela)} dakika, batıdaki Şanlıurfa ${ab(urf)} dakika sonra iftar eder. Kısacası bölgede doğuya gittikçe iftar erkene gelir; her ilin saatini sayfadaki araçla görebilirsiniz.` },
      ],
      body: (h) => `<h2>Hesap ile resmi takvim: bir dakikalık fark örneği</h2>
<p>Sitedeki vakitler hazır bir listeden alınmaz; Diyanet'in yöntemiyle hesaplanır. ${h.src('imsak', 'İmsak')} için güneşin ufkun 18 derece altına indiği an, iftar için gün batımına eklenen ${h.src('temkin', '7 dakikalık temkin')} kullanılır. Diyarbakır'da bu hesap 403 gün boyunca Diyanet takvimiyle kıyaslandı ve ${h.pct(yuzde(d.oran))} oranında aynı dakikayı verdi. Kalan durumlarda ne olduğunu görmek için iki örnek gün:</p>
${h.table(['Tarih', 'Vakit', 'Hesap', 'Diyanet'], ornekSatir('tr').map(([a, b, c, t]) => [h.day(t), c, a, b]), 'Diyarbakır: hesaplanan vakit ve Diyanet takvimi')}
<p>Dört değerden ${sapma} tanesinde bir dakikalık fark var. Bu kadar küçük bir fark, saniyelerin dakikaya yuvarlanmasından ya da koordinatlardaki küçük ayrımlardan kaynaklanabilir. Yine de bir dakika oruç için önemlidir: tereddütte kalırsanız ${h.src('namazvakitleri', 'Diyanet\'in resmi takvimine')} uyun ve iftarı resmi saatten önce açmayın.</p>
<h2>İstanbul'dan kırk dakika önce: boylamın etkisi</h2>
<p>Diyarbakır merkezi boylam ${h.n(x.lng, 2)} derecededir, İstanbul'dan yaklaşık 11 derece doğuda. Her derece yaklaşık 4 dakika ettiğinden akşam ${ab(d.ff)}–${ab(d.fl)} dakika önce girer. Enlem farkı (${h.n(x.lat, 2)} derece) sabahı da öne çeker: ilk gün imsak İstanbul'dan ${ab(d.imf)} dakika erkendir. Türkiye tek saat dilimi kullandığı için doğu illerinde vakitler saat olarak erken görünür. Diyanet'in ${h.src('kiyas', 'vakit kıyaslamaları')} bunu ayrıntılı anlatır.</p>
<h2>Batman, Mardin, Elazığ, Şanlıurfa</h2>
<p>İlk oruç günü Diyarbakır'a göre iftar: Batman ${ab(bat)}, Mardin ${ab(mar)}, Erzurum ${ab(erz)} dakika önce; Elazığ ${ab(ela)}, Şanlıurfa ${ab(urf)} dakika sonra. İl içinde Ergani ve Çermik merkezin batısında kalır ve biraz geç, Bismil doğuda olduğundan biraz erken iftar eder; ilçe saatleri Diyanet'in ilçe takvimindedir. Güneybatıdaki büyükşehir için ${h.a('imsakiye-gaziantep', 'Gaziantep imsakiyesi')}, kuzeydoğu için ${h.a('imsakiye-erzurum', 'Erzurum imsakiyesi')}.</p>
${h.mini('im', { p: ['il'], d: { il: 'erzurum', yil: 2027 }, c: 'Erzurum ya da başka bir ili seçin' })}
<h2>Kadir Gecesi, arefe ve 2028</h2>
<p>${h.wday(r.kadir)} günü Diyarbakır'da iftar ${kad.aksam}; Kadir Gecesi bu iftardan sonra başlar (${h.a('kadir-gecesi-2027', 'Kadir Gecesi 2027')}). Son oruç ${h.wday(r.son)} aynı zamanda arefedir, bayram ${h.wday(r.bayram)} (${h.a('ramazan-bayrami-2027', 'Ramazan Bayramı 2027')}). 2028 Ramazanı ${h.wday(o28.r.ilk)} günü başlar: Diyarbakır'da imsak ${o28.ilk.imsak}, iftar ${o28.ilk.aksam}, oruç ${h.sure(o28.ilk.oruc, 'tr')}. Ayrıca: ${h.a('imsakiye-2027', 'imsakiye 2027')}, ${h.a('ramazan-2027', 'Ramazan 2027')}, ${h.a('imsak-sahur-vakti', 'sahur vakti')}, ${h.a('iftara-kac-dakika-kaldi', 'iftara kaç dakika kaldı')}.</p>`,
    },
    en: {
      slug: 'diyarbakir-ramadan-times-2027', nav: 'Diyarbakır Ramadan times', card: `First iftar ${ilk.aksam}, ${ab(d.ff)} minutes before Istanbul`,
      title: 'Diyarbakır Ramadan times 2027: iftar and imsak, all days',
      description: `Diyarbakır Ramadan 2027: first fast Monday 8 February, imsak ${ilk.imsak}, iftar ${ilk.aksam}. Last iftar ${gm(r.son, 'en')} at ${son.aksam}, Qadr night ${gm(r.kadir, 'en')}, Eid ${gm(r.bayram, 'en')}. Full list.`,
      h1: `Diyarbakır Ramadan 2027: imsak ${ilk.imsak}, iftar ${ilk.aksam}`,
      intro: 'The Ramadan 2027 timetable computed for central Diyarbakır is in the tool: imsak, sunrise, iftar, isha and fast length over 29 days.',
      resume: `Ramadan 2027 begins in Diyarbakır on ${dShort(r.ilk, 'en')}. Imsak that morning is ${ilk.imsak}, iftar ${ilk.aksam}, and the fast lasts ${su(ilk.oruc, 'en')}. Sunset arrives ${ab(d.ff)} minutes before Istanbul, and ${ab(d.fl)} minutes before it on the final day. The last fast is on ${dShort(r.son, 'en')}: imsak ${son.imsak}, iftar ${son.aksam}, ${su(son.oruc, 'en')}. Laylat al-Qadr is the evening of ${dShort(r.kadir, 'en')} (iftar ${kad.aksam}) and Eid al-Fitr begins on ${dShort(r.bayram, 'en')}. We produce these times ourselves: the Diyanet's dawn angle and safety margins go in, and the output is compared with the Diyanet's Diyarbakır calendar. The match rate is ${d.enO}, and below we show a real example of a one-minute difference. For an act of worship such as fasting, the official Diyanet calendar has the last word. The average fast in Diyarbakır is ${su(d.o.ortalama, 'en')}.`,
      faqs: [
        { q: 'What time is iftar in Diyarbakır in Ramadan 2027?', a: `${ilk.aksam} on the first day, ${dShort(r.ilk, 'en')}, and ${son.aksam} on the last, ${dShort(r.son, 'en')}. Over the month iftar moves ${d.ileri} minutes later. Diyarbakır breaks the fast ${ab(d.ff)} minutes before Istanbul, a gap that comes from the east–west position of the two centres. With imsak at ${ilk.imsak} on day one, the fast lasts ${su(ilk.oruc, 'en')}, rising to ${su(son.oruc, 'en')} on the last day.` },
        { q: 'Is the Diyarbakır timetable identical to the Diyanet\'s?', a: `Mostly: ${d.enO} of the compared times are the same minute, the rest ${K.DOGRULAMA.enFazlaFark} minute apart. On the evening of ${dShort(r.son, 'en')}, for example, we compute ${son.aksam} and the Diyanet calendar shows ${d.ornek[r.son].aksam}. The comparison covers ${K.DOGRULAMA.gunler.adet} days and all 81 provincial centres. When starting or breaking the fast, follow the official calendar on the Diyanet prayer-times site.` },
        { q: 'How far apart are iftar in Diyarbakır and Batman?', a: `On the first fast Batman breaks its fast ${ab(bat)} minutes before Diyarbakır, because it lies further east; on the last day the gap is ${ab(fk('batman', 'diyarbakir', r.son))} minutes. Mardin to the south is ${ab(mar)} minute earlier, while Elazığ is ${ab(ela)} minutes and Şanlıurfa ${ab(urf)} minutes later. In short, the further east you go in the region, the earlier iftar comes; the tool on this page shows each province.` },
      ],
      body: (h) => `<h2>Computed versus official: a one-minute example</h2>
<p>The times on this site are not copied from a list; they are calculated the Diyanet's way. ${h.src('imsak', 'Imsak')} is when the sun reaches 18 degrees below the horizon, and iftar is sunset plus a ${h.src('temkin', '7-minute margin')}. For Diyarbakır the calculation was compared with the Diyanet calendar over 403 days and gave the same minute ${h.pct(yuzde(d.oran))} of the time. To see what happens otherwise, here are two sample days:</p>
${h.table(['Date', 'Time', 'Computed', 'Diyanet'], ornekSatir('en').map(([a, b, c, t]) => [h.day(t), c, a, b]), 'Diyarbakır: computed time and Diyanet calendar')}
<p>One minute separates the two sources in ${sapma} of the four values. A gap that small can come from rounding seconds to the minute or from slight differences in coordinates. Still, a minute matters for a fast: when unsure, follow the ${h.src('namazvakitleri', 'official Diyanet calendar')} and do not break the fast before the official time.</p>
<h2>Forty minutes ahead of Istanbul: longitude at work</h2>
<p>Central Diyarbakır lies at ${h.n(x.lng, 2)} degrees east, about 11 degrees east of Istanbul. At roughly 4 minutes a degree, sunset arrives ${ab(d.ff)} to ${ab(d.fl)} minutes sooner. Its more southerly latitude (${h.n(x.lat, 2)}) brings dawn forward too: imsak on day one is ${ab(d.imf)} minutes before Istanbul. Because Turkey uses a single time zone, eastern provinces simply show earlier clock times. The Diyanet's ${h.src('kiyas', 'comparison page')} goes into detail.</p>
<h2>Batman, Mardin, Elazığ, Şanlıurfa</h2>
<p>On day one, relative to Diyarbakır, iftar is earlier by ${ab(bat)} minutes in Batman, ${ab(mar)} in Mardin and ${ab(erz)} in Erzurum, and later by ${ab(ela)} in Elazığ and ${ab(urf)} in Şanlıurfa. Within the province, Ergani and Çermik lie west of the centre and break the fast slightly later, Bismil to the east slightly earlier; district times are in the Diyanet district calendars. For the big city to the south-west see the ${h.a('imsakiye-gaziantep', 'Gaziantep timetable')}, to the north-east the ${h.a('imsakiye-erzurum', 'Erzurum timetable')}.</p>
${h.mini('im', { p: ['il'], d: { il: 'erzurum', yil: 2027 }, c: 'Choose Erzurum or another province' })}
<h2>Qadr night, the eve and 2028</h2>
<p>On ${h.wday(r.kadir)} Diyarbakır breaks the fast at ${kad.aksam}, and Laylat al-Qadr begins after that iftar (${h.a('kadir-gecesi-2027', 'Laylat al-Qadr 2027')}). The last fast, ${h.wday(r.son)}, is also the eve of Eid, which falls on ${h.wday(r.bayram)} (${h.a('ramazan-bayrami-2027', 'Eid al-Fitr 2027')}). Ramadan 2028 begins on ${h.wday(o28.r.ilk)}: imsak ${o28.ilk.imsak}, iftar ${o28.ilk.aksam}, a fast of ${h.sure(o28.ilk.oruc, 'en')}. See also ${h.a('imsakiye-2027', 'Ramadan timetable 2027')}, ${h.a('ramazan-2027', 'Ramadan 2027')}, ${h.a('imsak-sahur-vakti', 'suhoor time')} and ${h.a('iftara-kac-dakika-kaldi', 'iftar countdown')}.</p>`,
    },
  });
})();

/* ------------------------------------------------------------------ Erzurum */
const erzurum = (() => {
  const d = veri('erzurum'), { r, ilk, son, kad, o28, x } = d;
  const ezc = fk('erzincan', 'erzurum'), bay = fk('bayburt', 'erzurum'), agr = fk('agri', 'erzurum'), kar = fk('kars', 'erzurum'), igd = fk('igdir', 'erzurum');
  const u1 = K.uclar(r.ilk), u2 = K.uclar(r.son);
  const diy = veri('diyarbakir'), ist = veri('istanbul');
  const sabitF = d.rows.map((z) => K.iftarFarki('erzurum', z.date));
  const iller3 = [['erzurum', d], ['diyarbakir', diy], ['istanbul', ist]] as const;
  return defineGuide({
    id: 'imsakiye-erzurum', group: 'iller', order: 39, tool: 'im', toolArg: { il: 'erzurum', yil: 2027 }, countdown: CD,
    related: ['imsakiye-2027', 'iftara-kac-dakika-kaldi', 'kadir-gecesi-2027', 'ramazan-bayrami-2027', 'imsakiye-diyarbakir', 'ramazan-2027'],
    sources: SOURCES,
    tr: {
      slug: 'erzurum-imsakiye-2027', nav: 'Erzurum imsakiye', card: `İlk iftar ${ilk.aksam}: büyük iller arasında en erken`,
      title: 'Erzurum imsakiye 2027: sahur ve iftar saatleri, Ramazan',
      description: `Erzurum imsakiye 2027: ilk oruç 8 Şubat Pazartesi, imsak ${ilk.imsak}, iftar ${ilk.aksam}; İstanbul'dan ${ab(d.ff)} dk önce. Kadir ${gm(r.kadir, 'tr')}, son oruç ${gm(r.son, 'tr')}, bayram ${gm(r.bayram, 'tr')}. Tam liste.`,
      h1: `Erzurum imsakiye 2027: sahur ${ilk.imsak}, iftar ${ilk.aksam}`,
      intro: 'Erzurum il merkezi için Ramazan 2027 boyunca hesaplanan imsak, güneş, iftar ve yatsı vakitleri ile her günün oruç süresi araçta.',
      resume: `Erzurum'da 2027 Ramazanının ilk orucu ${dShort(r.ilk, 'tr')} günü tutulur: imsak ${ilk.imsak}, iftar ${ilk.aksam}, oruç ${su(ilk.oruc, 'tr')}. Bu, sitedeki on büyük il arasında en erken iftardır; İstanbul'dan ${ab(d.ff)} dakika öncedir. Son oruç ${dShort(r.son, 'tr')} günü: imsak ${son.imsak}, iftar ${son.aksam}, süre ${su(son.oruc, 'tr')}. Kadir Gecesi ${dShort(r.kadir, 'tr')} akşamıdır ve o gün Erzurum'da iftar ${kad.aksam}; Ramazan Bayramı ${dShort(r.bayram, 'tr')} günü başlar. Erzurum'un enlemi İstanbul'unkine yakın olduğu için iki şehir arasındaki fark ay boyunca neredeyse sabit kalır: iftarda ${Math.min(...sabitF.map(ab))}–${Math.max(...sabitF.map(ab))} dakika. Saatler Diyanet'in kullandığı ölçülerle sitede hesaplandı ve Diyanet'in Erzurum takvimiyle karşılaştırıldı: aynı dakika oranı ${d.trO}, fark en fazla 1 dakika. Oruç için bağlayıcı olan Diyanet'in resmi takvimidir. İlk teravih ${dShort(d.arife, 'tr')} akşamı kılınır; ilk sahur da o gece yenir.`,
      faqs: [
        { q: 'Erzurum\'da 2027 Ramazanında ilk iftar kaçta?', a: `${dShort(r.ilk, 'tr')} akşamı Erzurum'da iftar saat ${ilk.aksam}, sabah imsak saat ${ilk.imsak}; ilk oruç ${su(ilk.oruc, 'tr')} sürer. Türkiye genelinde o gün en erken iftar ${u1.ilkIftar.il.ad} ilindedir (saat ${K.hhmm(u1.ilkIftar.v.aksam)}), Erzurum'dan ${ab(igd)} dakika önce. Erzurum ise İstanbul'dan ${ab(d.ff)} dakika erken iftar eder. Son gün, ${dShort(r.son, 'tr')}, iftar saat ${son.aksam} olur.` },
        { q: 'Erzurum\'da oruç Diyarbakır\'dan neden daha kısa?', a: `Erzurum daha kuzeydedir; kışın kuzeyde gün daha kısadır. İlk gün Erzurum'da oruç ${su(ilk.oruc, 'tr')}, Diyarbakır'da ${su(diy.ilk.oruc, 'tr')}. Mart'a doğru fark kapanır: son gün ikisi de ${su(son.oruc, 'tr')} civarındadır. Ay ortalaması Erzurum'da ${su(d.o.ortalama, 'tr')}, Diyarbakır'da ${su(diy.o.ortalama, 'tr')}; yani bütün ay boyunca kuzeydeki il biraz daha kısa oruç tutar.` },
        { q: 'Erzurum ile Erzincan arasında iftar farkı ne kadar?', a: `İlk oruç günü Erzincan'da iftar Erzurum'dan ${ab(ezc)} dakika sonra açılır, çünkü Erzincan daha batıdadır. Bayburt ${ab(bay)} dakika sonra; doğudaki Ağrı ${ab(agr)}, Kars ${ab(kar)}, Iğdır ${ab(igd)} dakika önce iftar eder. İki il arasında yolda olanlar iftarı hangi ilde açacaklarsa o ilin saatine bakmalıdır. Sayfadaki araçta il seçerek her takvimi ayrı görebilirsiniz.` },
      ],
      body: (h) => `<h2>Doğu Anadolu sıralaması: Erzincan'dan Iğdır'a</h2>
<p>Erzurum merkezi (enlem ${h.n(x.lat, 2)}, boylam ${h.n(x.lng, 2)}) doğuda olduğu için akşamı erken yaşar, ama ülkenin en doğusu değildir. İlk oruç günü Erzurum'a göre iftar: Erzincan ${ab(ezc)}, Bayburt ${ab(bay)} dakika sonra; Ağrı ${ab(agr)}, Kars ${ab(kar)}, Iğdır ${ab(igd)} dakika önce. ${u1.ilkIftar.il.ad}, ilk gün ${h.hhmm(u1.ilkIftar.v.aksam)} ile ülkenin en erken iftar eden il merkezidir; son gün de ${u2.ilkIftar.il.ad} (${h.hhmm(u2.ilkIftar.v.aksam)}). İl içinde Horasan ve Pasinler doğuda kalır ve biraz erken, Aşkale batıda olduğundan biraz geç iftar eder. Kesin ilçe saati için Diyanet'in ilçe takvimine bakın.</p>
${h.mini('im', { p: ['il'], d: { il: 'diyarbakir', yil: 2027 }, c: 'Diyarbakır ya da başka bir il' })}
<h2>Kuzeyde kısa, güneyde uzun oruç</h2>
<p>Doğuda olmak saati erkene çeker ama orucun süresini değiştirmez; süreyi belirleyen enlemdir. Erzurum, Diyarbakır'dan 2 derece kuzeyde, İstanbul'la hemen hemen aynı enlemdedir. Bu yüzden ilk gün Erzurum'un orucu Diyarbakır'dakinden kısa, İstanbul'dakine yakındır:</p>
${h.table(['İl', 'İlk gün imsak', 'İlk gün iftar', 'İlk oruç', 'Son oruç'], iller3.map(([s, v]) => [K.il(s).ad, v.ilk.imsak, v.ilk.aksam, h.sure(v.ilk.oruc, 'tr'), h.sure(v.son.oruc, 'tr')]), 'Erzurum, Diyarbakır ve İstanbul: Ramazan 2027 (hesaplanan)')}
<p>İstanbul'la enlem benzerliğinin bir sonucu daha var: iki şehir arasındaki iftar farkı Ramazan boyunca neredeyse hiç değişmez. Diyanet'in ${h.src('kiyas', 'vakit kıyaslamaları')} sayfası enlem ve boylamın etkisini ayrı ayrı gösterir. Kardeş sayfa: ${h.a('imsakiye-diyarbakir', 'Diyarbakır imsakiyesi')}.</p>
<h2>Saatlerin kaynağı</h2>
<p>Takvim, Diyanet'in tanımladığı ${h.src('imsak', 'imsak')} açısıyla (güneş ufkun 18 derece altında) ve akşam vaktine eklenen ${h.src('temkin', '7 dakikalık temkinle')} hesaplanır. Erzurum'un hesaplanan vakitleri Diyanet takvimiyle ${h.pct(yuzde(d.oran))} oranında birebir aynı, farklı olanlar 1 dakika. Sahur ve iftarda ${h.src('namazvakitleri', 'Diyanet\'in resmi takvimini')} esas alın; imsakın anlamı ${h.a('imsak-sahur-vakti', 'imsak ve sahur vakti')} sayfasında.</p>
<h2>Kadir Gecesi, bayram ve 2028 Ramazanı</h2>
<p>${h.wday(r.kadir)} günü Erzurum'da iftar ${kad.aksam}; Kadir Gecesi bu akşam başlar (${h.a('kadir-gecesi-2027', 'Kadir Gecesi 2027')}). Bayram ${h.wday(r.bayram)}: ${h.a('ramazan-bayrami-2027', 'Ramazan Bayramı 2027')}. 2028'de oruç ${h.wday(o28.r.ilk)} günü başlar; Erzurum'da ilk imsak ${o28.ilk.imsak}, ilk iftar ${o28.ilk.aksam}, oruç ${h.sure(o28.ilk.oruc, 'tr')}. Geri sayım: ${h.a('iftara-kac-dakika-kaldi', 'iftara kaç dakika kaldı')}; tüm iller: ${h.a('imsakiye-2027', 'imsakiye 2027')}; ay takvimi: ${h.a('ramazan-2027', 'Ramazan 2027')}.</p>`,
    },
    en: {
      slug: 'erzurum-ramadan-times-2027', nav: 'Erzurum Ramadan times', card: `First iftar ${ilk.aksam}: the earliest of the big cities`,
      title: 'Erzurum Ramadan times 2027: suhoor and iftar each day',
      description: `Erzurum Ramadan 2027: first fast Monday 8 February, imsak ${ilk.imsak}, iftar ${ilk.aksam}, ${ab(d.ff)} min before Istanbul. Qadr night ${gm(r.kadir, 'en')}, last fast ${gm(r.son, 'en')}, Eid ${gm(r.bayram, 'en')}.`,
      h1: `Erzurum Ramadan 2027: suhoor until ${ilk.imsak}, iftar ${ilk.aksam}`,
      intro: 'The tool shows the computed imsak, sunrise, iftar and isha times for central Erzurum throughout Ramadan 2027, with the length of each fast.',
      resume: `Erzurum's first fast of Ramadan 2027 is on ${dShort(r.ilk, 'en')}: imsak ${ilk.imsak}, iftar ${ilk.aksam}, ${su(ilk.oruc, 'en')} of fasting. That is the earliest iftar of the ten big cities covered here, ${ab(d.ff)} minutes ahead of Istanbul. The last fast is on ${dShort(r.son, 'en')}: imsak ${son.imsak}, iftar ${son.aksam}, ${su(son.oruc, 'en')}. Laylat al-Qadr is the evening of ${dShort(r.kadir, 'en')}, with iftar at ${kad.aksam}, and Eid al-Fitr starts on ${dShort(r.bayram, 'en')}. Because Erzurum sits at almost the same latitude as Istanbul, the gap between the two barely moves during the month: ${Math.min(...sabitF.map(ab))} to ${Math.max(...sabitF.map(ab))} minutes at iftar. The times were computed on this site with the parameters the Diyanet uses and compared with the Diyanet's Erzurum calendar: ${d.enO} identical to the minute, at most 1 minute apart. The official Diyanet calendar is the one that binds for the fast. The first tarawih is on the evening of Sunday 7 February.`,
      faqs: [
        { q: 'What time is the first iftar in Erzurum in Ramadan 2027?', a: `${ilk.aksam} on ${dShort(r.ilk, 'en')}, with imsak at ${ilk.imsak}, a first fast of ${su(ilk.oruc, 'en')}. The earliest iftar in Turkey that day is in ${u1.ilkIftar.il.en} (${K.hhmm(u1.ilkIftar.v.aksam)}), ${ab(igd)} minutes before Erzurum. Erzurum itself breaks the fast ${ab(d.ff)} minutes before Istanbul. On the last day, ${dShort(r.son, 'en')}, iftar is at ${son.aksam}.` },
        { q: 'Why is the fast shorter in Erzurum than in Diyarbakır?', a: `Erzurum is further north, and in winter northern days are shorter. On day one the fast lasts ${su(ilk.oruc, 'en')} in Erzurum against ${su(diy.ilk.oruc, 'en')} in Diyarbakır. The gap closes towards March: on the last day both are around ${su(son.oruc, 'en')}. The monthly average is ${su(d.o.ortalama, 'en')} in Erzurum and ${su(diy.o.ortalama, 'en')} in Diyarbakır, so the northern city fasts slightly less all month.` },
        { q: 'How many minutes apart are iftar in Erzurum and Erzincan?', a: `On the first fast Erzincan breaks its fast ${ab(ezc)} minutes after Erzurum, because it lies further west. Bayburt is ${ab(bay)} minutes later; to the east, Ağrı is ${ab(agr)}, Kars ${ab(kar)} and Iğdır ${ab(igd)} minutes earlier. If you are on the road between the two provinces, check the time of the one where you will break the fast. The tool on this page shows each timetable.` },
      ],
      body: (h) => `<h2>Eastern Anatolia in order: from Erzincan to Iğdır</h2>
<p>Central Erzurum (latitude ${h.n(x.lat, 2)}, longitude ${h.n(x.lng, 2)}) sees sunset early because it is far east, yet it is not Turkey's easternmost point. On the first fast, relative to Erzurum, iftar is ${ab(ezc)} minutes later in Erzincan and ${ab(bay)} in Bayburt, but ${ab(agr)} minutes earlier in Ağrı, ${ab(kar)} in Kars and ${ab(igd)} in Iğdır. ${u1.ilkIftar.il.en} is the provincial centre with the earliest iftar on day one (${h.hhmm(u1.ilkIftar.v.aksam)}), and ${u2.ilkIftar.il.en} again on the last day (${h.hhmm(u2.ilkIftar.v.aksam)}). Inside the province, Horasan and Pasinler lie east and break the fast slightly earlier, Aşkale to the west slightly later. Check the Diyanet district calendar for the exact time.</p>
${h.mini('im', { p: ['il'], d: { il: 'diyarbakir', yil: 2027 }, c: 'Diyarbakır or another province' })}
<h2>Shorter fasts in the north, longer in the south</h2>
<p>Being east moves the clock time earlier but does not change how long the fast lasts; latitude decides that. Erzurum is 2 degrees north of Diyarbakır and nearly level with Istanbul. So on day one Erzurum's fast is shorter than Diyarbakır's and close to Istanbul's:</p>
${h.table(['Province', 'Day 1 imsak', 'Day 1 iftar', 'First fast', 'Last fast'], iller3.map(([s, v]) => [K.il(s).en, v.ilk.imsak, v.ilk.aksam, h.sure(v.ilk.oruc, 'en'), h.sure(v.son.oruc, 'en')]), 'Erzurum, Diyarbakır and Istanbul: Ramadan 2027 (computed)')}
<p>The shared latitude has another consequence: the iftar gap between Erzurum and Istanbul hardly changes over Ramadan. The Diyanet's ${h.src('kiyas', 'comparison page')} separates the effects of latitude and longitude. Sister page: ${h.a('imsakiye-diyarbakir', 'Diyarbakır timetable')}.</p>
<h2>Where the times come from</h2>
<p>The timetable uses the Diyanet's ${h.src('imsak', 'imsak')} angle (sun 18 degrees below the horizon) and adds a ${h.src('temkin', '7-minute margin')} to sunset. Erzurum's computed times are identical to the Diyanet calendar ${h.pct(yuzde(d.oran))} of the time; those that differ are 1 minute off. At suhoor and iftar, rely on the ${h.src('namazvakitleri', 'official Diyanet calendar')}; what imsak means is set out on ${h.a('imsak-sahur-vakti', 'imsak and suhoor time')}.</p>
<h2>Qadr night, Eid and Ramadan 2028</h2>
<p>On ${h.wday(r.kadir)} Erzurum breaks the fast at ${kad.aksam}, and Laylat al-Qadr begins that evening (${h.a('kadir-gecesi-2027', 'Laylat al-Qadr 2027')}). Eid is ${h.wday(r.bayram)}: ${h.a('ramazan-bayrami-2027', 'Eid al-Fitr 2027')}. In 2028 the fast starts on ${h.wday(o28.r.ilk)}; Erzurum's first imsak is ${o28.ilk.imsak}, first iftar ${o28.ilk.aksam}, a fast of ${h.sure(o28.ilk.oruc, 'en')}. Countdown: ${h.a('iftara-kac-dakika-kaldi', 'minutes to iftar')}; all provinces: ${h.a('imsakiye-2027', 'Ramadan timetable 2027')}; the month: ${h.a('ramazan-2027', 'Ramadan 2027')}.</p>`,
    },
  });
})();


export default [istanbul, ankara, izmir, bursa, antalya, konya, adana, gaziantep, diyarbakir, erzurum] as GuideDef[];
