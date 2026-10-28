/** Resmi tatilde çalışma ücreti : 4857 sayılı İş Kanunu md. 44, 45, 47, 49, 50 ; katsayılar params-2026.json > ucret ; gün sayıları engine/takvim.ts. */
import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { formatDecimal, formatPercent } from '../../lib/format';

type L = 'tr' | 'en';
const d1 = (x: number, l: L) => formatDecimal(x, 1, l);
const pc = (x: number, l: L) => formatPercent(x, 1, l);
const U = K.P.ucret;
const Y = 2027;
const map = K.tatilHaritasi([Y]);
const o = K.yilOzeti(Y);
/** Dönemler: her tatil grubunun 2027 takvimindeki gün toplamı (çakışan gün bir kez). */
const grup = (re: RegExp) => [...map.entries()].filter(([, v]) => v.ids.some((id) => re.test(id))).reduce((s, [, v]) => s + v.sure, 0);
const donem = [
  { tr: 'Yılbaşı', en: "New Year's Day", g: grup(/^yilbasi$/) },
  { tr: 'Ramazan Bayramı (arefe dahil)', en: 'Eid al-Fitr incl. eve', g: grup(/^ramazan/) },
  { tr: '23 Nisan', en: '23 April', g: grup(/^cocuk$/) },
  { tr: '1 Mayıs', en: '1 May', g: grup(/^emek$/) },
  { tr: 'Kurban Bayramı (arefe dahil, 19 Mayıs ile)', en: 'Eid al-Adha incl. eve, with 19 May', g: grup(/^(kurban|genclik)/) },
  { tr: '15 Temmuz', en: '15 July', g: grup(/^demokrasi$/) },
  { tr: '30 Ağustos', en: '30 August', g: grup(/^zafer$/) },
  { tr: '28 Ekim öğleden sonra ve 29 Ekim', en: '28 Oct afternoon and 29 Oct', g: grup(/^cumhuriyet/) },
];
const kurban = donem[4].g, ramazan = donem[1].g;

