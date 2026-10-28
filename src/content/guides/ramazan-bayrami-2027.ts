/** Ramazan Bayramı 2027 : Diyanet listesi (dini-gunler.json), tatil hesabı engine/izin.ts. */
import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { dShort, dLong, aralik } from '../../lib/tool-specs';
import { formatDecimal } from '../../lib/format';

const b = K.bayram('ramazan', 2027)!, r = K.ramazan(2027)!;
const z = K.diniGunler(2027).filter((e) => /^ramazan-(arefe|\d)$/.test(e.id));
const t0 = K.bayramTatili('ramazan', 2027, 0)!, t1 = K.bayramTatili('ramazan', 2027, 1)!, t2 = K.bayramTatili('ramazan', 2027, 2)!;
const y2 = K.bayramTatili('ramazan', 2027, 1.5, { yarim: true })!;
const s0 = K.bayramTatili('ramazan', 2027, 0, { hafta: '6' })!, s4 = K.bayramTatili('ramazan', 2027, 4, { hafta: '6' })!;
const b28 = K.bayram('ramazan', 2028)!;
const ist = K.ilVakit('istanbul', r.son);
const hicri1 = z.find((e) => e.id === 'ramazan-1')!.hicri;

export default defineGuide({
  id: 'ramazan-bayrami-2027', group: 'bayram', order: 2, tool: 'by', toolArg: { tur: 'ramazan', yil: 2027 },
  countdown: { date: b.ilk, label: { tr: 'Ramazan Bayramı 2027', en: 'Ramazan Bayramı 2027' } },
  related: ['bayram-tatili-kac-gun', 'ramazan-2027', 'arefe-gunu-yarim-gun', 'idari-izin-2027', 'ramazan-bayrami-2028', 'kurban-bayrami-2027'],
  sources: ['dg2027', 'k2429', 'rt2027', 'hicri-fark'],
  tr: {
    slug: 'ramazan-bayrami-2027', nav: 'Ramazan Bayramı 2027', card: '9–11 Mart 2027: arefe Pazartesi, 2 gün izinle 9 gün',
    title: 'Ramazan Bayramı 2027 ne zaman? 9–11 Mart, arefe ve tatil',
    description: 'Ramazan Bayramı 2027: 9 Mart Salı başlar, 11 Mart Perşembe biter; arefe 8 Mart Pazartesi öğleden sonra. Bayrama kaç gün kaldı, kaç gün tatil, izin planı.',
    h1: 'Ramazan Bayramı 2027: 9–11 Mart, Salıdan Perşembeye',
    intro: 'Diyanet takvimine göre Şeker Bayramı da denen Ramazan Bayramı 2027, 9 Mart Salı günü başlar. Geri sayım, bayram günleri ve sonraki yılların tarihleri aşağıda.',
    resume: `Ramazan Bayramı 2027 ${dShort(b.ilk, 'tr')} günü başlar ve ${dShort(b.son, 'tr')} günü biter. Tarih, Diyanet İşleri Başkanlığının 2027 dini günler listesindedir ve hicri ${z.find((e) => e.id === 'ramazan-1')!.hicri} gününe karşılık gelir. Ramazan ayının son orucu, aynı zamanda arefe olan ${dShort(b.arefe, 'tr')} günü tutulur; 2429 sayılı Kanuna göre arefe saat 13.00'ten itibaren yarım gün tatildir ve kanundaki toplam süre 3,5 gündür. Bayram hafta ortasına düştüğü için Cumartesi-Pazar tatil yapan biri izinsiz yalnızca ${t0.gun} gün tatil yapar. Pazartesi sabahı için izin alınırsa tatil önceki Cumartesiden başlar ve ${t1.gun} güne çıkar. Pazartesiye bir de Cuma, 12 Mart eklenirse ${aralik(t2.bas, t2.son, 'tr')} arasında ${t2.gun} günlük kesintisiz bir tatil olur. Bu hesap arefe sabahını tam gün izin sayar; işyeriniz yarım gün sayıyorsa aynı ${y2.gun} günlük tatil ${formatDecimal(y2.izin, 1, 'tr')} gün izin tutar. Kamuda idari izin şimdilik açıklanmadı.`,
    faqs: [
      { q: 'Ramazan Bayramı 2027 hangi tarihte?', a: `${dShort(b.ilk, 'tr')} ile ${dShort(b.son, 'tr')} arasında, üç gün. Arefe ${dShort(b.arefe, 'tr')} günüdür; Ramazanın son oruç günü olan arefede tatil saat 13.00'te başlar. Tarihler Diyanet İşleri Başkanlığının 2027 listesine göredir ve bayramın ilk günü hicri ${hicri1} tarihine karşılık gelir. Hicri yıl güneş yılından kısa olduğundan bir sonraki Ramazan Bayramı ${aralik(b28.ilk, b28.son, 'tr')} tarihlerine kayar.` },
      { q: 'Şeker Bayramı 2027 kaç gün tatil olacak?', a: `Kanuna göre arefe öğleden sonrası dahil 3,5 gün. Bayram Salı-Perşembe arasına düştüğü için hafta sonu tatil yapan çalışan izinsiz ${t0.gun} gün tatil yapar. 8 ve 12 Mart için izin alırsa ${aralik(t2.bas, t2.son, 'tr')} arası ${t2.gun} gün olur. Tek gün izin varsa en iyisi onu arefe sabahına vermektir: tatil önceki Cumartesi başlar ve ${t1.gun} gün sürer.` },
      { q: '2027 Ramazan Bayramında hafta sonu ile birleşen kaç gün var?', a: `Hiç yok. Bayram Salı başlayıp Perşembe bittiği için ne önündeki ne arkasındaki hafta sonuna değer. Arada Pazartesi sabahı ve Cuma kalır; ikisi kapatılınca bayram iki hafta sonunu birleştirir. Cumartesi de çalışılan altı günlük düzende hesap değişir ve izinsiz tatil ${s0.gun} gün, ${s4.izin} gün izinle ${s4.gun} gün olur.` },
      { q: 'Bayramdan önceki son iftar 2027\'de ne zaman?', a: `Ramazanın son iftarı arefe akşamı, ${dShort(r.son, 'tr')} günü yapılır. İstanbul için hesapladığımız iftar vakti saat ${K.hhmm(ist.aksam)}, aynı günün imsak vakti ise saat ${K.hhmm(ist.imsak)} olur. Ertesi sabah bayramın ilk günüdür ve oruç tutulmaz. Ramazan 2027 toplam ${r.gun} gün sürer; öteki illerin saatleri ilden ile değiştiği için 81 il imsakiyesinde ayrı ayrı verilir.` },
    ],
    body: (h) => `<h2>Bayram günleri ve arefe</h2>
${h.table(['Tarih', 'Gün', 'Hicri tarih', 'Çalışma hayatında'], z.map((e) => [h.day(e.date), h.wd(e.date), e.hicri, e.id === 'ramazan-arefe' ? '13.00\'e kadar iş, sonra tatil' : 'Resmi tatil']), 'Ramazan Bayramı 2027 (Diyanet İşleri Başkanlığı)')}
<p>Bayramın birinci günü sabah bayram namazı kılınır, bayramlaşma ve aile ziyaretleri genellikle ilk iki güne yoğunlaşır. Halk arasında Şeker Bayramı adı, ziyaretlerde ikram edilen tatlılardan gelir; resmi adı 2429 sayılı Kanunda Ramazan Bayramı olarak geçer.</p>
<h2>Hafta ortasında bir bayram: üç gün mü, dokuz gün mü?</h2>
<p>2027'de bayram ne Pazartesiye ne Cumaya değiyor. Bu, iş takvimi açısından en kötü senaryolardan biri gibi görünse de aslında iki haftayı birleştirmek için çok az izin gerektirir. Pazartesi, 8 Mart arefedir: sabahı iş, öğleden sonrası tatil. Cuma, 12 Mart ise bayramdan sonraki tek iş günüdür. Bu iki gün kapatıldığında ${h.wday(t2.bas)} başlayan tatil ${h.wday(t2.son)} biter.</p>
${h.mini('bt', { p: ['izin', 'arefe'], d: { tur: 'ramazan', yil: 2027, izin: 2 }, c: 'Ramazan Bayramı 2027 tatilini hesaplayın' })}
<p>Yalnızca bir gün izniniz varsa onu arefe sabahına verin: Cumartesiden Perşembeye ${t1.gun} gün tatil yaparsınız. Cumartesi de çalışılan altı günlük düzende ise Pazar ve bayram günleri birleşir; izinsiz tatil ${s0.gun} gün, ${h.n(s4.izin)} gün izinle ${s4.gun} gündür.</p>
<h2>Arefe sabahı izin: yarım gün mü tam gün mü?</h2>
<p>Kanun arefenin öğleden sonrasını tatil sayar; sabahı için ne yapılacağını söylemez. Kamuda ve birçok özel işyerinde sabah için yarım gün izin yazılabilir, bazı işyerleri ise izni tam gün olarak düşer. Hesaplayıcıdaki "Arefe sabahı için izin" seçeneği bu farkı gösterir. Ayrıntılar ${h.a('arefe-gunu-yarim-gun', 'arefe yarım gün')} sayfasında.</p>
<h2>Ramazan ayı ve Kadir Gecesi</h2>
<p>Bayramdan önceki Ramazan ayı ${h.wday(r.ilk)} başlar ve ${h.n(r.gun)} gün sürer. Kadir Gecesi ${h.day(r.kadir)} Cuma akşamıdır. İmsak ve iftar saatleri için ${h.a('imsakiye-2027', '81 il imsakiyesi')}, gün gün plan için ${h.a('ramazan-2027', 'Ramazan 2027')} sayfasına bakın.</p>
<h2>Bayram neden her yıl yaklaşık 11 gün erken geliyor?</h2>
<p>Hicri takvim ay yılıdır ve güneş yılından yaklaşık 11 gün kısadır. Bu yüzden Ramazan Bayramı 2028'de ${aralik(b28.ilk, b28.son, 'tr')} tarihlerine, birkaç yıl sonra da Ocak ayına iner. 2033 yılında iki Ramazan Bayramı vardır: biri Ocak başında, diğeri Aralık sonunda. Uzun liste ${h.a('bayram-tarihleri', 'bayram tarihleri 2026–2035')} sayfasında. Diyanet, hicri ay başlarını hilalin dünyanın bir yerinde görülebilir olmasına göre hesapladığı için Türkiye'deki tarih bazı ülkelerden bir gün farklı olabilir.</p>`,
  },
  en: {
    slug: 'eid-al-fitr-2027-turkey', nav: 'Ramazan Bayramı 2027', card: '9–11 March 2027: eve on Monday, 9 days for 2',
    title: 'Eid al-Fitr 2027 in Turkey: Ramazan Bayramı dates, days off',
    description: 'Ramazan Bayramı (Eid al-Fitr) 2027 in Turkey: Tuesday 9 to Thursday 11 March, with a half-day eve on Monday 8 March. Countdown, days off and a 9-day plan.',
    h1: 'Ramazan Bayramı 2027 in Turkey: Tuesday 9 to Thursday 11 March',
    intro: 'According to the Diyanet calendar, Ramazan Bayramı (Eid al-Fitr, also called Şeker Bayramı) 2027 starts on Tuesday 9 March. Countdown, holiday days and later years below.',
    resume: `Ramazan Bayramı 2027, the festival that ends Ramadan and is known elsewhere as Eid al-Fitr, runs in Turkey from ${dShort(b.ilk, 'en')} to ${dShort(b.son, 'en')} 2027. The date is on the Diyanet's 2027 list of religious days and matches 1 Shawwal 1448. The last fast of Ramadan is kept on ${dShort(b.arefe, 'en')}, which is also the eve, arefe; under Law No. 2429 the eve is a holiday from 1 pm, giving 3.5 days in total. Because the feast falls midweek, someone who has weekends off gets only ${t0.gun} days without leave. A leave day for Monday morning starts the break on the Saturday before and makes it ${t1.gun} days. Adding Friday 12 March as well gives ${t2.gun} days in a row, from ${dLong(t2.bas, 'en')} to ${dLong(t2.son, 'en')}. That calculation counts the eve morning as a full leave day; where employers count it as half a day, the same ${y2.gun}-day break costs ${formatDecimal(y2.izin, 1, 'en')} days. No administrative leave for public employees has been announced so far.`,
    faqs: [
      { q: 'When is Eid al-Fitr 2027 in Turkey?', a: `From ${dShort(b.ilk, 'en')} to ${dShort(b.son, 'en')} 2027, three days. The eve, ${dShort(b.arefe, 'en')}, is also the last day of fasting, and the holiday begins at 1 pm that afternoon. The dates follow the Diyanet's 2027 list. Since the Hijri year is shorter than the solar year, the following Eid al-Fitr moves earlier, to ${aralik(b28.ilk, b28.son, 'en')}.` },
      { q: 'How many days off is Ramazan Bayramı 2027?', a: `3.5 days by law, including the eve afternoon. Because it falls between Tuesday and Thursday, someone with weekends off gets ${t0.gun} days without leave, and ${t2.gun} days (${aralik(t2.bas, t2.son, 'en')}) with leave on 8 and 12 March. With a single leave day, put it on the eve morning: the break then starts on the Saturday before and lasts ${t1.gun} days.` },
      { q: 'Is Şeker Bayramı the same as Ramazan Bayramı?', a: `Yes. Şeker Bayramı, the "sugar feast", is the popular name, from the sweets offered to visitors. Law No. 2429 calls it Ramazan Bayramı, and in English it is Eid al-Fitr. All three names cover the same days, ${aralik(b.ilk, b.son, 'en')} in 2027 plus the half-day eve. Whatever the name, the legal length is 3.5 days, and the countdown on this page uses the Diyanet dates.` },
    ],
    body: (h) => `<h2>The holiday days and the eve</h2>
${h.table(['Date', 'Day', 'Hijri date', 'At work'], z.map((e) => [h.day(e.date), h.wd(e.date), e.hicri, e.id === 'ramazan-arefe' ? 'Work until 1 pm, then holiday' : 'Public holiday']), 'Ramazan Bayramı 2027 (Diyanet)')}
<p>The first morning begins with the bayram prayer; family visits usually fill the first two days. The popular name Şeker Bayramı comes from the sweets offered to guests; the law uses Ramazan Bayramı.</p>
<h2>A midweek feast: three days or nine?</h2>
<p>In 2027 the feast touches neither a Monday nor a Friday. That looks like the worst case for a long break, yet very little leave joins two weekends. Monday 8 March is the eve: work in the morning, holiday from 1 pm. Friday 12 March is the only working day after the feast. Close both and the break runs from ${h.wday(t2.bas)} to ${h.wday(t2.son)}.</p>
${h.mini('bt', { p: ['izin', 'arefe'], d: { tur: 'ramazan', yil: 2027, izin: 2 }, c: 'Work out your Eid al-Fitr 2027 break' })}
<p>With a single leave day, use it on the eve morning: Saturday to Thursday, ${t1.gun} days. On a six-day week Sunday joins the holiday days; the break is ${s0.gun} days without leave and ${s4.gun} days with ${h.n(s4.izin)}.</p>
<h2>Eve morning: half a day or a full day of leave?</h2>
<p>The law makes the eve afternoon a holiday and says nothing about the morning. Public offices and many private employers book half a day of leave; others deduct a full day. The "leave for the eve morning" option in the calculator shows the difference. More on ${h.a('arefe-gunu-yarim-gun', 'the half-day eve')}.</p>
<h2>Ramadan and Laylat al-Qadr</h2>
<p>Ramadan before the feast starts on ${h.wday(r.ilk)} and lasts ${h.n(r.gun)} days. Laylat al-Qadr is the evening of Friday ${h.day(r.kadir)}. Fasting times for every province are on ${h.a('imsakiye-2027', 'the 2027 Ramadan timetable')}, and the month day by day on ${h.a('ramazan-2027', 'Ramadan 2027')}.</p>
<h2>Why the feast comes about 11 days earlier each year</h2>
<p>The Hijri calendar follows the moon and is about 11 days shorter than the solar year. Ramazan Bayramı therefore moves to ${aralik(b28.ilk, b28.son, 'en')} in 2028 and reaches January a few years later; 2033 even has two, one in early January and one in late December. The full list is on ${h.a('bayram-tarihleri', 'bayram dates 2026–2035')}. Because the Diyanet starts each Hijri month once the crescent can be seen anywhere on Earth, the Turkish date can differ by a day from some other countries.</p>`,
  },
});
