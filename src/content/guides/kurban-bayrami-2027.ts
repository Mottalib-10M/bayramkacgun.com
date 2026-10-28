/** Kurban Bayramı 2027 : tarihler Diyanet listesinden (dini-gunler.json), tatil hesabı engine/izin.ts. */
import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { dShort, dLong, aralik } from '../../lib/tool-specs';

const b = K.bayram('kurban', 2027)!;
const z = K.diniGunler(2027).filter((e) => e.id.startsWith('kurban'));
const t0 = K.bayramTatili('kurban', 2027, 0)!, t2 = K.bayramTatili('kurban', 2027, 2)!;
const t1 = K.bayramTatili('kurban', 2027, 1)!;
const s0 = K.bayramTatili('kurban', 2027, 0, { hafta: '6' })!, s3 = K.bayramTatili('kurban', 2027, 3, { hafta: '6' })!;
const o26 = K.yilOzeti(2026), o27 = K.yilOzeti(2027);
const b28 = K.bayram('kurban', 2028)!;

export default defineGuide({
  id: 'kurban-bayrami-2027', group: 'bayram', order: 1, tool: 'by', toolArg: { tur: 'kurban', yil: 2027 },
  countdown: { date: b.ilk, label: { tr: 'Kurban Bayramı 2027', en: 'Kurban Bayramı 2027' } },
  related: ['bayram-tatili-kac-gun', 'bayrama-kac-gun-kaldi', 'idari-izin-2027', 'resmi-tatiller-2027', 'kurban-bayrami-2028', 'resmi-tatil-calisma-ucreti'],
  sources: ['dg2027', 'k2429', 'rt2027', 'hilal'],
  tr: {
    slug: 'kurban-bayrami-2027', nav: 'Kurban Bayramı 2027', card: '16–19 Mayıs 2027: arefe, tatil süresi, 9 günlük plan',
    title: 'Kurban Bayramı 2027 ne zaman? Tarih, arefe ve tatil süresi',
    description: 'Kurban Bayramı 2027: 16 Mayıs Pazar başlar, 19 Mayıs Çarşamba biter; arefe 15 Mayıs Cumartesi. Bayrama kaç gün kaldı, kaç gün tatil, 2 günlük izinle 9 gün.',
    h1: 'Kurban Bayramı 2027: 16–19 Mayıs, arefesi Cumartesi',
    intro: 'Diyanet takvimine göre Kurban Bayramı 2027, 16 Mayıs Pazar günü başlar. Aşağıda canlı geri sayım, bayram günleri ve 2026–2035 arası tüm tarihler var.',
    resume: `Kurban Bayramı 2027, Diyanet İşleri Başkanlığının dini günler listesine göre ${dShort(b.ilk, 'tr')} günü başlar ve ${dShort(b.son, 'tr')} günü biter; hicri takvimde ${z.find((e) => e.id === 'kurban-1')!.hicri} gününe denk gelir. Arefe ${dShort(b.arefe, 'tr')} günüdür ve 2429 sayılı Kanun gereği saat 13.00'ten itibaren yarım gün tatildir. Bu yıl iki özellik var: arefe Cumartesiye, bayramın dördüncü günü de 19 Mayıs Atatürk'ü Anma, Gençlik ve Spor Bayramına düşüyor. İki tatil aynı güne geldiği için ayrı ayrı sayılmaz ve Türkiye'de hafta sonuna ya da başka tatile düşen gün kaydırılmaz. Sonuç olarak Cumartesi-Pazar tatil yapan biri için bayram, izinsiz ${t0.gun} gün sürer (${aralik(t0.bas, t0.son, 'tr')}). Perşembe ve Cuma, yani 20 ve 21 Mayıs için 2 gün yıllık izin alan, ${aralik(t2.bas, t2.son, 'tr')} arasında ${t2.gun} gün kesintisiz tatil yapar. Haftada altı gün çalışanların izinsiz tatili ${s0.gun} gündür. Kamu personeline idari izin verilip verilmeyeceği henüz açıklanmadı.`,
    faqs: [
      { q: 'Kurban Bayramı 2027 hangi gün başlıyor?', a: `${dShort(b.ilk, 'tr')} günü başlar, ${dShort(b.son, 'tr')} günü biter. Arefe ${dShort(b.arefe, 'tr')} günüdür ve tatil o gün saat 13.00'te başlar. Tarih Diyanet İşleri Başkanlığının 2027 dini günler listesinden alınmıştır; hicri takvimde 10–13 Zilhicce 1448 günlerine karşılık gelir. Diyanet hilal hesabını önceden yaptığı için bu tarih son anda değişmez. Bir sonraki Kurban Bayramı ${aralik(b28.ilk, b28.son, 'tr')} arasındadır.` },
      { q: 'Kurban Bayramı 2027 kaç gün tatil?', a: `2429 sayılı Kanuna göre arefe öğleden sonrası dahil 4,5 gün. Fiilen Cumartesi-Pazar tatil yapan biri ${aralik(t0.bas, t0.son, 'tr')} arasında ${t0.gun} gün tatil yapar; 20 ve 21 Mayıs için izin alırsa ${t2.gun} güne çıkar. Pazar dışında her gün çalışan biri için izinsiz tatil ${s0.gun} gündür. Arefe Cumartesiye düştüğü için hafta içi çalışanlar yarım günlük arefe tatilinden ayrıca yararlanamaz.` },
      { q: '19 Mayıs 2027 Kurban Bayramına denk geliyor mu?', a: `Evet. 19 Mayıs 2027 Çarşamba, hem Atatürk'ü Anma, Gençlik ve Spor Bayramı hem de Kurban Bayramının dördüncü günüdür. Aynı gün iki kez tatil sayılmaz ve yerine başka bir gün verilmez; bu yüzden 2027 yılındaki toplam resmi tatil, 2026'dakinden bir gün azdır. Bayram Çarşamba bittiği için o haftada geriye yalnızca Perşembe ve Cuma kalır; ikisi izinle kapatılırsa tatil Pazar akşamına uzar.` },
      { q: 'Kurban Bayramı 2027 için 9 günlük tatil olacak mı?', a: `Bayramı 9 güne tamamlayacak bir idari izin şimdilik açıklanmadı; kamu için böyle bir karar verilirse Resmî Gazete'de yayımlanır. Kendi izninizle aynı sonuca ulaşabilirsiniz: 20 ve 21 Mayıs için 2 gün yıllık izin alırsanız ${aralik(t2.bas, t2.son, 'tr')} arası ${t2.gun} gün tatil olur. Yalnızca bir gün izniniz varsa en verimli gün ${dShort(t1.izinGunleri[0], 'tr')} olur ve tatil ${t1.gun} gün sürer.` },
    ],
    body: (h) => `<h2>Kurban Bayramı 2027 gün gün</h2>
<p>Diyanet listesindeki bayram günleri, hicri karşılıkları ve iş hayatındaki anlamları. Saatler Türkiye saatidir; arefe günü 13.00'e kadar normal iş günüdür.</p>
${h.table(['Tarih', 'Gün', 'Hicri tarih', 'Durum'], z.map((e) => [h.day(e.date), h.wd(e.date), e.hicri, e.id === 'kurban-arefe' ? '13.00\'ten itibaren yarım gün tatil' : e.date === '2027-05-19' ? 'Bayramın 4. günü ve 19 Mayıs' : 'Resmi tatil']), 'Kurban Bayramı 2027, Diyanet İşleri Başkanlığı listesine göre')}
<h2>Arefe Cumartesi, son gün 19 Mayıs: bu yıl neden kısa?</h2>
<p>2429 sayılı Ulusal Bayram ve Genel Tatiller Hakkında Kanun, Kurban Bayramını "arefe günü saat 13.00'ten itibaren başlayıp 4,5 gün" olarak tanımlar. Kanunda hafta sonuna denk gelen tatilin başka güne aktarılması diye bir kural yoktur. 2027'de arefe Cumartesiye düşünce, beş gün çalışanlar için yarım günlük kazanç kaybolur. Dördüncü gün de zaten tatil olan 19 Mayısla çakışır. Bu iki çakışma yüzünden 2027 yılının toplam resmi tatili ${h.n(o27.toplam, 1)} gündür; 2026'da bu sayı ${h.n(o26.toplam, 1)} gündü.</p>
<p>Öte yandan bayram Pazar başladığı için Cumartesi-Pazar tatil yapanlar Cumartesiden Çarşambaya ${t0.gun} gün evde kalır. Haftanın kalan iki iş günü, Perşembe ve Cuma, bayramı uzun bir tatile çevirmenin anahtarıdır.</p>
${h.mini('bt', { p: ['izin'], d: { tur: 'kurban', yil: 2027, izin: 2 }, c: 'Kurban Bayramı 2027 tatilinizi planlayın' })}
<h2>2 gün izinle 9 gün, 6 günlük haftada 8 gün</h2>
<p>20 ve 21 Mayıs için yıllık izin alırsanız tatiliniz ${h.wday(t2.bas)} başlar ve ${h.wday(t2.son)} biter: ${t2.gun} gün. İzin bütçeniz bir günse en iyisi Cuma, 14 Mayıs'tır; o zaman bayram bir gün önce başlar. Pazar dışında her gün çalışıyorsanız tablo değişir: Cumartesi sabahı işe gidersiniz, izinsiz tatiliniz ${aralik(s0.bas, s0.son, 'tr')} arasında ${s0.gun} gündür ve ${h.n(s3.izin)} gün izinle ${s3.gun} güne çıkar. Tüm seçenekleri ${h.a('bayram-tatili-kac-gun', 'bayram tatili hesaplayıcısı')} gösterir.</p>
<h2>Memurlar için idari izin</h2>
<p>Kamuda bayram öncesi ya da sonrası iş günleri, Cumhurbaşkanlığı genelgesiyle idari izin ilan edilebilir. Bu karar her yıl ayrıca verilir ve Resmî Gazete'de yayımlanır. 2027 Kurban Bayramı için böyle bir karar henüz yok; sitemiz duyurulmamış bir izni varsaymaz. Gelişmeleri ${h.a('idari-izin-2027', 'idari izin 2027')} sayfasında izliyoruz.</p>
<h2>Bayramda çalışacaksanız</h2>
<p>Hastane, ulaşım, güvenlik ya da turizmde bayramda çalışmak olağandır. İş Kanununun 47. maddesine göre çalışılan her tatil günü için ayrıca bir günlük ücret ödenir; arefe öğleden sonrası yarım gün sayılır. Kendi tutarınızı ${h.a('resmi-tatil-calisma-ucreti', 'tatil çalışma ücreti hesaplayıcısıyla')} bulabilirsiniz.</p>
<h2>Tarih nereden geliyor, değişebilir mi?</h2>
<p>Diyanet, hicri ayların başlangıcını hilalin dünyanın herhangi bir yerinde görülebilir olmasına göre önceden hesaplar: güneşle ayın arasındaki açı en az 8 derece, güneş battığında ayın ufuktan yüksekliği en az 5 derece olmalıdır. Bu yüzden Türkiye'deki tarih yıllar önceden bellidir ve son anda değişmez; bazı ülkelerde bayram bir gün farklı olabilir. Bir sonraki Kurban Bayramı ${aralik(b28.ilk, b28.son, 'tr')} tarihlerindedir (${h.a('kurban-bayrami-2028', 'Kurban Bayramı 2028')}).</p>`,
  },
  en: {
    slug: 'eid-al-adha-2027-turkey', nav: 'Kurban Bayramı 2027', card: '16–19 May 2027: the eve, days off, a 9-day plan',
    title: 'Eid al-Adha 2027 in Turkey: Kurban Bayramı dates, days off',
    description: 'Kurban Bayramı (Eid al-Adha) 2027 in Turkey runs Sunday 16 to Wednesday 19 May, with the eve on Saturday 15 May. Countdown, days off and a 9-day leave plan.',
    h1: 'Kurban Bayramı 2027 in Turkey: 16–19 May, eve on a Saturday',
    intro: 'According to the Diyanet calendar, Kurban Bayramı (Eid al-Adha) 2027 starts on Sunday 16 May. Below: a live countdown, each holiday day, and every date from 2026 to 2035.',
    resume: `Kurban Bayramı, the Feast of Sacrifice known elsewhere as Eid al-Adha, begins in Turkey on ${dShort(b.ilk, 'en')} 2027 and ends on ${dShort(b.son, 'en')}, according to the religious-days list of the Presidency of Religious Affairs (Diyanet). The eve, arefe, is ${dShort(b.arefe, 'en')}; under Law No. 2429 it is a half-day holiday from 1 pm. Two things make 2027 unusual. The eve falls on a Saturday, and the fourth day coincides with 19 May, Commemoration of Atatürk, Youth and Sports Day. A day that is two holidays at once counts only once, and Turkey never moves a holiday that lands on a weekend or on another holiday. For someone with Saturdays and Sundays off, the break therefore lasts ${t0.gun} days without any leave, from ${dLong(t0.bas, 'en')} to ${dLong(t0.son, 'en')}. Taking Thursday 20 and Friday 21 May as annual leave turns it into ${t2.gun} days in a row, up to Sunday 23 May. On a six-day week the break is ${s0.gun} days. No administrative leave for public employees has been announced yet.`,
    faqs: [
      { q: 'When is Eid al-Adha 2027 in Turkey?', a: `Kurban Bayramı runs from ${dShort(b.ilk, 'en')} to ${dShort(b.son, 'en')} 2027, with the eve on ${dShort(b.arefe, 'en')}; the holiday itself starts at 1 pm that day. The dates come from the Diyanet's 2027 list of religious days and match 10 to 13 Dhu al-Hijjah 1448 in the Hijri calendar. Because the Diyanet computes the crescent in advance, the Turkish date will not change at the last minute.` },
      { q: 'How many days off is Kurban Bayramı 2027?', a: `By law 4.5 days including the eve afternoon. In practice, with weekends off you are free from ${dLong(t0.bas, 'en')} to ${dLong(t0.son, 'en')}, ${t0.gun} days; with leave on 20 and 21 May it becomes ${t2.gun} days. On a six-day week the break without leave is ${s0.gun} days.` },
      { q: 'Does 19 May 2027 fall during the Eid holiday?', a: `Yes. Wednesday 19 May 2027 is both Youth and Sports Day and the fourth day of Kurban Bayramı. It counts once, and no replacement day is given, which is why 2027 has one public holiday day fewer than 2026. With the feast ending on a Wednesday, only Thursday and Friday remain as working days that week; taking both as leave stretches the break to Sunday.` },
    ],
    body: (h) => `<h2>Kurban Bayramı 2027 day by day</h2>
<p>The holiday days from the Diyanet list, with their Hijri dates and what they mean for work. Times are Turkey time; the eve is an ordinary working day until 1 pm.</p>
${h.table(['Date', 'Day', 'Hijri date', 'Status'], z.map((e) => [h.day(e.date), h.wd(e.date), e.hicri, e.id === 'kurban-arefe' ? 'Half-day holiday from 1 pm' : e.date === '2027-05-19' ? 'Day 4 and Youth Day' : 'Public holiday']), 'Kurban Bayramı 2027, from the Diyanet list')}
<h2>An eve on Saturday and a clash with 19 May</h2>
<p>Law No. 2429 on national holidays defines Kurban Bayramı as starting "at 1 pm on the eve and lasting 4.5 days". Nothing in the law moves a holiday that falls on a weekend. With the eve on a Saturday, people who work Monday to Friday lose that half day. The fourth day also coincides with 19 May, already a holiday. Because of those two overlaps, 2027 has ${h.n(o27.toplam, 1)} days of public holidays in total, against ${h.n(o26.toplam, 1)} in 2026.</p>
<p>The upside is that the feast begins on a Sunday, so anyone off at weekends stays home from Saturday to Wednesday, ${t0.gun} days. The two working days left that week, Thursday and Friday, are the key to a long break.</p>
${h.mini('bt', { p: ['izin'], d: { tur: 'kurban', yil: 2027, izin: 2 }, c: 'Plan your 2027 Eid al-Adha break' })}
<h2>Nine days for two days of leave</h2>
<p>Take Thursday 20 and Friday 21 May off and your break runs from ${h.wday(t2.bas)} to ${h.wday(t2.son)}: ${t2.gun} days. With a single leave day, Friday 14 May is the best choice, starting the break a day earlier. On a six-day week the picture changes: you work Saturday morning, the break without leave is ${s0.gun} days, and ${h.n(s3.izin)} leave days stretch it to ${s3.gun}. The ${h.a('bayram-tatili-kac-gun', 'holiday length calculator')} shows every option.</p>
<h2>Administrative leave for public employees</h2>
<p>In the public sector, working days next to a bayram are sometimes declared administrative leave by presidential circular, published in the Official Gazette. That decision is made separately each year. None exists yet for Kurban Bayramı 2027, and this site does not assume leave that has not been announced. We follow it on ${h.a('idari-izin-2027', 'administrative leave 2027')}.</p>
<h2>If you work through the holiday</h2>
<p>Hospitals, transport, security and tourism keep working during the bayram. Under article 47 of the Labour Act, each holiday day worked earns one extra day's pay; the eve afternoon counts as half a day. Work out your own amount with the ${h.a('resmi-tatil-calisma-ucreti', 'holiday pay calculator')}.</p>
<h2>Where the date comes from</h2>
<p>The Diyanet computes the start of each Hijri month in advance, based on the new crescent being visible somewhere on Earth: at least 8 degrees between sun and moon, and the moon at least 5 degrees above the horizon at sunset. That is why the Turkish date is known years ahead and does not change at the last minute, while some countries celebrate a day earlier or later. The next Kurban Bayramı falls on ${aralik(b28.ilk, b28.son, 'en')} (${h.a('kurban-bayrami-2028', 'Kurban Bayramı 2028')}).</p>`,
  },
});
