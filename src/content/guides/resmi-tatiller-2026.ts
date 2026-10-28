/** Resmi tatiller 2026 : yıl sonuna doğru bilanço. Liste ve sayılar engine/takvim.ts, köprüler engine/izin.ts. */
import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { dShort, aralik } from '../../lib/tool-specs';
import { formatDecimal } from '../../lib/format';

type L = 'tr' | 'en';
const d1 = (x: number, l: L) => formatDecimal(x, 1, l);
const Y = 2026;
const list = K.tatiller(Y);
const o = K.yilOzeti(Y), o6 = K.yilOzeti(Y, '6'), o27 = K.yilOzeti(2027);
const hs = list.filter((t) => t.sure >= 1 && K.isWeekend(K.fromIso(t.date)));
const kp = K.kopruGunleri(Y);
const ekimKopru = kp.find((b) => b.izinBas.startsWith('2026-10'))!;
const kb = K.bayram('kurban', Y)!, rb = K.bayram('ramazan', Y)!;
const kb2 = K.bayramTatili('kurban', Y, 2)!, rb4 = K.bayramTatili('ramazan', Y, 4)!, kb0 = K.bayramTatili('kurban', Y, 0)!;
const p10 = K.optimize(Y, 10);
const yb27 = K.tatiller(2027)[0];
const ig = K.isGunleri(Y);
const kbIz = (l: L) => kb2.izinGunleri.map((d) => dShort(d, l)).join(l === 'tr' ? ' ve ' : ' and ');
const AY = (i: number, l: L) => new Date(Date.UTC(Y, i, 15)).toLocaleDateString(l === 'tr' ? 'tr-TR' : 'en-GB', { month: 'long', timeZone: 'UTC' });

