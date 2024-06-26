# Pentatrion Fontello CLI

## Installation

```bash
pnpm add pentatrion-fontello-cli
```

Create at the root of the project

```js
// fontello.config.js
import { defineConfig } from "pentatrion-fontello-cli";

export default defineConfig({
  base: "src/fontello",
  fontFamily: "fontello",
  cssFile: "fontello.css"
});
```

Run

```bash
pnpm exec fontello
```

## Explanation

```
.
└── src
    └── fontello
        ├── config.json
        ├── fontello.woff2
        ├── fontello.css
        └── fontello.css.template
```

During the first run, it will create a config.json file and a fontello.css.template file in the `base` folder.

The `fontello.css.template` file can be modified and will be used at each save.

If it finds the placeholders

- `{{FONT_FAMILY}}`
- `{{URL_DATA}}`
- `{{PREFIX}}`
- `{{TIMESTAMP}}`
- `{{CODES}}`

they will be replaced; otherwise, it will leave what is in place.

example of template file

```css
@font-face {
  font-family: "{{FONT_FAMILY}}";
  src: url("{{URL_DATA}}");
  font-weight: normal;
  font-style: normal;
}
/* If you don't want inline font use this instead */
/*
@font-face {
  font-family: 'fontello';
  src: url('./fontello.woff2?{{TIMESTAMP}}');;
  font-weight: normal;
  font-style: normal;
}
*/
[class^="{{PREFIX}}"]:before,
[class*=" {{PREFIX}}"]:before {
  font-family: "{{FONT_FAMILY}}";
  font-style: normal;
  font-weight: normal;
  speak: never;

  /* etc */
}

{{CODES}}
```

If you do not want the font to be embedded in the stylesheet in base64, simply uncomment in the template file

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
    fontFamily: "fontello-default",
    base: "playground/basic/font",
    cssFile: "index.css",
  },
  {
    fontFamily: "fontello-advanced",
    base: "playground/advanced",
    cssFile: "index.css",
  },
]);
```