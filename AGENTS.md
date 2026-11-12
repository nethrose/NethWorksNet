# NethWorksNet — nethworks.net

Single-page site for Neth Works LLC, with a personal "whois"/"whatdo" toggle
area underneath. Vanilla HTML/CSS/JS — no framework; the one script
(`javascript/app.js`) is an ES module.

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
  `.nav-indicator`, empty `#main-content`, and a `.site-footer` (fixed to the
  viewport bottom at every width, independent of nav/content height so it
  can't collide with either; stays on one line via tight padding, never a
  smaller font) with a copyright line and a `Contact` link to `contact.html`.
- `contact.html` — byte-for-byte the same shell as `index.html` (header, nav,
  empty `#main-content`, `.site-footer`, same `app.js`) except its title and
  `<body data-home="contact">`. That attribute is the only thing that makes
  it behave differently: `app.js` reads it as `homeTab` and uses it to pick
  what `#main-content` shows with no tab active, via `contentMap.contact`
  (legal name, what the company makes, contact addresses — no back link; the
  shared nav is the way back now). Keep this page a true "home tab" rather
  than a separate always-visible block beside `#main-content` — a second,
  independently-positioned block was tried and rejected because it could
  render at once with a toggled tab instead of being replaced by it, and
  could drift out of alignment with the nav independently.
- `javascript/app.js` — shared logic for both pages. `contentMap` holds every
  swappable piece of `#main-content` (whois as `about`, `whatdo`, and
  `contact`) as HTML-returning functions; `insertContent()` replaces
  `#main-content` wholesale, so switching tabs always swaps content, never
  stacks it. `renderHomeOrBlank()` is what `#main-content` reverts to with no
  tab active (on load, and when the active tab is clicked again to turn it
  off): `contentMap[document.body.dataset.home]` if the page sets `data-home`,
  else empty. No URL routing. `setupWhoisBar()` drives the social-links hover
  bar; `alignLayout()` (on load + resize) aligns nav and main to the title.
  `alignMainWithNav()` measures the widest `.nav-link` (not just the first)
  and adds a fixed `NAV_CONTENT_GAP` (24px) — nav links share one font-weight
  (`nav a`, not just `.active`) precisely so that width can't change between
  toggle states and reopen the gap. Below `CONTACT_STACK_BREAKPOINT` (600px),
  `contact.html` specifically (checked via `homeTab === "contact"`) drops the
  side-by-side layout and moves `#main-content` below the fixed nav instead:
  its column is too narrow there for `support@nethworks.net` to sit on one
  line without either overflowing or splitting mid-address, and both are
  disallowed (see the `.statement-text a[href^="mailto:"]` rule below).
- `css/styles.css` — all styles, shared by both pages. Tokens: bg `#201c29`,
  accents `#ab49de` / `#d39fee`, Montserrat (Google Fonts). `rem` here is
  relative to the root `<html>` (browser default, usually 16px) — `body`'s
  own `font: 62.5% ...` only sets `body`'s *own* font-size, it does not
  redefine what `rem` means for descendants; don't assume `1rem ≈ 10px` when
  sizing or measuring anything. `.whois-links`/`.whois-link`/`.whois-alias`
  must stay shrinkable (`min-width: 0`, `overflow-wrap: anywhere`) — a
  fixed-width flex row here will overflow at narrow widths once a long
  unbroken label (e.g. a bare domain) is added, since `align-items: stretch`
  only constrains the cross axis, not word-wrapping. By contrast,
  `.statement-text`'s `mailto:` links use `white-space: nowrap` — an address
  must never split, so on this page that constraint is met with layout
  (the stacking above), not a wrap-anywhere fallback.
- Whois tab renders social links: YouTube/LinkedIn `@netheroth`, GitHub
  `@nethrose`.

## Maintaining this file

Keep this file for knowledge useful to almost every future agent session in this project.
Do not repeat what the codebase already shows; point to the authoritative file or command instead.
Prefer rewriting or pruning existing entries over appending new ones.
When updating this file, preserve this bar for all agents and keep entries concise.
