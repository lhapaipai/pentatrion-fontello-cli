# Pentatrion Fontello CLI

Create at the root of the project

```bash
pnpm add pentatrion-fontello-cli
```

```js
// fontello.config.js
import { defineConfig } from "pentatrion-fontello-cli";

export default defineConfig({
  base: "src/fontello",
  name: "default"
});
```

During the first run, it will create a config.json file and a fontello.css.template file in the fontello folder.

The fontello.css.template file can be modified and will be used at each save.

If it finds the placeholders

- `{{FONT_FAMILY}}`
- `{{URL_DATA}}`
- `{{PREFIX}}`
- `{{TIMESTAMP}}`
- `{{CODES}}`

they will be replaced; otherwise, it will leave what is in place.

If you do not want the font to be embedded in the stylesheet in base64, simply replace in the template file

```css
@font-face {
  font-family: 'fontello';
  src: url('./fontello.woff2?{{TIMESTAMP}}');;
  font-weight: normal;
  font-style: normal;
}
```

## Multiple Icon Packs

```js
// fontello.config.js
import { defineConfig } from "pentatrion-fontello-cli";

export default defineConfig([
  {
    name: "default",
    base: "playground/basic/font",
  },
  {
    name: "advanced",
    base: "playground/advanced",
  },
]);
```