# NethWorksNet — Personal Website

## What It Is

A single-page personal "whois" landing site for **nethworks.net**. Vanilla
HTML/CSS/JS — no framework, no build step. The one script is loaded as an ES
module.

## Key Files

| File | Purpose |
|------|---------|
| `index.html` | Shell: header/title, `nav` with the whois link + sliding `.nav-indicator`, and an empty `#main-content` |
| `javascript/app.js` | SPA logic: `contentMap` content, content injection, nav indicator, whois hover-bar, layout alignment |
| `css/styles.css` | All styles |

## Tabs / Content Map

- **whois** (`data-tab="about"`) — the only tab. Renders social profile links:
  YouTube (`@netheroth`), GitHub (`@nethrose`), LinkedIn (`@netheroth`).

## Dependencies

None. No build step and no runtime dependencies. Node 22 is only relevant to the
Netlify environment (see Deployment), not the site itself.

## Design Tokens

- Background: `#201c29`
- Primary accent: `#ab49de` (title, gradients, indicator)
- Secondary accent: `#d39fee` (nav links, underlines, content text)
- Font: Montserrat (Google Fonts, imported in `styles.css`)
- Base font size: `62.5%` (10px equivalent), so `1rem` ≈ 10px

## JavaScript & HTML Architecture

### Content injection
Tab content lives in `contentMap` in `app.js`. Each key maps to a function that
returns HTML (string or Promise):

```javascript
const contentMap = {
  about: () => `...`,
};
```

`insertContent(container, htmlOrPromise, callback)` resolves the value, injects
it into `#main-content` (or appends it if it's an `HTMLElement`), then runs an
optional callback.

### Navigation
- Nav links use `data-tab` to match `contentMap` keys.
- The site **starts blank**. Clicking the whois link is an opt-in toggle: first
  click renders whois, clicking the active link again clears `#main-content`.
- Sliding `.nav-indicator` is positioned by `moveIndicatorTo(link)` via CSS vars
  `--indicator-top` / `--indicator-height`; transitions use
  `cubic-bezier(0.4, 0, 0.2, 1)`.
- No URL routing — content switching is hash-free.

### Whois hover-bar
`setupWhoisBar()` (run after the whois tab renders) drives a continuous left bar
that brightens the hovered `.whois-link`'s segment by clipping a bright overlay
(`--hl-top` / `--hl-height`) and sliding between segments.

### Layout alignment
On `DOMContentLoaded` and `resize`, `alignLayout()` runs:
- `alignNavWithTitle()` — raises the nav so the active indicator's top sits just
  beneath the title's `.gradient-underline`.
- `alignMainWithNav()` — sets `main`'s `margin-left` to the right edge of the nav
  link's underline so content is flush with it.
- Re-pins the indicator to the nav link even when inactive.

## CSS & Design System

### Layout
- **Nav**: fixed left column (its `top` is adjusted at runtime by `alignNavWithTitle()`).
- **Main**: `margin-left` set at runtime by `alignMainWithNav()`.
- **Header**: centered title with a gradient underline (`.gradient-underline`).

### Typography
- Font: Montserrat.
- Title: uppercase, gradient text.
- Nav link: small by default; active state enlarges and repositions.

### Content sections
Shared `.content-section` pattern: `::before` radial-gradient background,
`border-radius`, `box-shadow`. `.whois-links` is a vertical flex column of
`.whois-link` rows (icon + `.whois-alias`), left-aligned.

### Nav animation
- `.nav-link.active`: repositioned/enlarged with a `cubic-bezier` transition.
- `::before` on links: gradient underline, scaled small by default, full width on
  hover/active.

## Deployment

Deployed on **Netlify** with automated git builds from this repo (push to deploy).

- Static site, no build: `netlify.toml` sets `publish = "."`.
- Node 22 via `.nvmrc` and `netlify.toml` (`NODE_VERSION = "22"`); Netlify uses
  whichever is present.
