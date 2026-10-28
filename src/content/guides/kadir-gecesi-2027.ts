/** Kadir Gecesi 2027 : Diyanet listesi ; o akşamın iftar vakti engine/vakit.ts ile hesaplanır. */
import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { dShort, dLong } from '../../lib/tool-specs';

const r = K.ramazan(2027)!, r28 = K.ramazan(2028)!;
const kd = K.diniGunler(2027).find((e) => e.id === 'kadir')!;
const sehir = ['istanbul', 'ankara', 'izmir', 'bursa', 'antalya', 'konya', 'adana', 'gaziantep', 'diyarbakir', 'erzurum'];
const v = (s: string) => K.ilVakit(s, r.kadir);
const ist = v('istanbul');
const sabah = K.ilVakit('istanbul', K.addDays(r.kadir, 1)).imsak;
const gece = K.ramazanGunu(r, r.kadir) + 1;
const sonraki = K.ramazanlar().filter((x) => x.kadir > r.kadir).slice(0, 4);

export default defineGuide({
  id: 'kadir-gecesi-2027', group: 'bayram', order: 10, tool: 'rm', toolArg: { yil: 2027 },
  countdown: { date: r.kadir, time: K.hhmm(ist.aksam), label: { tr: 'Kadir Gecesi 2027 (İstanbul iftarı)', en: 'Laylat al-Qadr 2027 (Istanbul iftar)' } },
  related: ['ramazan-2027', 'dini-gunler-2027', 'ramazan-bayrami-2027', 'imsakiye-2027', 'teravih-kac-rekat'],
  sources: ['dg2027', 'dg2028', 'namazvakitleri'],
  tr: {
    slug: 'kadir-gecesi-2027', nav: 'Kadir Gecesi 2027', card: '5 Mart 2027 Cuma akşamı: Ramazan\'ın 27. gecesi',
    title: 'Kadir Gecesi 2027 ne zaman? 5 Mart Cuma akşamı, iftar saati',
    description: 'Kadir Gecesi 2027: 5 Mart Cuma akşamı, Ramazan\'ın 27. gecesi. Gece saat kaçta başlar, büyük şehirlerde o akşam iftar kaçta, 2028 ve sonraki yılların tarihi.',
    h1: 'Kadir Gecesi 2027: 5 Mart Cuma akşamı',
    intro: 'Yılı seçin: araç Ramazan ayının başını, Kadir Gecesini, son orucu ve bayramı gösterir. Sayaç, İstanbul\'da Kadir Gecesinin başladığı iftar anına sayar.',
    resume: `Kadir Gecesi 2027, Diyanet İşleri Başkanlığının dini günler listesine göre ${dShort(r.kadir, 'tr')} akşamıdır. Listede ${kd.hicri} olarak yazılan günün akşamı, Ramazan ayının ${gece}. gecesine karşılık gelir; Türkiye'de Kadir Gecesi geleneksel olarak bu gece idrak edilir. Gece, o günün akşam vaktiyle, yani iftarla başlar ve ertesi sabah imsaka kadar sürer. İstanbul'da 5 Mart akşamı iftar vakti hesabımıza göre ${K.hhmm(ist.aksam)}, Ankara'da ${K.hhmm(v('ankara').aksam)}, Erzurum'da ${K.hhmm(v('erzurum').aksam)}; ertesi sabah İstanbul'da imsak ${K.hhmm(K.ilVakit('istanbul', K.addDays(r.kadir, 1)).imsak)}. 2027 Ramazanı ${dShort(r.ilk, 'tr')} günü başlar ve ${r.gun} gün sürer; Kadir Gecesinden üç gün sonra arefe, dört gün sonra Ramazan Bayramı gelir. Kur'an'da adıyla bir sure bulunan bu gece, Ramazan'ın son on gününde aranır. Kadir Gecesi resmi tatil değildir; 6 Mart Cumartesi sabahı hafta sonu tatili olanlar için gece uzun bir ibadet gecesine dönüşebilir.`,
    faqs: [
      { q: 'Kadir Gecesi 2027 hangi gün?', a: `${dShort(r.kadir, 'tr')} akşamı. Diyanet listesinde ${kd.hicri} tarihi yazılıdır; gece o günün akşamından ertesi sabaha kadar sürer ve Ramazan ayının ${gece}. gecesine karşılık gelir. 2027'de Ramazan ayı ${dShort(r.ilk, 'tr')} günü başlar ve ${r.gun} gün sürer; Kadir Gecesinin ertesi günü de oruç tutulur. Ramazan Bayramı ise ${dShort(r.bayram, 'tr')} günü gelir.` },
      { q: 'Kadir Gecesi saat kaçta başlar?', a: `Akşam namazı vaktinde, yani iftarla. ${dShort(r.kadir, 'tr')} günü bu vakit İstanbul'da ${K.hhmm(ist.aksam)}, İzmir'de ${K.hhmm(v('izmir').aksam)}, Diyarbakır'da ${K.hhmm(v('diyarbakir').aksam)} olarak hesaplanır. Vakitler ilden ile değişir; sayfadaki tabloda ${sehir.length} ilin akşam vakti ayrı ayrı yer alır. Gece, ertesi sabahın imsak vaktine kadar sürer: İstanbul'da imsak saat ${K.hhmm(sabah)} olduğundan gecenin süresi ${K.sure(1440 - ist.aksam + sabah, 'tr')} eder.` },
      { q: 'Kadir Gecesi 2028\'de ne zaman?', a: `${dShort(r28.kadir, 'tr')} akşamı. Hicri yıl kısa olduğundan Kadir Gecesi her yıl yaklaşık on bir gün öne gelir. 2028 yılında Ramazan ayı ${dShort(r28.ilk, 'tr')} günü başlar ve ${r28.gun} gün sürer. Sonraki yılların tarihleri de Diyanet listelerinde yer alır: ${sonraki.slice(1).map((x) => dLong(x.kadir, 'tr')).join(', ')}. Her biri ilgili günün akşamıdır.` },
    ],
    body: (h) => `<h2>5 Mart akşamı büyük şehirlerde iftar ve ertesi imsak</h2>
<p>Kadir Gecesi iftarla başlar. Aşağıdaki vakitler Diyanet ölçüleriyle hesaplanmıştır ve resmi takvimle en çok bir dakika farklıdır; ibadet için ${h.src('namazvakitleri', 'Diyanet\'in resmi vakitleri')} esastır.</p>
${h.table(['İl', 'İftar (5 Mart)', 'Yatsı', 'İmsak (6 Mart)'], sehir.map((s) => [K.il(s).ad, h.hhmm(v(s).aksam), h.hhmm(v(s).yatsi), h.hhmm(K.ilVakit(s, K.addDays(r.kadir, 1)).imsak)]), 'Kadir Gecesi 2027: hesaplanan vakitler, Türkiye saati')}
<h2>Neden 27. gece?</h2>
<p>Kadir Gecesinin Ramazan'ın hangi gecesi olduğu kesin olarak bildirilmemiştir; rivayetler son on günün tek gecelerini işaret eder. Türkiye'de Diyanet, Ramazan'ın 27. gecesini Kadir Gecesi olarak ilan eder ve camilerde o gece özel programlar yapılır. Takvimde 26 Ramazan günü yazılır, çünkü hicri takvimde gece, kendisinden sonraki güne aittir: 26 Ramazan akşamı başlayan gece, 27. gecedir.</p>
<h2>Gece nasıl geçirilir?</h2>
<p>Kadir Gecesinde camiler yatsı ve teravih namazından sonra da açık kalır; mukabele, vaaz, dua ve sabaha kadar süren programlar yapılır. Birçok kişi geceyi uyumadan ibadetle geçirir, sahuru yaptıktan sonra imsakla birlikte sabah namazını kılar. 2027'de gece Cuma akşamına denk geldiği için Cumartesi çalışmayanlar ertesi günü dinlenerek geçirebilir. Camideki programlar ve saatleri için bulunduğunuz yerin müftülüğünün duyurularına bakmak en doğrusudur.</p>
<h2>Ramazan 2027 içinde Kadir Gecesi</h2>
<p>Ramazan 2027 ${h.wday(r.ilk)} başlar. Kadir Gecesi ${h.wday(r.kadir)} akşamıdır; sonrasında üç oruç günü kalır. Son oruç ${h.wday(r.son)} tutulur ve bu gün aynı zamanda arefedir. Ramazan Bayramı ${h.wday(r.bayram)} başlar. İl il imsak ve iftar saatleri ${h.a('imsakiye-2027', 'imsakiye 2027')} sayfasında.</p>
${h.mini('im', { p: ['il'], d: { il: 'ankara', yil: 2027 }, c: 'İlinizin Ramazan 2027 imsakiyesi' })}
<h2>Sonraki yıllarda Kadir Gecesi</h2>
${h.table(['Yıl', 'Kadir Gecesi (akşamı)', 'Gün'], sonraki.map((x) => [x.kadir.slice(0, 4), h.day(x.kadir), h.wd(x.kadir)]), 'Kadir Gecesi, Diyanet listelerine göre')}
<p>Diğer kandil geceleri ve dini günler ${h.a('dini-gunler-2027', 'dini günler 2027')} sayfasında; Ramazan gecelerinde kılınan teravih için ${h.a('teravih-kac-rekat', 'teravih namazı')} sayfasına bakabilirsiniz.</p>`,
  },
  en: {
    slug: 'laylat-al-qadr-2027-turkey', nav: 'Laylat al-Qadr 2027', card: 'Evening of Friday 5 March 2027: the 27th night of Ramadan',
    title: 'Laylat al-Qadr 2027 in Turkey: Friday 5 March, evening times',
    description: 'Laylat al-Qadr (Kadir Gecesi) 2027 in Turkey is the evening of Friday 5 March, the 27th night of Ramadan. When it starts, iftar times by city, 2028 date.',
    h1: 'Laylat al-Qadr 2027 in Turkey: the evening of Friday 5 March',
    intro: 'Choose a year: the tool shows the start of Ramadan, Laylat al-Qadr, the last fast and the feast. The counter runs to the iftar that opens the night in Istanbul.',
    resume: `Laylat al-Qadr, the Night of Power, called Kadir Gecesi in Turkish, falls in 2027 on the evening of ${dShort(r.kadir, 'en')}, according to the Diyanet's list of religious days. The list gives the date as ${kd.hicri}; the evening of that day is the ${gece}th night of Ramadan, the night Turkey traditionally observes. The night begins at the sunset prayer, with iftar, and lasts until imsak the next morning. On 5 March we compute iftar at ${K.hhmm(ist.aksam)} in Istanbul, ${K.hhmm(v('ankara').aksam)} in Ankara and ${K.hhmm(v('erzurum').aksam)} in Erzurum; the next morning's imsak in Istanbul is ${K.hhmm(K.ilVakit('istanbul', K.addDays(r.kadir, 1)).imsak)}. Ramadan 2027 begins on ${dShort(r.ilk, 'en')} and lasts ${r.gun} days; the eve of the feast comes three days after Laylat al-Qadr and Eid al-Fitr four days after. The Quran has a chapter named after this night, which is sought in the last ten days of Ramadan. It is not a public holiday; with Saturday 6 March off for many, it can be a long night of prayer.`,
    faqs: [
      { q: 'When is Laylat al-Qadr 2027 in Turkey?', a: `On the evening of ${dShort(r.kadir, 'en')}. The Diyanet list gives ${kd.hicri}; the night lasts from that evening until the next morning and is the ${gece}th night of Ramadan. Ramadan 2027 starts on ${dShort(r.ilk, 'en')} and lasts ${r.gun} days, so the day after Laylat al-Qadr is still a fasting day. Eid al-Fitr follows on ${dShort(r.bayram, 'en')}.` },
      { q: 'What time does Laylat al-Qadr start?', a: `At the sunset prayer, with iftar. On ${dShort(r.kadir, 'en')} we compute it at ${K.hhmm(ist.aksam)} in Istanbul, ${K.hhmm(v('izmir').aksam)} in Izmir and ${K.hhmm(v('diyarbakir').aksam)} in Diyarbakır. The time varies from province to province. The night ends at the next morning's imsak, ${K.hhmm(sabah)} in Istanbul, which makes it ${K.sure(1440 - ist.aksam + sabah, 'en')} long there.` },
      { q: 'When is Laylat al-Qadr in 2028?', a: `On the evening of ${dShort(r28.kadir, 'en')}. Because the Hijri year is shorter, the night comes about eleven days earlier each year. Ramadan 2028 starts on ${dShort(r28.ilk, 'en')} and lasts ${r28.gun} days. The Diyanet lists also give the following years: ${sonraki.slice(1).map((x) => dLong(x.kadir, 'en')).join(', ')}, each on the evening of that day.` },
    ],
    body: (h) => `<h2>Iftar on 5 March and imsak the next morning</h2>
<p>Laylat al-Qadr begins at iftar. The times below are computed with the Diyanet's parameters and are at most a minute off the official calendar; for worship, ${h.src('namazvakitleri', 'the Diyanet\'s official times')} prevail.</p>
${h.table(['Province', 'Iftar (5 March)', 'Isha', 'Imsak (6 March)'], sehir.map((s) => [K.il(s).en, h.hhmm(v(s).aksam), h.hhmm(v(s).yatsi), h.hhmm(K.ilVakit(s, K.addDays(r.kadir, 1)).imsak)]), 'Laylat al-Qadr 2027: computed times, Turkey time')}
<h2>Why the 27th night?</h2>
<p>Which night of Ramadan is Laylat al-Qadr was never stated with certainty; the reports point to the odd nights of the last ten days. In Turkey the Diyanet announces the 27th night as Kadir Gecesi, and mosques hold special programmes that night. The calendar shows 26 Ramadan because in the Hijri calendar a night belongs to the following day: the night that begins on the evening of 26 Ramadan is the 27th night.</p>
<h2>How the night is spent</h2>
<p>On Laylat al-Qadr mosques stay open after the night and tarawih prayers, with Quran recitation, sermons and prayers that continue until dawn. Many people spend the night awake in worship, eat the pre-dawn meal and pray the dawn prayer at imsak. In 2027 the night falls on a Friday evening, so anyone with Saturday off can rest the next day. For programmes and times at a given mosque, the local mufti's office announcements are the reliable source.</p>
<h2>Laylat al-Qadr within Ramadan 2027</h2>
<p>Ramadan 2027 begins on ${h.wday(r.ilk)}. Laylat al-Qadr is the evening of ${h.wday(r.kadir)}, with three days of fasting left after it. The last fast is on ${h.wday(r.son)}, which is also the eve of the feast. Eid al-Fitr starts on ${h.wday(r.bayram)}. Fasting times by province are on ${h.a('imsakiye-2027', 'the 2027 Ramadan timetable')}.</p>
${h.mini('im', { p: ['il'], d: { il: 'ankara', yil: 2027 }, c: 'Ramadan 2027 timetable for your province' })}
<h2>Laylat al-Qadr in the coming years</h2>
${h.table(['Year', 'Laylat al-Qadr (evening of)', 'Day'], sonraki.map((x) => [x.kadir.slice(0, 4), h.day(x.kadir), h.wd(x.kadir)]), 'Laylat al-Qadr, from the Diyanet lists')}
<p>Other kandil nights and religious days are on ${h.a('dini-gunler-2027', 'religious days 2027')}; for the night prayers of Ramadan see ${h.a('teravih-kac-rekat', 'the tarawih prayer')}.</p>`,
  },
});
