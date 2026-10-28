/** Resmi tatiller 2028 : liste engine/takvim.ts (2429 sayılı Kanun + Diyanet 2028 dini günler), izin hesapları engine/izin.ts. */
import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { dShort, aralik } from '../../lib/tool-specs';
import { formatDecimal } from '../../lib/format';

type L = 'tr' | 'en';
const d1 = (x: number, l: L) => formatDecimal(x, 1, l);
const Y = 2028;
const list = K.tatiller(Y);
const o = K.yilOzeti(Y), o6 = K.yilOzeti(Y, '6'), o26 = K.yilOzeti(2026), o27 = K.yilOzeti(2027);
const hs = list.filter((t) => t.sure >= 1 && K.isWeekend(K.fromIso(t.date)));
const hi = list.filter((t) => t.sure >= 1 && !K.isWeekend(K.fromIso(t.date)));
const rb = K.bayram('ramazan', Y)!, kb = K.bayram('kurban', Y)!;
const r0 = K.bayramTatili('ramazan', Y, 0)!, r4 = K.bayramTatili('ramazan', Y, 4)!;
const k0 = K.bayramTatili('kurban', Y, 0)!, k3 = K.bayramTatili('kurban', Y, 3)!;
const p10 = K.optimize(Y, 10);
const tekGun = K.kopruGunleri(Y);
const ad = (ts: typeof list, l: L) => ts.map((t) => `${t.ad[l]} (${dShort(t.date, l)})`).join(', ');

