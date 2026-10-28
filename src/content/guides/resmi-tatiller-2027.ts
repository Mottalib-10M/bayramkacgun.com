/** Resmi tatiller 2027 : liste engine/takvim.ts (2429 sayılı Kanun + Diyanet dini günler listesi), yıl özeti yilOzeti. */
import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { dShort, aralik } from '../../lib/tool-specs';
import { formatDecimal } from '../../lib/format';

type L = 'tr' | 'en';
const d1 = (x: number, l: L) => formatDecimal(x, 1, l);
const Y = 2027;
const list = K.tatiller(Y);
const o = K.yilOzeti(Y), o6 = K.yilOzeti(Y, '6'), o26 = K.yilOzeti(2026), o28 = K.yilOzeti(2028);
const tam = list.filter((t) => t.sure >= 1);
const haftaSonu = tam.filter((t) => K.isWeekend(K.fromIso(t.date)));
const yarimHs = list.filter((t) => t.sure < 1 && K.isWeekend(K.fromIso(t.date)));
const cuma = tam.filter((t) => K.weekday(K.fromIso(t.date)) === 5 && !K.tatilHaritasi([Y]).get(K.addDays(t.date, 1)));
const pzt = tam.filter((t) => K.weekday(K.fromIso(t.date)) === 1 && !K.tatilHaritasi([Y]).get(K.addDays(t.date, -1)));
const rb = K.bayram('ramazan', Y)!, kb = K.bayram('kurban', Y)!;
const r0 = K.bayramTatili('ramazan', Y, 0)!, r2 = K.bayramTatili('ramazan', Y, 2)!;
const k0 = K.bayramTatili('kurban', Y, 0)!;
const p10 = K.optimize(Y, 10);
const ad = (ts: typeof list, l: L) => ts.map((t) => `${t.ad[l]} (${dShort(t.date, l)})`).join(l === 'tr' ? ' ve ' : ' and ');
const ayAdi = (iso: string, l: L) => new Date(`${iso}T12:00:00Z`).toLocaleDateString(l === 'tr' ? 'tr-TR' : 'en-GB', { month: 'long', timeZone: 'UTC' });
const ig = K.isGunleri(Y);
const mayisIs = ig[4].tam + ig[4].yarim;
const yarimSay = list.filter((t) => t.sure < 1).length;

