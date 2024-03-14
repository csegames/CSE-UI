# Updating a font

- Our games use the TTF font format--other formats are not necessary because we are only targeting the Coherent browser runtime.
- Fonts will be delivered by an artist. This will likely come with demo information as well, so you can preview the font.
- The `*.ttf` files should be placed under `<game>/src/fonts/<family>`, e.g. `camelot\src\fonts\Caudex`.
- All font files need to be linked to our source through the `<game>\shared\fonts.scss` file by using a `@font-face` declaration; see the existing entries for examples.