export default defineGuide({
  id: 'resmi-tatiller-2028', group: 'tatil', order: 52, tool: 'rt', toolArg: { yil: Y },
  related: ['kopru-gunleri-2028', 'resmi-tatiller-2027', 'kurban-bayrami-2028', 'ramazan-bayrami-2028', 'bayram-tatili-kac-gun', 'yillik-izin'],
  sources: ['k2429', 'rt2028', 'dg2028'],
  tr: {
    slug: 'resmi-tatiller-2028', nav: 'Resmi tatiller 2028', card: `Hafta içine yalnız ${d1(o.haftaIci, 'tr')} gün düşüyor`,
    title: `Resmi tatiller 2028: ${hs.length} tam gün hafta sonuna denk geliyor`,
    description: `Resmi tatiller 2028: Ramazan Bayramı 26–28 Şubat, Kurban 5–8 Mayıs. ${d1(o.toplam, 'tr')} günün yalnız ${d1(o.haftaIci, 'tr')} günü hafta içinde; 29 Ekim Pazar, 23 Nisan Pazar, 1 Ocak Cumartesi.`,
    h1: `2028 resmi tatilleri: ${d1(o.toplam, 'tr')} gün, çoğu hafta sonunda`,
    intro: '2028 yılının resmi tatilleri araçta günleriyle listelenir; çalışma haftasını değiştirerek Cumartesi çalışanların durumunu da görebilirsiniz.',
    resume: `2028 yılında kâğıt üzerindeki resmi tatil ${d1(o.toplam, 'tr')} gündür, yani 2027'den bir gün fazladır; ama Pazartesi–Cuma çalışan biri için bunun yalnız ${d1(o.haftaIci, 'tr')} günü iş gününe denk gelir. Nedeni takvimin dizilişi: ${hs.length} tam gün hafta sonuna düşüyor. Yılbaşı Cumartesi, 23 Nisan Pazar, 15 Temmuz Cumartesi, 29 Ekim Pazar ve 28 Ekim yarım günü de Cumartesidir. Ramazan Bayramı ${aralik(rb.ilk, rb.son, 'tr')} arasında, Cumartesi başlayıp Pazartesi biter; arefe ${dShort(rb.arefe, 'tr')} öğleden sonradır. Kurban Bayramı ${aralik(kb.ilk, kb.son, 'tr')} arasındadır, arefe ${dShort(kb.arefe, 'tr')} günüdür. Kurban 1 Mayıs Pazartesiye çok yakın olduğu için ${k3.izin} gün izinle ${aralik(k3.bas, k3.son, 'tr')} arası ${k3.gun} gün tatil yapılabilir. Beş günlük haftada yılın iş günü sayısı ${o.isGunu}, 2027'de bu sayı ${o27.isGunu} idi. Kısacası 2028, izin günlerini dikkatle yerleştirmeyi gerektiren bir yıl; hafta sonuna düşen tatilin kaydırılmasını beklemek boşunadır, çünkü kanunda böyle bir hüküm yoktur.`,
    faqs: [
      { q: '2028 yılında kaç gün resmi tatil var?', a: `${d1(o.toplam, 'tr')} gün, bunun ${o.yarim} tanesi yarım gündür. Ancak Cumartesi ve Pazar zaten tatil olan biri için hafta içine düşen tatil yalnız ${d1(o.haftaIci, 'tr')} gündür, çünkü ${hs.length} tam gün hafta sonunda kalır ve kanun bunları kaydırmaz. Cumartesi de çalışanlarda bu sayı ${d1(o6.haftaIci, 'tr')} gündür. Beş günlük haftada yılın iş günü sayısı ${o.isGunu}; 2027'de bu sayı ${o27.isGunu} idi.` },
      { q: '29 Ekim 2028 hangi güne denk geliyor?', a: `${dShort('2028-10-29', 'tr')}. 28 Ekim yarım günü de ${dShort('2028-10-28', 'tr')} öğleden sonrasına düşer. İkisi de hafta sonu olduğu için Pazartesi–Cuma çalışanlar Cumhuriyet Bayramında ayrıca boş gün kazanmaz; 2429 sayılı Kanunda hafta sonuna gelen tatili Pazartesiye kaydıran bir hüküm yoktur. Cumartesi de çalışılan işyerlerinde 28 Ekim öğleden sonrası yine tatildir; o saatlerde çalışan işçiye İş Kanunu md. 47 uyarınca yarım günlük ek ücret ödenir.` },
      { q: 'Ramazan Bayramı 2028 kaç gün tatil?', a: `Kanuna göre arefe öğleden sonrasıyla 3,5 gün: arefe ${dShort(rb.arefe, 'tr')} saat 13.00'ten itibaren yarım gündür. Bayram ${dShort(rb.ilk, 'tr')} başladığı için hafta sonu tatil yapan biri izinsiz ${aralik(r0.bas, r0.son, 'tr')} arası ${r0.gun} gün boş kalır. ${r4.izin} gün izinle ${aralik(r4.bas, r4.son, 'tr')} arası ${r4.gun} gün olur. Farklı izin sayılarını bayram tatili hesaplayıcısında deneyebilirsiniz.` },
    ],
    body: (h) => `<h2>Hafta sonuyla çakışan bir yıl</h2>
<p>Bir yılın tatil açısından iyi ya da kötü olmasını belirleyen şey, tatillerin haftanın hangi gününe düştüğüdür; Türkiye'de hafta sonuna gelen tatil başka güne aktarılmaz. 2028 bu bakımdan son yılların en zayıf yılı: hafta sonunda kalan tam günler ${ad(hs, 'tr')}. İş gününe denk gelenler ise şunlar: ${ad(hi, 'tr')}.</p>
${h.table(['Tarih', 'Gün', 'Tatil', 'Süre'], list.map((t) => [h.day(t.date), h.wd(t.date), t.ad.tr, t.sure < 1 ? 'yarım gün' : 'tam gün']), '2028 resmi tatilleri (2429 sayılı Kanun; bayram tarihleri Diyanet 2028 listesi)')}
<h2>Üç yılı yan yana koyunca</h2>
${h.table(['Yıl', 'Toplam tatil', 'Hafta içine düşen', 'İş günü (5 gün)'], [['2026', d1(o26.toplam, 'tr'), d1(o26.haftaIci, 'tr'), o26.isGunu], ['2027', d1(o27.toplam, 'tr'), d1(o27.haftaIci, 'tr'), o27.isGunu], ['2028', d1(o.toplam, 'tr'), d1(o.haftaIci, 'tr'), o.isGunu]], 'Pazartesi–Cuma çalışan biri için tatil ve iş günü', ['l', 'r', 'r', 'r'])}
<p>Toplam artarken iş gününe gelen tatilin azalması ilk bakışta çelişki gibi görünür. Ama toplam, kanundaki günlerin toplamıdır; çalışan için önemli olan ise hafta içi kaybedilmeyen gündür. 2028'de Pazartesi–Cuma çalışanın yıl içinde ${o.isGunu} iş günü vardır. Yalnız Pazar tatil yapanlar için tablo daha iyidir: Cumartesiye düşen yılbaşı, 15 Temmuz ve bayram günleri onlar için gerçek tatildir.</p>
<h2>İki bayram, iki farklı plan</h2>
<p>Ramazan Bayramı Cumartesi başladığı için arefe günü ${h.wday(rb.arefe)} olur; o gün öğleden sonra tatildir. İzinsiz tatil üç gündür ve Pazartesi akşamı biter. Bayramdan önceki haftayı değil, sonraki dört iş gününü izinle kapatırsanız tatil ${aralik(r4.bas, r4.son, 'tr')} arasında ${r4.gun} güne çıkar; 2028 artık yıl olduğu için bu aralıkta 29 Şubat da var. Kurban Bayramı ise Cuma başlar ve Pazartesi biter, izinsiz ${k0.gun} gün eder. Önündeki ${k3.izin} iş gününü izinle doldurursanız 1 Mayıs Pazartesiyle birleşir ve ${k3.gun} günlük bir blok çıkar. Ayrıntılar ${h.a('ramazan-bayrami-2028', 'Ramazan Bayramı 2028')} ve ${h.a('kurban-bayrami-2028', 'Kurban Bayramı 2028')} sayfalarında.</p>
${h.mini('bt', { p: ['tur', 'izin'], d: { tur: 'kurban', yil: Y, izin: 3 }, c: '2028 bayram tatilini hesaplayın' })}
<h2>Kendiliğinden uzun hafta sonu az</h2>
<p>İki bayram dışında, 2028'de izinsiz üç günlük hafta sonu yapan tatiller 1 Mayıs Pazartesi ve 19 Mayıs Cuma ile sınırlıdır. 19 Mayıs Cumaya düştüğü için 2429 sayılı Kanunun "tatil Cuma akşamı biterse ertesi Cumartesinin tamamı tatildir" hükmü Cumartesi açık olan resmi daireler için devreye girer. Tek günlük izinle uzayan klasik köprü günü ${tekGun.length === 0 ? 'bu yıl hiç yoktur' : `${tekGun.length} tanedir`}; en verimli seçenekler iki ile beş gün arasındaki izin bloklarıdır. 10 günlük izinle yıl içinde blok blok toplam ${p10.bos} gün tatil yapılabileceğini ${h.a('kopru-gunleri-2028', '2028 köprü günleri')} sayfası gösteriyor. Yıllık izninizin kaç gün olduğunu ${h.a('yillik-izin', 'yıllık izin hesabı')} ile kontrol edin; 2027'nin listesi için ${h.a('resmi-tatiller-2027', 'resmi tatiller 2027')}.</p>`,
  },
  en: {
    slug: 'public-holidays-turkey-2028', nav: 'Public holidays 2028', card: `Only ${d1(o.haftaIci, 'en')} days fall on weekdays`,
    title: `Turkey public holidays 2028: ${hs.length} full days on a weekend`,
    description: `Public holidays in Turkey 2028: Ramazan Bayramı 26–28 February, Kurban Bayramı 5–8 May. Only ${d1(o.haftaIci, 'en')} of ${d1(o.toplam, 'en')} days fall on weekdays; Republic Day is a Sunday.`,
    h1: `Public holidays in Turkey 2028: ${d1(o.toplam, 'en')} days, many on a weekend`,
    intro: 'The tool lists the 2028 public holidays with their weekday; switch the working week to see how a six-day week changes the count.',
    resume: `On paper Turkey has ${d1(o.toplam, 'en')} days of public holidays in 2028, one more than in 2027, yet a Monday-to-Friday worker only gets ${d1(o.haftaIci, 'en')} of them on working days. The reason is how the dates fall: ${hs.length} full holidays land on a weekend. New Year's Day is a Saturday, 23 April a Sunday, 15 July a Saturday and Republic Day, 29 October, a Sunday, with the 28 October half day on the Saturday before. Ramazan Bayramı (Eid al-Fitr) runs ${aralik(rb.ilk, rb.son, 'en')}, Saturday to Monday, after a half-day eve on ${dShort(rb.arefe, 'en')}. Kurban Bayramı (Eid al-Adha) runs ${aralik(kb.ilk, kb.son, 'en')}, with the eve on ${dShort(kb.arefe, 'en')}. Because it sits next to Labour Day on Monday 1 May, ${k3.izin} days of leave give ${k3.gun} days off, ${aralik(k3.bas, k3.son, 'en')}. A five-day week has ${o.isGunu} working days in 2028, against ${o27.isGunu} in 2027.`,
    faqs: [
      { q: 'How many public holidays does Turkey have in 2028?', a: `${d1(o.toplam, 'en')} days including ${o.yarim} half days. For someone with weekends off, only ${d1(o.haftaIci, 'en')} days fall on working days, because ${hs.length} full days land on a Saturday or Sunday and the law never moves them. On a six-day week the figure is ${d1(o6.haftaIci, 'en')}. A five-day week has ${o.isGunu} working days in 2028, against ${o27.isGunu} in 2027.` },
      { q: 'What day is Republic Day 2028 in Turkey?', a: `${dShort('2028-10-29', 'en')}, and the half day falls on ${dShort('2028-10-28', 'en')} afternoon. Both are on the weekend, so Monday-to-Friday workers gain nothing; Law No. 2429 has no rule moving a weekend holiday to Monday. Where Saturday is a working day, the afternoon of 28 October is still a holiday, and anyone who works it earns half a day's extra pay under article 47 of the Labour Act.` },
      { q: 'How long is the Eid al-Fitr 2028 break in Turkey?', a: `By law 3.5 days including the eve afternoon: the eve, ${dShort(rb.arefe, 'en')}, is off from 1 pm. As the festival starts on ${dShort(rb.ilk, 'en')}, a weekend worker is off ${aralik(r0.bas, r0.son, 'en')}, ${r0.gun} days, without leave. ${r4.izin} days of leave make it ${r4.gun} days, ${aralik(r4.bas, r4.son, 'en')}. You can try other leave budgets in the festival break calculator.` },
    ],
    body: (h) => `<h2>A year that keeps hitting the weekend</h2>
<p>Whether a year is good for holidays depends on which weekday they land on, because Turkey never moves a holiday that falls on a weekend. In that sense 2028 is the weakest year in a while. Full days lost to the weekend: ${ad(hs, 'en')}. Those that do fall on working days: ${ad(hi, 'en')}.</p>
${h.table(['Date', 'Day', 'Holiday', 'Length'], list.map((t) => [h.day(t.date), h.wd(t.date), t.ad.en, t.sure < 1 ? 'half day' : 'full day']), 'Public holidays in Turkey, 2028 (Law No. 2429; festival dates from the Diyanet 2028 list)')}
<h2>Three years side by side</h2>
${h.table(['Year', 'Total', 'On weekdays', 'Working days (5-day week)'], [['2026', d1(o26.toplam, 'en'), d1(o26.haftaIci, 'en'), o26.isGunu], ['2027', d1(o27.toplam, 'en'), d1(o27.haftaIci, 'en'), o27.isGunu], ['2028', d1(o.toplam, 'en'), d1(o.haftaIci, 'en'), o.isGunu]], 'Holidays and working days for a Monday-to-Friday worker', ['l', 'r', 'r', 'r'])}
<p>A higher total with fewer useful days looks odd at first. The total is simply what the law grants; what counts for an employee is the weekday not worked. In 2028 a Monday-to-Friday worker has ${o.isGunu} working days. Those who only have Sunday off fare better, since New Year's Day, 15 July and the festival Saturdays are real days off for them.</p>
<h2>Two festivals, two different plans</h2>
<p>With Ramazan Bayramı starting on a Saturday, the eve is ${h.wday(rb.arefe)}, off from 1 pm. Without leave the break is three days and ends on Monday evening. Cover the four working days after it, not before, and the break becomes ${r4.gun} days, ${aralik(r4.bas, r4.son, 'en')}; 2028 is a leap year, so 29 February falls inside. Kurban Bayramı runs Friday to Monday, ${k0.gun} days without leave. Fill the ${k3.izin} working days before it and the break joins Labour Day on Monday 1 May, giving a ${k3.gun}-day block. Details on ${h.a('ramazan-bayrami-2028', 'Ramazan Bayramı 2028')} and ${h.a('kurban-bayrami-2028', 'Kurban Bayramı 2028')}.</p>
${h.mini('bt', { p: ['tur', 'izin'], d: { tur: 'kurban', yil: Y, izin: 3 }, c: 'Work out your 2028 festival break' })}
<h2>Few long weekends for free</h2>
<p>Apart from the two festivals, only two holidays give a three-day weekend without leave in 2028: Labour Day on Monday 1 May and Youth Day on Friday 19 May. Because 19 May is a Friday, the rule in Law No. 2429 that "when a holiday ends on Friday evening the following Saturday is a full day off" applies to public offices that open on Saturdays. Classic one-day bridges ${tekGun.length === 0 ? 'do not exist at all this year' : `number ${tekGun.length}`}; the best deals are blocks of two to five leave days. With 10 days of leave you can collect ${p10.bos} days off in total, block by block, as the ${h.a('kopru-gunleri-2028', '2028 bridge-day planner')} shows. Check your own entitlement with the ${h.a('yillik-izin', 'annual leave calculator')}, and see ${h.a('resmi-tatiller-2027', 'public holidays 2027')} for the year before.</p>`,
  },
});
