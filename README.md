# Halı Saha Maç Videosu

Remotion ile hazırlanmış, Avrupa kupası gecesi formatında maç duyuru videosu.
**15 saniye · 1080×1920 (dikey) · 30 fps · orkestral marş** — WhatsApp / Instagram Story için.

## Maç

| | |
|---|---|
| **Gün** | Perşembe |
| **Saat** | 20:00 |
| **Saha** | Baltalimanı |
| **Format** | 6 v 6 |

Kaleci oynanmıyor — kale önü taktik tahtasında boş bırakılıyor. Her iki takım
da **2-2-2** diziliyor: 2 defans, 2 orta saha, 2 forvet.

**Siyah Takım (A):** Mert E. (DEF), Oğuz (DEF), Mert H. (ORT), Murat (ORT), Bulut (FOR), Yusuf (FOR)
**Beyaz Takım (B):** Orkun (DEF), Göktuğ (DEF), Aykut (ORT), Ersan +1 (ORT), Kamil (FOR), Ersan (FOR)

## Sahneler

Marş 80 BPM olduğu için bir ölçü tam olarak 3 sn = 90 kare ve her ölçü bir
timpani + zil vuruşuyla açılıyor. Her sahne bir ölçü, yani her geçiş bir
vuruşa denk geliyor (`src/timeline.ts`). Sahneler kesmeyle değil, sabit duran
yıldız alanının üzerinde erimeyle (dissolve) birbirine bağlanıyor.

| Kare | Süre | Sahne |
|---|---|---|
| 0 | 3 sn | Arma kuruluyor — **HALI SAHA LİGİ** |
| 90 | 3 sn | Siyah takım taktik tahtası |
| 180 | 3 sn | Beyaz takım taktik tahtası |
| 270 | 3 sn | **A vs B** karşılaşma kartı |
| 360 | 3 sn | **MAÇ GÜNÜ** — gün / saat / saha |

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

Takım isimleri, oyuncular, mevkiler, renkler ve maç bilgisi tek dosyada:
**`src/data.ts`**. Diziliş `SHAPE` dizisindeki x/y koordinatlarıyla belirleniyor
— oyuncu sırası bu koordinatlara göre eşleşir, yani sıralamayı değiştirmek
mevkileri değiştirir.

## Müzik

`public/music.mp3` sıfırdan sentezleniyor — hazır örnek (sample) ya da mevcut
bir melodi kullanılmıyor, dolayısıyla telif sorunu yok.
`scripts/make-music.mjs` timpani, yaylı grubu, koro pedi, bakır üflemeli
fanfar, arp ve zil seslerini tek tek üretip 80 BPM / Re majör bir marşa
diziyor. `npm run music` ile yeniden üretilir.

## Yazı tipleri

Anton ve Barlow Condensed (SIL Open Font License) `public/fonts/` altında yerel
olarak duruyor; Türkçe karakterler (ğ ş ı İ ö ü ç) için `latin-ext` alt kümesi
dahil. Ayrıntı: `public/fonts/OFL.txt`.

## Dosya düzeni

```
src/
  Root.tsx                 kompozisyon tanımı
  MatchVideo.tsx           sahneleri, marşı ve geçişleri birleştirir
  timeline.ts              kare/ölçü hesapları
  data.ts                  maç bilgisi, kadrolar ve diziliş koordinatları
  theme.ts                 gece laciverti paleti ve gümüş tipografi
  fonts.ts                 yerel font yükleme
  components/
    Starfield.tsx          yıldızlı gece arka planı (tüm sahnelerin altında)
    Crest.tsx              lige özel gümüş arma
    FormationBoard.tsx     perspektifli taktik tahtası
    Broadcast.tsx          bantlar, şerit, gümüş başlık
    Ball.tsx, Jersey.tsx   top ve forma çizimleri
    anim.ts                animasyon ve dissolve yardımcıları
  scenes/                  Opening, Lineup, Showdown, Fixture
scripts/make-music.mjs     marş sentezleyici
```
