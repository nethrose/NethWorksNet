# NethWorksNet — nethworks.net

Single-page personal "whois" landing site. Vanilla HTML/CSS/JS — no framework,
no build step; the one script (`javascript/app.js`) is an ES module.

## Deploy + DNS blast radius

- **Netlify auto-deploys on push to the default branch** — verify locally
  before pushing. Static publish (`netlify.toml`, `publish = "."`); the Node 24
  pins (`.nvmrc`, `netlify.toml`) matter only to the Netlify environment.
- **Netlify also runs DNS for `nethworks.net`, and the same zone serves
  `jellyfin.nethworks.net` for the cm3588 NAS.** DNS-affecting changes have
  blast radius beyond this site. The jellyfin A record is manually maintained
  (no DDNS).

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
