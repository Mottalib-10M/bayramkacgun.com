/** 28 Ekim yarım gün : 2429 sayılı Kanun md. 1 ve 2 ; ücret 4857 md. 44, 47, 49 (params-2026.json > ucret) ; köprüler engine/izin.ts. */
import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { dShort, aralik, gunAdi } from '../../lib/tool-specs';
import { formatDecimal, formatPercent } from '../../lib/format';

type L = 'tr' | 'en';
const d1 = (x: number, l: L) => formatDecimal(x, 1, l);
const U = K.P.ucret;
const G = 1.5;
const oran = G / U.aylikGun;
const yillar = [2026, 2027, 2028];
const satir = (y: number, l: L) => [String(y), gunAdi(`${y}-10-28`, l), gunAdi(`${y}-10-29`, l)];
const blokEkim27 = K.kopruler(2027, {}, 4).find((k) => k.tatiller.includes('cumhuriyet'))!;
const blokEkim27y = K.kopruler(2027, { yarim: true }, 4).find((k) => k.tatiller.includes('cumhuriyet'))!;
const kp26 = K.kopruGunleri(2026).find((k) => k.tatiller.includes('cumhuriyet'));

export default defineGuide({
  id: '28-ekim-yarim-gun', group: 'tatil', order: 56, tool: 'uc', toolArg: { gun: G },
  countdown: { date: '2027-10-28', time: '13:00', label: { tr: '28 Ekim 2027, 13.00', en: '28 October 2027, 1 pm' } },
  related: ['resmi-tatil-calisma-ucreti', 'resmi-tatiller-2027', 'kopru-gunleri-2027', 'resmi-tatiller-2026', 'arefe-gunu-yarim-gun', 'idari-izin-2027'],
  sources: ['k2429', 'k4857', 'rt2027'],
  tr: {
    slug: '28-ekim-yarim-gun-mu', nav: '28 Ekim yarım gün mü', card: '13.00\'ten sonra tatil; 29 Ekim özel işyerleri kapalı',
    title: '28 Ekim yarım gün mü? 2027 saat 13.00 kuralı ve ücret',
    description: '28 Ekim yarım gün mü? Evet: 2429 sayılı Kanuna göre Cumhuriyet Bayramı 28 Ekim 13.00\'te başlar. 2027\'de Perşembe öğleden sonra; kim çalışır, ücret ne olur?',
    h1: '28 Ekim yarım gün mü? Evet, saat 13.00\'ten itibaren',
    intro: 'Araç, 28 Ekim öğleden sonrası ile 29 Ekim\'de, yani 1,5 tatil gününde çalışan bir işçinin alacağı ek ücreti brüt olarak hesaplar.',
    resume: `Evet, 28 Ekim yarım gündür. 2429 sayılı Ulusal Bayram ve Genel Tatiller Hakkında Kanunun 1. maddesi Cumhuriyet Bayramının 28 Ekim günü saat 13.00'te başlayıp 29 Ekim boyunca sürdüğünü söyler; toplam 1,5 gündür. 2027'de bu, ${dShort('2027-10-28', 'tr')} öğleden sonrası ile ${dShort('2027-10-29', 'tr')} günü demektir. Resmi daire ve kuruluşlar bu sürede kapalıdır. Kanun, 29 Ekim için özel işyerlerinin kapanmasını da zorunlu tutar; bu hüküm 28 Ekim öğleden sonrası için yazılmamıştır. İşçi açısından 28 Ekim öğleden sonrası ve 29 Ekim ulusal bayram sayılır: çalışılmasa da ücret kesilmez, çalışılırsa İş Kanununun 47. maddesine göre her tatil günü için ayrıca bir günlük ücret ödenir. Aylık ücretlide bir gün aylık brütün otuzda biridir; 1,5 gün çalışan biri aylık brütünün ${formatPercent(oran, 0, 'tr')} kadarını ek olarak alır. 2027'de 29 Ekim Cumaya denk geldiği için Cumartesi-Pazar tatil yapanlar izinsiz üç gün boş kalır.`,
    faqs: [
      { q: '28 Ekim 2027 yarım gün tatil mi?', a: `Evet. ${dShort('2027-10-28', 'tr')} saat 13.00'e kadar normal iş günüdür, 13.00'ten sonra Cumhuriyet Bayramı başlar (2429 sayılı Kanun md. 1). ${dShort('2027-10-29', 'tr')} tam gün tatildir; ardından gelen hafta sonuyla birlikte tatil 31 Ekim Pazar akşamına kadar sürer. Daha uzun bir ara isteyen, ${aralik(blokEkim27.izinBas, blokEkim27.izinSon, 'tr')} arası ${blokEkim27.izin} gün izinle ${aralik(blokEkim27.bosBas, blokEkim27.bosSon, 'tr')} arasında ${blokEkim27.bos} gün tatil yapar.` },
      { q: '29 Ekim\'de özel sektör çalışır mı?', a: `2429 sayılı Kanunun 2. maddesine göre 29 Ekim günü özel işyerlerinin kapanması zorunludur. Hastane, enerji, ulaşım gibi sürekli görev yapması gereken kuruluşların özel kanunlarındaki hükümler saklıdır; bu işlerde çalışan işçiye İş Kanunu md. 47'ye göre ek ücret ödenir. Kapanma zorunluluğu yalnız bu bayram için yazılmıştır; öteki resmi tatillerde çalışılıp çalışılmayacağı İş Kanununun 44. maddesine göre sözleşmeyle belirlenir.` },
      { q: '28 Ekim öğleden sonra çalışırsam ne kadar ek ücret alırım?', a: `Yarım günlük ücret kadar. Aylık ücretlide günlük ücret, aylık brütün ${U.aylikGun} güne bölünmesiyle bulunur; saatlik ücretlide saat ücretinin ${d1(U.saatlikKat, 'tr')} katıdır. 28 Ekim öğleden sonrası ile 29 Ekim'in tamamında çalışan biri ${d1(G, 'tr')} günlük ek ücret alır; saatlik ücretli için bu, ${formatDecimal(G * U.saatlikKat, 2, 'tr')} saatlik ücrete karşılık gelir. Tutarlar brüttür; kendi ücretinizle hesabı sayfadaki araçta yapabilirsiniz.` },
    ],
    body: (h) => `<h2>Saat 13.00 nereden geliyor?</h2>
<p>1981 tarihli 2429 sayılı Kanunun ilk maddesi yalnızca Cumhuriyet Bayramını düzenler: 29 Ekim ulusal bayramdır, Devlet adına yurt içinde ve dışında yalnız bu gün tören yapılır ve bayram 28 Ekim saat 13.00'ten itibaren başlar. Aynı yarım gün kuralı Ramazan ve Kurban Bayramı arefelerinde de vardır (${h.a('arefe-gunu-yarim-gun', 'arefe günü yarım gün')}). Sabah saatleri her durumda normal mesaidir; kanun işyerini 13.00'ten önce kapanmaya zorlamaz.</p>
${h.table(['Yıl', '28 Ekim', '29 Ekim'], yillar.map((y) => satir(y, 'tr')), 'Cumhuriyet Bayramı 2026–2028: haftanın günü')}
<h2>Kimler için geçerli?</h2>
<p>Kamuda durum açıktır: Kanunun 2. maddesi bayram ve genel tatil günlerinde resmi daire ve kuruluşların tatil olduğunu söyler, dolayısıyla 28 Ekim öğleden sonra memurlar için mesai biter. Özel sektörde ise iki ayrı kural birlikte okunur. Birincisi 2429'un son fıkrası: 29 Ekim günü özel işyerlerinin kapanması zorunludur; 28 Ekim öğleden sonrası için böyle bir zorunluluk yazılmamıştır. İkincisi İş Kanununun 44. maddesi: ulusal bayram ve genel tatillerde çalışılıp çalışılmayacağı toplu sözleşme ya da iş sözleşmesiyle belirlenir, sözleşmede hüküm yoksa işçinin onayı gerekir.</p>
<p>2027'ye özgü bir ayrıntı daha var. Tatil Cuma akşamı sona erdiğinde ertesi Cumartesinin tamamı tatil yapılır (2429 md. 2). 29 Ekim 2027 Cuma olduğu için Cumartesi açık olan resmi daireler 30 Ekim Cumartesi de kapalıdır.</p>
<h2>Çalışana ödenecek ücret</h2>
<p>İş Kanununun 47. maddesine göre ulusal bayram ve genel tatilde çalışmayan işçinin o günkü ücreti tam ödenir; çalışan işçiye ise çalıştığı her gün için ayrıca bir günlük ücret verilir. 49. madde günlük ücretin nasıl bulunacağını söyler: aylık ücretlide aylık brüt ${U.aylikGun} güne bölünür, saatlik ücretlide saat ücreti ${d1(U.saatlikKat, 'tr')} ile çarpılır. 28 Ekim öğleden sonrası yarım gün, 29 Ekim tam gün sayıldığından ikisinde de çalışan biri ${d1(G, 'tr')} günlük ek ücret alır. Yukarıdaki araç tutarı kendi ücretinize göre verir; gelir vergisi ve sigorta kesintileri ayrıca uygulanır. Diğer tatiller için ${h.a('resmi-tatil-calisma-ucreti', 'resmi tatilde çalışma ücreti')} sayfasına bakın.</p>
<h2>28–29 Ekim'i uzun tatile çevirmek</h2>
<p>${kp26 ? `2026'da 29 Ekim Perşembeye denk geldi; ${dShort(kp26.izinBas, 'tr')} için bir gün izinle ${kp26.bos} günlük tatil yapılabiliyordu.` : ''} 2027'de 29 Ekim Cuma olduğu için izinsiz üç gün vardır. Haftanın ilk dört gününü izinle kapatırsanız ${aralik(blokEkim27.bosBas, blokEkim27.bosSon, 'tr')} arası ${blokEkim27.bos} gün tatil yaparsınız; bunun için ${d1(blokEkim27.izin, 'tr')} gün izin gerekir. İşyeriniz 28 Ekim sabahını yarım gün izin sayıyorsa bu ${d1(blokEkim27y.izin, 'tr')} güne iner. Yılın diğer fırsatları ${h.a('kopru-gunleri-2027', 'köprü günleri 2027')} ve ${h.a('resmi-tatiller-2027', 'resmi tatiller 2027')} sayfalarında.</p>
${h.mini('kp', { p: ['izin', 'arefe'], d: { yil: 2027, izin: 4 }, c: '2027 izin günlerinizi yerleştirin' })}`,
  },
  en: {
    slug: 'turkey-28-october-half-day', nav: '28 October half day', card: 'Off from 1 pm; private businesses closed on 29 October',
    title: 'Is 28 October a half day in Turkey? The 1 pm rule in 2027',
    description: 'Is 28 October a half day in Turkey? Yes: under Law No. 2429 Republic Day starts at 1 pm on 28 October. In 2027 it is a Thursday afternoon. Who works, what pay?',
    h1: 'Is 28 October a half day? Yes, from 1 pm',
    intro: 'The tool works out the gross extra pay for an employee who works the 28 October afternoon and 29 October, that is 1.5 holiday days.',
    resume: `Yes, 28 October is a half day in Turkey. Article 1 of Law No. 2429 on national holidays says Republic Day begins at 1 pm on 28 October and continues through 29 October, 1.5 days in all. In 2027 that means the afternoon of ${dShort('2027-10-28', 'en')} and the whole of ${dShort('2027-10-29', 'en')}. Public offices are closed for that time. The law also makes it compulsory for private businesses to close on 29 October, but it says nothing of the kind for the afternoon of 28 October. For employees, both the afternoon and 29 October count as a national holiday: pay is not cut if you stay home, and under article 47 of the Labour Act each holiday day worked earns one extra day's pay. On a monthly salary a day is one thirtieth of gross monthly pay, so working the full 1.5 days adds ${formatPercent(oran, 0, 'en')} of a month's gross pay. As 29 October 2027 is a Friday, anyone with weekends off gets three days in a row without leave.`,
    faqs: [
      { q: 'Is 28 October 2027 a half-day holiday in Turkey?', a: `Yes. ${dShort('2027-10-28', 'en')} is a normal working day until 1 pm, when Republic Day begins (Law No. 2429, art. 1). ${dShort('2027-10-29', 'en')} is a full holiday, and with the weekend after it the break lasts until Sunday 31 October. For a longer break, ${blokEkim27.izin} leave days, ${aralik(blokEkim27.izinBas, blokEkim27.izinSon, 'en')}, give ${blokEkim27.bos} days off, ${aralik(blokEkim27.bosBas, blokEkim27.bosSon, 'en')}.` },
      { q: 'Do private businesses close on 29 October in Turkey?', a: `Yes. Article 2 of Law No. 2429 makes it compulsory for private businesses to close on 29 October. Services that must run continuously, such as hospitals, energy or transport, keep the rules of their own laws, and employees working there earn extra pay under article 47 of the Labour Act. The closure duty exists for this holiday only; for the others, article 44 of the Labour Act leaves the question to the contract.` },
      { q: 'What extra pay do I get for working the afternoon of 28 October?', a: `Half a day's pay. On a monthly salary, a day is gross monthly pay divided by ${U.aylikGun}; on hourly pay it is ${d1(U.saatlikKat, 'en')} times the hourly rate. Working both the 28 October afternoon and 29 October earns ${d1(G, 'en')} days of extra pay, which for an hourly worker means ${formatDecimal(G * U.saatlikKat, 2, 'en')} hours' pay. Amounts are gross; the tool on this page works it out from your own pay.` },
    ],
    body: (h) => `<h2>Where the 1 pm comes from</h2>
<p>The first article of Law No. 2429 of 1981 deals with Republic Day alone: 29 October is the national holiday, the only day on which official ceremonies are held on behalf of the State at home and abroad, and the holiday begins at 1 pm on 28 October. The same half-day rule applies to the eves of both Eids (${h.a('arefe-gunu-yarim-gun', 'festival eve half day')}). The morning is always normal working time; an employer does not have to close before 1 pm.</p>
${h.table(['Year', '28 October', '29 October'], yillar.map((y) => satir(y, 'en')), 'Republic Day 2026–2028: day of the week')}
<h2>Who does it apply to?</h2>
<p>For the public sector it is simple: article 2 of the law closes public offices on national and general holidays, so civil servants stop at 1 pm on 28 October. In the private sector two rules are read together. The last paragraph of article 2 requires private businesses to close on 29 October; there is no such requirement for the afternoon of 28 October. Article 44 of the Labour Act then says whether people work on national and general holidays is settled by the collective agreement or the employment contract, and failing that requires the employee's consent.</p>
<p>2027 adds one detail. When a holiday ends on a Friday evening, the following Saturday is a full day off (Law No. 2429, art. 2). Because 29 October 2027 is a Friday, public offices that normally open on Saturdays stay closed on Saturday 30 October too.</p>
<h2>What you are paid if you work</h2>
<p>Under article 47 of the Labour Act, an employee who does not work on a national or general holiday still receives full pay for that day; one who works receives an additional day's pay for each day worked. Article 49 sets the daily rate: monthly gross pay divided by ${U.aylikGun}, or ${d1(U.saatlikKat, 'en')} times the hourly rate. The 28 October afternoon counts as half a day and 29 October as a full day, so working both brings ${d1(G, 'en')} days of extra pay. The tool above gives the amount for your own pay; income tax and social security come on top. For other holidays see ${h.a('resmi-tatil-calisma-ucreti', 'holiday pay in Turkey')}.</p>
<h2>Turning 28–29 October into a long break</h2>
<p>${kp26 ? `In 2026, 29 October fell on a Thursday, and one day of leave on ${dShort(kp26.izinBas, 'en')} gave ${kp26.bos} days off.` : ''} In 2027 it is a Friday, so three days come free. Cover the first four days of that week with leave and you are off ${aralik(blokEkim27.bosBas, blokEkim27.bosSon, 'en')}, ${blokEkim27.bos} days, for ${d1(blokEkim27.izin, 'en')} days of leave. If your employer counts the 28 October morning as half a leave day, that drops to ${d1(blokEkim27y.izin, 'en')}. Other options are on ${h.a('kopru-gunleri-2027', 'bridge days 2027')} and ${h.a('resmi-tatiller-2027', 'public holidays 2027')}.</p>
${h.mini('kp', { p: ['izin', 'arefe'], d: { yil: 2027, izin: 4 }, c: 'Place your 2027 leave days' })}`,
  },
});
