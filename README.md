# Halı Saha Maç Videosu

Remotion ile hazırlanmış, halı saha maçı duyuru videosu.
**38 saniye · 1080×1920 (dikey) · 30 fps · müzikli** — WhatsApp / Instagram Story için.

## Maç

| | |
|---|---|
| **Gün** | Perşembe |
| **Saat** | 20:00 |
| **Saha** | Baltalimanı |
| **Format** | 6'ya 6 |

**Siyah Takım (A):** Mert, Oğuz, Murat, Passucci, Kamil, Yusuf
**Beyaz Takım (B):** Orkun, Aykut, Özkan, Mıstık, Ersan, Tuna

## Sahneler

Müzik 120 BPM olduğu için bir ölçü tam olarak 2 sn = 60 kare. Bütün kesmeler
ölçü başlarına, müziğin vuruşlarına denk geliyor (`src/timeline.ts`).

| Kare | Süre | Sahne |
|---|---|---|
| 0 | 4 sn | Işıklar yanıyor, top geliyor — **MAÇ GÜNÜ** |
| 120 | 8 sn | Gün / saha / saat kartları |
| 360 | 4 sn | **KADROLAR AÇIKLANDI** (build-up) |
| 480 | 6 sn | Siyah takım kadrosu |
| 660 | 6 sn | Beyaz takım kadrosu |
| 840 | 4 sn | **SİYAH vs BEYAZ** |
| 960 | 6 sn | **HAZIR MISIN?** + özet kart |

## Komutlar

```bash
npm install
npm run music      # public/music.mp3 dosyasını yeniden üretir
npm run studio     # Remotion Studio — canlı önizleme
npm run build      # out/hali-saha-mac.mp4
npm run typecheck
```

Chromium'u kendi indiremeyen ortamlarda (ör. hazır tarayıcısı olan container'lar)
render komutuna tarayıcı yolunu ekleyin:

```bash
npx remotion render MatchVideo out/hali-saha-mac.mp4 \
  --browser-executable=/yol/headless_shell
```

## Bilgileri değiştirmek

Takım isimleri, oyuncular, renkler ve maç bilgisi tek dosyada: **`src/data.ts`**.
Oyuncu sayısını değiştirirseniz kadro ızgarası kendini ayarlar.

## Müzik

`public/music.mp3` sıfırdan sentezleniyor — hazır örnek (sample) kullanılmıyor,
dolayısıyla telif sorunu yok. `scripts/make-music.mjs` davul, bas, akor ve riser
seslerini tek tek üretip 120 BPM / La minör bir parçaya diziyor: giriş → groove →
build-up → drop → final. `npm run music` ile yeniden üretilir.

## Yazı tipleri

Anton ve Barlow Condensed (SIL Open Font License) `public/fonts/` altında yerel
olarak duruyor; Türkçe karakterler (ğ ş ı İ ö ü ç) için `latin-ext` alt kümesi
dahil. Ayrıntı: `public/fonts/OFL.txt`.

## Dosya düzeni

```
src/
  Root.tsx            kompozisyon tanımı
  MatchVideo.tsx      sahneleri ve müziği birleştirir
  timeline.ts         kare/ölçü hesapları
  data.ts             maç ve kadro bilgisi
  theme.ts            renkler ve font yığınları
  fonts.ts            yerel font yükleme
  components/         Pitch, Ball, Jersey, animasyon yardımcıları
  scenes/             Intro, MatchInfo, Callout, Lineup, Clash, Outro
scripts/make-music.mjs  müzik sentezleyici
```
