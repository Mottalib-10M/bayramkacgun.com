/** Köprü günleri 2028 : K.optimize (kesin en iyi dağılım), K.kopruler (2–4 günlük izin blokları), K.kopruGunleri (tek gün). */
import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { aralik, gunAdi } from '../../lib/tool-specs';
import { formatDecimal } from '../../lib/format';

type L = 'tr' | 'en';
const d1 = (x: number, l: L) => formatDecimal(x, 1, l);
const Y = 2028;
const p = K.optimize(Y, 10), p6 = K.optimize(Y, 10, { hafta: '6' }), p5 = K.optimize(Y, 5), p20 = K.optimize(Y, 20);
const p27 = K.optimize(2027, 10);
const tek = K.kopruGunleri(Y);
const hepsi = K.kopruler(Y, {}, 4);
const [subat, mayis, agustos] = p.bloklar;
const yilSonu = p20.bloklar.find((b) => b.bosSon > `${Y}-12-31`);
const zafer = hepsi.filter((k) => k.tatiller.includes('zafer'));
const kurbanSonra = hepsi.find((k) => k.izinBas > `${Y}-05-08` && k.tatiller.includes('kurban-1'));
const AD = (ids: string[], l: L) => [...new Set(ids.map((id) => id.replace(/-\d$/, '').replace('-arefe', '')))].map((id) => (id === 'ramazan' ? (l === 'tr' ? 'Ramazan Bayramı' : 'Eid al-Fitr') : id === 'kurban' ? (l === 'tr' ? 'Kurban Bayramı' : 'Eid al-Adha') : K.TATIL_AD[id as keyof typeof K.TATIL_AD][l])).join(l === 'tr' ? ' + ' : ' + ');

