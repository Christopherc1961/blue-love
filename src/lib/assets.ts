/** Local in the Grok preview. GitHub raw on the public mockup. */
const REMOTE =
  "https://raw.githubusercontent.com/Christopherc1961/blue-love/main/public";

export function img(src: string) {
  if (!src.startsWith("/")) return src;
  if (import.meta.env.DEV) return src;
  return `${REMOTE}${src}`;
}
