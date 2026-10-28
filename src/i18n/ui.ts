import type { Locale } from './routes';
const tr = {
  updatedOn: 'Güncelleme', editorialPolicy: 'Yayın ilkeleri', contactLabel: 'İletişim', reviewedBy: 'Hazırlayan',
  skipToContent: 'İçeriğe geç', mainNav: 'Ana menü', breadcrumbLabel: 'Sayfa yolu', breadcrumbHome: 'Ana sayfa', menuOpen: 'Menüyü aç',
  faqTitle: 'Sık sorulan sorular', relatedCalculators: 'Devam edin', sourcesTitle: 'Bu sayfanın resmi kaynakları', writtenBy: 'Hazırlayan',
  asOf: 'Tarih', lastUpdated: 'Diyanet listeleri ve 2429 sayılı Kanun okunma tarihi', footerValidated: 'Kaynaklar: Diyanet İşleri Başkanlığı dini günler ve resmi tatil listeleri, 2429 sayılı Kanun, 4857 sayılı İş Kanunu, 657 sayılı Devlet Memurları Kanunu',
  footerBrowser: 'Her şey tarayıcınızda çalışır · yazdığınız hiçbir şey gönderilmez ya da saklanmaz · hesap yok',
  footerDisclaimer: 'Radif Partners tarafından yayımlanan bağımsız site; Diyanet İşleri Başkanlığı, bir bakanlık, belediye ya da dernekle bağı yoktur. Bağış toplamaz, kurban satmaz. İmsak ve iftar saatleri hesaptır: ibadet için bulunduğunuz yerin resmi takvimi esastır. Sonuçlar tahmindir, hukuki danışmanlık değildir.',
  footerPopular: 'Araçlar',
  notFound: 'Bu adreste bir sayfa yok. Ana sayfada bayram geri sayımı, 2027 bayram tarihleri, resmi tatiller ve 81 il için imsakiye var.',
  readMore: 'Devamını oku',
  moreOptions: 'Diğer seçenekler', copyLink: 'Bağlantıyı kopyala', copied: 'Bağlantı kopyalandı', print: 'Yazdır', howComputed: 'Nasıl hesaplanıyor', openFull: 'Aracın tamamını açın',
  countdownTo: 'Kalan süre:', days: 'gün', hours: 'saat', minutes: 'dk', seconds: 'sn', tzNote: 'Cihazınızın saatiyle hesaplanır, saat dilimi', passed: 'Bu tarih geride kaldı.',
};
const en: typeof tr = {
  updatedOn: 'Updated on', editorialPolicy: 'Editorial policy', contactLabel: 'Contact', reviewedBy: 'Prepared by',
  skipToContent: 'Skip to content', mainNav: 'Main navigation', breadcrumbLabel: 'Breadcrumb', breadcrumbHome: 'Home', menuOpen: 'Open menu',
  faqTitle: 'Common questions', relatedCalculators: 'Keep going', sourcesTitle: 'Official sources for this page', writtenBy: 'Prepared by',
  asOf: 'As of', lastUpdated: 'Diyanet lists and Law No. 2429 read on', footerValidated: 'Sources: Diyanet religious-day and public-holiday lists, Law No. 2429, Labour Act No. 4857, Civil Servants Act No. 657',
  footerBrowser: 'Everything runs in your browser · nothing you type is sent or stored · no account',
  footerDisclaimer: 'Independent site published by Radif Partners, not affiliated with the Presidency of Religious Affairs (Diyanet), any ministry, municipality or charity. It collects no donations and sells no sacrifices. Fasting times are computed: for worship, the official calendar of your location prevails. Results are estimates and do not constitute legal advice.',
  footerPopular: 'Tools',
  notFound: 'Nothing lives at this address. The home page has the bayram countdown, the 2027 holiday dates, the public holidays and Ramadan times for all 81 provinces.',
  readMore: 'Read more',
  moreOptions: 'More options', copyLink: 'Copy share link', copied: 'Link copied', print: 'Print', howComputed: 'How this is calculated', openFull: 'Open the full tool',
  countdownTo: 'Time left until', days: 'days', hours: 'hrs', minutes: 'min', seconds: 'sec', tzNote: 'Uses your device clock, time zone', passed: 'This date has passed.',
};
const ALL = { tr, en };
export function t(lang: Locale) { return ALL[lang] ?? tr; }
