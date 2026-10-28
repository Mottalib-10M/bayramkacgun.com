/** Configuration centrale du site (générée par new-site.py). */
export const SITE_URL = "https://bayramkacgun.com";
export const SITE_NAMES: Record<string, string> = {"tr": "Bayram Kaç Gün", "en": "Bayram Kaç Gün"};
// Partie du nom affichée en couleur dans l'en-tête (RECETTE §10.3), « » pour aucune.
export const BRAND_ACCENT = "Bayram";
/** Locale des nombres et des dates : anglais britannique pour la version anglaise. */
export const NUM_TAGS: Record<string, string> = {"tr": "tr-TR", "en": "en-GB"};
export const LANG_TAGS: Record<string, string> = {"tr": "tr-TR", "en": "en-TR"};
export const OG_LOCALES: Record<string, string> = {"tr": "tr_TR", "en": "en_GB"};
export const LOCALE_TAG = 'tr-TR';
export const CURRENCY = 'TRY';
export const YEAR = 2026;
/** Année de création du site — signal d'ancienneté (RECETTE §8.0). */
export const SITE_FOUNDED = '2026';
export const LAST_UPDATED = '2026-10-28';
export const AUTHOR_NAME = 'Radif Partners';
export const AUTHOR_ROLE: Record<string, string> = {"tr": "Diyanet İşleri Başkanlığının yayımladığı dini günler takvimini, 2429 sayılı Kanunu ve 4857 sayılı İş Kanununu okuyarak bayram ve tatil tarihlerini hesaplayan bağımsız yayıncı", "en": "Independent publisher that works out Turkish religious holidays, public holidays and Ramadan times from the Diyanet calendar, Law No. 2429 and the Labour Act No. 4857"};
export const AUTHOR_DESC: Record<string, string> = {"tr": "Radif Partners; devlet, Diyanet, belediye ya da herhangi bir dernekle bağı olmayan bağımsız bir yayıncıdır. Bayram Kaç Gün için bayram tarihlerini Diyanet İşleri Başkanlığının yayımladığı dini günler listesinden, resmi tatilleri 2429 sayılı Ulusal Bayram ve Genel Tatiller Hakkında Kanunun resmi metninden, izin ve ücret kurallarını 4857 sayılı İş Kanunundan okur. İmsak ve iftar saatlerini Diyanet'in açıkladığı ölçülerle 81 il merkezi için kendisi hesaplar ve resmi takvimle karşılaştırır. Bağış toplamaz, kurban satmaz; yazdığınız hiçbir şey tarayıcınızdan çıkmaz.", "en": "Radif Partners is an independent publisher with no tie to the Turkish state, the Diyanet, any municipality or any charity. For Bayram Kaç Gün it takes holiday dates from the religious-days list published by the Presidency of Religious Affairs (Diyanet), public holidays from the official text of Law No. 2429 on National Holidays and General Days Off, and leave and pay rules from Labour Act No. 4857. It computes fasting start and fast-breaking times for all 81 provincial centres with the parameters the Diyanet describes, and checks them against the official calendar. It collects no donations and sells no sacrifices; nothing you type leaves your browser."};
/** Sujets sur lesquels l'editeur est competent (schema.org knowsAbout). Ce sont les
 *  themes reellement traites par le site, pas une liste de mots-cles : un sujet
 *  declare ici sans page qui le couvre est une declaration fausse. */
