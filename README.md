# Luminox Automation Website

Cinematic Vite rebuild following `LMX_Build_Prompt_v2.md` and `LMX_Technical_Spec.md`.

## Run

Requires Node 22 LTS and npm 10+.

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

Before launch: replace the visibly marked image/headshot placeholders, supply the real self-hosted fonts, restore the approved FAQ copy from the current site, configure Formspree, review the privacy placeholders, and replace the locally generated atmosphere prototypes with licensed Pexels/Unsplash assets and record credits.

GoDaddy deployment target: upload the contents of `dist/` into `public_html`; DNS remains on Cloudflare.

## Asset pipeline

After `npm install`, run `npm run fonts` to copy the Fontsource WOFF2 files into `public/fonts`. Add licensed masters to `assets-src/img` and run `npm run images` to generate AVIF/WebP variants and the image manifest.
