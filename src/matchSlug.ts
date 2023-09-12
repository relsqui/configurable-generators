import { titleToSlug } from "./presets";

export function matchSlug(options: string[], fallback: string) {
  if (window.location.hash) {
    for (const option of options) {
      if (window.location.hash === `#${titleToSlug(option)}`) {
        return option;
      }
    }
  }
  return fallback;
}