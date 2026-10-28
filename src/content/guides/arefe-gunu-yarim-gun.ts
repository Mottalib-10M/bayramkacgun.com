/** Arefe günü yarım gün mü : 2429 md. 2 (13.00'ten itibaren), arefe tarihleri Diyanet listesinden. */
import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { dShort, aralik } from '../../lib/tool-specs';

const arefeler = [2026, 2027, 2028].flatMap((y) => (['ramazan', 'kurban'] as const).map((tur) => ({ y, tur, d: K.bayram(tur, y)!.arefe })));
const r27 = K.bayram('ramazan', 2027)!, k27 = K.bayram('kurban', 2027)!;
const tam = K.bayramTatili('ramazan', 2027, 1)!, yarim = K.bayramTatili('ramazan', 2027, 0.5, { yarim: true })!;
const ist = K.ilVakit('istanbul', r27.arefe);
const kt = K.bayramTatili('kurban', 2027, 0)!;
const hafta = (d: string) => (K.isWeekend(K.fromIso(d)) ? 1 : 0);

export default defineGuide({
  id: 'arefe-gunu-yarim-gun', group: 'bayram', order: 5, tool: 'bt', toolArg: { tur: 'ramazan', yil: 2027, izin: 1 },
  related: ['ramazan-bayrami-2027', 'kurban-bayrami-2027', '28-ekim-yarim-gun', 'resmi-tatil-calisma-ucreti', 'bayram-tatili-kac-gun'],
  sources: ['k2429', 'k4857', 'dg2027', 'dg2028'],
  tr: {
    slug: 'arefe-gunu-yarim-gun-mu', nav: 'Arefe günü yarım gün mü', card: 'Arefe 13.00\'ten sonra tatil: 2027 ve 2028 arefe günleri',
    title: 'Arefe günü yarım gün mü? 2027 arefe tarihleri ve çalışma',
    description: 'Arefe günü saat 13.00\'ten itibaren resmi tatildir. 2027 Ramazan arefesi 8 Mart Pazartesi, Kurban arefesi 15 Mayıs Cumartesi. Sabah izin, ücret ve özel sektör.',
    h1: 'Arefe günü yarım gün mü? Evet, saat 13.00\'ten itibaren',
    intro: 'Aracı arefe sabahı için alacağınız izne göre kurun: yarım ya da tam gün sayılmasının bayram tatilinizi nasıl değiştirdiğini görürsünüz.',
    resume: `Arefe günü, 2429 sayılı Ulusal Bayram ve Genel Tatiller Hakkında Kanuna göre saat 13.00'ten itibaren resmi tatildir: kanun Ramazan Bayramını "arefe günü saat 13.00'ten itibaren 3,5 gün", Kurban Bayramını 4,5 gün olarak tanımlar. Sabah saatleri normal çalışma saatidir. 2027'de Ramazan Bayramı arefesi ${dShort(r27.arefe, 'tr')}, Kurban Bayramı arefesi ${dShort(k27.arefe, 'tr')} günüdür; ikincisi hafta sonuna denk geldiği için Cumartesi çalışmayanlar bu yarım günden yararlanamaz ve yerine başka gün verilmez. Kamu kurumları öğleden sonra kapanır. Özel sektörde de öğleden sonrası genel tatildir: çalışan işçiye İş Kanununun 47. maddesine göre o yarım gün için ek ücret ödenir. Sabahı izinle kapatmak isteyenler için işyerleri farklı uygular; yarım gün izin yazılırsa 2027 Ramazan Bayramında yarım gün izinle ${yarim.gun} gün, tam gün sayılırsa bir gün izinle ${tam.gun} gün tatil yapılır.`,
    faqs: [
      { q: 'Arefe günü öğleden sonra işyerleri kapalı mı?', a: `Kamu daireleri 13.00'te kapanır. Özel işyerlerinde arefe öğleden sonrası genel tatildir; işveren çalışmayı ancak iş sözleşmesi ya da işçinin onayıyla isteyebilir ve çalışılan yarım gün için ek ücret öder. Dayanak 2429 sayılı Kanunun 2. maddesidir: sabah saatleri normal iş günüdür. 2027'deki ilk arefe ${dShort(r27.arefe, 'tr')} günü, Ramazan Bayramından önce gelir.` },
      { q: 'Arefe günü çalışan işçiye ne kadar ücret ödenir?', a: `İş Kanununun 47. maddesine göre çalışılan genel tatil için ayrıca bir günlük ücret ödenir. Arefe öğleden sonrası yarım gün olduğundan bu, yarım günlük ek ücrete karşılık gelir. Yani ${dShort(r27.arefe, 'tr')} günü saat 13.00'ten sonra çalışan işçi, o günün normal ücretine ek olarak yarım günlük ücret daha alır. Tutarı tatil çalışma ücreti hesaplayıcısıyla bulabilirsiniz.` },
      { q: 'Kurban Bayramı 2027 arefesi Cumartesiye denk gelirse ne olur?', a: `${dShort(k27.arefe, 'tr')} Cumartesi zaten çalışmayanlar için ayrı bir kazanç olmaz. Cumartesi çalışan işyerlerinde o gün 13.00'e kadar çalışılır, sonrası tatildir. Kaybedilen yarım günün yerine başka bir gün verilmez; 2429 sayılı Kanunda böyle bir telafi hükmü yoktur. Beş gün çalışan biri için bayram yine de ${aralik(kt.bas, kt.son, 'tr')} arasında ${kt.gun} gün sürer.` },
    ],
    body: (h) => `<h2>2026–2028 arefe günleri</h2>
${h.table(['Bayram', 'Arefe', 'Gün', 'Hafta sonuna denk geliyor mu?'], arefeler.map((a) => [`${a.tur === 'kurban' ? 'Kurban' : 'Ramazan'} ${a.y}`, h.day(a.d), h.wd(a.d), hafta(a.d) ? 'evet' : 'hayır']), 'Arefe günleri (Diyanet dini günler listeleri)')}
<p>Arefe, bayramdan önceki gündür. Ramazan Bayramı arefesi aynı zamanda Ramazanın son oruç günüdür; 2027'de İstanbul'da o akşam iftar için hesapladığımız vakit ${h.hhmm(ist.aksam)}. Kurban Bayramı arefesi hicri takvimde 9 Zilhicce'dir; hacıların Arafat'ta vakfeye durduğu gün olarak bilinir.</p>
<h2>Kanun ne diyor?</h2>
<p>2429 sayılı Kanunun 2. maddesi dini bayramları sayarken arefenin saat 13.00'ten itibaren tatil olduğunu açıkça yazar. Aynı yarım gün kuralı Cumhuriyet Bayramı için de geçerlidir: ${h.a('28-ekim-yarim-gun', '28 Ekim öğleden sonrası')} tatildir. Kanunda arefe sabahı için özel bir hüküm yoktur; sabah normal iş günüdür.</p>
<h2>Sabah için izin: yarım mı, tam mı?</h2>
<p>İş Kanunu yıllık iznin gün olarak kullanılacağını öngörür ve yarım gün izinden söz etmez. Uygulamada bazı işyerleri arefe sabahını yarım gün izin olarak yazar, bazıları tam gün düşer. Fark küçük görünse de yıl boyunca birikir: 2027'de iki, 2028'de iki arefe vardır. Hesaplayıcıda "Arefe sabahı için izin" seçeneğini değiştirerek iki uygulamayı karşılaştırabilirsiniz.</p>
${h.mini('bt', { p: ['tur', 'arefe'], d: { tur: 'kurban', yil: 2028, izin: 3 }, c: 'Arefe izninin tatile etkisini görün' })}
<h2>Arefe öğleden sonra çalışırsanız</h2>
<p>Sağlık, ulaşım, güvenlik, enerji ve perakendede arefe öğleden sonra da çalışılır. Bu yarım gün genel tatil sayıldığı için çalışan işçi, o güne ait ücretine ek olarak yarım günlük ücret daha alır. Saatlik ücretlilerde günlük ücret saatlik ücretin 7,5 katı olarak hesaplanır. Ayrıntılar ve hesap ${h.a('resmi-tatil-calisma-ucreti', 'resmi tatilde çalışma ücreti')} sayfasında.</p>`,
  },
  en: {
    slug: 'turkey-eid-eve-half-day', nav: 'Is the eve a half day?', card: 'The eve is a holiday from 1 pm: eve dates 2027 and 2028',
    title: 'Is the Eid eve a half day in Turkey? Arefe 2027 dates, rules',
    description: 'In Turkey the eve of each bayram is a public holiday from 1 pm. In 2027: Monday 8 March (Eid al-Fitr) and Saturday 15 May (Eid al-Adha). Leave, pay and offices.',
    h1: 'Is the eve (arefe) a half day? Yes, from 1 pm',
    intro: 'Set the tool to the leave you take for the eve morning: you see how counting it as half or a full day changes your bayram break.',
    resume: `The eve of each religious holiday, called arefe in Turkish, is a public holiday from 1 pm under Law No. 2429 on National Holidays and General Days Off. The law defines Ramazan Bayramı as lasting "3.5 days from 1 pm on the eve" and Kurban Bayramı 4.5 days. The morning is ordinary working time. In 2027 the Eid al-Fitr eve is ${dShort(r27.arefe, 'en')} and the Eid al-Adha eve ${dShort(k27.arefe, 'en')}; because the second one falls on a weekend, people who do not work Saturdays gain nothing and get no replacement. Public offices close in the afternoon. In the private sector the afternoon is a general holiday too, and an employee who works it is owed extra pay under article 47 of the Labour Act. Employers handle leave for the morning differently: booked as half a day, a half day of leave gives ${yarim.gun} days off around Eid al-Fitr 2027; booked as a full day, one day of leave gives ${tam.gun} days.`,
    faqs: [
      { q: 'Are offices closed on the afternoon of the eve in Turkey?', a: `Public offices close at 1 pm. In private workplaces the afternoon is a general holiday; an employer can ask staff to work only under the contract or with their consent, and must pay extra for the half day worked. The rule comes from article 2 of Law No. 2429, and the morning stays a normal working day. The first eve of 2027 is ${dShort(r27.arefe, 'en')}, before Eid al-Fitr.` },
      { q: 'What is the extra pay for working on the eve afternoon?', a: `Article 47 of the Labour Act grants one extra day's pay for each general holiday worked. The eve afternoon is half a day, so the extra pay is half a day's wage. In practice, an employee working after 1 pm on ${dShort(r27.arefe, 'en')} receives the normal pay for that day plus half a day's wage on top. The holiday pay calculator works out the amount.` },
      { q: 'What happens when the Eid al-Adha eve falls on a Saturday in 2027?', a: `Saturday ${k27.arefe.slice(8)} May brings no extra time off for people who do not work Saturdays. Where Saturday is a working day, staff work until 1 pm and are off afterwards. No other day replaces the lost half day, as Law No. 2429 contains no make-up rule. On a five-day week the feast still gives ${kt.gun} days off, ${aralik(kt.bas, kt.son, 'en')}.` },
    ],
    body: (h) => `<h2>Eve dates 2026 to 2028</h2>
${h.table(['Holiday', 'Eve', 'Day', 'On a weekend?'], arefeler.map((a) => [`${a.tur === 'kurban' ? 'Eid al-Adha' : 'Eid al-Fitr'} ${a.y}`, h.day(a.d), h.wd(a.d), hafta(a.d) ? 'yes' : 'no']), 'Eve dates (Diyanet religious-day lists)')}
<p>Arefe is the day before the feast. The Eid al-Fitr eve is also the last day of Ramadan; in Istanbul in 2027 we compute that evening's iftar at ${h.hhmm(ist.aksam)}. The Eid al-Adha eve is 9 Dhu al-Hijjah, the day pilgrims stand at Arafat.</p>
<h2>What the law says</h2>
<p>Article 2 of Law No. 2429 lists the religious holidays and states plainly that the eve is a holiday from 1 pm. The same half-day rule applies to Republic Day: the ${h.a('28-ekim-yarim-gun', 'afternoon of 28 October')} is a holiday. The law says nothing specific about the eve morning, which is an ordinary working morning.</p>
<h2>Leave for the morning: half or full day?</h2>
<p>The Labour Act counts annual leave in days and does not mention half days. In practice some employers book the eve morning as half a day of leave and others deduct a full day. The gap looks small but adds up: 2027 and 2028 each have two eves. Switch the "leave for the eve morning" option in the calculator to compare both practices.</p>
${h.mini('bt', { p: ['tur', 'arefe'], d: { tur: 'kurban', yil: 2028, izin: 3 }, c: 'See how eve leave changes your break' })}
<h2>If you work the eve afternoon</h2>
<p>Health care, transport, security, energy and retail keep going on the eve afternoon. Because the half day is a general holiday, an employee who works it earns half a day's extra pay on top of the normal wage. For hourly workers the daily wage is 7.5 times the hourly rate. Details and the calculation are on ${h.a('resmi-tatil-calisma-ucreti', 'holiday pay in Turkey')}.</p>`,
  },
});
