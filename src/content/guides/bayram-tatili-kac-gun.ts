/** Bayram tatili kaç gün : 2429 sayılı Kanundaki süre ve hafta sonları/izinle fiilî tatil (engine/izin.ts bayramTatili). */
import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { aralik } from '../../lib/tool-specs';
import { formatDecimal } from '../../lib/format';

type Tur = 'ramazan' | 'kurban';
const T = (tur: Tur, y: number, izin: number, hafta: '5' | '6' = '5') => K.bayramTatili(tur, y, izin, { hafta })!;
const satir = (l: 'tr' | 'en') => (['ramazan', 'kurban'] as Tur[]).flatMap((tur) => [2026, 2027, 2028].map((y) => {
  const b = K.bayram(tur, y)!;
  const best = [1, 2, 3, 4].map((k) => T(tur, y, k)).reduce((a, x) => (x.gun / Math.max(x.izin, 1) > a.gun / Math.max(a.izin, 1) ? x : a));
  return [`${tur === 'kurban' ? (l === 'tr' ? 'Kurban' : 'Eid al-Adha') : (l === 'tr' ? 'Ramazan' : 'Eid al-Fitr')} ${y}`, aralik(b.ilk, b.son, l), String(T(tur, y, 0).gun), String(T(tur, y, 0, '6').gun), l === 'tr' ? `${formatDecimal(best.izin, 1, l)} gün izinle ${best.gun} gün` : `${best.gun} days for ${formatDecimal(best.izin, 1, l)} leave`];
}));
const k0 = T('kurban', 2027, 0), k2 = T('kurban', 2027, 2), r0 = T('ramazan', 2027, 0), r2 = T('ramazan', 2027, 2);
const k28 = T('kurban', 2028, 3), r28 = T('ramazan', 2028, 1);

