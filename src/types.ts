export type IconSetConfig = {
  name: string;
  base: string;
  prefix: string;
};
export type ProjectConfig = IconSetConfig | IconSetConfig[];

export type ProjectAnswers = {
  iconSetIndex: string;
};
export type ActionAnswers = {
  action: "open" | "save";
};