export default defineGuide({
  id: 'kopru-gunleri-2028', group: 'tatil', order: 55, tool: 'kp', toolArg: { yil: Y, izin: 10 },
  related: ['resmi-tatiller-2028', 'kopru-gunleri-2027', 'kurban-bayrami-2028', 'ramazan-bayrami-2028', 'yillik-izin', 'bayram-tatili-kac-gun'],
  sources: ['k2429', 'rt2028', 'dg2028'],
  tr: {
    slug: 'kopru-gunleri-2028', nav: 'Köprü günleri 2028', card: `Tek günlük köprü yok; 10 gün izin ${p.bos} gün eder`,
    title: `Köprü günleri 2028: tek gün köprü yok, 10 izinle ${p.bos} gün`,
    description: `Köprü günleri 2028: yıl boyunca tek günlük köprü çıkmıyor. 10 gün izni Şubat'taki Ramazan Bayramına, Mayıs'taki Kurbana ve 30 Ağustosa koyarak ${p.bos} gün tatil.`,
    h1: `2028 köprü günleri: tek günlük köprü yok, plan şart`,
    intro: '2028 için izin bütçenizi girin; planlayıcı en verimli izin günlerini ve oluşan tatil dönemlerini, ardından yılın bütün köprü seçeneklerini listeler.',
    resume: `2028'de klasik köprü günü, yani resmi tatille hafta sonu arasında tek başına kalan iş günü ${tek.length === 0 ? 'hiç yoktur' : `${tek.length} tanedir`}; tatillerin çoğu zaten hafta sonuna ya da Pazartesi-Cumaya denk gelir. Bu yüzden izin daha büyük bloklar halinde kullanılmalıdır. 10 günlük bütçenin en iyi dağılımı ${p.bos} gün tatil verir: ${subat.izin} gün izinle Ramazan Bayramı öncesinde ${aralik(subat.bosBas, subat.bosSon, 'tr')} (${subat.bos} gün), ${mayis.izin} gün izinle 1 Mayıs ile Kurban Bayramını birleştiren ${aralik(mayis.bosBas, mayis.bosSon, 'tr')} (${mayis.bos} gün) ve ${agustos.izin} gün izinle Çarşambaya düşen Zafer Bayramının çevresinde ${aralik(agustos.bosBas, agustos.bosSon, 'tr')} (${agustos.bos} gün). Aynı bütçe 2027'de ${p27.bos} gün ediyordu; fark, 2028'de tatillerin hafta sonunda kaybolmasından gelir. Yalnız Pazar tatil yapanlar için sonuç ${p6.bos} gündür. 20 günlük bir bütçeyle ${yilSonu ? `yıl sonunda ${aralik(yilSonu.bosBas, yilSonu.bosSon, 'tr')} arası ${yilSonu.bos} günlük bir blok da eklenir` : 'plan uzar'}.`,
    faqs: [
      { q: '2028\'de köprü günü var mı?', a: `Tek günlük köprü ${tek.length === 0 ? 'yok' : `${tek.length} tane var`}. Yılbaşı, 23 Nisan, 15 Temmuz ve 29 Ekim hafta sonuna düşüyor; 1 Mayıs Pazartesi ve 19 Mayıs Cuma ise izinsiz uzun hafta sonu yapıyor. En verimli seçenek ${mayis.izin} gün izinle ${aralik(mayis.bosBas, mayis.bosSon, 'tr')} arası ${mayis.bos} gündür. Planlayıcı izin bütçenizi bu tür bloklara en verimli biçimde dağıtır.` },
      { q: '2028\'de 10 gün izinle en çok kaç gün tatil yapılır?', a: `Cumartesi-Pazar tatil yapan biri için ${p.bos} gün: ${p.bloklar.map((b) => `${b.izin} gün izin → ${b.bos} gün`).join('; ')}. Haftada altı gün çalışanlarda aynı bütçe ${p6.bos} gün eder. Aynı 10 gün 2027'de ${p27.bos} gün veriyordu; fark, 2028'de tatillerin hafta sonuna yığılmasından gelir. 20 günlük bir bütçeyle yıl içinde toplam ${p20.bos} gün tatile ulaşılır.` },
      { q: '30 Ağustos 2028 için kaç gün izin almak gerekir?', a: `30 Ağustos 2028 bir ${gunAdi('2028-08-30', 'tr')} günüdür. Haftanın iki yanından birini seçmek gerekir: ${zafer.map((k) => `${aralik(k.izinBas, k.izinSon, 'tr')} izni ${aralik(k.bosBas, k.bosSon, 'tr')} (${k.bos} gün)`).join(' ya da ')}. Dört gün izinle iki hafta sonu birleştirilirse 9 gün olur.` },
    ],
    body: (h) => `<h2>Neden 2028'de köprü yok?</h2>
<p>Köprü, bir tatille hafta sonu arasında tek iş günü kaldığında oluşur; bunun için tatilin Salı ya da Perşembeye düşmesi gerekir. 2028'de sabit tatillerden hiçbiri Salı ya da Perşembe değildir: yılbaşı Cumartesi, 23 Nisan Pazar, 1 Mayıs Pazartesi, 19 Mayıs Cuma, 15 Temmuz Cumartesi, 30 Ağustos Çarşamba, 29 Ekim Pazar. Bayramlar da hafta sonuna yaslanır: Ramazan Bayramı Cumartesi–Pazartesi, Kurban Bayramı Cuma–Pazartesi. Bu yüzden 2028'de tatil uzatmanın yolu, iki ile beş gün arasında izin bloklarıdır.</p>
<h2>10 günlük plan, dönem dönem</h2>
${h.table(['Dönem', 'İzin', 'Tatil', 'Gün', 'Dayandığı tatil'], p.bloklar.map((b) => [aralik(b.izinBas, b.izinSon, 'tr'), d1(b.izin, 'tr'), aralik(b.bosBas, b.bosSon, 'tr'), b.bos, AD(b.tatiller, 'tr')]), '2028: 10 günlük izin bütçesinin en iyi dağılımı', ['l', 'r', 'l', 'r', 'l'])}
<p>Şubat bloku, bayramdan önceki haftanın tamamını kapatır; ${h.wday(subat.izinSon)} arefedir: öğleden sonrası zaten tatil olduğundan, sabahı yarım gün izin sayan işyerlerinde bütçe yarım gün azalır. Mayıs bloku yılın en kârlısıdır: Salı, Çarşamba ve Perşembe için izin alındığında 1 Mayıs Pazartesi ile Cuma başlayan Kurban Bayramı birleşir. Ağustos'ta ise Çarşambaya düşen Zafer Bayramının iki yanından biri seçilir; planlayıcı Pazartesi-Salıyı önerir, Perşembe-Cuma da aynı sonucu verir.</p>
<h2>Kurbandan sonra ikinci bir şans</h2>
<p>Mayıs ayı 2028'de iki seçenek sunar. Kurban Bayramından önceki üç günle 1 Mayısa bağlanabileceğiniz gibi, ${kurbanSonra ? `bayramdan sonraki ${kurbanSonra.izin} iş gününü (${aralik(kurbanSonra.izinBas, kurbanSonra.izinSon, 'tr')}) izinle kapatarak ${aralik(kurbanSonra.bosBas, kurbanSonra.bosSon, 'tr')} arası ${kurbanSonra.bos} gün de` : 'bayramdan sonraki haftayı da'} tatil yapabilirsiniz. Birincisi bir gün daha ucuzdur. Bütçeniz izin verirse 19 Mayıs Cumaya bağlanan ${h.wday('2028-05-15')} başlayan dört günlük izin de bir dokuz günlük dönem daha ekler. Bayram tarihlerinin ayrıntısı ${h.a('kurban-bayrami-2028', 'Kurban Bayramı 2028')} sayfasında.</p>
${h.mini('bt', { p: ['tur', 'izin'], d: { tur: 'ramazan', yil: Y, izin: 5 }, c: '2028 bayram tatilini izin sayısına göre hesaplayın' })}
<h2>Bütçe büyürse: yıl sonuna uzanan blok</h2>
${h.table(['İzin bütçesi', 'Toplam tatil', 'Dönem'], [[5, p5.bos, p5.bloklar.length], [10, p.bos, p.bloklar.length], [20, p20.bos, p20.bloklar.length]], '2028: izin bütçesine göre en iyi sonuç (Cumartesi-Pazar tatil)', ['r', 'r', 'r'])}
<p>${yilSonu ? `20 gün izinle planlayıcı Aralık'ın son haftasını da önerir: ${aralik(yilSonu.izinBas, yilSonu.izinSon, 'tr')} izni, 2029 yılbaşıyla birleşerek ${aralik(yilSonu.bosBas, yilSonu.bosSon, 'tr')} arası ${yilSonu.bos} gün eder. Bu izin günleri 2028 bütçesinden düşer.` : ''} İzin hakkınız 14 günse 10 günlük planı uygulayıp kalanı yaz için saklayabilirsiniz; kaç gün hakkınız olduğunu ${h.a('yillik-izin', 'yıllık izin hesabı')} gösterir. İzin İş Kanununa göre ancak anlaşmayla ve bir parçası en az 10 gün olacak şekilde bölünebilir. Bayram odaklı hesap için ${h.a('bayram-tatili-kac-gun', 'bayram tatili kaç gün')}, 2028 tatil listesi için ${h.a('resmi-tatiller-2028', 'resmi tatiller 2028')}, önceki yıl için ${h.a('kopru-gunleri-2027', 'köprü günleri 2027')}; Şubat bayramının ayrıntısı ${h.a('ramazan-bayrami-2028', 'Ramazan Bayramı 2028')} sayfasında.</p>`,
  },
  en: {
    slug: 'bridge-days-turkey-2028', nav: 'Bridge days 2028', card: `No one-day bridge; 10 leave days give ${p.bos} days off`,
    title: `Bridge days Turkey 2028: none, but 10 leave days give ${p.bos}`,
    description: `Bridge days in Turkey 2028: not one single-day bridge all year. Put 10 leave days on the February Eid, the May Eid and 30 August for ${p.bos} days off in total.`,
    h1: 'Turkey 2028 bridge days: no single-day bridge, so plan ahead',
    intro: 'Enter your 2028 leave budget; the planner lists the most efficient leave days and the breaks they create, then every bridge option in the year.',
    resume: `In 2028 Turkey has ${tek.length === 0 ? 'no' : tek.length} classic bridge days, that is, single working days caught between a public holiday and a weekend; most holidays fall on a weekend or on a Monday or Friday. Leave therefore has to go in larger blocks. The best use of 10 leave days gives ${p.bos} days off: ${subat.izin} days before Eid al-Fitr for ${aralik(subat.bosBas, subat.bosSon, 'en')} (${subat.bos} days), ${mayis.izin} days joining Labour Day and Eid al-Adha for ${aralik(mayis.bosBas, mayis.bosSon, 'en')} (${mayis.bos} days), and ${agustos.izin} days around Victory Day, a Wednesday, for ${aralik(agustos.bosBas, agustos.bosSon, 'en')} (${agustos.bos} days). The same budget was worth ${p27.bos} days in 2027; the gap comes from 2028 holidays being lost to the weekend. With only Sunday off, the result is ${p6.bos} days. A 20-day budget ${yilSonu ? `also adds a ${yilSonu.bos}-day block at the end of the year, ${aralik(yilSonu.bosBas, yilSonu.bosSon, 'en')}` : 'stretches the plan further'}.`,
    faqs: [
      { q: 'Are there any bridge days in Turkey in 2028?', a: `${tek.length === 0 ? 'No one-day bridges at all' : `${tek.length} one-day bridges`}. New Year's Day, 23 April, 15 July and 29 October fall on a weekend, while Monday 1 May and Friday 19 May give long weekends without leave. The best deal is ${mayis.izin} leave days for ${mayis.bos} days off, ${aralik(mayis.bosBas, mayis.bosSon, 'en')}.` },
      { q: 'How many days off can 10 days of leave give in Turkey in 2028?', a: `${p.bos} days with weekends off: ${p.bloklar.map((b) => `${b.izin} leave → ${b.bos} off`).join('; ')}. On a six-day week the same budget gives ${p6.bos}. The same 10 days gave ${p27.bos} in 2027; the gap comes from 2028's holidays piling up on weekends. A 20-day budget reaches ${p20.bos} days off over the year.` },
      { q: 'How many leave days do you need around 30 August 2028?', a: `30 August 2028 is a ${gunAdi('2028-08-30', 'en')}, so you pick one side: ${zafer.map((k) => `leave ${aralik(k.izinBas, k.izinSon, 'en')} for ${aralik(k.bosBas, k.bosSon, 'en')} (${k.bos} days)`).join(' or ')}. Four leave days joining both weekends make 9 days.` },
    ],
    body: (h) => `<h2>Why 2028 has no bridges</h2>
<p>A bridge appears when a single working day separates a holiday from the weekend, which requires the holiday to fall on a Tuesday or Thursday. In 2028 none of the fixed holidays does: New Year's Day is a Saturday, 23 April a Sunday, 1 May a Monday, 19 May a Friday, 15 July a Saturday, 30 August a Wednesday and 29 October a Sunday. The festivals hug the weekend too: Eid al-Fitr runs Saturday to Monday, Eid al-Adha Friday to Monday. So in 2028 the way to stretch a break is a block of two to five leave days.</p>
<h2>The 10-day plan, break by break</h2>
${h.table(['Leave period', 'Leave', 'Break', 'Days', 'Built on'], p.bloklar.map((b) => [aralik(b.izinBas, b.izinSon, 'en'), d1(b.izin, 'en'), aralik(b.bosBas, b.bosSon, 'en'), b.bos, AD(b.tatiller, 'en')]), '2028: best split of a 10-day leave budget', ['l', 'r', 'l', 'r', 'l'])}
<p>The February block covers the whole week before the festival; ${h.wday(subat.izinSon)} is the eve: the afternoon is off anyway, so employers that book the morning as half a leave day save you half a day. The May block is the best value of the year: leave on Tuesday, Wednesday and Thursday joins Labour Day on Monday with Eid al-Adha starting on Friday. In August you choose a side of Victory Day, which falls on a Wednesday; the planner suggests Monday and Tuesday, and Thursday and Friday give the same result.</p>
<h2>A second chance after Eid al-Adha</h2>
<p>May 2028 offers two routes. You can link to Labour Day with the three days before the festival, or ${kurbanSonra ? `cover the ${kurbanSonra.izin} working days after it (${aralik(kurbanSonra.izinBas, kurbanSonra.izinSon, 'en')}) for ${kurbanSonra.bos} days off, ${aralik(kurbanSonra.bosBas, kurbanSonra.bosSon, 'en')}` : 'take the week after it'}. The first route costs one day less. With a bigger budget, four leave days from ${h.wday('2028-05-15')} up to Youth Day on Friday 19 May add another nine-day break. Festival details are on ${h.a('kurban-bayrami-2028', 'Kurban Bayramı 2028')}.</p>
${h.mini('bt', { p: ['tur', 'izin'], d: { tur: 'ramazan', yil: Y, izin: 5 }, c: 'Work out a 2028 festival break by leave days' })}
<h2>A bigger budget: a block into the new year</h2>
${h.table(['Leave budget', 'Days off', 'Breaks'], [[5, p5.bos, p5.bloklar.length], [10, p.bos, p.bloklar.length], [20, p20.bos, p20.bloklar.length]], '2028: best result by leave budget (Saturday and Sunday off)', ['r', 'r', 'r'])}
<p>${yilSonu ? `With 20 days the planner also suggests the last week of December: leave on ${aralik(yilSonu.izinBas, yilSonu.izinSon, 'en')} joins New Year 2029 for ${yilSonu.bos} days off, ${aralik(yilSonu.bosBas, yilSonu.bosSon, 'en')}. Those leave days come out of the 2028 budget.` : ''} With 14 days of entitlement you can follow the 10-day plan and keep the rest for summer; the ${h.a('yillik-izin', 'annual leave calculator')} tells you your entitlement. Under the Labour Act, leave can only be split by agreement, with one part of at least 10 days. For festival-only plans, use the ${h.a('bayram-tatili-kac-gun', 'holiday length calculator')}; the 2028 list is on ${h.a('resmi-tatiller-2028', 'public holidays 2028')}, the previous year on ${h.a('kopru-gunleri-2027', 'bridge days 2027')}, and the February festival on ${h.a('ramazan-bayrami-2028', 'Ramazan Bayramı 2028')}.</p>`,
  },
});