export default defineGuide({
  id: 'resmi-tatiller-2026', group: 'tatil', order: 50, tool: 'rt', toolArg: { yil: Y },
  countdown: { date: '2027-01-01', label: { tr: 'Yılbaşı 2027', en: "New Year's Day 2027" } },
  related: ['resmi-tatiller-2027', '28-ekim-yarim-gun', 'kopru-gunleri-2027', 'bayram-tatili-kac-gun', 'kurban-bayrami-2027', 'ramazan-bayrami-2027'],
  sources: ['k2429', 'rt2026', 'dg2026', 'rt2027'],
  tr: {
    slug: 'resmi-tatiller-2026', nav: 'Resmi tatiller 2026', card: `Kalan: 28 Ekim öğleden sonra ve 29 Ekim; yıl toplamı ${d1(o.toplam, 'tr')} gün`,
    title: `Resmi tatiller 2026: kalan günler ve ${d1(o.toplam, 'tr')} günlük yıl özeti`,
    description: `Resmi tatiller 2026: yılın son tatili 29 Ekim Perşembe, 28 Ekim 13.00'ten itibaren yarım gün. ${d1(o.toplam, 'tr')} günün kaçı hafta içine düştü, 2027'de ne değişiyor?`,
    h1: '2026 resmi tatilleri: geriye 29 Ekim kaldı',
    intro: 'Araç 2026 yılının bütün resmi tatillerini gösterir; yıl seçimini 2027 ya da 2028 yaparak sonraki listelere geçebilirsiniz.',
    resume: `2026'nın resmi tatil takviminde geriye yalnızca Cumhuriyet Bayramı kaldı: ${dShort('2026-10-28', 'tr')} saat 13.00'ten itibaren yarım gün, ${dShort('2026-10-29', 'tr')} tam gün. 2429 sayılı Kanun 29 Ekim'de özel işyerlerinin de kapanmasını zorunlu tutar. ${dShort(ekimKopru.izinBas, 'tr')} için bir gün izin alan, ${aralik(ekimKopru.bosBas, ekimKopru.bosSon, 'tr')} arasında ${ekimKopru.bos} gün tatil yapar. Bundan sonraki resmi tatil ${dShort(yb27.date, 'tr')} 2027 yılbaşıdır. Yılın tamamına bakınca 2026 cömert bir yıldı: toplam ${d1(o.toplam, 'tr')} günün ${d1(o.haftaIci, 'tr')} günü hafta içine düştü, ${hs.length} tam gün hafta sonunda kaldı. Kurban Bayramı Çarşamba başladığı için izinsiz ${kb0.gun} gün sürdü, 2 gün izinle ${kb2.gun} güne çıktı. Beş günlük haftada yılın iş günü sayısı ${o.isGunu} oldu. 2027'de toplam ${d1(o27.toplam, 'tr')} güne iniyor, çünkü Kurbanın son günü 19 Mayısla çakışıyor; yeni yılın ilk tatili olan yılbaşı ise Cumaya denk geliyor ve üç günlük bir hafta sonu yapıyor.`,
    faqs: [
      { q: '2026 yılında hangi resmi tatiller kaldı?', a: `Yalnızca Cumhuriyet Bayramı kaldı: ${dShort('2026-10-28', 'tr')} günü saat 13.00'ten sonrası yarım gün, ${dShort('2026-10-29', 'tr')} günü ise tam gün tatildir. 2429 sayılı Kanun bu bayramda özel işyerlerinin de kapanmasını öngörür. Sıradaki resmi tatil 2027 yılbaşıdır; ${dShort(yb27.date, 'tr')} günü hafta sonuna bitiştiği için izin almadan üç günlük bir hafta sonu oluşur. 2027 listesini görmek için araçta yılı değiştirmeniz yeterli.` },
      { q: '30 Ekim 2026 Cuma tatil mi?', a: `Hayır, normal iş günüdür. Ancak Perşembe günkü bayram ile hafta sonu arasında tek başına kaldığı için tipik bir köprüdür: o gün ${ekimKopru.izin} gün yıllık izin alan ${aralik(ekimKopru.bosBas, ekimKopru.bosSon, 'tr')} arasında ${ekimKopru.bos} gün tatil yapar. Bu izin günü, 4857 sayılı Kanunun 53. maddesindeki yıllık izin hakkından düşülür. Kamu personeli için 30 Ekim gününe idari izin verildiğine dair bir karar yayımlanmadı.` },
      { q: '2026 yılında toplam kaç gün resmi tatil vardı?', a: `${d1(o.toplam, 'tr')} gün; bunun ${o.yarim} tanesi saat 13.00'te başlayan yarım gündür: iki bayram arefesi ve 28 Ekim. Pazartesi–Cuma çalışan biri için ${d1(o.haftaIci, 'tr')} günü iş gününe denk geldi, çünkü ${hs.length} tam gün hafta sonunda kaldı ve kanun bunları başka güne kaydırmaz. Yıl ${o.isGunu} iş günüyle kapanıyor; altı günlük haftada bu sayı ${o6.isGunu}. 2027'de toplam ${d1(o27.toplam, 'tr')} güne iner.` },
    ],
    body: (h) => `<h2>Yılın son tatili: 28 Ekim öğleden sonra ve 29 Ekim</h2>
<p>Cumhuriyet Bayramı 2429 sayılı Kanunun 1. maddesine göre 28 Ekim saat 13.00'te başlar ve 29 Ekim boyunca sürer. 2026'da bu, ${h.wd('2026-10-28')} öğleden sonrası ile ${h.wd('2026-10-29')} günü demektir. Kanunda yalnız bu bayram için özel işyerlerinin kapanması zorunlu tutulmuştur; sürekli çalışması gereken hastane, enerji, ulaşım gibi kuruluşların kendi kuralları saklıdır. Yarım günün kimi kapsadığını ve o gün çalışanın ücretini ${h.a('28-ekim-yarim-gun', '28 Ekim yarım gün mü')} sayfasında ayrıntılı anlattık.</p>
<p>${h.wday(ekimKopru.izinBas)} tatil değildir. Ama Perşembe ile hafta sonu arasında tek başına kaldığı için yılın son köprü günüdür: ${h.n(ekimKopru.izin)} gün izinle ${ekimKopru.bos} gün art arda boş kalırsınız.</p>
<h2>2026 nasıl geçti: tatil tatil bilanço</h2>
${h.table(['Tarih', 'Gün', 'Tatil', 'İş gününe düştü mü'], list.map((t) => [h.day(t.date), h.wd(t.date), t.ad.tr, K.isWeekend(K.fromIso(t.date)) ? 'hayır, hafta sonu' : t.sure < 1 ? 'yarım gün' : 'evet']), '2026 resmi tatilleri ve haftanın günü')}
<p>Hafta sonunda kalan tam günler ${hs.map((t) => dShort(t.date, 'tr')).join(', ')} oldu: Ramazan Bayramının son iki günü, Kurbanın dördüncü günü ve Zafer Bayramı. Buna karşılık yılbaşı, 23 Nisan ve 19 Mayıs hafta içine denk geldi. Ay bazında en kısa ay ${ig[4].tam} tam iş günüyle Mayıs oldu; ${AY(4, 'tr')} ayında 1 Mayıs, 19 Mayıs ve Kurban Bayramı üst üste geldi.</p>
<h2>Bu yılın köprüleri ve bayram planları</h2>
<p>2026'da tek günlük izinle uzayan dört hafta sonu vardı: ${kp.map((b) => `${dShort(b.izinBas, 'tr')} (${b.bos} gün)`).join(', ')}. Ramazan Bayramı ${aralik(rb.ilk, rb.son, 'tr')} arasına düştü; 4 gün izinle ${aralik(rb4.bas, rb4.son, 'tr')} arası ${rb4.gun} gün oldu. Kurban Bayramında ise arefe ${dShort(kb.arefe, 'tr')} günüydü ve ${kbIz('tr')} için alınan ${kb2.izin} gün izin tatili ${kb2.gun} güne taşıdı. 10 günlük bir izin bütçesi, yıl boyunca ${p10.bloklar.length} blokta toplam ${p10.bos} gün tatile dönüşebiliyordu.</p>
<h2>Yılbaşından sonra: 2027'ye hazırlık</h2>
<p>2027'nin ilk tatili ${h.wday(yb27.date)} olduğu için yılı üç günlük bir hafta sonuyla açarsınız. Yeni yılda toplam tatil ${d1(o27.toplam, 'tr')} güne düşüyor, Ramazan Bayramı Mart başına, Kurban Bayramı Mayıs ortasına kayıyor. İzinlerinizi şimdiden yerleştirmek için ${h.a('resmi-tatiller-2027', '2027 resmi tatil listesine')} ve ${h.a('kopru-gunleri-2027', '2027 köprü günlerine')} bakın; bayramların ayrıntısı ${h.a('ramazan-bayrami-2027', 'Ramazan Bayramı 2027')} ile ${h.a('kurban-bayrami-2027', 'Kurban Bayramı 2027')} sayfalarında, kaç gün izin gerektiği ${h.a('bayram-tatili-kac-gun', 'bayram tatili hesaplayıcısında')}.</p>
${h.mini('bt', { p: ['tur', 'izin'], d: { tur: 'ramazan', yil: 2027, izin: 2 }, c: '2027 bayram tatilinizi şimdiden hesaplayın' })}`,
  },
  en: {
    slug: 'public-holidays-turkey-2026', nav: 'Public holidays 2026', card: `Left: 28 Oct afternoon and 29 Oct; ${d1(o.toplam, 'en')} days in the year`,
    title: `Turkey public holidays 2026: what is left, ${d1(o.toplam, 'en')}-day review`,
    description: `Public holidays in Turkey 2026: the last one is Republic Day, Thursday 29 October, after a half day from 1 pm on 28 October. How the ${d1(o.toplam, 'en')} days fell this year.`,
    h1: 'Public holidays in Turkey 2026: Republic Day is the last one',
    intro: 'The tool shows every public holiday of 2026; switch the year to 2027 or 2028 to see the next lists.',
    resume: `Only Republic Day is left on Turkey's 2026 holiday calendar: a half day from 1 pm on ${dShort('2026-10-28', 'en')}, then the full day on ${dShort('2026-10-29', 'en')}. Law No. 2429 makes 29 October the one day on which private businesses must close as well. Taking ${dShort(ekimKopru.izinBas, 'en')} as leave gives ${ekimKopru.bos} days off, from ${aralik(ekimKopru.bosBas, ekimKopru.bosSon, 'en')}. The next public holiday after that is New Year's Day, ${dShort(yb27.date, 'en')} 2027. Looking back, 2026 was a generous year: of ${d1(o.toplam, 'en')} holiday days, ${d1(o.haftaIci, 'en')} fell on working days and ${hs.length} full days landed on a weekend. Kurban Bayramı started on a Wednesday, giving ${kb0.gun} days off without leave and ${kb2.gun} with two days of leave. A Monday-to-Friday worker had ${o.isGunu} working days in the year. In 2027 the total drops to ${d1(o27.toplam, 'en')} days because the last day of Kurban Bayramı coincides with 19 May.`,
    faqs: [
      { q: 'Which public holidays are left in Turkey in 2026?', a: `Only Republic Day: the afternoon of ${dShort('2026-10-28', 'en')} from 1 pm, then the full day on ${dShort('2026-10-29', 'en')}. Law No. 2429 also requires private businesses to close for it. The next public holiday is New Year's Day 2027, ${dShort(yb27.date, 'en')}; because it touches the weekend, it gives a three-day weekend without any leave. Switch the year in the tool to see the 2027 list.` },
      { q: 'Is Friday 30 October 2026 a holiday in Turkey?', a: `No, it is an ordinary working day. Sitting alone between Thursday's holiday and the weekend, it is a classic bridge: ${ekimKopru.izin} day of annual leave gives ${ekimKopru.bos} days off, ${aralik(ekimKopru.bosBas, ekimKopru.bosSon, 'en')}. That day comes out of the annual leave entitlement set by article 53 of Labour Act No. 4857. No administrative leave for public staff has been published for 30 October.` },
      { q: 'How many public holiday days did Turkey have in 2026?', a: `${d1(o.toplam, 'en')} days, ${o.yarim} of them half days starting at 1 pm: the two festival eves and 28 October. On a Monday-to-Friday week ${d1(o.haftaIci, 'en')} fell on working days, because ${hs.length} full days landed on a weekend and the law never moves them. The year closes with ${o.isGunu} working days, or ${o6.isGunu} on a six-day week. In 2027 the total drops to ${d1(o27.toplam, 'en')} days.` },
    ],
    body: (h) => `<h2>The last holiday of the year: 28 and 29 October</h2>
<p>Under article 1 of Law No. 2429, Republic Day begins at 1 pm on 28 October and continues through 29 October. In 2026 that means ${h.wd('2026-10-28')} afternoon and the whole of ${h.wd('2026-10-29')}. This is the only holiday on which the law requires private businesses to close; services that must run continuously, such as hospitals, energy or transport, follow their own rules. Who gets the half day, and what you are paid if you work it, is explained on ${h.a('28-ekim-yarim-gun', 'is 28 October a half day')}.</p>
<p>${h.wday(ekimKopru.izinBas)} is not a holiday. Squeezed between Thursday and the weekend, though, it is the last bridge of the year: ${h.n(ekimKopru.izin)} day of leave buys ${ekimKopru.bos} days off in a row.</p>
<h2>How 2026 went, holiday by holiday</h2>
${h.table(['Date', 'Day', 'Holiday', 'On a working day?'], list.map((t) => [h.day(t.date), h.wd(t.date), t.ad.en, K.isWeekend(K.fromIso(t.date)) ? 'no, weekend' : t.sure < 1 ? 'half day' : 'yes']), 'Public holidays in Turkey, 2026, with the weekday')}
<p>The full days lost to the weekend were ${hs.map((t) => dShort(t.date, 'en')).join(', ')}: the last two days of Ramazan Bayramı, day four of Kurban Bayramı and Victory Day. New Year's Day, 23 April and 19 May, on the other hand, all fell on weekdays. May was the shortest working month, with ${ig[4].tam} full working days, because Labour Day, Youth Day and Kurban Bayramı all fell in it.</p>
<h2>This year's bridges and festival plans</h2>
<p>2026 offered four weekends stretched by a single day of leave: ${kp.map((b) => `${dShort(b.izinBas, 'en')} (${b.bos} days)`).join(', ')}. Ramazan Bayramı ran ${aralik(rb.ilk, rb.son, 'en')}; four days of leave made it ${rb4.gun} days, ${aralik(rb4.bas, rb4.son, 'en')}. For Kurban Bayramı the eve was ${dShort(kb.arefe, 'en')}, and ${kb2.izin} days of leave on ${kbIz('en')} stretched the break to ${kb2.gun} days. A budget of 10 leave days could turn into ${p10.bos} days off over the year, spread across ${p10.bloklar.length} blocks.</p>
<h2>After New Year: getting ready for 2027</h2>
<p>The first holiday of 2027 is ${h.wday(yb27.date)}, so the year opens with a three-day weekend. The new year has ${d1(o27.toplam, 'en')} holiday days; Ramazan Bayramı moves to early March and Kurban Bayramı to mid-May. To place your leave now, see the ${h.a('resmi-tatiller-2027', '2027 holiday list')} and the ${h.a('kopru-gunleri-2027', '2027 bridge days')}; the festivals have their own pages, ${h.a('ramazan-bayrami-2027', 'Ramazan Bayramı 2027')} and ${h.a('kurban-bayrami-2027', 'Kurban Bayramı 2027')}, and the ${h.a('bayram-tatili-kac-gun', 'holiday length calculator')} tells you how many leave days you need.</p>
${h.mini('bt', { p: ['tur', 'izin'], d: { tur: 'ramazan', yil: 2027, izin: 2 }, c: 'Work out your 2027 festival break now' })}`,
  },
});
