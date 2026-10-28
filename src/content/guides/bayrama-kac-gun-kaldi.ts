/** Bayrama kaç gün kaldı : canlı geri sayım (components/bt/GeriSayim.tsx). Metindeki gün sayıları okuma tarihine göre hesaplanır. */
import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { dShort, dLong } from '../../lib/tool-specs';

const BUGUN = K.OKUMA;
const kac = (iso: string) => K.daysBetween(BUGUN, iso);
const r27 = K.bayram('ramazan', 2027)!, k27 = K.bayram('kurban', 2027)!, ram = K.ramazan(2027)!;
const r28 = K.bayram('ramazan', 2028)!, k28 = K.bayram('kurban', 2028)!;
const liste = [
  { tr: 'Ramazan başlangıcı (ilk oruç)', en: 'Start of Ramadan (first fast)', d: ram.ilk },
  { tr: 'Kadir Gecesi', en: 'Laylat al-Qadr', d: ram.kadir },
  { tr: 'Ramazan Bayramı 2027', en: 'Eid al-Fitr 2027', d: r27.ilk },
  { tr: 'Kurban Bayramı 2027', en: 'Eid al-Adha 2027', d: k27.ilk },
  { tr: 'Ramazan Bayramı 2028', en: 'Eid al-Fitr 2028', d: r28.ilk },
  { tr: 'Kurban Bayramı 2028', en: 'Eid al-Adha 2028', d: k28.ilk },
];

