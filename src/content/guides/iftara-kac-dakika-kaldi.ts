/** İftara kaç dakika kaldı : canlı geri sayım (Vakit.tsx), il farkları İstanbul'a göre (engine/iller.ts). */
import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { dShort } from '../../lib/tool-specs';

const r = K.ramazan(2027)!;
const SEC = ['edirne', 'canakkale', 'izmir', 'bursa', 'antalya', 'ankara', 'konya', 'samsun', 'trabzon', 'adana', 'gaziantep', 'diyarbakir', 'erzurum', 'van', 'igdir'];
const ist = K.ilVakit('istanbul', r.ilk);
const fark = (s: string) => K.iftarFarki(s, r.ilk);
const isaret = (x: number, l: 'tr' | 'en') => (x === 0 ? (l === 'tr' ? 'aynı' : 'same') : `${x > 0 ? '+' : '−'}${Math.abs(x)} ${l === 'tr' ? 'dk' : 'min'}`);
const ogle = K.ilVakit('ankara', r.ilk);
const ogledenIftara = ogle.aksam - ogle.ogle;
const ikindidenIftara = ogle.aksam - ogle.ikindi;
const u = K.uclar(r.ilk);

export default defineGuide({
  id: 'iftara-kac-dakika-kaldi', group: 'ramazan', order: 24, tool: 'vakit',
  countdown: { date: r.ilk, label: { tr: 'Ramazan 2027 (ilk oruç)', en: 'Ramadan 2027 (first fast)' } },
  related: ['iftar-saati', 'imsak-sahur-vakti', 'imsakiye-2027', 'ramazan-2027', 'bayrama-kac-gun-kaldi', 'imsakiye-erzurum'],
  sources: ['temkin', 'kiyas', 'namazvakitleri'],
  tr: {
    slug: 'iftara-kac-dakika-kaldi', nav: 'İftara kaç dakika kaldı?', card: 'Canlı geri sayım: ilinizde iftara kalan saat, dakika, saniye',
    title: 'İftara kaç dakika kaldı? 81 il için canlı iftar geri sayımı',
    description: 'İftara kaç dakika kaldı? İlinizi seçin: sayaç akşam ezanına kalan süreyi saniyesine kadar canlı gösterir. Diyanet ölçüleriyle, hep Türkiye saatine göre.',
    h1: 'İftara kaç dakika kaldı? Canlı geri sayım',
    intro: 'İlinizi seçin: bugünün iftar saati ve kalan süre saniye saniye görünür. İftar geçtiyse sayaç sıradaki vakte, gece ise yarının imsakine geçer.',
    resume: `Bu sayaç, seçtiğiniz ilin akşam vaktine, yani iftara kalan süreyi canlı gösterir. Akşam vakti Diyanet ölçüsüyle hesaplanır: güneşin batışından 7 dakika sonra. Sayaç cihazınızın saatini kullanır ama hesabı her zaman Türkiye saatine, UTC+3'e göre yapar; telefonunuz yurt dışı saatinde olsa bile Türkiye'deki iftar saatine sayar. Hiçbir bilgi sunucuya gönderilmez, seçtiğiniz il yalnızca adres satırına yazılır ki sayfayı yer imlerine ekleyebilesiniz. İftar geçtikten sonra sayaç yatsıya, yatsıdan sonra ertesi sabahın imsakine, yani sahurun bitişine sayar. Ramazan 2027'nin ilk günü, ${dShort(r.ilk, 'tr')}, İstanbul'da iftar ${K.hhmm(ist.aksam)} olarak hesaplanır; aynı gün ${u.ilkIftar.il.ad} ilinde ${K.hhmm(u.ilkIftar.v.aksam)}, ${u.sonIftar.il.ad} ilinde ${K.hhmm(u.sonIftar.v.aksam)}. Kalan süre il merkezine göredir; ilçenizde birkaç dakika fark olabilir. Doğru sonuç için cihaz saatinin ağ saatiyle eşitlendiğinden emin olun. Sayaç Ramazan dışında da çalışır: kaza ya da nafile oruç tutanlar için aynı akşam vakti geçerlidir.`,
    faqs: [
      { q: 'İftar geri sayımı hangi saate göre çalışıyor?', a: 'Türkiye saatine, yani yıl boyu UTC+3\'e göre. Cihazınızın saat dilimi farklıysa, örneğin yurt dışındaysanız, sayaç yine Türkiye\'deki iftar anına sayar ve ekranda cihazınızın saat dilimi not olarak gösterilir. Hesap tarayıcınızda yapılır; seçtiğiniz il yalnızca adres satırına yazılır, böylece sayfayı yer imlerine ekleyip her akşam aynı ille açabilirsiniz.' },
      { q: 'Sayaç ile ezan arasında neden birkaç saniye fark var?', a: 'Sayaç cihazınızın saatine dayanır; telefonun saati ağdan otomatik eşitlenmiyorsa birkaç saniye, bazen dakikalarca kayabilir. Ayrıca hesaplanan vakit resmi takvimden en çok bir dakika farklı olabilir ve sayaç il merkezine göre sayar. Bu yüzden orucu ezanla ya da Diyanet\'in resmi takvimiyle açın; sayacı yaklaşan iftarı izlemek için kullanın.' },
      { q: 'İftardan sonra sayaç neyi gösteriyor?', a: 'Sıradaki vakti. İftardan sonra yatsıya, yatsıdan sonra ertesi sabahın imsakine, yani sahurun bitiş anına sayar. Böylece aynı sayfa gece sahur için de kullanılabilir. Tarih alanından başka bir gün seçerseniz sayaç durur ve o günün altı vakti listelenir; bugüne döndüğünüzde canlı sayım kaldığı yerden yeniden başlar.' },
    ],
    body: (h) => `<h2>Ramazanda bir günün akışı</h2>
<p>Gün içinde iftara kalan süre, vakitlerle birlikte düşünülünce daha anlamlı olur. Ramazan 2027'nin ilk günü Ankara'da öğle vakti ${h.hhmm(ogle.ogle)}, ikindi ${h.hhmm(ogle.ikindi)}, iftar ${h.hhmm(ogle.aksam)} olarak hesaplanır. Öğle ezanından iftara ${K.sure(ogledenIftara, 'tr')}, ikindiden iftara ${K.sure(ikindidenIftara, 'tr')} vardır. Oruç bu günde toplam ${K.sure(ogle.aksam - ogle.imsak, 'tr')} sürer.</p>
<h2>İllere göre iftar: İstanbul'dan kaç dakika önce ya da sonra?</h2>
<p>İstanbul'da iftar ${h.day(r.ilk)} günü ${h.hhmm(ist.aksam)}. Aşağıdaki iller için fark aynı gün hesaplanmıştır; eksi işareti iftarın İstanbul'dan önce açıldığını gösterir.</p>
${h.table(['İl', 'İftar', 'İstanbul\'a göre'], SEC.map((s) => [K.il(s).ad, K.hhmm(K.ilVakit(s, r.ilk).aksam), isaret(fark(s), 'tr')]), `İftar saati ve İstanbul farkı, ${h.day(r.ilk)}`)}
<p>Fark çoğunlukla boylamdan gelir. ${h.src('kiyas', 'Diyanet\'in kıyaslamalarına')} göre bir boylam derecesi yaklaşık dört dakikadır; Iğdır ile Çanakkale arasında on sekiz dereceden fazla boylam vardır. Enlemin etkisi kışın ve yazın ters yöne işler: Şubatta güneyde gün biraz daha uzundur, bu yüzden Antalya, İstanbul'un doğusunda olmasına rağmen iftarı aynı saatte açar.</p>
${h.mini('im', { p: ['il'], d: { il: 'van', yil: 2027 }, c: 'İlinizin Ramazan 2027 iftar listesi' })}
<h2>Sayaç nasıl hesaplıyor?</h2>
<p>Sayfa açıldığında seçilen ilin enlem ve boylamıyla o günün altı vakti cihazınızda hesaplanır. Sayaç her saniye, Türkiye saatine göre şimdiki an ile akşam vakti arasındaki farkı yeniden çizer. İnternet bağlantısı kesilse de çalışmaya devam eder, çünkü hesap için sunucuya gerek yoktur. Vakit hesabının ayrıntısı ve resmi takvimle karşılaştırma ${h.a('method', 'yöntem')} sayfasında; tarih seçerek başka bir günün vakitlerine bakmak için ${h.a('iftar-saati', 'iftar saati')} sayfası, sahur için ${h.a('imsak-sahur-vakti', 'imsak vakti')} sayfası kullanılabilir. Bayram için ise ${h.a('bayrama-kac-gun-kaldi', 'bayrama kaç gün kaldı')} sayacı var.</p>
<h2>Sayacı doğru kullanmak için</h2>
<p>Telefonun saatini otomatik ağ saatine ayarlayın; elle kurulmuş bir saat birkaç dakika kayabilir. Seyahatteyseniz il seçimini güncelleyin, çünkü sayaç seçilen ilin merkezine göre sayar. Yüksek bir yerde ya da ilin en batısındaysanız güneş biraz geç batar; temkin bu farkı karşılamak içindir, bu yüzden orucu sayacın sıfırlandığı andan önce açmayın.</p>`,
  },
  en: {
    slug: 'iftar-countdown-turkey', nav: 'Iftar countdown', card: 'Live countdown: hours, minutes and seconds to iftar in your province',
    title: 'Iftar countdown Turkey: how long until iftar, 81 provinces',
    description: 'How many minutes until iftar? Choose your province: the counter shows the time left to the evening call, live to the second. Diyanet rules, in Turkey time.',
    h1: 'How long until iftar? Live countdown',
    intro: 'Choose your province: today\'s iftar time and the time left appear second by second. After iftar the counter moves to the next prayer, at night to tomorrow\'s imsak.',
    resume: `This counter shows the time left until maghrib, the iftar time, in the province you choose. Maghrib is computed with the Diyanet's rule: 7 minutes after sunset. The counter uses your device's clock but always works in Turkey time, UTC+3, so even if your phone is set to another time zone it counts down to iftar in Turkey. Nothing is sent to a server; the province you pick is written only in the address bar, so you can bookmark the page. After iftar the counter moves on to isha, and after isha to the next morning's imsak, the end of sahur. On the first day of Ramadan 2027, ${dShort(r.ilk, 'en')}, iftar in Istanbul is computed at ${K.hhmm(ist.aksam)}; the same day it is ${K.hhmm(u.ilkIftar.v.aksam)} in ${u.ilkIftar.il.en} and ${K.hhmm(u.sonIftar.v.aksam)} in ${u.sonIftar.il.en}. The time left refers to the provincial centre; a district may differ by a few minutes. For a precise result, make sure the device clock is synchronised with network time.`,
    faqs: [
      { q: 'Which time does the iftar countdown use?', a: 'Turkey time, UTC+3 all year. If your device is in another time zone, for example while abroad, the counter still runs to the moment of iftar in Turkey, and a note shows the device\'s own time zone. The calculation happens in your browser; the province you pick is written only into the address bar, so you can bookmark the page and open it each evening.' },
      { q: 'Why can the counter differ from the call to prayer by a few seconds?', a: 'The counter relies on your device clock, which can drift by seconds or even minutes if it is not synced with the network. The computed time can also differ from the official calendar by up to a minute, and the counter refers to the provincial centre. Break the fast with the call or the Diyanet\'s official calendar, and use the counter to follow the approach of iftar.' },
      { q: 'What does the counter show after iftar?', a: 'The next prayer time: after iftar it counts to isha, and after isha to the next morning\'s imsak, the end of sahur, so the same page also works at night. If you pick another date, the live count stops and that day\'s six prayer times are listed; switching back to today restarts the countdown.' },
    ],
    body: (h) => `<h2>How a day of Ramadan unfolds</h2>
<p>The time left to iftar means more when read against the other prayer times. On the first day of Ramadan 2027, in Ankara, dhuhr is computed at ${h.hhmm(ogle.ogle)}, asr at ${h.hhmm(ogle.ikindi)} and iftar at ${h.hhmm(ogle.aksam)}. From the noon call to iftar there are ${K.sure(ogledenIftara, 'en')}, from asr ${K.sure(ikindidenIftara, 'en')}. The whole fast that day lasts ${K.sure(ogle.aksam - ogle.imsak, 'en')}.</p>
<h2>Iftar by province: how many minutes before or after Istanbul?</h2>
<p>In Istanbul iftar on ${h.day(r.ilk)} is at ${h.hhmm(ist.aksam)}. The gaps below are computed for the same day; a minus sign means iftar comes earlier than in Istanbul.</p>
${h.table(['Province', 'Iftar', 'Versus Istanbul'], SEC.map((s) => [K.il(s).en, K.hhmm(K.ilVakit(s, r.ilk).aksam), isaret(fark(s), 'en')]), `Iftar time and gap with Istanbul, ${h.day(r.ilk)}`)}
<p>Most of the gap comes from longitude. ${h.src('kiyas', 'According to the Diyanet\'s comparisons')}, one degree of longitude is worth about four minutes, and more than eighteen degrees separate Iğdır from Çanakkale. Latitude works in opposite directions in winter and summer: in February the day is slightly longer in the south, which is why Antalya, although east of Istanbul, breaks the fast at the same time.</p>
${h.mini('im', { p: ['il'], d: { il: 'van', yil: 2027 }, c: 'Iftar list for your province, Ramadan 2027' })}
<h2>How the counter works</h2>
<p>When the page opens, the six prayer times of the day are computed on your device from the province's latitude and longitude. Every second the counter redraws the difference between now, in Turkey time, and maghrib. It keeps running if the connection drops, because no server is needed. The method and the comparison with the official calendar are on the ${h.a('method', 'method')} page; to look at another day, use ${h.a('iftar-saati', 'iftar time')}, and for sahur ${h.a('imsak-sahur-vakti', 'imsak time')}. For the feast there is the ${h.a('bayrama-kac-gun-kaldi', 'countdown to bayram')}.</p>`,
  },
});