export const KNOWS_ABOUT: Record<string, string[]> = {"tr": ["Kurban Bayramı ve Ramazan Bayramı tarihleri", "2429 sayılı Kanuna göre resmi tatiller", "Arefe günü yarım gün tatili", "İmsak, iftar ve sahur vakitlerinin hesaplanması", "Hicri takvim ve dini günler", "Yıllık izin ve genel tatil ücreti (4857 sayılı İş Kanunu)"], "en": ["Eid al-Fitr and Eid al-Adha dates in Turkey", "Turkish public holidays under Law No. 2429", "Half-day holiday on the eve of a bayram", "Computing fasting and fast-breaking times", "Hijri calendar and religious days in Turkey", "Annual leave and holiday pay under Turkish Labour Act No. 4857"]};
export const CONTACT_EMAIL = "contact@bayramkacgun.com";
export const THEME_COLOR = '#E30A17';
export const LOGO_SYMBOL = 'BT';
export const BING_VERIFY_CODE = '';
export const GOOGLE_VERIFY_CODE = '';
/** Régime : 'none' pour tous les sites (RECETTE §15.6, décision de l'éditeur du 2026-10-06) :
 *  aucun bandeau ; Clarity chargé en mode sans cookie (consentv2 denied) ; GA4 avec cookies si GA4_ID.
 *  'opt-in' / 'notice' ne servent plus qu'aux sites anciens qui les portent encore. */
export const CONSENT_MODE: 'opt-in' | 'notice' | 'none' = 'none';
/** Propriété Google Analytics 4 (décision de l'éditeur du 2026-10-17, RECETTE §15.6) : GA4 normal,
 *  avec cookies _ga / _ga_<ID> (390 jours), sans bandeau, publicité refusée. Créée par
 *  `seo-platform/scripts/create-ga4.ts accounts/372759688` (RECETTE §15.3, étape 15), puis
 *  pages légales régénérées : `python3 scripts/gen-legal-pages.py .`. Vide = pas de GA4. */
export const GA4_ID = 'G-C99HTB3XBY';
/** Projet Microsoft Clarity (compte amradif), chargé sans cookie. Vide = aucune mesure. */
export const CLARITY_ID = 'z4zq3bf99e';
export const INDEXNOW_KEY = 'a365150c8a2d8debab2d2d0d0bf84c46';

/* ------------------------------------------------------------------------- *
 * IDENTITÉ LÉGALE — À COMPLÉTER AVANT LA MISE EN LIGNE
 * Ces champs alimentent la mention légale du pays, la politique de confidentialité,
 * la page contact et le schema Organization. Un champ vide s'affiche en jaune
 * sur le site. Contrôle : `npm run check:legal`.
 * ------------------------------------------------------------------------- */
export interface LegalHosting { name: string; address: string; phone: string; url: string }
export interface LegalIdentity {
  entityName: string; legalForm: string; street: string; postalCode: string; city: string;
  country: string; phone: string; registerLabel: string; registerNumber: string;
  vatLabel: string; vatNumber: string; jurisdiction: string;
  supervisoryAuthority: string; supervisoryAuthorityUrl: string; hosting: LegalHosting;
}
export const LEGAL: LegalIdentity = {
  entityName: 'Radif Partners',  // éditeur de tous les sites du portefeuille (RECETTE §8)
  legalForm: '',  // vide : comme les autres sites du portefeuille
  street: '49 rue du Ressort',
  postalCode: '63000',
  city: 'Clermont-Ferrand',
  country: "Fransa / France",
  phone: '',                 // ligne de contact publiée
  registerLabel: "SIREN",
  registerNumber: '',
  vatLabel: "VAT",
  vatNumber: '',             // laisser vide si non assujetti
  jurisdiction: "France",
  supervisoryAuthority: "Commission nationale de l'informatique et des libertés (CNIL)",
  supervisoryAuthorityUrl: "https://www.cnil.fr",
  hosting: { name: 'GitHub, Inc. (GitHub Pages)', address: '88 Colin P Kelly Jr Street, San Francisco, CA 94107, United States', phone: '', url: 'https://pages.github.com' },
};

/** Champs sans lesquels le site ne doit pas être mis en ligne. */
export const LEGAL_REQUIRED: Array<keyof LegalIdentity> = ['entityName', 'street', 'postalCode', 'city']; // legalForm vide à dessein, comme les autres sites du portefeuille

/** Profils publics de l'auteur (schema.org sameAs). Laisser vide si aucun. */
export const AUTHOR_SAME_AS: string[] = [];

/** Rythme de revue éditoriale annoncé sur le site, en mois. */
export const REVIEW_CYCLE_MONTHS = 12;
