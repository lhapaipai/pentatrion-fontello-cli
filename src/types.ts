export type IconSetConfig = {
  fontFamily: string;
  base: string;
  cssFile: string;
};
export type ProjectConfig = IconSetConfig | IconSetConfig[];

export type ProjectAnswers = {
  iconSetIndex: string;
};
export type ActionAnswers = {
  action: "open" | "save";
};

export type FontelloConfig = {
  name: string;
  css_prefix_text: string;
  css_use_suffix: boolean;
  hinting: boolean;
  units_per_em: number;
  ascent: number;
  glyphs: {
    uid: string;
    css: string;
    code: number;
    src: string;
  }[];
};
