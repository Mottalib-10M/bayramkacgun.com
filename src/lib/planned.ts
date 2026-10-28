/** Toutes les pages prévues (id = nom du fichier de src/content/guides, ou id d'une entrée d'un fichier à plusieurs pages).
 *  Les tests acceptent un lien vers ces ids pendant la rédaction ; « toutes les pages existent » échoue tant qu'il en manque. */
export const IL_SAYFALARI = ['istanbul', 'ankara', 'izmir', 'bursa', 'antalya', 'konya', 'adana', 'gaziantep', 'diyarbakir', 'erzurum'].map((s) => `imsakiye-${s}`);
export const PLANNED_GUIDES = [
  'kurban-bayrami-2027', 'ramazan-bayrami-2027', 'bayrama-kac-gun-kaldi', 'bayram-tatili-kac-gun', 'arefe-gunu-yarim-gun', 'kurban-bayrami-2028', 'ramazan-bayrami-2028', 'bayram-tarihleri', 'dini-gunler-2027', 'kadir-gecesi-2027',
  'ramazan-2027', 'imsakiye-2027', 'iftar-saati', 'imsak-sahur-vakti', 'iftara-kac-dakika-kaldi', 'imsakiye-2028', 'teravih-kac-rekat',
  ...IL_SAYFALARI,
  'resmi-tatiller-2026', 'resmi-tatiller-2027', 'resmi-tatiller-2028', 'takvim-2027', 'kopru-gunleri-2027', 'kopru-gunleri-2028', '28-ekim-yarim-gun', 'resmi-tatil-calisma-ucreti', 'yillik-izin', 'idari-izin-2027',
];
export const PLANNED_IDS = new Set<string>([...PLANNED_GUIDES, 'home', 'method', 'about', 'widget', 'contact', 'editorial', 'privacy', 'terms', 'cookies']);
