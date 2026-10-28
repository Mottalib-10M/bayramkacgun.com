import { describe, it, expect } from 'vitest';
import { bayram, ramazan, tatiller, yilOzeti, diniGunler, DINI_YILLAR } from '../src/lib/engine/takvim';
import { optimize, bayramTatili, kopruGunleri } from '../src/lib/engine/izin';
import { ilVakit, IL, DOGRULAMA, imsakiye } from '../src/lib/engine/iller';
import { hhmm } from '../src/lib/engine/vakit';
import { yillikIzin } from '../src/lib/tool-specs';

describe('Diyanet dini günler listesi', () => {
  it('bayram tarihleri Diyanet listeleriyle aynı', () => {
    expect(bayram('ramazan', 2026)).toMatchObject({ arefe: '2026-03-19', ilk: '2026-03-20', son: '2026-03-22' });
    expect(bayram('kurban', 2026)).toMatchObject({ arefe: '2026-05-26', ilk: '2026-05-27', son: '2026-05-30' });
    expect(bayram('ramazan', 2027)).toMatchObject({ arefe: '2027-03-08', ilk: '2027-03-09', son: '2027-03-11' });
    expect(bayram('kurban', 2027)).toMatchObject({ arefe: '2027-05-15', ilk: '2027-05-16', son: '2027-05-19' });
    expect(bayram('ramazan', 2028)).toMatchObject({ arefe: '2028-02-25', ilk: '2028-02-26', son: '2028-02-28' });
    expect(bayram('kurban', 2028)).toMatchObject({ arefe: '2028-05-04', ilk: '2028-05-05', son: '2028-05-08' });
  });
  it('Ramazan 2027 ve 2028', () => {
    expect(ramazan(2027)).toMatchObject({ ilk: '2027-02-08', son: '2027-03-08', gun: 29, kadir: '2027-03-05', bayram: '2027-03-09' });
    expect(ramazan(2028)).toMatchObject({ ilk: '2028-01-28', son: '2028-02-25', gun: 29, kadir: '2028-02-22', bayram: '2028-02-26' });
  });
  it('her yıl için Ramazan ve Kurban günleri eksiksiz', () => {
    for (const y of DINI_YILLAR) {
      const ids = diniGunler(y).map((e) => e.id);
      for (const id of ['kadir', 'ramazan-1', 'kurban-1']) expect(ids).toContain(id);
      expect(bayram('kurban', y)?.gunler.length ?? 4).toBe(4);
    }
  });
});

describe('2429 sayılı Kanun', () => {
  it('2027: 14,5 gün tatil, 250 iş günü (Pazartesi-Cuma)', () => {
    expect(yilOzeti(2027)).toMatchObject({ toplam: 14.5, haftaIci: 12, isGunu: 250 });
    expect(tatiller(2027).filter((t) => t.sure === 0.5).map((t) => t.date)).toEqual(['2027-03-08', '2027-05-15', '2027-10-28']);
  });
  it('2028: 15,5 gün tatil, yalnız 7 günü hafta içi', () => {
    expect(yilOzeti(2028)).toMatchObject({ toplam: 15.5, haftaIci: 7 });
  });
  it('sabit tatiller her yıl aynı gün', () => {
    for (const y of [2026, 2027, 2028]) {
      const d = tatiller(y).map((t) => t.date);
      for (const md of ['01-01', '04-23', '05-01', '05-19', '07-15', '08-30', '10-28', '10-29']) expect(d).toContain(`${y}-${md}`);
    }
  });
});

describe('Bayram tatili ve izin planı', () => {
  it('Kurban 2027: izinsiz 5, 2 gün izinle 9 gün', () => {
    expect(bayramTatili('kurban', 2027, 0)!.gun).toBe(5);
    expect(bayramTatili('kurban', 2027, 2)!.gun).toBe(9);
  });
  it('Ramazan 2027: izinsiz 3, 1 gün izinle 6, 2 gün izinle 9', () => {
    expect([0, 1, 2].map((k) => bayramTatili('ramazan', 2027, k)!.gun)).toEqual([3, 6, 9]);
  });
  it('Kurban 2028: arefe sabahı yarım gün sayılırsa 2,5 gün izinle 10 gün', () => {
    expect(bayramTatili('kurban', 2028, 2.5, { yarim: true })!.gun).toBe(10);
  });
  it('planlayıcı: daha çok izin hiçbir zaman daha az tatil vermez', () => {
    for (const y of [2027, 2028]) {
      let once = 0;
      for (let b = 0; b <= 20; b++) { const p = optimize(y, b); expect(p.bos).toBeGreaterThanOrEqual(once); expect(p.izin).toBeLessThanOrEqual(b); once = p.bos; }
    }
    expect(optimize(2027, 10).bos).toBe(32);
  });
  it('2028 için tek günlük köprü yok', () => {
    expect(kopruGunleri(2028).length).toBe(0);
  });
});

describe('Yıllık izin (4857 md. 53, 657 md. 102)', () => {
  it('dilim sınırları kanundaki gibi dahil', () => {
    expect(yillikIzin('isci', 5, 35, false).gun).toBe(14);
    expect(yillikIzin('isci', 5.1, 35, false).gun).toBe(20);
    expect(yillikIzin('isci', 15, 35, false).gun).toBe(26);
    expect(yillikIzin('isci', 3, 50, false).gun).toBe(20);
    expect(yillikIzin('isci', 3, 35, true).gun).toBe(18);
    expect(yillikIzin('memur', 10, 40, false).gun).toBe(20);
    expect(yillikIzin('memur', 10.5, 40, false).gun).toBe(30);
  });
});

describe('Vakitler ve Diyanet karşılaştırması', () => {
  it('örnek günlerde imsak ve akşam en çok 1 dakika farklı', () => {
    const dk = (s: string) => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
    for (const [slug, gunler] of Object.entries(DOGRULAMA.ornek)) for (const [d, v] of Object.entries(gunler)) {
      const h = ilVakit(slug, d);
      expect(Math.abs(dk(hhmm(h.imsak)) - dk(v.imsak))).toBeLessThanOrEqual(1);
      expect(Math.abs(dk(hhmm(h.aksam)) - dk(v.aksam))).toBeLessThanOrEqual(1);
    }
  });
  it('karşılaştırma özeti: 81 il, hiçbir fark 1 dakikayı aşmıyor', () => {
    expect(IL.length).toBe(81);
    expect(DOGRULAMA.iller).toBe(81);
    expect(DOGRULAMA.enFazlaFark).toBeLessThanOrEqual(1);
  });
  it('İstanbul Ramazan 2027 ilk gün: imsak 06:35, iftar 18:36', () => {
    const r = imsakiye('istanbul', 2027).rows[0];
    expect([r.imsak, r.aksam]).toEqual(['06:35', '18:36']);
    expect(imsakiye('istanbul', 2027).rows.filter((x) => x.kadir).map((x) => x.date)).toEqual(['2027-03-05']);
  });
});
