import fs from "node:fs";
import path from "node:path";

const out = "public/fonts";
fs.mkdirSync(out, { recursive: true });

function find(root, pattern) {
  const hits = [];
  if (!fs.existsSync(root)) return hits;
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const p = path.join(root, entry.name);
    if (entry.isDirectory()) hits.push(...find(p, pattern));
    else if (pattern.test(entry.name)) hits.push(p);
  }
  return hits;
}

const files = [
  ["node_modules/@fontsource-variable/space-grotesk", /space-grotesk-latin-wght-normal\.woff2$/, "space-grotesk-var.woff2"],
  ["node_modules/@fontsource/ibm-plex-sans", /ibm-plex-sans-latin-300-normal\.woff2$/, "plex-sans-300.woff2"],
  ["node_modules/@fontsource/ibm-plex-sans", /ibm-plex-sans-latin-400-normal\.woff2$/, "plex-sans-400.woff2"],
  ["node_modules/@fontsource/ibm-plex-sans", /ibm-plex-sans-latin-600-normal\.woff2$/, "plex-sans-600.woff2"],
  ["node_modules/@fontsource/ibm-plex-mono", /ibm-plex-mono-latin-500-normal\.woff2$/, "plex-mono-500.woff2"],
];

let copied = 0;
for (const [root, pattern, dest] of files) {
  const match = find(root, pattern)[0];
  if (!match) {
    console.warn(`Font not found: ${root} ${pattern}`);
    continue;
  }
  fs.copyFileSync(match, path.join(out, dest));
  copied++;
}
console.log(`Copied ${copied}/${files.length} font files.`);