export default defineGuide({
  id: 'bayram-tatili-kac-gun', group: 'bayram', order: 4, tool: 'bt', toolArg: { tur: 'kurban', yil: 2027, izin: 2 },
  related: ['kurban-bayrami-2027', 'ramazan-bayrami-2027', 'kopru-gunleri-2027', 'idari-izin-2027', 'arefe-gunu-yarim-gun', 'yillik-izin'],
  sources: ['k2429', 'k4857', 'rt2027', 'rt2028'],
  tr: {
    slug: 'bayram-tatili-kac-gun', nav: 'Bayram tatili kaç gün', card: 'Kanundaki süre, hafta sonları ve izinle kaç gün tatil',
    title: 'Bayram tatili kaç gün? 2027 Ramazan ve Kurban tatil hesabı',
    description: 'Bayram tatili kaç gün sürer: 2027 Kurban Bayramı izinsiz 5, 2 gün izinle 9 gün; Ramazan Bayramı 3 ve 9 gün. Hafta tipine ve arefe iznine göre gün gün hesap.',
    h1: 'Bayram tatili kaç gün? Kendi takviminize göre hesaplayın',
    intro: 'Bayramı, yılı ve almak istediğiniz izin gününü girin: araç en uzun kesintisiz tatili, izin günlerini ve işe dönüş tarihini gün gün çıkarır.',
    resume: `Kanunda bayram tatili sabittir: 2429 sayılı Kanuna göre Ramazan Bayramı arefe günü saat 13.00'ten itibaren 3,5 gün, Kurban Bayramı 4,5 gündür. Fiilen kaç gün evde kalacağınızı ise hafta sonları belirler, çünkü Türkiye'de Cumartesi ya da Pazara denk gelen tatil başka güne kaydırılmaz. 2027'de Kurban Bayramı Pazar başlayıp Çarşamba bittiği için Cumartesi-Pazar tatil yapan biri izinsiz ${k0.gun} gün tatil yapar; Perşembe ve Cuma için 2 gün izin alırsa ${aralik(k2.bas, k2.son, 'tr')} arasında ${k2.gun} gün. Ramazan Bayramı 2027 Salı-Perşembe arasındadır: izinsiz ${r0.gun} gün, arefe sabahı ve Cuma için 2 gün izinle ${r2.gun} gün. 2028'de tablo değişir: Kurban Bayramı Cuma başlar ve 1 Mayıs Pazartesiye düştüğü için 3 gün izinle ${k28.gun} günlük tatil yapılabilir, Ramazan Bayramı ise Cumartesi başladığından izinsiz yalnızca 3 gündür. Haftada altı gün çalışanların tatili genellikle bir gün daha kısadır.`,
    faqs: [
      { q: 'Kanuna göre bayram tatili kaç gündür?', a: `Ramazan Bayramı 3,5, Kurban Bayramı 4,5 gündür. Yarım gün, arefe gününün saat 13.00'ten sonrasıdır. Bu süreler 2429 sayılı Ulusal Bayram ve Genel Tatiller Hakkında Kanunun 2. maddesinde yazılıdır ve hafta sonuna denk gelse de değişmez. 2027'de hafta sonlarıyla birlikte Cumartesi-Pazar tatil yapan biri için fiilî tatil Ramazan Bayramında ${r0.gun}, Kurban Bayramında ${k0.gun} gün olur.` },
      { q: 'Hafta sonuna denk gelen bayram günü başka güne kaydırılır mı?', a: `Hayır. Türk mevzuatında hafta sonuna ya da başka bir tatile denk gelen resmi tatilin yerine ayrı bir gün verilmez. 2027'de Kurban Bayramının dördüncü günü 19 Mayıs ile çakışır ve tek gün sayılır. Aynı bayramın arefesi de Cumartesiye düşer, yani hafta içi çalışan için o yarım gün de kaybolur. Sonuçta bu kişi 2027 Kurban Bayramında izinsiz ${k0.gun} gün tatil yapar.` },
      { q: 'Bayramda izin alınca izin günüm düşer mi?', a: `Yalnızca iş günleri düşer. İş Kanununun 56. maddesine göre yıllık izin içine giren ulusal bayram, hafta tatili ve genel tatil günleri izin süresinden sayılmaz. Arefe sabahı için işyeri yarım ya da tam gün izin yazabilir. Örneğin 2027 Kurban Bayramında ${k2.izin} iş günü izin alan biri ${aralik(k2.bas, k2.son, 'tr')} arasında ${k2.gun} gün tatil yapar ve yıllık izninden yalnızca bu ${k2.izin} gün eksilir.` },
    ],
    body: (h) => `<h2>2026, 2027 ve 2028 bayramları yan yana</h2>
<p>Aynı kanun, her yıl farklı uzunlukta tatil demektir. Tablo, beş günlük ve altı günlük haftada izinsiz tatili ve izin günü başına en verimli seçeneği gösterir.</p>
${h.table(['Bayram', 'Tarih', 'İzinsiz (5 gün)', 'İzinsiz (6 gün)', 'En verimli plan'], satir('tr'), 'Bayram tatili: izinsiz ve izinle kesintisiz gün sayısı')}
<h2>Hesap nasıl yapılıyor?</h2>
<p>Araç, bayramın ilk gününü içeren her olası aralığı dener. Hafta sonu ve resmi tatil günleri bedavadır; iş günleri bir gün izin, arefe sabahı ise seçiminize göre yarım ya da tam gün izin tutar. Bütçenizi aşmayan en uzun aralık kazanır, eşitlikte daha az izin kullanan seçilir. Böylece "2 günle 9 gün" gibi sonuçlar tahmin değil, takvimin kendisinden çıkar.</p>
<p>Beş günlük haftada Cumartesi ve Pazar boştur. Altı günlük haftada yalnızca Pazar boştur; bu, perakende, üretim ve hizmet sektörlerinde yaygındır. Cumartesi çalışılan düzende bayramın önündeki ve arkasındaki hafta sonu yarıya iner, bu yüzden aynı izinle elde edilen tatil kısalır.</p>
<h2>2027 için iki kısa yol</h2>
<p>Kurban Bayramında izin günlerinizi bayramdan sonraya koyun: 20 ve 21 Mayıs. Ramazan Bayramında ise bayramın iki yanına: 8 Mart arefe sabahı ve 12 Mart Cuma. İkisi birlikte yalnızca 4 gün izinle 18 gün tatil eder. Yıl boyunca başka köprüler de istiyorsanız ${h.a('kopru-gunleri-2027', 'köprü günleri planlayıcısı')} izin bütçenizin tamamını dağıtır.</p>
${h.mini('kp', { p: ['izin'], d: { yil: 2027, izin: 4 }, c: '2027 izinlerinizi tüm yıla yayın' })}
<h2>Memurlar, işçiler ve idari izin</h2>
<p>Kamuda bayram öncesi ya da sonrasındaki iş günleri bazen Cumhurbaşkanlığı kararıyla idari izin ilan edilir; o zaman memurlar bu günleri yıllık izinlerinden kullanmaz. Özel sektörde böyle bir otomatik karşılık yoktur. 2027 için bir karar şimdilik yok; durumu ${h.a('idari-izin-2027', 'idari izin 2027')} sayfasında izliyoruz. Yıllık izin hakkınızı ${h.a('yillik-izin', 'yıllık izin hesaplayıcısıyla')} bulabilirsiniz.</p>`,
  },
  en: {
    slug: 'eid-holiday-length-turkey', nav: 'How long is the bayram break', card: 'Legal length, weekends and leave: your days off',
    title: 'Eid holiday length in Turkey 2027: days off, leave planner',
    description: 'How many days off for Eid in Turkey: Eid al-Adha 2027 gives 5 days, or 9 with 2 leave days; Eid al-Fitr 3, or 9. Computed day by day for your working week.',
    h1: 'How long is the bayram break? Work it out for your calendar',
    intro: 'Enter the holiday, the year and the leave days you want to use: the tool finds the longest unbroken break, your leave dates and the day you are back at work.',
    resume: `The legal length of each bayram is fixed: under Law No. 2429, Ramazan Bayramı (Eid al-Fitr) lasts 3.5 days and Kurban Bayramı (Eid al-Adha) 4.5 days, both starting at 1 pm on the eve. How long you are actually off depends on weekends, because Turkey never moves a holiday that falls on a Saturday or Sunday. In 2027 Kurban Bayramı runs from Sunday to Wednesday, so someone with weekends off gets ${k0.gun} days without leave, and ${k2.gun} days with two leave days on Thursday and Friday, from ${aralik(k2.bas, k2.son, 'en')}. Ramazan Bayramı 2027 runs from Tuesday to Thursday: ${r0.gun} days without leave, ${r2.gun} days with two leave days on the eve morning and the Friday. 2028 looks different: Kurban Bayramı starts on a Friday and 1 May falls on the Monday, so three leave days give ${k28.gun} days, while Ramazan Bayramı starts on a Saturday and gives only three days without leave. On a six-day week breaks are usually one day shorter.`,
    faqs: [
      { q: 'How many days is the bayram holiday by law?', a: `Eid al-Fitr 3.5 days and Eid al-Adha 4.5 days. The half day is the afternoon of the eve from 1 pm. Both lengths are set in article 2 of Law No. 2429 and do not change when the holiday falls on a weekend. Combined with weekends, in 2027 that gives someone with Saturdays and Sundays off ${r0.gun} actual days for Eid al-Fitr and ${k0.gun} for Eid al-Adha.` },
      { q: 'Is a holiday that falls on a weekend moved in Turkey?', a: `No. Turkish law gives no substitute day for a public holiday that falls on a weekend or on another holiday. In 2027 the fourth day of Eid al-Adha coincides with 19 May and counts once. The eve of that feast also lands on a Saturday, so Monday-to-Friday staff lose that half day too. As a result their 2027 Eid al-Adha break is ${k0.gun} days without leave.` },
      { q: 'Do holiday days inside my annual leave count as leave?', a: `No, only working days do. Under article 56 of the Labour Act, national holidays, weekly rest days and general holidays falling within annual leave are not deducted. For the eve morning, employers book either half a day or a full day. For example, someone taking ${k2.izin} working days around Eid al-Adha 2027 is off for ${k2.gun} days (${aralik(k2.bas, k2.son, 'en')}) and loses only those ${k2.izin} days from the leave balance.` },
    ],
    body: (h) => `<h2>The 2026, 2027 and 2028 holidays side by side</h2>
<p>The same law gives a different break every year. The table shows the break without leave on a five-day and a six-day week, and the most efficient option per leave day.</p>
${h.table(['Holiday', 'Dates', 'No leave (5-day)', 'No leave (6-day)', 'Best plan'], satir('en'), 'Bayram breaks without and with leave, in consecutive days')}
<h2>How the calculation works</h2>
<p>The tool tries every possible stretch that includes the first day of the feast. Weekends and public holidays are free; each working day costs one leave day, and the eve morning half or a full day depending on your choice. The longest stretch within your budget wins, and on a tie the one using less leave. Results such as "9 days for 2" come straight from the calendar, not from a rule of thumb.</p>
<p>On a five-day week Saturday and Sunday are free. On a six-day week only Sunday is, which is common in retail, manufacturing and services. Working Saturdays halves the weekends around the feast, so the same leave buys a shorter break.</p>
<h2>Two shortcuts for 2027</h2>
<p>For Eid al-Adha put your leave after the feast: 20 and 21 May. For Eid al-Fitr put it on both sides: the eve morning of 8 March and Friday 12 March. Together, four leave days give eighteen days off. For bridges across the rest of the year, the ${h.a('kopru-gunleri-2027', 'bridge-day planner')} spreads your whole leave budget.</p>
${h.mini('kp', { p: ['izin'], d: { yil: 2027, izin: 4 }, c: 'Spread your 2027 leave over the year' })}
<h2>Civil servants, employees and administrative leave</h2>
<p>In the public sector the working days before or after a bayram are sometimes declared administrative leave by presidential decision, so civil servants do not use their own leave. Private employers have no automatic equivalent. No decision exists yet for 2027; we follow it on ${h.a('idari-izin-2027', 'administrative leave 2027')}. Your own entitlement is on the ${h.a('yillik-izin', 'annual leave calculator')}.</p>`,
  },
});