export default defineGuide({
  id: 'resmi-tatiller-2027', group: 'tatil', order: 51, tool: 'rt', toolArg: { yil: Y },
  related: ['kopru-gunleri-2027', 'takvim-2027', 'kurban-bayrami-2027', 'ramazan-bayrami-2027', 'idari-izin-2027', 'resmi-tatiller-2028'],
  sources: ['k2429', 'rt2027', 'dg2027', 'k4857'],
  tr: {
    slug: 'resmi-tatiller-2027', nav: 'Resmi tatiller 2027', card: `${d1(o.toplam, 'tr')} gün tatil, ${haftaSonu.length} tam gün hafta sonunda`,
    title: `Resmi tatiller 2027: tam liste, ${d1(o.toplam, 'tr')} gün ve hafta sonları`,
    description: `Resmi tatiller 2027 listesi: Ramazan Bayramı 9–11 Mart, Kurban 16–19 Mayıs, toplam ${d1(o.toplam, 'tr')} gün. Hangisi hafta sonuna denk geliyor, hangi ay kaç iş günü var?`,
    h1: `2027 resmi tatilleri: ${list.length} kalem, ${d1(o.toplam, 'tr')} gün`,
    intro: '2027 yılının bütün resmi tatilleri aşağıdaki araçta, günüyle ve süresiyle listelenir; yıl ya da çalışma haftası değiştirilebilir.',
    resume: `2027 yılında Türkiye'de resmi tatil toplamı ${d1(o.toplam, 'tr')} gündür ve bunun ${d1(o.haftaIci, 'tr')} günü Pazartesi–Cuma arasına düşer. Liste 2429 sayılı Kanundan, dini bayram tarihleri Diyanet İşleri Başkanlığının 2027 dini günler listesinden gelir. Ramazan Bayramı ${aralik(rb.ilk, rb.son, 'tr')} (arefe ${dShort(rb.arefe, 'tr')}, 13.00'ten sonra), Kurban Bayramı ${aralik(kb.ilk, kb.son, 'tr')} (arefe ${dShort(kb.arefe, 'tr')}) tarihlerindedir. Kurbanın dördüncü günü ${dShort('2027-05-19', 'tr')} Gençlik ve Spor Bayramıyla aynı güne geldiği için bir kez sayılır; yılın 2026'daki ${d1(o26.toplam, 'tr')} günün altında kalmasının nedeni budur. Hafta sonuna denk gelen ${haftaSonu.length} tam gün var: ${ad(haftaSonu, 'tr')}; ayrıca Kurban arefesi Cumartesiye düşüyor. Bu günler başka güne kaydırılmaz. Beş gün çalışan biri için yılda ${o.isGunu} iş günü kalır. Cuma ya da Pazartesiye düşen ${cuma.length + pzt.length} tatil kendiliğinden üç günlük hafta sonu yapar.`,
    faqs: [
      { q: '2027 yılında toplam kaç gün resmi tatil var?', a: `${d1(o.toplam, 'tr')} gün. ${yarimSay} tanesi yarım gündür: 28 Ekim ile iki bayram arefesi, saat 13.00'ten itibaren. Aynı takvim günü iki kez sayılmadığı için ${list.length} kalemlik liste ${o.gunSayisi} ayrı güne yayılır; Kurbanın dördüncü günü ${dShort('2027-05-19', 'tr')} Gençlik ve Spor Bayramıyla çakışır. Toplamın 2026'daki ${d1(o26.toplam, 'tr')} günün altında kalmasının nedeni budur; 2028'de yeniden ${d1(o28.toplam, 'tr')} güne çıkar.` },
      { q: '2027\'de hangi resmi tatiller hafta sonuna denk geliyor?', a: `Tam gün olarak ${ad(haftaSonu, 'tr')}. Yarım gün olarak da ${ad(yarimHs, 'tr')}. Türkiye'de hafta sonuna düşen tatilin yerine hafta içinde başka bir gün verilmez; 2429 sayılı Kanunda böyle bir telafi hükmü yoktur. Bu nedenle Pazartesi–Cuma çalışan biri için yılın ${d1(o.toplam, 'tr')} tatil gününden yalnız ${d1(o.haftaIci, 'tr')} günü iş gününe denk gelir.` },
      { q: '2027 yılında kaç iş günü var?', a: `Cumartesi ve Pazar tatil yapan biri için ${o.isGunu} gün; arefe ve 28 Ekim gibi yarım günler bu sayıya dahildir, çünkü sabah saatleri normal mesaidir. Pazar dışında her gün çalışanlar için ${o6.isGunu} gündür. Kurban Bayramı Mayıs ortasına düştüğü için Mayıs ayında yalnız ${mayisIs} iş günü kalır. Bordro ya da proje planı için ay ay sayılar 2027 takvimi sayfasında yer alır.` },
      { q: '2027\'de en uzun resmi tatil hangisi?', a: `İzinsiz bakıldığında Kurban Bayramı: arefe ${dShort(kb.arefe, 'tr')}, ilk gün ${dShort(kb.ilk, 'tr')} olduğu için hafta sonu tatil yapan biri ${aralik(k0.bas, k0.son, 'tr')} arasında ${k0.gun} gün evde kalır. Ramazan Bayramı ${aralik(rb.ilk, rb.son, 'tr')} arasında hafta içine düşer ve izinsiz ${r0.gun} gündür; ama 2 gün izinle ${aralik(r2.bas, r2.son, 'tr')} arası ${r2.gun} güne çıkar. İzin günlerini köprü planlayıcısı gösterir.` },
    ],
    body: (h) => `<h2>2027 tatil takvimi ay ay</h2>
<p>Aşağıdaki tablo her tatili ait olduğu ayla ve haftanın günüyle verir. "Süre" sütununda yarım gün, o günün öğleden sonrasının, yani saat 13.00'ten sonrasının tatil olduğu anlamına gelir; sabah normal mesai yapılır.</p>
${h.table(['Ay', 'Tarih', 'Gün', 'Tatil', 'Süre'], list.map((t) => [ayAdi(t.date, 'tr'), h.day(t.date), h.wd(t.date), t.ad.tr, t.sure < 1 ? 'yarım' : 'tam']), `2027 resmi tatilleri (2429 sayılı Kanun; bayram tarihleri Diyanet)`)}
<h2>${d1(o.toplam, 'tr')} gün nereden çıkıyor?</h2>
<p>Kanun yedi sabit tatil sayar: 1 Ocak, 23 Nisan, 1 Mayıs, 19 Mayıs, 15 Temmuz, 30 Ağustos ve 28 Ekim öğleden sonrasıyla birlikte 29 Ekim. Bunlara Ramazan Bayramının 3,5 ve Kurban Bayramının 4,5 günü eklenir. Kâğıt üzerinde toplam ${d1(o.toplam + 1, 'tr')} gün eder; ancak 2027'de Kurbanın son günü 19 Mayısla çakıştığı için takvimde ${d1(o.toplam, 'tr')} gün kalır. Tatil haritası bu çakışmayı tek gün olarak işler, gün kaydırmaz. 2028'de çakışma olmadığından toplam yeniden ${d1(o28.toplam, 'tr')} güne çıkar (${h.a('resmi-tatiller-2028', 'resmi tatiller 2028')}).</p>
<h2>Hafta sonuna düşen günler kayıp mı?</h2>
<p>Pazartesi–Cuma çalışan biri açısından evet. ${ad(haftaSonu, 'tr')} zaten boş olan günlerdir ve 2429 sayılı Kanunda bunları telafi eden bir hüküm yoktur. Kurban arefesinin Cumartesiye düşmesi de yarım günlük bir kayıp demektir. Sonuçta yılın ${d1(o.toplam, 'tr')} tatil gününden ${d1(o.haftaIci, 'tr')} günü iş gününe denk gelir. Cumartesi de çalışan, yani altı günlük haftada olan biri için bu sayı ${d1(o6.haftaIci, 'tr')} gündür; çünkü Cumartesiye düşen tatiller onun için gerçek bir boş gündür.</p>
<p>Kanunun 2. maddesinde ayrıca şu cümle var: ulusal bayram ve genel tatil Cuma akşamı sona erdiğinde ertesi Cumartesinin tamamı tatil yapılır. 2027'de Cuma günü biten tatiller ${cuma.map((t) => dShort(t.date, 'tr')).join(', ')} günleridir. Cumartesi çalışılan resmi daireler için bu hüküm önemlidir; özel sektörde uygulama işyerine göre değişir.</p>
<h2>Kendiliğinden uzayan hafta sonları</h2>
<p>Hiç izin almadan üç gün art arda boş kalınan dönemler: ${[...cuma, ...pzt].sort((a, b) => a.date.localeCompare(b.date)).map((t) => `${t.ad.tr} (${dShort(t.date, 'tr')})`).join(', ')}. Bunlara Ramazan Bayramının Salı–Perşembe arasına, Kurbanın da Pazar–Çarşamba arasına yayılması eklenir. Ramazan için 8 Mart Pazartesi ve 12 Mart Cuma birer köprü günüdür; 15 Temmuz Perşembeye düştüğü için 16 Temmuz Cuma da öyledir. 10 günlük izinle yıl içinde ${p10.bloklar.length} ayrı blokta toplam ${p10.bos} gün tatil yapılabileceğini ${h.a('kopru-gunleri-2027', '2027 köprü günleri planlayıcısı')} gösteriyor.</p>
${h.mini('kp', { p: ['izin'], d: { yil: Y, izin: 10 }, c: '2027 izin planınızı çıkarın' })}
<h2>Bayram günlerinde çalışma ve memur izinleri</h2>
<p>Hastane, ulaşım ya da üretim hattında tatilde çalışmak sözleşmeye veya işçinin onayına bağlıdır (İş Kanunu md. 44); çalışılan her gün için ayrıca bir günlük ücret ödenir. Tutarı ${h.a('resmi-tatil-calisma-ucreti', 'tatil çalışma ücreti hesabı')} sayfasında bulabilirsiniz. Kamuda bayram öncesine ya da sonrasına eklenen idari izin ise yıl başında belli değildir; 2027 için henüz bir karar yok (${h.a('idari-izin-2027', 'idari izin 2027')}). Bayramların ayrıntısı için ${h.a('ramazan-bayrami-2027', 'Ramazan Bayramı 2027')} ve ${h.a('kurban-bayrami-2027', 'Kurban Bayramı 2027')} sayfalarına, bütün yılı bir bakışta görmek için ${h.a('takvim-2027', '2027 takvimi')} sayfasına bakın.</p>`,
  },
  en: {
    slug: 'public-holidays-turkey-2027', nav: 'Public holidays 2027', card: `${d1(o.toplam, 'en')} days off, ${haftaSonu.length} full days on a weekend`,
    title: `Turkey public holidays 2027: full list and ${d1(o.toplam, 'en')} days`,
    description: `Public holidays in Turkey for 2027: Ramazan Bayramı 9–11 March, Kurban Bayramı 16–19 May, ${d1(o.toplam, 'en')} days in total. Which fall on a weekend and how many working days?`,
    h1: `Public holidays in Turkey 2027: ${list.length} entries, ${d1(o.toplam, 'en')} days`,
    intro: 'The tool below lists every public holiday in Turkey for 2027 with its weekday and length; you can switch the year or the working week.',
    resume: `Turkey has ${d1(o.toplam, 'en')} days of public holidays in 2027, and ${d1(o.haftaIci, 'en')} of them fall between Monday and Friday. The list comes from Law No. 2429, while the dates of the two religious festivals come from the Diyanet's 2027 list of religious days. Ramazan Bayramı (Eid al-Fitr) runs ${aralik(rb.ilk, rb.son, 'en')}, with a half-day eve on ${dShort(rb.arefe, 'en')}; Kurban Bayramı (Eid al-Adha) runs ${aralik(kb.ilk, kb.son, 'en')}, with the eve on ${dShort(kb.arefe, 'en')}. Its fourth day coincides with Youth and Sports Day on ${dShort('2027-05-19', 'en')}, so that date counts once, which is why the year is shorter than 2026 (${d1(o26.toplam, 'en')} days). ${haftaSonu.length} full holidays land on a weekend: ${ad(haftaSonu, 'en')}; the Kurban eve also falls on a Saturday. Nothing is moved to a weekday. Someone on a Monday-to-Friday week has ${o.isGunu} working days. Holidays on a Friday or a Monday give ${cuma.length + pzt.length} long weekends without any leave.`,
    faqs: [
      { q: 'How many public holiday days does Turkey have in 2027?', a: `${d1(o.toplam, 'en')} days. ${yarimSay} of them are half days from 1 pm (28 October and the two festival eves). Because day four of Kurban Bayramı and Youth and Sports Day share ${dShort('2027-05-19', 'en')}, the ${list.length} entries cover ${o.gunSayisi} separate dates. That is why the year falls short of 2026 (${d1(o26.toplam, 'en')} days); 2028 returns to ${d1(o28.toplam, 'en')}.` },
      { q: 'Which 2027 holidays in Turkey fall on a weekend?', a: `As full days, ${ad(haftaSonu, 'en')}. As a half day, ${ad(yarimHs, 'en')}. Turkey does not give a replacement weekday for a holiday that lands on a weekend; Law No. 2429 contains no such compensation rule. On a Monday-to-Friday week, only ${d1(o.haftaIci, 'en')} of the year's ${d1(o.toplam, 'en')} holiday days therefore fall on working days.` },
      { q: 'How many working days are there in Turkey in 2027?', a: `${o.isGunu} for someone with Saturdays and Sundays off, counting half days such as the festival eves as working days, since their mornings are normal working time. On a six-day week with only Sunday off, the figure is ${o6.isGunu}. With Kurban Bayramı in mid-May, May has only ${mayisIs} working days. Month-by-month figures for payroll or project planning are on the 2027 calendar page.` },
    ],
    body: (h) => `<h2>The 2027 holiday calendar month by month</h2>
<p>The table gives each holiday with its month and weekday. A half day means the afternoon from 1 pm is off; the morning is a normal working morning.</p>
${h.table(['Month', 'Date', 'Day', 'Holiday', 'Length'], list.map((t) => [ayAdi(t.date, 'en'), h.day(t.date), h.wd(t.date), t.ad.en, t.sure < 1 ? 'half' : 'full']), 'Public holidays in Turkey, 2027 (Law No. 2429; festival dates from the Diyanet)')}
<h2>Where the ${d1(o.toplam, 'en')} days come from</h2>
<p>The law lists seven fixed holidays: 1 January, 23 April, 1 May, 19 May, 15 July, 30 August and 29 October, the last one starting at 1 pm on 28 October. Add 3.5 days for Ramazan Bayramı and 4.5 for Kurban Bayramı and you reach ${d1(o.toplam + 1, 'en')} days on paper. In 2027 the last day of Kurban Bayramı is also 19 May, so the calendar holds ${d1(o.toplam, 'en')}. The overlap is simply counted once; no day is added elsewhere. In 2028 there is no such clash and the total goes back to ${d1(o28.toplam, 'en')} (${h.a('resmi-tatiller-2028', 'public holidays 2028')}).</p>
<h2>Are weekend holidays lost?</h2>
<p>For anyone working Monday to Friday, yes. ${ad(haftaSonu, 'en')} are days off anyway, and Law No. 2429 has no rule to compensate them. The Kurban eve on a Saturday also costs half a day. Out of ${d1(o.toplam, 'en')} holiday days, ${d1(o.haftaIci, 'en')} fall on working days. On a six-day week, where Saturday is a working day, the figure rises to ${d1(o6.haftaIci, 'en')}.</p>
<p>Article 2 of the law adds one more sentence: when a national or general holiday ends on a Friday evening, the following Saturday is a full day off. In 2027 that happens after ${cuma.map((t) => dShort(t.date, 'en')).join(', ')}. It matters mainly for public offices open on Saturdays; in the private sector, practice varies by employer.</p>
<h2>Long weekends that come for free</h2>
<p>Three days in a row without leave: ${[...cuma, ...pzt].sort((a, b) => a.date.localeCompare(b.date)).map((t) => `${t.ad.en} (${dShort(t.date, 'en')})`).join(', ')}. On top of that, Ramazan Bayramı spans Tuesday to Thursday and Kurban Bayramı Sunday to Wednesday. Monday 8 March and Friday 12 March are bridge days around Ramazan Bayramı, and so is Friday 16 July after Democracy Day. With 10 days of leave, the ${h.a('kopru-gunleri-2027', '2027 bridge-day planner')} finds ${p10.bos} days off across the year, in ${p10.bloklar.length} separate blocks.</p>
${h.mini('kp', { p: ['izin'], d: { yil: Y, izin: 10 }, c: 'Build your 2027 leave plan' })}
<h2>Working on a holiday, and leave for civil servants</h2>
<p>Working on a public holiday requires a clause in the contract or the employee's consent (Labour Act art. 44), and each day worked earns an extra day's pay; see the ${h.a('resmi-tatil-calisma-ucreti', 'holiday pay calculator')}. Extra administrative leave around the festivals is decided separately for the public sector and nothing has been announced for 2027 (${h.a('idari-izin-2027', 'administrative leave 2027')}). For the festivals themselves, see ${h.a('ramazan-bayrami-2027', 'Ramazan Bayramı 2027')} and ${h.a('kurban-bayrami-2027', 'Kurban Bayramı 2027')}; for the whole year at a glance, the ${h.a('takvim-2027', '2027 calendar')}.</p>`,
  },
});