export default defineGuide({
  id: 'bayrama-kac-gun-kaldi', group: 'bayram', order: 3, tool: 'geri', toolArg: { hedef: 'ramazan-bayrami' },
  related: ['ramazan-bayrami-2027', 'kurban-bayrami-2027', 'ramazan-2027', 'kadir-gecesi-2027', 'bayram-tatili-kac-gun', 'iftara-kac-dakika-kaldi'],
  sources: ['dg2027', 'dg2028', 'k2429', 'hilal'],
  tr: {
    slug: 'bayrama-kac-gun-kaldi', nav: 'Bayrama kaç gün kaldı', card: 'Canlı geri sayım: Ramazan ve Kurban Bayramı, Ramazan, Kadir',
    title: 'Bayrama kaç gün kaldı? 2027 Ramazan ve Kurban geri sayım',
    description: 'Bayrama kaç gün kaldı: Ramazan Bayramı 2027 (9 Mart) ve Kurban Bayramı 2027 (16 Mayıs) için gün, saat, dakika ve saniyeyle canlı geri sayım; Ramazan ve Kadir.',
    h1: 'Bayrama kaç gün kaldı? Canlı geri sayım',
    intro: 'Hangi bayramı beklediğinizi seçin: sayaç gün, saat, dakika ve saniyeyi Türkiye saatine göre canlı gösterir; sıradaki üç tarih de altında.',
    resume: `${dLong(BUGUN, 'tr')} itibarıyla sıradaki bayram, ${dShort(r27.ilk, 'tr')} günü başlayan Ramazan Bayramıdır ve ona ${kac(r27.ilk)} gün vardır. Kurban Bayramına ise ${kac(k27.ilk)} gün kalmıştır: ${dShort(k27.ilk, 'tr')} günü başlar. Bayramdan önce Ramazan ayı gelir; ilk oruç ${dShort(ram.ilk, 'tr')} günü, yani ${kac(ram.ilk)} gün sonra tutulur, Kadir Gecesi de ${dShort(ram.kadir, 'tr')} akşamıdır. Sayaç bu tarihleri Diyanet İşleri Başkanlığının dini günler listesinden alır ve bayramın ilk gününün başlangıcına, yani Türkiye saatiyle gece yarısına kadar kalan süreyi hesaplar. Yurt dışındaysanız da doğru çalışır: kalan süre sizin saat diliminizden bağımsızdır, yalnızca ekrandaki "bugün" cihazınızın saatine göre ilerler. Resmi tatil arefe günü saat 13.00'te başladığı için işten çıkış bir buçuk gün önce olabilir: Ramazan Bayramı arefesi ${dShort(r27.arefe, 'tr')}, Kurban Bayramı arefesi ${dShort(k27.arefe, 'tr')} günüdür.`,
    faqs: [
      { q: 'Ramazan Bayramına kaç gün kaldı?', a: `${dLong(BUGUN, 'tr')} tarihinden ${dShort(r27.ilk, 'tr')} gününe ${kac(r27.ilk)} gün var. Sayfadaki sayaç bu süreyi her saniye güncel tutar. Arefe ${dShort(r27.arefe, 'tr')} günüdür; tatil o gün saat 13.00'te başlar ve kanuna göre toplam 3,5 gün sürer. Oruç tutacaklar için Ramazan ayı daha önce, ${dShort(ram.ilk, 'tr')} günü başlar; ona kalan süre ${kac(ram.ilk)} gündür.` },
      { q: 'Kurban Bayramına kaç gün kaldı?', a: `${dLong(BUGUN, 'tr')} itibarıyla ${kac(k27.ilk)} gün. Kurban Bayramı 2027 ${dShort(k27.ilk, 'tr')} günü başlar, ${dShort(k27.son, 'tr')} günü biter. Arefe ${dShort(k27.arefe, 'tr')} günüdür ve hafta sonuna denk gelir; kanuni süre 4,5 gündür. İki bayram arasında ${K.daysBetween(r27.ilk, k27.ilk)} gün vardır. Bir sonraki Kurban Bayramı ${dLong(k28.ilk, 'tr')} günü başlar; ona bugünden ${kac(k28.ilk)} gün kalmıştır.` },
      { q: 'Geri sayım hangi saate göre yapılıyor?', a: `Hedef an, bayramın ilk gününün Türkiye saatiyle 00.00'ıdır. Türkiye yıl boyu UTC+3 kullanır. Cihazınız başka bir saat dilimindeyse sayaç yine aynı anı hedefler; kalan süre her yerde aynıdır. Metinde yazan gün sayıları ise ${dLong(BUGUN, 'tr')} tarihine göre hesaplanmıştır; sayaç sayfayı açtığınız andan itibaren canlı sayar. Arefe tatili için ayrıca saat 13.00 esas alınır.` },
    ],
    body: (h) => `<h2>Sıradaki bayramlar ve dini günler</h2>
<p>Aşağıdaki tablo, ${h.day(BUGUN)} tarihinden itibaren kalan gün sayısını verir. Sayfanın üstündeki sayaç aynı hesabı canlı yapar ve bugünün tarihine göre kendini günceller.</p>
${h.table(['Ne', 'Tarih', 'Kalan gün'], liste.map((x) => [x.tr, h.wday(x.d), kac(x.d)]), `${h.day(BUGUN)} tarihinden itibaren kalan gün sayısı`)}
<h2>Bayram hangi anda başlar?</h2>
<p>Takvim açısından bayram, ilk gününün gece yarısında başlar; sayaç da bu anı esas alır. Gündelik hayatta bayram sabah namazından sonra kılınan bayram namazıyla açılır. Resmi tatil ise daha erken başlar: 2429 sayılı Kanun, arefe gününü saat 13.00'ten itibaren tatil sayar. Bu yüzden "işten çıkışa kaç saat kaldı" sorusunun cevabı, bayrama kalan süreden yaklaşık on bir saat kısadır. Kurban Bayramı 2027'nin arefesi Cumartesiye düştüğü için hafta sonu tatil yapanlarda bu fark ortadan kalkar.</p>
<h2>Bayramın kaç gün süreceği</h2>
<p>Ramazan Bayramı üç, Kurban Bayramı dört gündür; arefe öğleden sonrasıyla birlikte kanunda 3,5 ve 4,5 gün olarak geçer. Ne kadar evde kalacağınız hafta sonlarına ve alacağınız izne bağlıdır.</p>
${h.mini('bt', { p: ['tur', 'izin'], d: { tur: 'ramazan', yil: 2027, izin: 2 }, c: 'Bayram tatilinin kaç gün olacağını hesaplayın' })}
<h2>Tarihler neden değişmez?</h2>
<p>Bazı ülkelerde bayram, hilalin gözle görülmesine göre son gece ilan edilir. Türkiye'de ise Diyanet, hicri ayların başını hesapla ve yıllar önceden belirler: hilalin dünyanın herhangi bir yerinde görülebilir olması yeterlidir. Bu yüzden ${h.a('bayram-tarihleri', '2035\'e kadarki bayram tarihleri')} bugünden bellidir ve sayaç son dakikada şaşırmaz.</p>
<h2>Ramazana kaç gün kaldı?</h2>
<p>Seçicide "Ramazan (ilk oruç)" seçeneği ilk oruç gününe sayar. İlk sahur ${h.wday(ram.ilk)} sabaha karşı, ilk teravih ise bir önceki akşam kılınır. Ramazan boyunca her gün için ${h.a('iftara-kac-dakika-kaldi', 'iftara kaç dakika kaldığını')} gösteren ayrı bir sayaç da var.</p>`,
  },
  en: {
    slug: 'countdown-to-eid-turkey', nav: 'Countdown to the bayram', card: 'Live countdown to Eid al-Fitr, Eid al-Adha, Ramadan and Qadr night',
    title: 'Countdown to Eid in Turkey 2027: days left to the bayram',
    description: 'How many days until Eid in Turkey? A live countdown in days, hours, minutes and seconds to Eid al-Fitr 2027 (9 March), Eid al-Adha 2027 (16 May) and Ramadan.',
    h1: 'How many days until the bayram? A live countdown',
    intro: 'Choose the holiday you are waiting for: the counter shows days, hours, minutes and seconds to Turkey time, with the next three dates underneath.',
    resume: `As of ${dLong(BUGUN, 'en')}, the next holiday is Ramazan Bayramı (Eid al-Fitr), starting on ${dShort(r27.ilk, 'en')}, ${kac(r27.ilk)} days away. Kurban Bayramı (Eid al-Adha) is ${kac(k27.ilk)} days away and begins on ${dShort(k27.ilk, 'en')}. Ramadan comes first: the first fast is on ${dShort(ram.ilk, 'en')}, in ${kac(ram.ilk)} days, and Laylat al-Qadr falls on the evening of ${dShort(ram.kadir, 'en')}. The counter takes these dates from the religious-days list of the Presidency of Religious Affairs (Diyanet) and measures the time left until the first day begins at midnight Turkey time. It also works abroad: the time left is the same whatever your time zone, and only "today" on screen follows your device clock. Because the public holiday begins at 1 pm on the eve, many people leave work a day and a half earlier: the Eid al-Fitr eve is ${dShort(r27.arefe, 'en')}, the Eid al-Adha eve ${dShort(k27.arefe, 'en')}.`,
    faqs: [
      { q: 'How many days until Eid al-Fitr 2027 in Turkey?', a: `From ${dLong(BUGUN, 'en')} to ${dShort(r27.ilk, 'en')} 2027 there are ${kac(r27.ilk)} days. The counter on this page keeps it up to the second. The eve, ${dShort(r27.arefe, 'en')}, is a holiday from 1 pm, and the legal break lasts 3.5 days in all. If you are counting down to the fast instead, Ramadan begins on ${dShort(ram.ilk, 'en')}, ${kac(ram.ilk)} days away.` },
      { q: 'How many days until Eid al-Adha 2027 in Turkey?', a: `${kac(k27.ilk)} days as of ${dLong(BUGUN, 'en')}. Kurban Bayramı 2027 runs from ${dShort(k27.ilk, 'en')} to ${dShort(k27.son, 'en')}, with the eve on a Saturday; the legal length is 4.5 days. The two feasts of 2027 are ${K.daysBetween(r27.ilk, k27.ilk)} days apart. Looking further ahead, Eid al-Adha 2028 starts on ${dLong(k28.ilk, 'en')}, which is ${kac(k28.ilk)} days from now.` },
      { q: 'Which time zone does the countdown use?', a: `The target is 00:00 Turkey time on the first day of the holiday. Turkey stays on UTC+3 all year. If your device is in another time zone, the counter still aims at the same instant, so the time left is identical everywhere. The day counts written in the text are worked out as of ${dLong(BUGUN, 'en')}, while the counter runs live from the moment you open the page.` },
    ],
    body: (h) => `<h2>The next holidays and religious days</h2>
<p>The table gives the days left from ${h.day(BUGUN)}. The counter at the top does the same calculation live and updates itself to today's date.</p>
${h.table(['What', 'Date', 'Days left'], liste.map((x) => [x.en, h.wday(x.d), kac(x.d)]), `Days left from ${h.day(BUGUN)}`)}
<h2>When exactly does the holiday start?</h2>
<p>In calendar terms the feast begins at midnight on its first day, and that is the moment the counter aims at. In daily life it opens with the bayram prayer after the dawn prayer. The public holiday starts earlier: Law No. 2429 makes the eve a holiday from 1 pm. "Hours until I leave work" is therefore about eleven hours shorter than the time until the feast. In 2027 the Eid al-Adha eve falls on a Saturday, so for people with weekends off that gap disappears.</p>
<h2>How long the holiday lasts</h2>
<p>Eid al-Fitr lasts three days and Eid al-Adha four; with the eve afternoon the law counts 3.5 and 4.5 days. How long you are actually off depends on weekends and on the leave you take.</p>
${h.mini('bt', { p: ['tur', 'izin'], d: { tur: 'ramazan', yil: 2027, izin: 2 }, c: 'Work out how long your break will be' })}
<h2>Why the dates do not move</h2>
<p>Some countries announce the feast the night before, once the crescent has been sighted. In Turkey the Diyanet fixes the start of each Hijri month by calculation, years in advance: it is enough for the crescent to be visible anywhere on Earth. The ${h.a('bayram-tarihleri', 'holiday dates up to 2035')} are therefore known today and the counter will not be caught out at the last minute.</p>
<h2>How many days until Ramadan?</h2>
<p>The "Ramadan (first fast)" option counts down to the first day of fasting. The first pre-dawn meal is eaten in the early hours of ${h.wday(ram.ilk)}, and the first tarawih prayer is held the evening before. During Ramadan a separate counter shows ${h.a('iftara-kac-dakika-kaldi', 'how many minutes are left until iftar')}.</p>`,
  },
});
