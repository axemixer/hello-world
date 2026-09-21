# Halı Saha Maç Videosu

Remotion ile hazırlanmış, TV yayını tarzında halı saha maçı duyuru videosu.
**15 saniye · 1080×1920 (dikey) · 30 fps · müzikli** — WhatsApp / Instagram Story için.

## Maç

| | |
|---|---|
| **Gün** | Perşembe |
| **Saat** | 20:00 |
| **Saha** | Baltalimanı |
| **Format** | 6 v 6 |

Kaleci oynanmıyor — kale önü taktik tahtasında boş bırakılıyor. Her iki takım
da **2-2-2** diziliyor: 2 defans, 2 orta saha, 2 forvet.

**Siyah Takım (A):** Mert (DEF), Oğuz (DEF), Murat (ORT), Passucci (ORT), Kamil (FOR), Yusuf (FOR)
**Beyaz Takım (B):** Orkun (DEF), Aykut (DEF), Özkan (ORT), Mustafa (ORT), Ersan (FOR), Tunahan (FOR)

## Sahneler

Müzik 160 BPM olduğu için bir ölçü tam olarak 1.5 sn = 45 kare. Bütün kesmeler
ölçü başlarına, müziğin vuruşlarına denk geliyor (`src/timeline.ts`).

| Kare | Süre | Sahne |
|---|---|---|
| 0 | 3 sn | Açılış jeneriği — **MAÇ GÜNÜ / KADROLAR AÇIKLANDI** |
| 90 | 3 sn | Siyah takım taktik tahtası |
| 180 | 3 sn | Beyaz takım taktik tahtası |
| 270 | 1.5 sn | **SİYAH vs BEYAZ** |
| 315 | 4.5 sn | **HAZIR MISIN?** + özet kart |

Her sahnede yayın grafikleri sabit: sağ üstte **MAÇ ÖNÜ** etiketi, takım
şeridi (alt bant), altta **PERŞEMBE · 20:00 · BALTALİMANI · 6 v 6** şeridi.

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

`public/music.mp3` sıfırdan sentezleniyor — hazır örnek (sample) kullanılmıyor,
dolayısıyla telif sorunu yok. `scripts/make-music.mjs` davul, bas, akor ve riser
seslerini tek tek üretip 160 BPM / La minör bir parçaya diziyor: açılış vuruşu →
hızlanan build-up → sonuna kadar yüksek tempo. `npm run music` ile yeniden üretilir.

## Yazı tipleri

Anton ve Barlow Condensed (SIL Open Font License) `public/fonts/` altında yerel
olarak duruyor; Türkçe karakterler (ğ ş ı İ ö ü ç) için `latin-ext` alt kümesi
dahil. Ayrıntı: `public/fonts/OFL.txt`.

## Dosya düzeni

```
src/
  Root.tsx                 kompozisyon tanımı
  MatchVideo.tsx           sahneleri ve müziği birleştirir
  timeline.ts              kare/ölçü hesapları
  data.ts                  maç bilgisi, kadrolar ve diziliş koordinatları
  theme.ts                 renkler ve font yığınları
  fonts.ts                 yerel font yükleme
  components/
    FormationBoard.tsx     perspektifli taktik tahtası
    Broadcast.tsx          alt bant, şerit, MAÇ ÖNÜ etiketi
    Pitch.tsx              arka plan sahası
    Ball.tsx, Jersey.tsx   top ve forma çizimleri
    anim.ts                animasyon yardımcıları
  scenes/                  Intro, Lineup, Clash, Outro
scripts/make-music.mjs     müzik sentezleyici
```
