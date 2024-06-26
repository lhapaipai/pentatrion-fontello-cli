# Pentatrion Fontello CLI

créer à la racine du projet

```bash
pnpm add pentatrion-fontello-cli
```

```js
// fontello.config.js
import { defineConfig } from "pentatrion-fontello-cli";

export default defineConfig({
  base: "src/fontello",
  name: "default",
  prefix: "fe-"
});
```

Lors du premier lancement il va nous créer dans le dossier fontello un fichier `config.json` et un fichier `fontello.css.template`.

le fichier `fontello.css.template` peut être modifié il sera utilisé à chaque enregistrement.

s'il trouve les emplacements

- `{{FONT_FAMILY}}`
- `{{URL_DATA}}`
- `{{PREFIX}}`
- `{{TIMESTAMP}}`

ils seront remplacés sinon il laissera ce qui est en place.

si l'on ne souhaite pas que la font soit intégrée dans la feuille de style en base64
il suffit de remplacer dans le fichier de template

```css
@font-face {
  font-family: 'fontello';
  src: url('./fontello.woff2?{{TIMESTAMP}}');;
  font-weight: normal;
  font-style: normal;
}
```

## Multi packs d'icônes

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