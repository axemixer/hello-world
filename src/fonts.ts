import {continueRender, delayRender, staticFile} from 'remotion';

/**
 * Anton and Barlow Condensed are vendored into public/fonts (SIL Open Font
 * License, see public/fonts/OFL.txt) so a render never depends on the network.
 * Both files include the latin-ext subset, which carries the Turkish glyphs
 * (ğ Ğ ş Ş ı İ ö Ö ü Ü ç Ç).
 */
const FILES: {family: string; weight: string; file: string}[] = [
  {family: 'Anton', weight: '400', file: 'anton-400-latin.woff2'},
  {family: 'Anton', weight: '400', file: 'anton-400-latin-ext.woff2'},
  {family: 'Barlow Condensed', weight: '400', file: 'barlow-condensed-400-latin.woff2'},
  {family: 'Barlow Condensed', weight: '400', file: 'barlow-condensed-400-latin-ext.woff2'},
  {family: 'Barlow Condensed', weight: '600', file: 'barlow-condensed-600-latin.woff2'},
  {family: 'Barlow Condensed', weight: '600', file: 'barlow-condensed-600-latin-ext.woff2'},
  {family: 'Barlow Condensed', weight: '700', file: 'barlow-condensed-700-latin.woff2'},
  {family: 'Barlow Condensed', weight: '700', file: 'barlow-condensed-700-latin-ext.woff2'},
];

let started = false;

export const loadFonts = () => {
  if (started || typeof document === 'undefined') return;
  started = true;

  const handle = delayRender('Loading display fonts');
  Promise.all(
    FILES.map(async ({family, weight, file}) => {
      const face = new FontFace(family, `url(${staticFile(`fonts/${file}`)})`, {
        weight,
        style: 'normal',
      });
      await face.load();
      document.fonts.add(face);
    }),
  )
    .then(() => continueRender(handle))
    .catch(() => continueRender(handle)); // never block the render on a font
};