export default defineGuide({
  id: 'resmi-tatil-calisma-ucreti', group: 'tatil', order: 57, tool: 'uc',
  related: ['28-ekim-yarim-gun', 'kurban-bayrami-2027', 'ramazan-bayrami-2027', 'resmi-tatiller-2027', 'yillik-izin', 'bayram-tatili-kac-gun'],
  sources: ['k4857', 'k2429', 'rt2027'],
  tr: {
    slug: 'resmi-tatilde-calisma-ucreti', nav: 'Tatilde çalışma ücreti', card: 'Çalışılan her tatil günü için +1 günlük brüt ücret',
    title: 'Resmi tatilde çalışma ücreti 2027: bayram mesaisi hesaplama',
    description: 'Resmi tatilde çalışma ücreti 2027: İş Kanunu md. 47\'ye göre çalışılan her bayram ve tatil günü için ek bir günlük ücret. Aylık ve saatlik ücretle brüt hesap.',
    h1: 'Resmi tatilde ve bayramda çalışma ücreti nasıl hesaplanır?',
    intro: 'Hesaplayıcıya aylık ya da saatlik brüt ücretinizi ve çalıştığınız tatil gününü girin; İş Kanununun 47. ve 49. maddelerine göre ödenmesi gereken ek ücreti brüt olarak gösterir.',
    resume: `Resmi tatilde ya da bayramda çalışan işçiye, o günün normal ücretine ek olarak çalıştığı her tatil günü için bir günlük ücret daha ödenir; uygulamada buna "çift yevmiye" denir. Kural 4857 sayılı İş Kanununun 47. maddesindedir. Günlük ücret 49. maddeye göre bulunur: aylık ücretlide aylık brüt ${U.aylikGun} güne bölünür, saatlik ücretlide saat ücreti ${d1(U.saatlikKat, 'tr')} ile çarpılır. Arefe ve 28 Ekim öğleden sonrası yarım gün sayılır. Böylece 2027 Kurban Bayramının tamamında, arefe öğleden sonrası dahil ${d1(kurban, 'tr')} gün çalışan aylık ücretli, aylık brütünün ${pc(kurban / U.aylikGun, 'tr')} kadarını ek olarak alır; Ramazan Bayramında bu oran ${pc(ramazan / U.aylikGun, 'tr')} olur. Yılın bütün resmi tatillerinde (${d1(o.toplam, 'tr')} gün) çalışan biri için ek ücret, yaklaşık ${d1(o.toplam / U.aylikGun, 'tr')} aylık brüte eşittir. Tutarlar brüttür; gelir vergisi ve SGK kesintisi ayrıca yapılır. Tatilde çalışmak ise sözleşmeye ya da işçinin onayına bağlıdır.`,
    faqs: [
      { q: 'Bayramda çalışana kaç yevmiye ödenir?', a: `Çalışılan her tatil günü için normal ücrete ek olarak bir yevmiye (İş Kanunu md. 47). Aylık ücretli zaten o günün ücretini maaşıyla alır, üzerine bir günlük ücret (aylık brüt ÷ ${U.aylikGun}) daha eklenir. Kurban Bayramı 2027 arefe dahil ${d1(kurban, 'tr')} gün, Ramazan Bayramı ${d1(ramazan, 'tr')} gün sayılır; ikisinin tamamında çalışan biri ${d1(kurban + ramazan, 'tr')} yevmiye ek ücret alır. Tutarlar brüttür.` },
      { q: 'Resmi tatilde çalışmak zorunlu mu?', a: `Hayır. İş Kanununun 44. maddesine göre ulusal bayram ve genel tatillerde çalışılıp çalışılmayacağı toplu iş sözleşmesi ya da iş sözleşmesiyle belirlenir; sözleşmede hüküm yoksa işçinin onayı gerekir. 29 Ekim'de ise 2429 sayılı Kanun özel işyerlerinin kapanmasını zorunlu tutar. Tatilde çalışmayan işçi de o günün ücretini, bir iş karşılığı olmaksızın tam olarak alır (md. 47).` },
      { q: 'Saatlik ücretle tatil çalışması nasıl hesaplanır?', a: `Günlük ücret saat ücretinin ${d1(U.saatlikKat, 'tr')} katıdır (md. 49). Tatilde çalışan saatlik ücretli, çalıştığı günün ücretini alır; buna ek olarak tatil günü başına ${d1(U.saatlikKat, 'tr')} saatlik ücret daha ödenir. Yarım günde bu ek tutar yarıya iner. Örneğin 28 Ekim öğleden sonrası ile 29 Ekim'de çalışan biri, normal ücretinin üstüne ${formatDecimal(donem[7].g * U.saatlikKat, 2, 'tr')} saatlik ücret alır.` },
      { q: 'Tatil ücretine prim ve fazla mesai dahil mi?', a: `Hayır. İş Kanununun 50. maddesine göre fazla çalışma ücretleri, primler, normal saatler dışındaki hazırlama ve temizleme işleri için ödenenler ve sosyal yardımlar tatil ücretinin hesabına katılmaz. Hesaba yalnız çıplak ücret girer: aylık ücretlide aylık brüt ${U.aylikGun} güne bölünür, saatlik ücretlide saat ücreti ${d1(U.saatlikKat, 'tr')} ile çarpılır. Araca da bu yüzden yalnız temel brüt ücreti girin.` },
    ],
    body: (h) => `<h2>Kanun ne diyor?</h2>
<p>İş Kanununun 47. maddesi iki durumu ayırır. Ulusal bayram ya da genel tatilde çalışmayan işçinin o günkü ücreti, karşılığında iş yapılmadan tam olarak ödenir. Tatil yapmayıp çalışan işçiye ise ayrıca çalıştığı her gün için bir günlük ücret ödenir. Yani tatilde çalışmak ücreti ikiye katlar; çalışmamak ücreti azaltmaz. 44. madde de tatilde çalışmayı sözleşmeye ya da işçinin onayına bağlar. 45. maddeye göre sözleşmeler bu hakları daraltamaz, daha elverişli toplu sözleşme hükümleri ise saklıdır; toplu sözleşme tatil çalışmasına daha fazlasını verebilir.</p>
<h2>Günlük ücret: üç farklı ücret şekli</h2>
<p>Hesabın tek değişkeni günlük ücrettir ve 49. madde onu ücret şekline göre tanımlar. Aylık ücretli işçide aylık brüt ${U.aylikGun} güne bölünür. Saat ücretiyle çalışanda günlük ücret saat ücretinin ${d1(U.saatlikKat, 'tr')} katıdır. Parça başı, akort, götürü ya da yüzde usulüyle çalışanda ise ödeme döneminde kazanılan ücret, aynı dönemde çalışılan gün sayısına bölünür. 50. madde fazla mesai, prim ve sosyal yardımları bu hesabın dışında tutar. Hesaplayıcı ilk iki şekli doğrudan hesaplar; üçüncüsünde günlük ortalamanızı aylık alana 30 ile çarparak girebilirsiniz.</p>
<h2>2027 tatillerinde kaç günlük ek ücret?</h2>
<p>Aşağıdaki tablo, her tatil döneminin 2027 takvimindeki gün sayısını ve aylık ücretli için aylık brütün yüzde kaçına karşılık geldiğini gösterir. 19 Mayıs Kurban Bayramının dördüncü günüyle aynı gün olduğu için iki kez ödenmez; aynı gün iki tatil sayılmaz.</p>
${h.table(['Dönem', 'Tatil günü', 'Aylık brütün'], donem.map((d) => [d.tr, d1(d.g, 'tr'), pc(d.g / U.aylikGun, 'tr')]), '2027 resmi tatillerinde çalışmanın ek ücreti, aylık ücretli için (İş Kanunu md. 47 ve 49)', ['l', 'r', 'r'])}
<p>Bayram tarihlerini ${h.a('ramazan-bayrami-2027', 'Ramazan Bayramı 2027')} ve ${h.a('kurban-bayrami-2027', 'Kurban Bayramı 2027')} sayfalarında, tüm listeyi ${h.a('resmi-tatiller-2027', 'resmi tatiller 2027')} sayfasında bulabilirsiniz.</p>
${h.mini('rt', { p: ['yil'], d: { yil: Y }, c: 'Hangi tatil hangi güne düşüyor?' })}
<h2>Arefe ve 28 Ekim: yarım günün hesabı</h2>
<p>2429 sayılı Kanun arefe günlerinde ve 28 Ekim'de tatili saat 13.00'ten başlatır. Bu yüzden öğleden sonra çalışan biri için ek ücret yarım günlüktür; sabah saatleri zaten normal mesaidir. 2027'de Ramazan arefesi Pazartesiye, Kurban arefesi Cumartesiye, 28 Ekim Perşembeye düşer. Cumhuriyet Bayramına özgü kurallar ${h.a('28-ekim-yarim-gun', '28 Ekim yarım gün mü')} sayfasında.</p>
<h2>Brüt, net ve kapsam</h2>
<p>Hesaplayıcının verdiği tutar brüttür: gelir vergisi ve sigorta primi gibi kesintilerden sonra bordroya daha düşük bir net yansır. Hesap, İş Kanunu kapsamındaki işçiler içindir; devlet memurları 657 sayılı Kanuna tabidir ve tatil çalışmaları kendi mevzuatlarına göre değerlendirilir. Tatil yerine izin planlıyorsanız ${h.a('yillik-izin', 'yıllık izin hesabı')} ve ${h.a('bayram-tatili-kac-gun', 'bayram tatili kaç gün')} araçları işinize yarar.</p>`,
  },
  en: {
    slug: 'holiday-pay-turkey', nav: 'Holiday pay', card: 'One extra day of gross pay for each holiday worked',
    title: 'Holiday pay in Turkey 2027: working on a bayram or holiday',
    description: 'Holiday pay in Turkey 2027: under Labour Act art. 47, each public holiday or festival day worked earns one extra day\'s pay. Gross, for monthly or hourly pay.',
    h1: 'Working on a public holiday in Turkey: how holiday pay works',
    intro: 'Enter your gross monthly or hourly pay and the holiday days you work; the calculator shows the gross extra pay due under articles 47 and 49 of the Labour Act.',
    resume: `An employee in Turkey who works on a public holiday or during a religious festival receives, on top of normal pay, one extra day's pay for each holiday day worked; in practice people call it "double pay". The rule is article 47 of Labour Act No. 4857. Article 49 sets the daily rate: gross monthly pay divided by ${U.aylikGun}, or ${d1(U.saatlikKat, 'en')} times the hourly rate. Festival eves and the afternoon of 28 October count as half days. So a monthly-paid employee who works the whole of Kurban Bayramı 2027, eve afternoon included, ${d1(kurban, 'en')} days, earns an extra ${pc(kurban / U.aylikGun, 'en')} of monthly gross pay; for Ramazan Bayramı the figure is ${pc(ramazan / U.aylikGun, 'en')}. Working every public holiday of the year (${d1(o.toplam, 'en')} days) adds roughly ${d1(o.toplam / U.aylikGun, 'en')} months of gross pay. The amounts are gross, before income tax and social security. Working on a holiday at all depends on the contract or the employee's consent.`,
    faqs: [
      { q: 'How much extra pay for working on Eid in Turkey?', a: `One extra day's pay for each holiday day worked, on top of normal pay (Labour Act art. 47). A monthly-paid employee already gets the day in the salary and receives a further day's pay (gross monthly ÷ ${U.aylikGun}). In 2027 Kurban Bayramı counts as ${d1(kurban, 'en')} days including the eve afternoon and Ramazan Bayramı as ${d1(ramazan, 'en')}; working both in full earns ${d1(kurban + ramazan, 'en')} extra days' pay, gross.` },
      { q: 'Can my employer make me work on a public holiday in Turkey?', a: `Not unilaterally. Under article 44 of the Labour Act, whether people work on national and general holidays is set by the collective agreement or the employment contract; failing that, the employee must agree. On 29 October, Law No. 2429 requires private businesses to close. An employee who does not work the holiday still receives that day's full pay without doing any work (art. 47).` },
      { q: 'How is holiday work paid on an hourly rate?', a: `The daily rate is ${d1(U.saatlikKat, 'en')} times the hourly rate (art. 49). An hourly worker who works the holiday is paid for the hours worked and, on top, ${d1(U.saatlikKat, 'en')} hours' pay per holiday day. On a half day that extra is halved. Someone working the 28 October afternoon and 29 October, for instance, earns ${formatDecimal(donem[7].g * U.saatlikKat, 2, 'en')} hours' pay on top of normal pay.` },
      { q: 'Do bonuses and overtime count in holiday pay?', a: `No. Article 50 of the Labour Act excludes overtime pay, bonuses, pay for preparation or cleaning work outside normal hours, and social benefits from the calculation of holiday pay. Only basic pay counts: gross monthly pay divided by ${U.aylikGun}, or the hourly rate multiplied by ${d1(U.saatlikKat, 'en')}. That is why the calculator asks for your basic gross pay alone.` },
    ],
    body: (h) => `<h2>What the law says</h2>
<p>Article 47 of the Labour Act separates two cases. An employee who does not work on a national or general holiday is paid in full for that day without doing any work. One who works instead receives an additional day's pay for each day worked. Working the holiday doubles the pay; staying home does not reduce it. Article 44 makes holiday work subject to the contract or the employee's consent. Under article 45, contracts cannot cut these rights, while more favourable terms in collective agreements are preserved; a collective agreement may pay holiday work more.</p>
<h2>The daily rate under three pay methods</h2>
<p>The only variable in the calculation is the daily rate, which article 49 defines by pay method. On a monthly salary, gross monthly pay is divided by ${U.aylikGun}. On an hourly rate, a day is ${d1(U.saatlikKat, 'en')} times the hourly rate. For piece work, lump-sum or percentage pay, the pay earned in the period is divided by the days worked in it. Article 50 leaves overtime, bonuses and social benefits out. The calculator handles the first two methods directly; for the third, enter your daily average times 30 as monthly pay.</p>
<h2>Extra pay for each 2027 holiday</h2>
<p>The table shows how many holiday days each period has in the 2027 calendar and what share of monthly gross pay it represents for a salaried employee. 19 May is also the fourth day of Kurban Bayramı, so it is paid once, not twice.</p>
${h.table(['Period', 'Holiday days', 'Share of monthly pay'], donem.map((d) => [d.en, d1(d.g, 'en'), pc(d.g / U.aylikGun, 'en')]), 'Extra pay for working the 2027 public holidays, monthly-paid employee (Labour Act arts. 47 and 49)', ['l', 'r', 'r'])}
<p>Festival dates are on ${h.a('ramazan-bayrami-2027', 'Ramazan Bayramı 2027')} and ${h.a('kurban-bayrami-2027', 'Kurban Bayramı 2027')}; the full list on ${h.a('resmi-tatiller-2027', 'public holidays 2027')}.</p>
${h.mini('rt', { p: ['yil'], d: { yil: Y }, c: 'Which day does each holiday fall on?' })}
<h2>Eves and 28 October: paying the half day</h2>
<p>Law No. 2429 starts the holiday at 1 pm on festival eves and on 28 October. Working that afternoon therefore earns half a day extra; the morning is ordinary working time. In 2027 the Eid al-Fitr eve falls on a Monday, the Eid al-Adha eve on a Saturday and 28 October on a Thursday. Republic Day has its own rules, explained on ${h.a('28-ekim-yarim-gun', 'is 28 October a half day')}.</p>
<h2>Gross, net and who is covered</h2>
<p>The calculator's figure is gross: after deductions such as income tax and social security the net amount on the payslip is lower. The calculation applies to employees under the Labour Act; civil servants come under Law No. 657 and their holiday duty follows their own rules. If you would rather plan time off, the ${h.a('yillik-izin', 'annual leave calculator')} and the ${h.a('bayram-tatili-kac-gun', 'holiday length calculator')} will help.</p>`,
  },
});
