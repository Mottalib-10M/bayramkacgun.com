/** İmsak ve sahur vakti : fecr-i sâdık (güneş −18°), Ramazanda sabah ezanı imsakta ; engine/vakit.ts. */
import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { dShort } from '../../lib/tool-specs';

const r = K.ramazan(2027)!;
const ORTA = K.addDays(r.ilk, 14);
const BUYUK = ['istanbul', 'ankara', 'izmir', 'bursa', 'antalya', 'konya', 'adana', 'gaziantep', 'diyarbakir', 'erzurum'];
const ank = (d: string) => K.ilVakit('ankara', d);
const fark = (d: string) => ank(d).gunes - ank(d).imsak;
const u = K.uclar(r.ilk), uS = K.uclar(r.son);
const haziran = '2027-06-21', aralik = '2027-12-21';

export default defineGuide({
  id: 'imsak-sahur-vakti', group: 'ramazan', order: 23, tool: 'vakit', toolArg: { il: 'ankara' },
  countdown: { date: r.ilk, label: { tr: 'Ramazan 2027 (ilk sahur gecesi sonu)', en: 'Ramadan 2027 (end of the first sahur)' } },
  related: ['iftar-saati', 'imsakiye-2027', 'iftara-kac-dakika-kaldi', 'ramazan-2027', 'imsakiye-ankara', 'imsakiye-erzurum'],
  sources: ['imsak', 'sabah-ezani', 'temkin', 'namazvakitleri'],
  tr: {
    slug: 'imsak-sahur-vakti', nav: 'İmsak ve sahur vakti', card: 'Sahur ne zaman biter? 81 ilde imsak vakti ve sabah ezanı',
    title: 'İmsak vakti: sahur kaçta biter? 81 il için imsak saati 2027',
    description: 'İmsak vakti, yani sahurun son anı: güneş ufkun 18 derece altına geldiğinde. 81 il için tarih seçin; Ramazan 2027 ilk gün imsak: Ankara 06:19, Hakkari 05:34.',
    h1: 'İmsak vakti: sahur ne zaman biter?',
    intro: 'İl ve tarih seçin: araç imsak dahil günün altı vaktini verir; bugün için sıradaki vakte kalan süreyi sayar. Seçtiğiniz il hiçbir yere gönderilmez.',
    resume: `İmsak, orucun başladığı ve sahurun bittiği vakittir. Diyanet bu anı fecr-i sâdık, yani ufukta yayılan gerçek tan ağarması olarak tanımlar ve güneşin ufkun 18 derece altına geldiği an olarak hesaplar; imsak vaktine ayrıca temkin eklenmez. Sahur yemeği bu vakitten önce bitmelidir. Ramazan 2027'nin ilk sabahı, ${dShort(r.ilk, 'tr')}, Ankara'da imsak ${K.hhmm(ank(r.ilk).imsak)}, son sabahı ${dShort(r.son, 'tr')} ise ${K.hhmm(ank(r.son).imsak)} olarak hesaplanır; gün uzadıkça imsak her sabah bir dakikadan fazla öne gelir. Aynı ilk sabah en erken imsak ${u.ilkImsak.il.ad} ilinde ${K.hhmm(u.ilkImsak.v.imsak)}, en geç ${u.sonImsak.il.ad} ilinde ${K.hhmm(u.sonImsak.v.imsak)}. Ramazanda sabah ezanı imsak vaktinde okunur; böylece ezan duyulduğunda yemeyi bırakmak gerektiği bilinir. Ramazan dışında ise sabah ezanı daha geç okunur. Saatler 81 il merkezi için hesaplanmıştır ve Diyanet takvimiyle karşılaştırıldığında imsakta günlerin büyük kısmında aynı dakikadır, kalanında bir dakika farklıdır.`,
    faqs: [
      { q: 'Sahur en geç kaçta bitirilmeli?', a: `İmsak vaktinden önce. İmsak orucun başladığı andır; o dakikadan sonra yemek ve içmek orucu bozar. Diyanet imsak vaktine temkin eklemez, bu yüzden takvimdeki saat son andır ve birkaç dakika önce bitirmek ihtiyatlıdır. Örneğin Ramazan 2027'nin ilk sabahı Ankara'da imsak saat ${K.hhmm(ank(r.ilk).imsak)} olarak hesaplanır; sahur bu saatten önce bitmelidir.` },
      { q: 'Ramazanda sabah ezanı neden imsakta okunuyor?', a: 'Diyanet, Ramazan ayında oruç tutanların sahuru ne zaman bitireceklerini duyabilmeleri için sabah ezanını imsak vaktinde okutur. Ezan duyulduğunda oruç başlamış olur. Ramazan dışında ise sabah ezanı imsakten bir süre sonra, güneş doğmadan önce okunur; bu yüzden kaza ya da nafile oruç tutanlar ezanı değil, takvimdeki imsak saatini esas almalıdır.' },
      { q: 'İmsak ile güneşin doğuşu arasında ne kadar zaman var?', a: `Ankara için Ramazan 2027'nin ilk günü ${fark(r.ilk)} dakika. Bu süre mevsime ve enleme göre değişir: haziran sonunda ${fark(haziran)} dakikaya uzar, aralık sonunda ${fark(aralik)} dakika olur. Sabah namazı bu aralıkta kılınır. Takvimdeki güneş vakti, temkin nedeniyle gerçek doğuştan 7 dakika öncedir; sabah namazını bu saatten önce bitirmek gerekir.` },
    ],
    body: (h) => `<h2>Ramazan 2027: on büyük ilde imsak</h2>
${h.table(['İl', h.day(r.ilk), h.day(ORTA), h.day(r.son)], BUYUK.map((s) => [K.il(s).ad, K.hhmm(K.ilVakit(s, r.ilk).imsak), K.hhmm(K.ilVakit(s, ORTA).imsak), K.hhmm(K.ilVakit(s, r.son).imsak)]), 'İmsak vakti (sahurun sonu), hesaplanan, Türkiye saati')}
<p>Son sabah, ${h.day(r.son)}, imsak en erken ${uS.ilkImsak.il.ad} ilinde ${h.hhmm(uS.ilkImsak.v.imsak)}, en geç ${uS.sonImsak.il.ad} ilinde ${h.hhmm(uS.sonImsak.v.imsak)} vaktindedir. Ay boyunca imsak öne geldiği için sahura her sabah biraz daha erken kalkmak gerekir.</p>
<h2>Fecr-i kâzib ve fecr-i sâdık</h2>
<p>Gece ile sabah arasında gökyüzü iki aşamada aydınlanır. Önce ufukta dikey, ince bir ışık görünür ve kaybolur; buna yalancı şafak, fecr-i kâzib denir. Ardından ufuk boyunca yatay olarak yayılan aydınlık gelir: gerçek şafak, fecr-i sâdık. ${h.src('imsak', 'Diyanet\'e göre')} imsak, bu ikinci aydınlığın başladığı andır ve güneşin ufkun 18 derece altında olduğu konuma karşılık gelir. Bazı ülkelerde 15 veya 19,5 derece gibi farklı ölçüler kullanıldığı için yurt dışında yayımlanan takvimler Türkiye'deki imsak saatinden ayrılabilir.</p>
<h2>Sabah ezanı ve imsak</h2>
<p>${h.src('sabah-ezani', 'Diyanet')}, Ramazan boyunca sabah ezanını imsak vaktinde okutur; ezan duyulduğunda oruç başlamış olur. Yılın geri kalanında sabah ezanı, imsakten sonra, güneşin doğmasına daha yakın bir zamanda okunur. Bu yüzden Ramazan dışında “ezan okununca sahur biter” düşüncesi geçerli değildir: kaza veya nafile oruç tutanlar takvimdeki imsak saatine bakmalıdır.</p>
${h.mini('im', { p: ['il'], d: { il: 'erzurum', yil: 2027 }, c: 'İlinizin her sabahki imsak saati' })}
<h2>İmsak ile güneş arasındaki süre</h2>
${h.table(['Tarih', 'Ankara imsak', 'Ankara güneş', 'Fark'], [r.ilk, r.son, haziran, aralik].map((d) => [h.day(d), K.hhmm(ank(d).imsak), K.hhmm(ank(d).gunes), `${fark(d)} dk`]), 'İmsak ile güneşin doğuşu arasındaki süre, Ankara')}
<p>Sabah namazı imsak ile güneşin doğuşu arasında kılınır. Yazın güneş daha dik bir açıyla yükselmediği için tan ağarması uzun sürer ve aradaki süre artar. Takvimdeki güneş vakti, gerçek doğuştan 7 dakika öncedir; temkin burada vakti geriye çeker ki sabah namazı güneş doğmadan kesin olarak bitsin. Akşam tarafı için ${h.a('iftar-saati', 'iftar saati')} sayfasına, gün gün tüm vakitler için ${h.a('imsakiye-2027', 'imsakiye 2027')} sayfasına bakın.</p>`,
  },
  en: {
    slug: 'imsak-sahur-time-turkey', nav: 'Imsak and sahur time', card: 'When does sahur end? Imsak in 81 provinces and the dawn call',
    title: 'Imsak time in Turkey: when does sahur end? 81 provinces',
    description: 'Imsak, the last moment of sahur, is when the sun is 18 degrees below the horizon. Pick a province and date; on the first day of Ramadan 2027, Ankara 06:19.',
    h1: 'Imsak time in Turkey: when does sahur end?',
    intro: 'Choose a province and a date: the tool shows the six prayer times including imsak, and for today counts down to the next one. Your province is never sent anywhere.',
    resume: `Imsak is the moment the fast begins and sahur, the pre-dawn meal, must end. The Diyanet defines it as true dawn (fajr al-sadiq), the light that spreads along the horizon, and computes it as the moment the sun is 18 degrees below the horizon; no safety margin is added to imsak. Sahur must be finished before then. On the first morning of Ramadan 2027, ${dShort(r.ilk, 'en')}, imsak in Ankara is computed at ${K.hhmm(ank(r.ilk).imsak)}, and on the last morning, ${dShort(r.son, 'en')}, at ${K.hhmm(ank(r.son).imsak)}; as days lengthen, imsak comes more than a minute earlier each morning. That first morning the earliest imsak is in ${u.ilkImsak.il.en} at ${K.hhmm(u.ilkImsak.v.imsak)} and the latest in ${u.sonImsak.il.en} at ${K.hhmm(u.sonImsak.v.imsak)}. During Ramadan the dawn call to prayer is made at imsak, so hearing it means it is time to stop eating; outside Ramadan the dawn call comes later. Times are computed for the 81 provincial centres and, compared with the Diyanet calendar, match to the minute on most days and differ by one minute otherwise.`,
    faqs: [
      { q: 'What is the latest time to finish sahur?', a: `Before imsak. Imsak is the moment the fast starts; eating or drinking after it breaks the fast. The Diyanet adds no margin to imsak, so the calendar time is the last moment and finishing a few minutes earlier is the cautious choice. On the first morning of Ramadan 2027, for example, imsak in Ankara is computed at ${K.hhmm(ank(r.ilk).imsak)}.` },
      { q: 'Why is the dawn call to prayer made at imsak during Ramadan?', a: 'The Diyanet has the dawn call made at imsak during Ramadan so that people fasting can hear when sahur ends; once it is heard, the fast has begun. Outside Ramadan the dawn call comes some time after imsak, before sunrise, so anyone making up a fast or keeping a voluntary one should go by the imsak time in the calendar, not by the call.' },
      { q: 'How long is it from imsak to sunrise?', a: `In Ankara, ${fark(r.ilk)} minutes on the first day of Ramadan 2027. The gap depends on season and latitude: it grows to ${fark(haziran)} minutes in late June and is ${fark(aralik)} minutes in late December. The dawn prayer is performed in this window. Because of the safety margin, the sunrise time in the calendar is 7 minutes before the actual sunrise.` },
    ],
    body: (h) => `<h2>Ramadan 2027: imsak in ten large provinces</h2>
${h.table(['Province', h.day(r.ilk), h.day(ORTA), h.day(r.son)], BUYUK.map((s) => [K.il(s).en, K.hhmm(K.ilVakit(s, r.ilk).imsak), K.hhmm(K.ilVakit(s, ORTA).imsak), K.hhmm(K.ilVakit(s, r.son).imsak)]), 'Imsak time (end of sahur), computed, Turkey time')}
<p>On the last morning, ${h.day(r.son)}, imsak is earliest in ${uS.ilkImsak.il.en} at ${h.hhmm(uS.ilkImsak.v.imsak)} and latest in ${uS.sonImsak.il.en} at ${h.hhmm(uS.sonImsak.v.imsak)}. Because imsak moves earlier through the month, getting up for sahur means rising a little earlier each morning.</p>
<h2>False dawn and true dawn</h2>
<p>The sky brightens in two stages between night and morning. First a thin vertical light appears on the horizon and fades: the false dawn, fajr al-kadhib. Then a horizontal glow spreads along the horizon: the true dawn, fajr al-sadiq. ${h.src('imsak', 'According to the Diyanet')}, imsak is the start of this second light, which corresponds to the sun 18 degrees below the horizon. Some countries use other angles, such as 15 or 19.5 degrees, so timetables published abroad can differ from imsak times in Turkey.</p>
<h2>The dawn call and imsak</h2>
<p>${h.src('sabah-ezani', 'The Diyanet')} has the dawn call to prayer made at imsak throughout Ramadan; once it is heard, the fast has begun. For the rest of the year the dawn call is made after imsak, closer to sunrise. Outside Ramadan the idea that sahur ends with the call therefore does not hold: anyone making up a fast or keeping a voluntary one should go by the imsak time in the calendar.</p>
${h.mini('im', { p: ['il'], d: { il: 'erzurum', yil: 2027 }, c: 'Imsak every morning in your province' })}
<h2>The time between imsak and sunrise</h2>
${h.table(['Date', 'Ankara imsak', 'Ankara sunrise', 'Gap'], [r.ilk, r.son, haziran, aralik].map((d) => [h.day(d), K.hhmm(ank(d).imsak), K.hhmm(ank(d).gunes), `${fark(d)} min`]), 'Time between imsak and sunrise, Ankara')}
<p>The dawn prayer is performed between imsak and sunrise. In summer twilight lasts longer and the gap grows. The sunrise time in the calendar is 7 minutes before the astronomical sunrise; here the margin pulls the time back so that the dawn prayer surely ends before the sun is up. For the evening side see ${h.a('iftar-saati', 'iftar time')}, and for all times day by day ${h.a('imsakiye-2027', 'the 2027 Ramadan timetable')}.</p>`,
  },
});
