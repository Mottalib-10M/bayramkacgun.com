/** Ramazan 2027 : başlangıç, Kadir, arefe ve bayram Diyanet listesinden ; oruç süreleri engine/iller.ts. */
import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { dShort, dLong } from '../../lib/tool-specs';

const r = K.ramazan(2027)!, r26 = K.ramazan(2026)!;
const ist = K.ramazanOzet('istanbul', 2027);
const tum = K.IL.map((x) => ({ x, o: K.ramazanOzet(x.slug, 2027) }));
const ilkKisa = [...tum].sort((a, b) => a.o.ilk.oruc - b.o.ilk.oruc)[0], sonUzun = [...tum].sort((a, b) => b.o.son.oruc - a.o.son.oruc)[0];
const u1 = K.uclar(r.ilk);
const once = K.addDays(r.ilk, -1);
const pazartesi = K.weekday(K.fromIso(r.ilk)) === 1;

export default defineGuide({
  id: 'ramazan-2027', group: 'ramazan', order: 20, tool: 'rm', toolArg: { yil: 2027 },
  countdown: { date: r.ilk, label: { tr: 'Ramazan 2027 (ilk oruç günü)', en: 'Ramadan 2027 (first day of fasting)' } },
  related: ['imsakiye-2027', 'kadir-gecesi-2027', 'ramazan-bayrami-2027', 'iftara-kac-dakika-kaldi', 'teravih-kac-rekat', 'imsakiye-istanbul'],
  sources: ['dg2027', 'imsak', 'temkin', 'namazvakitleri'],
  tr: {
    slug: 'ramazan-2027', nav: 'Ramazan 2027', card: '8 Şubat–8 Mart 2027: ilk oruç, ilk teravih, Kadir, oruç süreleri',
    title: 'Ramazan 2027 ne zaman başlıyor? İlk oruç 8 Şubat, 29 gün',
    description: 'Ramazan 2027: ilk oruç 8 Şubat Pazartesi, ilk teravih 7 Şubat Pazar akşamı, son oruç 8 Mart. 29 gün; Kadir Gecesi 5 Mart. Ramazana kaç gün kaldı, oruç kaç saat?',
    h1: 'Ramazan 2027: 8 Şubat Pazartesi başlıyor',
    intro: 'Yılı seçin: araç ilk orucu, ilk teravihi, Kadir Gecesini, son orucu ve bayramı gösterir; tablo 2035\'e kadar her Ramazanı listeler.',
    resume: `Ramazan 2027, Diyanet İşleri Başkanlığının dini günler listesine göre ${dShort(r.ilk, 'tr')} günü başlar: ilk oruç o gün tutulur. İlk teravih namazı bir önceki akşam, ${dShort(once, 'tr')} günü yatsıdan sonra kılınır ve ilk sahur o gece yapılır. Hicri ${r.hicriYil} yılının Ramazan ayı bu yıl ${r.gun} gün çeker; son oruç ${dShort(r.son, 'tr')} günü tutulur ve o gün aynı zamanda bayram arefesidir. Kadir Gecesi ${dShort(r.kadir, 'tr')} akşamıdır, Ramazan Bayramı ${dShort(r.bayram, 'tr')} günü başlar. Kış sonuna denk gelen bu Ramazanda oruçlar kısadır: İstanbul'da ilk gün imsak ${ist.ilk.imsak}, iftar ${ist.ilk.aksam}, oruç ${K.sure(ist.ilk.oruc, 'tr')}; ayın sonunda gün uzadığı için oruç ${K.sure(ist.son.oruc, 'tr')} olur. Ülke genelinde ilk gün en kısa oruç ${ilkKisa.x.ad} ilinde (${K.sure(ilkKisa.o.ilk.oruc, 'tr')}), son gün en uzun oruç ${sonUzun.x.ad} ilindedir (${K.sure(sonUzun.o.son.oruc, 'tr')}). Bir önceki Ramazan ${dLong(r26.ilk, 'tr')} tarihinde başlamıştı; Ramazan her yıl yaklaşık on bir gün öne gelir.`,
    faqs: [
      { q: 'Ramazan 2027 hangi gün başlıyor?', a: `Diyanet İşleri Başkanlığının 2027 dini günler listesine göre ilk oruç ${dShort(r.ilk, 'tr')} günü tutulur. Teravih ve sahur bir önceki akşam başlar: ${dShort(once, 'tr')} akşamı yatsıdan sonra ilk teravih kılınır, o gece ilk sahur yapılır. Diyanet ay başını önceden hesapladığı için tarih hilal gözlemine göre değişmez; imsakiye ve bayram tatili bu tarihe göre düzenlenir.` },
      { q: '2027 Ramazanı kaç gün sürecek?', a: `${r.gun} gün. Son oruç ${dShort(r.son, 'tr')} günü tutulur; o gün aynı zamanda bayram arefesidir ve 2429 sayılı Kanuna göre saat 13.00'ten sonrası tatildir. Ertesi gün, ${dShort(r.bayram, 'tr')}, Ramazan Bayramının birinci günüdür. Diyanet ay başlarını astronomik ölçüyle önceden belirlediği için ayın kaç gün çekeceği bugünden bellidir.` },
      { q: 'Ramazan 2027\'de oruç kaç saat sürüyor?', a: `İstanbul'da ilk gün ${K.sure(ist.ilk.oruc, 'tr')}, son gün ${K.sure(ist.son.oruc, 'tr')}, ay ortalaması ${K.sure(ist.ortalama, 'tr')}. Oruç süresi imsak ile akşam vakti arasındaki zamandır; Şubattan Marta günler uzadığı için her gün iki üç dakika artar. İller arasında da fark vardır: ilk gün en kısa oruç ${ilkKisa.x.ad} ilinde, son gün en uzun oruç ${sonUzun.x.ad} ilindedir.` },
      { q: 'Ramazana kaç gün kaldı?', a: `${dLong(K.OKUMA, 'tr')} itibarıyla ilk oruca ${K.daysBetween(K.OKUMA, r.ilk)} gün var. Sayfanın üstündeki sayaç kalan süreyi gün, saat, dakika ve saniye olarak canlı gösterir ve her zaman Türkiye saatine göre çalışır; telefonunuz başka bir saat dilimindeyse bile ilk oruç gününe sayar. Kadir Gecesi ve bayram için ayrı sayaçlar bayrama kaç gün kaldı sayfasındadır.` },
    ],
    body: (h) => `<h2>Ramazan 2027 takvimi</h2>
${h.table(['Ne', 'Tarih'], [['İlk teravih ve ilk sahur', `${h.wday(once)} akşamı ve gecesi`], ['İlk oruç (1 Ramazan)', h.wday(r.ilk)], ['Kadir Gecesi', `${h.wday(r.kadir)} akşamı`], ['Son oruç ve arefe', h.wday(r.son)], ['Ramazan Bayramı', `${h.wday(r.bayram)} – ${h.wday(K.addDays(r.bayram, 2))}`]], 'Ramazan 2027 (Diyanet İşleri Başkanlığı)')}
<p>${pazartesi ? 'Ramazan Pazartesi başladığı için ilk sahur Pazar gecesidir; hafta sonunu dinlenerek geçirip Ramazana hazırlanmak mümkündür.' : ''} Ramazan boyunca hafta sonları dört kez gelir; son hafta sonu Kadir Gecesinin hemen ardındadır.</p>
<h2>Oruç saatleri: kısa başlayıp uzayan bir ay</h2>
<p>Şubat başında günler hâlâ kısadır, Mart başında ise belirgin şekilde uzar. Bu yüzden imsak her gün bir iki dakika öne gelir, iftar bir iki dakika geri gider. İstanbul'da imsak ayın ilk günü ${ist.ilk.imsak}, son günü ${ist.son.imsak}; iftar ise ilk gün ${ist.ilk.aksam}, son gün ${ist.son.aksam} olarak hesaplanır. Doğu ile batı arasındaki fark da büyüktür: ilk gün en erken iftar ${K.il(u1.ilkIftar.il.slug).ad} ilinde ${h.hhmm(u1.ilkIftar.v.aksam)}, en geç iftar ${K.il(u1.sonIftar.il.slug).ad} ilinde ${h.hhmm(u1.sonIftar.v.aksam)}. Türkiye tek bir saat dilimi kullandığı için doğudaki iller hem daha erken imsak eder hem daha erken iftar açar.</p>
${h.mini('im', { p: ['il'], d: { il: 'istanbul', yil: 2027 }, c: 'İlinizin gün gün imsakiyesi' })}
<h2>Vakitler nasıl hesaplanıyor?</h2>
<p>İmsak, güneşin ufkun 18 derece altına geldiği andır; iftar, güneş battıktan 7 dakika sonra okunan akşam ezanıdır. Bu ölçüleri ve temkin sürelerini Diyanet açıklamıştır. Sitemizdeki imsakiye bu ölçülerle 81 il merkezi için hesaplanır ve Diyanet'in resmi takvimiyle karşılaştırılır: günlerin büyük çoğunluğunda dakikası dakikasına aynıdır, fark hiçbir zaman bir dakikayı geçmez. Yine de ibadet için ${h.src('namazvakitleri', 'Diyanet\'in resmi namaz vakitleri')} esastır. Ayrıntılar ${h.a('imsakiye-2027', 'imsakiye 2027')} ve ${h.a('method', 'yöntem')} sayfalarında.</p>
<h2>Ramazanda her gün</h2>
<p>Gün içinde en çok sorulan iki soru "sahur ne zaman biter" ve "iftara ne kadar kaldı" sorularıdır. İlki için ${h.a('imsak-sahur-vakti', 'imsak ve sahur vakti')}, ikincisi için ${h.a('iftara-kac-dakika-kaldi', 'iftara kaç dakika kaldı')} sayfası canlı sayaçla cevap verir. Teravihin kaç rekât kılındığı ${h.a('teravih-kac-rekat', 'teravih')} sayfasında anlatılır.</p>`,
  },
  en: {
    slug: 'ramadan-2027-turkey', nav: 'Ramadan 2027', card: '8 February to 8 March 2027: first fast, tarawih, Qadr, fasting hours',
    title: 'Ramadan 2027 in Turkey: starts Monday 8 February, 29 days',
    description: 'Ramadan 2027 in Turkey: first fast Monday 8 February, first tarawih the evening before, last fast 8 March. 29 days; Laylat al-Qadr 5 March. Fast lengths.',
    h1: 'Ramadan 2027 in Turkey: begins Monday 8 February',
    intro: 'Choose a year: the tool shows the first fast, the first tarawih, Laylat al-Qadr, the last fast and the feast; the table lists every Ramadan up to 2035.',
    resume: `Ramadan 2027 begins in Turkey on ${dShort(r.ilk, 'en')}, the first day of fasting, according to the religious-days list of the Presidency of Religious Affairs (Diyanet). The first tarawih prayer is held the evening before, ${dShort(once, 'en')}, after the night prayer, and the first pre-dawn meal, sahur, is eaten that night. The month of Ramadan in Hijri year ${r.hicriYil} lasts ${r.gun} days; the last fast is on ${dShort(r.son, 'en')}, which is also the eve of the feast. Laylat al-Qadr is the evening of ${dShort(r.kadir, 'en')}, and Eid al-Fitr starts on ${dShort(r.bayram, 'en')}. Falling at the end of winter, this Ramadan has short fasts: in Istanbul the first day runs from ${ist.ilk.imsak} to ${ist.ilk.aksam}, ${K.sure(ist.ilk.oruc, 'en')}, and by the end of the month the fast lasts ${K.sure(ist.son.oruc, 'en')} as the days lengthen. Across the country the shortest first-day fast is in ${ilkKisa.x.en} (${K.sure(ilkKisa.o.ilk.oruc, 'en')}) and the longest last-day fast in ${sonUzun.x.en} (${K.sure(sonUzun.o.son.oruc, 'en')}). The previous Ramadan began on ${dLong(r26.ilk, 'en')}; Ramadan moves about eleven days earlier each year.`,
    faqs: [
      { q: 'When does Ramadan 2027 start in Turkey?', a: `According to the Diyanet's 2027 list of religious days, the first fast is on ${dShort(r.ilk, 'en')}. Tarawih and sahur begin the evening before: the first tarawih is prayed after isha on ${dShort(once, 'en')}, and the first sahur is that night. Because the Diyanet fixes the start of the month in advance, the date does not depend on a sighting, and the timetable and holidays follow it.` },
      { q: 'How long is Ramadan 2027?', a: `${r.gun} days. The last fast is on ${dShort(r.son, 'en')}, which is also the eve of the feast: under Law 2429 the afternoon from 1 pm is a holiday. The next day, ${dShort(r.bayram, 'en')}, is the first day of Ramazan Bayramı. Since the Diyanet sets month starts astronomically in advance, the length of the month is already known.` },
      { q: 'How many hours is the fast during Ramadan 2027?', a: `In Istanbul ${K.sure(ist.ilk.oruc, 'en')} on the first day, ${K.sure(ist.son.oruc, 'en')} on the last and ${K.sure(ist.ortalama, 'en')} on average. The fast runs from imsak to maghrib, and as days lengthen from February to March it grows by two to three minutes a day. Provinces differ too: the shortest first-day fast is in ${ilkKisa.x.en}, the longest last-day fast in ${sonUzun.x.en}.` },
      { q: 'How many days until Ramadan 2027?', a: `As of ${dLong(K.OKUMA, 'en')} there are ${K.daysBetween(K.OKUMA, r.ilk)} days until the first fast. The counter at the top of the page shows the time left in days, hours, minutes and seconds and always runs on Turkey time, so it counts to the first day of fasting even if your phone is set to another time zone. Separate counters for Laylat al-Qadr and the feast are on the countdown page.` },
    ],
    body: (h) => `<h2>The Ramadan 2027 calendar</h2>
${h.table(['What', 'Date'], [['First tarawih and first sahur', `evening and night of ${h.wday(once)}`], ['First fast (1 Ramadan)', h.wday(r.ilk)], ['Laylat al-Qadr', `evening of ${h.wday(r.kadir)}`], ['Last fast and eve of the feast', h.wday(r.son)], ['Eid al-Fitr', `${h.wday(r.bayram)} – ${h.wday(K.addDays(r.bayram, 2))}`]], 'Ramadan 2027 (Diyanet)')}
<p>${pazartesi ? 'As Ramadan starts on a Monday, the first sahur falls on Sunday night, leaving the weekend to rest and prepare.' : ''} Four weekends fall within the month; the last comes straight after Laylat al-Qadr.</p>
<h2>Fasting hours: a month that starts short and grows</h2>
<p>In early February the days are still short; by early March they are noticeably longer. Imsak moves a minute or two earlier every day and iftar a minute or two later. In Istanbul imsak moves from ${ist.ilk.imsak} to ${ist.son.imsak} and iftar from ${ist.ilk.aksam} to ${ist.son.aksam}. The east-west gap is large too: on the first day the earliest iftar is in ${K.il(u1.ilkIftar.il.slug).en} at ${h.hhmm(u1.ilkIftar.v.aksam)} and the latest in ${K.il(u1.sonIftar.il.slug).en} at ${h.hhmm(u1.sonIftar.v.aksam)}. Turkey uses a single time zone, so eastern provinces both start and break the fast earlier.</p>
${h.mini('im', { p: ['il'], d: { il: 'istanbul', yil: 2027 }, c: 'Day-by-day timetable for your province' })}
<h2>How the times are computed</h2>
<p>Imsak is the moment the sun is 18 degrees below the horizon; iftar is the sunset call to prayer, 7 minutes after sunset. The Diyanet has published these parameters and safety margins. Our timetable applies them to all 81 provincial centres and compares the result with the Diyanet's official calendar: on the vast majority of days the times are identical to the minute, and they never differ by more than one minute. For worship, ${h.src('namazvakitleri', 'the Diyanet\'s official prayer times')} still prevail. Details on ${h.a('imsakiye-2027', 'the 2027 timetable')} and the ${h.a('method', 'method')} page.</p>
<h2>Every day of Ramadan</h2>
<p>The two questions asked most during the day are "when does sahur end?" and "how long until iftar?". ${h.a('imsak-sahur-vakti', 'Imsak and sahur time')} answers the first and ${h.a('iftara-kac-dakika-kaldi', 'minutes until iftar')} the second, with a live counter. How many units the tarawih prayer has is explained on ${h.a('teravih-kac-rekat', 'tarawih')}.</p>`,
  },
});
