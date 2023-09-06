import { TableConfig } from "./tableConfig";

export const presets: { [key: string]: TableConfig } = {};
export const presetsBySlug: { [key: string]: TableConfig } = {};
const requirePresets = require.context('./static/presets/', true, /\.json$/);

export function titleToSlug(title: string) {
  return encodeURIComponent(title.toLowerCase().replaceAll(' ', '-'));
}

for (const presetFile of requirePresets.keys()) {
  const preset = requirePresets(presetFile);
  presets[preset.title] = preset;
  presetsBySlug[titleToSlug(preset.title)] = preset;
}