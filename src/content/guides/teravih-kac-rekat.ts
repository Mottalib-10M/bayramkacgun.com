/** Teravih kaç rekât : TDV İslâm Ansiklopedisi « Terâvih » (okundu 2026-10-28) ; ilk ve son teravih gecesi Diyanet listesinden. */
import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { dShort } from '../../lib/tool-specs';

const r = K.ramazan(2027)!, r28 = K.ramazan(2028)!;
const ilk = K.addDays(r.ilk, -1), son = K.addDays(r.son, -1);
const gece = K.daysBetween(ilk, son) + 1;
const BUYUK = ['istanbul', 'ankara', 'izmir', 'antalya', 'diyarbakir', 'erzurum'];
const y = (s: string, d: string) => K.hhmm(K.ilVakit(s, d).yatsi);

export default defineGuide({
  id: 'teravih-kac-rekat', group: 'ramazan', order: 26, tool: 'rm', toolArg: { yil: 2027 },
  countdown: { date: ilk, label: { tr: 'İlk teravih 2027', en: 'First tarawih 2027' } },
  related: ['ramazan-2027', 'kadir-gecesi-2027', 'imsakiye-2027', 'iftar-saati', 'dini-gunler-2027'],
  sources: ['teravih', 'dg2027', 'dg2028', 'namazvakitleri'],
  tr: {
    slug: 'teravih-kac-rekat', nav: 'Teravih kaç rekât?', card: 'Yirmi mi sekiz mi? Mezheplerin görüşü, ilk teravih 2027 ve saatleri',
    title: 'Teravih kaç rekât? 20 mi 8 mi, ilk teravih 2027 ne zaman?',
    description: 'Teravih namazı kaç rekât? Hanefî, Şâfiî ve Hanbelî çoğunluğa göre 20, bazı âlimlere göre 8. İlk teravih 7 Şubat 2027 Pazar akşamı; illerde yatsı saati.',
    h1: 'Teravih kaç rekât? Görüşler ve 2027 teravih takvimi',
    intro: 'Araç, seçtiğiniz yılın ilk ve son teravih gecesini, Kadir Gecesini ve bayramı gösterir. Aşağıda rekât sayısı hakkındaki görüşleri kaynağıyla özetliyoruz.',
    resume: `Teravih, Ramazan ayına özgü olarak yatsı namazından sonra kılınan namazdır. TDV İslâm Ansiklopedisine göre Hanefî, Şâfiî ve Hanbelî fakihlerin çoğunluğu, Hz. Peygamber'in vitir dahil yirmi üç rekât kıldığı yolundaki rivayete ve sahâbe uygulamasına dayanarak teravihin yirmi rekât olduğu görüşündedir. İbnü'l-Hümâm ve Süyûtî gibi âlimler ise teravihin sekiz rekât olduğunu söylemiş; İbnü'l-Hümâm sekizden sonra kılınan on iki rekâtı müstehap saymıştır. İmam Mâlik'ten otuz altı rekât görüşü de nakledilir. Gelenek yirmi rekât yönünde gelişmiştir. Teravih orucun değil Ramazan ayının sünneti olduğu için oruç tutamayanlar da kılar. Diyanet takvimine göre 2027'de ilk teravih ${dShort(ilk, 'tr')} akşamı, son teravih ${dShort(son, 'tr')} akşamı kılınır: toplam ${gece} gece. Bayram arefesinin akşamı teravih kılınmaz, çünkü ertesi gün bayramdır. Teravihin vakti yatsıdan sonra başlar ve sabaha kadar sürer; İstanbul'da ilk teravih gecesi yatsı ${y('istanbul', ilk)} olarak hesaplanır. Bu sayfa fıkhî bir hüküm vermez, kaynakta yazılanları aktarır.`,
    faqs: [
      { q: 'Teravih namazı kaç rekâttır?', a: 'TDV İslâm Ansiklopedisine göre Hanefî, Şâfiî ve Hanbelî fakihlerin çoğunluğu teravihin yirmi rekât olduğu görüşündedir; vitirle birlikte yirmi üç rekât eder. İbnü\'l-Hümâm ve Süyûtî gibi âlimler sekiz rekât görüşündedir, İmam Mâlik\'ten otuz altı rekât görüşü nakledilir. Kaynağa göre gelenek yirmi rekât yönünde gelişmiştir. Size uygun uygulama için bir din görevlisine danışın.' },
      { q: '2027\'de ilk teravih ne zaman kılınacak?', a: `${dShort(ilk, 'tr')} akşamı, yatsı namazından sonra. Ertesi gün, ${dShort(r.ilk, 'tr')}, ilk oruç tutulur. Son teravih ${dShort(son, 'tr')} akşamıdır; bayram arefesinin akşamı teravih kılınmaz. Toplam ${gece} gece teravih kılınır. İstanbul'da ilk teravih gecesi yatsı saat ${y('istanbul', ilk)} olarak hesaplanır; teravih bu saatten sonra başlar.` },
      { q: 'Teravih kaçırılırsa kaza edilir mi?', a: 'TDV İslâm Ansiklopedisine göre teravih için ezan okunmaz, kamet getirilmez ve kılamayan kişinin kaza etmesi gerekmez. Vakti yatsı namazından sonra başlar ve fecre, yani imsak vaktine kadar sürer. Teravih orucun değil Ramazan ayının sünneti sayıldığından, oruç tutamayanlar da kılabilir. Gecenin hangi bölümünde kılınmasının daha faziletli olduğu konusunda mezhepler farklı görüştedir.' },
    ],
    body: (h) => `<h2>Rekât sayısı hakkındaki görüşler</h2>
${h.table(['Görüş', 'Rekât', 'Dayanak (kaynağa göre)'], [['Hanefî, Şâfiî ve Hanbelî çoğunluk', '20 (vitirle 23)', 'Vitir dahil 23 rekât rivayeti ve sahâbe uygulaması'], ['İbnü\'l-Hümâm, Süyûtî', '8', 'Vitir dahil 11 rekâttan fazla gece namazı kılınmadığı yönündeki hadisler'], ['İmam Mâlik (nakledilen)', '36; 20 görüşü de var', 'İbn Rüşd\'ün aktarımı']], 'Teravihin rekât sayısı (TDV İslâm Ansiklopedisi, Terâvih maddesi)')}
<p>${h.src('teravih', 'TDV İslâm Ansiklopedisi')}, rekât sayısı için sekiz, on, on altı, yirmi, otuz altı, otuz sekiz ve kırk gibi sayıların ileri sürüldüğünü belirtir. Hz. Ömer 635 yılında Übey b. Kâ'b'dan cemaate teravih kıldırmasını istemiş, bu uygulama günümüze kadar sürmüştür. Hz. Ömer dönemindeki uygulamanın etkisiyle yirmi rekât rivayeti güç kazanmış ve gelenek bu yönde gelişmiştir.</p>
<h2>Nasıl kılınır?</h2>
<p>Fakihler teravihin iki rekâtta bir selam verilerek kılınmasının faziletli olduğunda birleşir. Şâfiî mezhebinde iki rekâtta bir selam farzdır; Hanefîlere göre yirmi rekâtın sonunda tek selamla kılınan teravih mekruh olmakla birlikte sahihtir. Adını, her dört rekâttan sonra dinlenmek için kısa bir süre oturulmasından (tervîha) alır. Ramazan boyunca teravihte bir hatim yapılması Hanefî ve Hanbelîlere göre sünnet, Şâfiî ve Mâlikîlere göre müstehaptır. Hangi uygulamanın size uygun olduğunu bir din görevlisine danışın.</p>
<p>Kaynak, teravihin hızlı kıldırılmasına da dikkat çeker: her durumda namazın âdâbına ve özellikle ta'dîl-i erkâna, yani rükû ve secdelerde yeterince durmaya riayet edilmesi gerekir; namazın bunu bozacak hızda kıldırılması doğru değildir. Kıraatte ise her rekâtta uzunca bir âyet ya da üç kısa âyet okunması yeterli görülmüştür. Hanefî ve Şâfiîlere göre teravihi gecenin ilk üçte birine ya da yarısına ertelemek müstehaptır; Hanbelîler gecenin ilk vaktini daha faziletli bulur.</p>
<h2>2027 teravih takvimi ve yatsı saatleri</h2>
<p>İlk teravih ${h.wday(ilk)} akşamı, son teravih ${h.wday(son)} akşamıdır. Kadir Gecesi ${h.wday(r.kadir)} akşamına denk gelir. Yatsı vakti ay boyunca ilerler, bu yüzden teravihin başlama saati de her akşam biraz gecikir.</p>
${h.table(['İl', `İlk teravih, ${h.day(ilk)}`, `Kadir Gecesi, ${h.day(r.kadir)}`, `Son teravih, ${h.day(son)}`], BUYUK.map((s) => [K.il(s).ad, y(s, ilk), y(s, r.kadir), y(s, son)]), 'Yatsı vakti (teravihin en erken başlangıcı), hesaplanan, Türkiye saati')}
${h.mini('rm', { p: ['yil'], d: { yil: 2028 }, c: '2028 ve sonrasında ilk teravih' })}
<h2>Gelecek yıl</h2>
<p>Ramazan 2028'de ilk teravih ${h.day(K.addDays(r28.ilk, -1))} akşamıdır; Ocak sonunda yatsı erken girdiği için teravih de erken saatlerde kılınır. Gün gün vakitler ${h.a('imsakiye-2027', 'imsakiye 2027')} sayfasında, Kadir Gecesi ayrıntıları ${h.a('kadir-gecesi-2027', 'Kadir Gecesi 2027')} sayfasında.</p>`,
  },
  en: {
    slug: 'tarawih-rakats-turkey-2027', nav: 'How many rakats is tarawih?', card: 'Twenty or eight? The schools\' views, the first tarawih of 2027 and its times',
    title: 'Tarawih rakats: 20 or 8? Views and the 2027 dates in Turkey',
    description: 'How many rakats is tarawih? 20 for most Hanafi, Shafi\'i and Hanbali jurists, 8 for some scholars. First tarawih in Turkey: Sunday 7 February 2027, after isha.',
    h1: 'How many rakats is tarawih? Views and the 2027 calendar',
    intro: 'The tool shows the first and last tarawih night of the year you choose, Laylat al-Qadr and the feast. Below we summarise the views on the number of rakats, with the source.',
    resume: `Tarawih is the prayer performed after isha, specific to Ramadan. According to the TDV Encyclopedia of Islam, most Hanafi, Shafi'i and Hanbali jurists hold that tarawih is twenty rakats, based on the report that the Prophet prayed twenty-three rakats including witr and on the practice of the Companions. Scholars such as Ibn al-Humam and al-Suyuti said tarawih is eight rakats; Ibn al-Humam considered the twelve rakats prayed after the eight to be recommended. A view of thirty-six rakats is also reported from Imam Malik. Tradition developed in favour of twenty. Tarawih is a sunnah of the month of Ramadan, not of the fast, so those who cannot fast also pray it. Per the Diyanet calendar, in 2027 the first tarawih is on the evening of ${dShort(ilk, 'en')} and the last on the evening of ${dShort(son, 'en')}: ${gece} nights in all. No tarawih is prayed on the eve of the feast, since the next day is Eid. Its time begins after isha and lasts until dawn; in Istanbul, isha on the first tarawih night is computed at ${y('istanbul', ilk)}. This page gives no religious ruling; it reports what the source says.`,
    faqs: [
      { q: 'How many rakats is the tarawih prayer?', a: 'According to the TDV Encyclopedia of Islam, most Hanafi, Shafi\'i and Hanbali jurists hold that tarawih is twenty rakats, twenty-three with witr. Scholars such as Ibn al-Humam and al-Suyuti hold eight, and a view of thirty-six is reported from Imam Malik. The source notes that tradition developed in favour of twenty. Ask a religious official which practice suits you.' },
      { q: 'When is the first tarawih of 2027 in Turkey?', a: `On the evening of ${dShort(ilk, 'en')}, after the isha prayer. The first fast is the next day, ${dShort(r.ilk, 'en')}. The last tarawih is on the evening of ${dShort(son, 'en')}; none is prayed on the evening of the feast's eve. That makes ${gece} nights of tarawih. In Istanbul, isha on the first night is computed at ${y('istanbul', ilk)}, and tarawih begins after it.` },
      { q: 'Does a missed tarawih have to be made up?', a: 'According to the TDV Encyclopedia of Islam, there is no call to prayer or iqama for tarawih, and someone who misses it does not have to make it up. Its time starts after isha and lasts until dawn, that is until imsak. Since tarawih is a sunnah of the month of Ramadan rather than of the fast, those who cannot fast may pray it too. The schools differ on which part of the night is best.' },
    ],
    body: (h) => `<h2>The views on the number of rakats</h2>
${h.table(['View', 'Rakats', 'Basis (according to the source)'], [['Most Hanafi, Shafi\'i and Hanbali jurists', '20 (23 with witr)', 'Report of 23 rakats including witr; practice of the Companions'], ['Ibn al-Humam, al-Suyuti', '8', 'Hadiths that no more than 11 rakats of night prayer, witr included, were prayed'], ['Imam Malik (reported)', '36; a view of 20 too', 'As related by Ibn Rushd']], 'Number of tarawih rakats (TDV Encyclopedia of Islam, entry Terâvih)')}
<p>The ${h.src('teravih', 'TDV Encyclopedia of Islam')} notes that eight, ten, sixteen, twenty, thirty-six, thirty-eight and forty rakats have all been put forward. In 635 Caliph Umar asked Ubayy ibn Ka'b to lead tarawih in congregation, a practice that continues today. Under the influence of that practice the report of twenty rakats gained strength and tradition developed in that direction.</p>
<h2>How it is prayed</h2>
<p>Jurists agree that it is better to pray tarawih with a salam after every two rakats. In the Shafi'i school the salam after every two rakats is obligatory; for Hanafis, tarawih prayed with a single salam at the end of twenty rakats is disliked but valid. The name comes from the short rest (tarwiha) taken after every four rakats. Completing a full reading of the Quran in tarawih during Ramadan is a sunnah for Hanafis and Hanbalis and recommended for Shafi'is and Malikis. Ask a religious official which practice suits you.</p>
<p>The source also warns against rushing: in every case the etiquette of prayer, and especially ta'dil al-arkan, pausing properly in bowing and prostration, must be respected, and leading the prayer so fast as to break it is not right. For recitation, one long verse or three short ones per rakat is considered sufficient. Hanafis and Shafi'is consider it recommended to delay tarawih to the first third or the middle of the night; Hanbalis see the early part of the night as more meritorious.</p>
<h2>The 2027 tarawih calendar and isha times</h2>
<p>The first tarawih is on the evening of ${h.wday(ilk)}, the last on the evening of ${h.wday(son)}. Laylat al-Qadr falls on the evening of ${h.wday(r.kadir)}. Isha moves later through the month, so tarawih starts a little later each evening.</p>
${h.table(['Province', `First tarawih, ${h.day(ilk)}`, `Laylat al-Qadr, ${h.day(r.kadir)}`, `Last tarawih, ${h.day(son)}`], BUYUK.map((s) => [K.il(s).en, y(s, ilk), y(s, r.kadir), y(s, son)]), 'Isha time (earliest start of tarawih), computed, Turkey time')}
${h.mini('rm', { p: ['yil'], d: { yil: 2028 }, c: 'The first tarawih in 2028 and later' })}
<h2>Next year</h2>
<p>In Ramadan 2028 the first tarawih is on the evening of ${h.day(K.addDays(r28.ilk, -1))}; in late January isha comes early, so tarawih is prayed early in the evening. Day-by-day times are on ${h.a('imsakiye-2027', 'the 2027 Ramadan timetable')}, and details of the Night of Power on ${h.a('kadir-gecesi-2027', 'Laylat al-Qadr 2027')}.</p>`,
  },
});
