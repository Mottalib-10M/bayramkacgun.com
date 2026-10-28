/** Dini günler ve kandiller 2027 : Diyanet 2027 listesi (dini-gunler.json). */
import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { dShort } from '../../lib/tool-specs';

const L = K.diniGunler(2027);
const g = (id: string) => L.filter((e) => e.id === id);
const mirac = g('mirac'), berat = g('berat')[0], kadir = g('kadir')[0], regaib = g('regaib')[0], mevlid = g('mevlid')[0], uc = g('uc-aylar')[0];
const yil = g('hicri-yilbasi')[0], asure = g('asure')[0];
const kandiller = L.filter((e) => ['regaib', 'mirac', 'berat', 'kadir', 'mevlid'].includes(e.id));

export default defineGuide({
  id: 'dini-gunler-2027', group: 'bayram', order: 9, tool: 'dg', toolArg: { yil: 2027 },
  countdown: { date: mirac[0].date, time: '18:00', label: { tr: 'Miraç Kandili', en: 'Isra and Mi\'raj night' } },
  related: ['kadir-gecesi-2027', 'ramazan-2027', 'bayram-tarihleri', 'ramazan-bayrami-2027', 'kurban-bayrami-2027', 'takvim-2027'],
  sources: ['dg2027', 'dg2028', 'hilal', 'namazvakitleri'],
  tr: {
    slug: 'dini-gunler-2027', nav: 'Dini günler ve kandiller 2027', card: 'Kandiller, Hicri yılbaşı, Aşure: 2027 listesi, iki Miraç Kandili',
    title: 'Dini günler 2027: kandiller, Hicri yılbaşı ve Aşure günü',
    description: '2027 dini günler: Miraç Kandili 4 Ocak ve 24 Aralık, Berat 22 Ocak, Kadir 5 Mart, Mevlid 13 Ağustos, Regaib 2 Aralık; Hicri yılbaşı 6 Haziran, Aşure 15 Haziran.',
    h1: 'Dini günler ve kandiller 2027',
    intro: 'Yılı seçin: araç Diyanet listesindeki bütün dini günleri, haftanın gününü ve hicri tarihlerini gösterir. Kandil, listedeki günün akşamıdır.',
    resume: `2027 yılında Diyanet İşleri Başkanlığının listesinde ${L.length} dini gün ve gece vardır. Yıl iki kandille açılır: Miraç Kandili ${dShort(mirac[0].date, 'tr')}, Berat Kandili ${dShort(berat.date, 'tr')} akşamıdır. Ramazan ${dShort(L.find((e) => e.id === 'ramazan-baslangici')!.date, 'tr')} günü başlar, Kadir Gecesi ${dShort(kadir.date, 'tr')} akşamıdır; Ramazan Bayramı 9–11 Mart, Kurban Bayramı 16–19 Mayıs tarihlerindedir. Hicri 1449 yılı ${dShort(yil.date, 'tr')} günü başlar, Aşure Günü ${dShort(asure.date, 'tr')} günüdür. Mevlid Kandili ${dShort(mevlid.date, 'tr')} akşamı idrak edilir. Üç aylar ${dShort(uc.date, 'tr')} günü başlar; Regaib Kandili ${dShort(regaib.date, 'tr')} akşamıdır. 2027'nin bir özelliği, Miraç Kandilinin iki kez gelmesidir: hicri yıl miladi yıldan kısa olduğundan Recep ayının 27. gecesi hem Ocak başına hem de Aralık sonuna (${dShort(mirac[1].date, 'tr')}) düşer. Kandiller ve bu günler resmi tatil değildir; tatil olanlar yalnızca bayramlardır.`,
    faqs: [
      { q: 'Kandil gecesi hangi akşam?', a: `Diyanet listesinde yazan günün akşamı. Örneğin Berat Kandili 2027 için ${dShort(berat.date, 'tr')} yazılıdır; kandil o gün akşam namazından sonra başlar ve ertesi sabaha kadar sürer. Kadir Gecesi için de aynı kural geçerlidir. Akşam namazı vakti ilden ile değiştiği için kandilin başladığı saat de değişir; il il akşam vakitleri Diyanet'in resmi namaz vakitleri takviminde yer alır.` },
      { q: '2027\'de kaç kandil var?', a: `${kandiller.length} kandil gecesi var: iki Miraç Kandili (${dShort(mirac[0].date, 'tr')} ve ${dShort(mirac[1].date, 'tr')}), Berat Kandili (${dShort(berat.date, 'tr')}), Kadir Gecesi (${dShort(kadir.date, 'tr')}), Mevlid Kandili (${dShort(mevlid.date, 'tr')}) ve Regaib Kandili (${dShort(regaib.date, 'tr')}). Miraç Kandilinin aynı yıla iki kez düşmesi, hicri yılın kısa olmasından kaynaklanır.` },
      { q: 'Kandil günleri resmi tatil mi?', a: `Hayır. 2429 sayılı Kanun dini günlerden yalnızca Ramazan ve Kurban Bayramını tatil sayar. Kandiller, Hicri yılbaşı ve Aşure Günü normal iş günleridir; işyerleri ve okullar açıktır. 2027'de Hicri yılbaşı ${dShort(yil.date, 'tr')}, Aşure Günü ${dShort(asure.date, 'tr')} günüdür. Bu günlerde çalışmak için ek ücret de doğmaz, çünkü İş Kanununun 47. maddesi yalnızca ulusal bayram ve genel tatil günlerini kapsar.` },
    ],
    body: (h) => `<h2>2027 dini günler listesi</h2>
${h.table(['Tarih', 'Gün', 'Dini gün', 'Hicri tarih'], L.map((e) => [h.day(e.date), h.wd(e.date), K.DINI_AD[e.id].tr, e.hicri]), '2027 dini günler (Diyanet İşleri Başkanlığı)')}
<h2>Üç aylar ve kandiller</h2>
<p>Recep, Şaban ve Ramazan ayları "üç aylar" olarak anılır. 2027 iki ayrı üç aylar dönemine değer: Aralık 2026'da başlayan dönem Mart'taki Ramazan Bayramıyla kapanır, yenisi ${h.wday(uc.date)} başlar. Regaib Kandili, Recep ayının ilk Cuma gecesidir; 2027'de ${h.wday(regaib.date)} akşamıdır. Miraç Kandili Recep'in 27. gecesi, Berat Kandili Şaban'ın 15. gecesidir. Kadir Gecesi Ramazan'ın 27. gecesi olarak kabul edilir; ayrıntılar ${h.a('kadir-gecesi-2027', 'Kadir Gecesi 2027')} sayfasında.</p>
<h2>Hicri yılbaşı ve Aşure</h2>
<p>Hicri 1449 yılı Muharrem ayının birinci günü, ${h.wday(yil.date)} başlar. Aşure Günü Muharrem'in onuncu günüdür: ${h.wday(asure.date)}. Mevlid Kandili Rebiülevvel ayının 12. gecesidir ve 2027'de ${h.wday(mevlid.date)} akşamına denk gelir.</p>
${h.mini('dg', { p: ['yil'], d: { yil: 2028 }, c: '2028 ve sonraki yılların dini günleri' })}
<h2>Tarih neden her yıl değişiyor?</h2>
<p>Dini günler hicri takvime bağlıdır. Hicri yıl yaklaşık 354 gün sürdüğü için her dini gün bir önceki yıla göre yaklaşık on bir gün önce gelir. Diyanet, hicri ayların başını hilalin dünyanın herhangi bir yerinde görülebilir olmasına göre önceden hesaplar; bu yüzden liste yıllar öncesinden bellidir. Bayramların on yıllık tablosu ${h.a('bayram-tarihleri', 'bayram tarihleri')} sayfasındadır. Resmi tatil sayılan günlerin listesi ise ${h.a('resmi-tatiller-2027', 'resmi tatiller 2027')} sayfasındadır.</p>`,
  },
  en: {
    slug: 'religious-days-turkey-2027', nav: 'Religious days 2027', card: 'Kandil nights, Islamic New Year, Ashura: the 2027 list',
    title: 'Religious days in Turkey 2027: kandil nights, Ashura, dates',
    description: 'Religious days in Turkey 2027: Mi\'raj night on 4 January and 24 December, Bara\'at 22 January, Qadr 5 March, Mawlid 13 August, New Year 6 June, Ashura 15 June.',
    h1: 'Religious days and kandil nights in Turkey, 2027',
    intro: 'Choose a year: the tool shows every religious day on the Diyanet list with its weekday and Hijri date. A kandil night is the evening of the listed day.',
    resume: `The 2027 list of the Presidency of Religious Affairs (Diyanet) contains ${L.length} religious days and nights. The year opens with two kandil nights, the special nights marked by mosque illuminations in Turkey: Isra and Mi'raj on the evening of ${dShort(mirac[0].date, 'en')} and Bara'at on the evening of ${dShort(berat.date, 'en')}. Ramadan starts on ${dShort(L.find((e) => e.id === 'ramazan-baslangici')!.date, 'en')} and Laylat al-Qadr falls on the evening of ${dShort(kadir.date, 'en')}; Eid al-Fitr is on 9 to 11 March and Eid al-Adha on 16 to 19 May. Hijri year 1449 starts on ${dShort(yil.date, 'en')}, with the Day of Ashura on ${dShort(asure.date, 'en')}. The Mawlid night is the evening of ${dShort(mevlid.date, 'en')}. The three holy months begin on ${dShort(uc.date, 'en')}, and the Raghaib night is the evening of ${dShort(regaib.date, 'en')}. Unusually, 2027 has two Mi'raj nights: because the Hijri year is shorter, the 27th night of Rajab falls both in early January and in late December (${dShort(mirac[1].date, 'en')}). None of these days is a public holiday; only the two Eids are.`,
    faqs: [
      { q: 'On which evening is a kandil night?', a: `The evening of the date on the Diyanet list. Bara'at 2027 is listed as ${dShort(berat.date, 'en')}, so the kandil starts after the sunset prayer that day and lasts until the next morning. The same rule applies to Laylat al-Qadr. Since the sunset prayer time varies by province, so does the hour a kandil begins; the Diyanet's official prayer calendar gives each province's time.` },
      { q: 'How many kandil nights are there in 2027?', a: `${kandiller.length}: two Mi'raj nights (${dShort(mirac[0].date, 'en')} and ${dShort(mirac[1].date, 'en')}), Bara'at (${dShort(berat.date, 'en')}), Laylat al-Qadr (${dShort(kadir.date, 'en')}), Mawlid (${dShort(mevlid.date, 'en')}) and Raghaib (${dShort(regaib.date, 'en')}). Mi'raj falls twice in the year because the Hijri year is shorter than the Gregorian one.` },
      { q: 'Are kandil nights public holidays in Turkey?', a: `No. Law No. 2429 makes only Eid al-Fitr and Eid al-Adha public holidays among religious days. Kandil nights, the Islamic New Year and Ashura are ordinary working days; offices and schools are open. In 2027 the Islamic New Year is ${dShort(yil.date, 'en')} and Ashura ${dShort(asure.date, 'en')}. Working on these days earns no extra pay, as article 47 of the Labour Act covers only national and general holidays.` },
    ],
    body: (h) => `<h2>The 2027 list</h2>
${h.table(['Date', 'Day', 'Religious day', 'Hijri date'], L.map((e) => [h.day(e.date), h.wd(e.date), K.DINI_AD[e.id].en, e.hicri]), 'Religious days 2027 (Diyanet)')}
<h2>The three holy months and the kandil nights</h2>
<p>Rajab, Sha'ban and Ramadan are known in Turkey as the "three months". 2027 touches two cycles: the one that began in December 2026 closes with Eid al-Fitr in March, and the next starts on ${h.wday(uc.date)}. The Raghaib night is the eve of the first Friday of Rajab, in 2027 the evening of ${h.wday(regaib.date)}. Mi'raj is the 27th night of Rajab and Bara'at the 15th night of Sha'ban. Laylat al-Qadr is observed on the 27th night of Ramadan; more on ${h.a('kadir-gecesi-2027', 'Laylat al-Qadr 2027')}.</p>
<h2>Islamic New Year and Ashura</h2>
<p>Hijri year 1449 begins on the first of Muharram, ${h.wday(yil.date)}. The Day of Ashura, the tenth of Muharram, is ${h.wday(asure.date)}. The Mawlid night, the 12th night of Rabi al-Awwal, falls on the evening of ${h.wday(mevlid.date)}.</p>
${h.mini('dg', { p: ['yil'], d: { yil: 2028 }, c: 'Religious days in 2028 and later' })}
<h2>Why the dates change every year</h2>
<p>Religious days follow the Hijri calendar. A Hijri year lasts about 354 days, so each day arrives about eleven days earlier than the year before. The Diyanet computes the start of each Hijri month in advance, based on the crescent being visible anywhere on Earth, which is why the list is known years ahead. Ten years of Eid dates are on ${h.a('bayram-tarihleri', 'bayram dates')}; the days that are actually public holidays are on ${h.a('resmi-tatiller-2027', 'public holidays 2027')}.</p>`,
  },
});
