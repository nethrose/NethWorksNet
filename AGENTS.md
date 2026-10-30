# NethWorksNet — nethworks.net

Single-page personal "whois" landing site. Vanilla HTML/CSS/JS — no framework;
the one script (`javascript/app.js`) is an ES module.

## Deploy + DNS blast radius

- **Netlify auto-deploys on push to the default branch** — verify locally
  before pushing. Static publish (`netlify.toml`, `publish = "."`); the Node 24
  pins (`.nvmrc`, `netlify.toml`) matter only to the Netlify environment.
- **Netlify also runs DNS for `nethworks.net`, and the same zone serves
  `jellyfin.nethworks.net` for the cm3588 NAS.** DNS-affecting changes have
  blast radius beyond this site. The jellyfin A record is manually maintained
  (no DDNS).
- **`/.well-known/security.txt` is generated at Netlify build time, never
  committed.** `npm run build` (the `netlify.toml` build command) runs
  `scripts/generate-security-txt.mjs .`, which writes the file straight into
  the published root, dates `Expires` six months from the build clock, and
  refuses to finish if the result is missing `Contact` or carries an
  `Expires` already past or more than a year out. Contact is
  `security@nethworks.net` (Neth Works LLC, not a person) — there is
  deliberately no `/security` page and no nav or footer link. This check only
  catches a malformed file at build time: it does not catch staleness, and no
  scheduled job re-runs the build, so the deployed file goes stale if the
  site is not redeployed within six months of its last build.

## Architecture (read before changing behavior)

- `index.html` — shell: header/title, nav with the whois link + sliding
  `.nav-indicator`, empty `#main-content`.
- `javascript/app.js` — all logic. `contentMap` holds tab content as
  HTML-returning functions keyed by `data-tab`; `insertContent()` injects into
  `#main-content`. The site starts blank — clicking whois is an opt-in toggle.
  No URL routing. `setupWhoisBar()` drives the social-links hover bar;
  `alignLayout()` (on load + resize) aligns nav and main to the title.
- `css/styles.css` — all styles. Tokens: bg `#201c29`, accents `#ab49de` /
  `#d39fee`, Montserrat (Google Fonts), base font-size 62.5% (1rem ≈ 10px).
- Whois tab renders social links: YouTube/LinkedIn `@netheroth`, GitHub
  `@nethrose`.

## Maintaining this file

Keep this file for knowledge useful to almost every future agent session in this project.
Do not repeat what the codebase already shows; point to the authoritative file or command instead.
Prefer rewriting or pruning existing entries over appending new ones.
When updating this file, preserve this bar for all agents and keep entries concise.
