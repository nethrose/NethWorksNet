// app.js

const links = document.querySelectorAll("nav a");

const contentMap = {
  about: () => `
    <div class="content-section whois-links">
      <a href="https://www.youtube.com/@netheroth" target="_blank" rel="noopener noreferrer" class="whois-link whois-link--youtube" title="YouTube">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
        <span class="whois-alias">@netheroth</span>
      </a>
      <a href="https://github.com/nethrose" target="_blank" rel="noopener noreferrer" class="whois-link whois-link--github" title="GitHub">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
        <span class="whois-alias">@nethrose</span>
      </a>
      <a href="https://www.linkedin.com/in/netheroth" target="_blank" rel="noopener noreferrer" class="whois-link whois-link--linkedin" title="LinkedIn">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        <span class="whois-alias">@netheroth</span>
      </a>
    </div>
  `,
  whatdo: () => `
    <div class="content-section whois-links">
      <a href="https://nocternal.net" target="_blank" rel="noopener noreferrer" class="whois-link whois-link--nocternal" title="nocternal — browser-local dev-file redaction tools">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        <span class="whois-alias">nocternal.net</span>
      </a>
      <a href="https://useplaceholder.com" target="_blank" rel="noopener noreferrer" class="whois-link whois-link--placeholder" title="placeholder — habit tracker with weekly leagues">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
        <span class="whois-alias">useplaceholder.com</span>
      </a>
      <a href="https://github.com/nethrose/k3sraspbian" target="_blank" rel="noopener noreferrer" class="whois-link whois-link--k3sraspbian" title="k3sraspbian — Ansible provisioning for a Raspberry Pi k3s cluster">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
        <span class="whois-alias">k3sraspbian</span>
      </a>
    </div>
  `,
  contact: () => `
    <p class="statement-text">
      <strong>Neth Works LLC</strong> builds browser-local developer tools and a habit tracker with weekly leagues:
      <a href="https://nocternal.net" target="_blank" rel="noopener noreferrer">nocternal</a> and
      <a href="https://useplaceholder.com" target="_blank" rel="noopener noreferrer">placeholder</a>.
    </p>
    <p class="statement-text">
      <a href="mailto:support@nethworks.net">support@nethworks.net</a> for anything.
      <a href="mailto:security@nethworks.net">security@nethworks.net</a> for security reports.
    </p>
  `,
};

// On contact.html, #main-content shows this content by default (initial load,
// and whenever a toggled tab is switched off) instead of going blank.
const homeTab = document.body.dataset.home;

function moveIndicatorTo(link) {
  const indicator = document.querySelector(".nav-indicator");
  const nav = document.querySelector("nav");
  if (!indicator || !link || !nav) return;
  const linkRect = link.getBoundingClientRect();
  const navRect = nav.getBoundingClientRect();
  indicator.style.setProperty("--indicator-top", `${linkRect.top - navRect.top + linkRect.height / 2}px`);
  indicator.style.setProperty("--indicator-height", `${linkRect.height}px`);
}

function insertContent(container, htmlOrPromise, callback) {
  Promise.resolve(htmlOrPromise).then((content) => {
    if (content instanceof HTMLElement) {
      container.innerHTML = '';
      container.appendChild(content);
    } else {
      container.innerHTML = content;
    }
    if (callback) callback();
  });
}

// What #main-content shows with no tab active: the page's home content
// (contact.html) if one is configured, otherwise blank (index.html).
function renderHomeOrBlank() {
  const mainContent = document.getElementById("main-content");
  if (homeTab && contentMap[homeTab]) {
    insertContent(mainContent, contentMap[homeTab](), setupWhoisBar);
  } else {
    mainContent.innerHTML = "";
  }
}

links.forEach(function (link) {
  link.addEventListener("click", function (event) {
    event.preventDefault();

    const activeLink = document.querySelector(".nav-link.active");
    if (activeLink === this) {
      this.classList.remove("active");
      renderHomeOrBlank();
      return;
    }

    links.forEach((l) => l.classList.remove("active"));
    this.classList.add("active");
    moveIndicatorTo(this);

    const mainContent = document.getElementById("main-content");
    mainContent.style.opacity = 0;

    const tab = this.getAttribute("data-tab");
    if (!contentMap[tab]) return;

    insertContent(mainContent, contentMap[tab](), () => {
      mainContent.style.opacity = 1;
      // Both tabs render the shared .whois-links column; the helper no-ops if absent.
      setupWhoisBar();
    });
  });
});

// Drive the shared continuous left bar: brighten the hovered item's segment
// by clipping the bright overlay to that item, sliding between segments.
function setupWhoisBar() {
  const container = document.querySelector(".whois-links");
  if (!container) return;
  container.querySelectorAll(".whois-link").forEach((item) => {
    item.addEventListener("mouseenter", () => {
      const cRect = container.getBoundingClientRect();
      const iRect = item.getBoundingClientRect();
      container.style.setProperty("--hl-top", `${iRect.top - cRect.top}px`);
      container.style.setProperty("--hl-height", `${iRect.height}px`);
      container.classList.add("bar-active");
    });
  });
  container.addEventListener("mouseleave", () => {
    container.classList.remove("bar-active");
  });
}

// Clear the widest nav label by a fixed gap, so content never starts right
// at (or just past) a label's edge regardless of which link is widest or
// active. Nav label widths are stable across active/inactive (same
// font-weight throughout - see nav a in styles.css), so this holds in every
// toggle state without needing to re-run on click.
const NAV_CONTENT_GAP = 24;

// Below this width, contact.html's column beside the nav isn't wide enough
// for an email address to sit on one line without either splitting it or
// overflowing the viewport - so content moves below the (still fixed, still
// left-aligned) nav instead of beside it.
const CONTACT_STACK_BREAKPOINT = 600;

function alignMainWithNav() {
  const navLinks = document.querySelectorAll(".nav-link");
  const nav = document.querySelector("nav");
  const main = document.querySelector("main");
  if (!navLinks.length || !nav || !main) return;

  if (homeTab === "contact" && window.innerWidth <= CONTACT_STACK_BREAKPOINT) {
    main.style.marginLeft = "1rem";
    main.style.marginTop = `${nav.getBoundingClientRect().bottom + 24}px`;
    return;
  }

  main.style.marginTop = "";
  const maxRight = Math.max(...Array.from(navLinks, (l) => l.getBoundingClientRect().right));
  main.style.marginLeft = `${maxRight + NAV_CONTENT_GAP}px`;
}

// Raise the nav so the top of the active indicator bar (= the nav link's top)
// sits just beneath the bottom of the title's underline.
function alignNavWithTitle() {
  const underline = document.querySelector(".gradient-underline");
  const nav = document.querySelector("nav");
  const navLink = document.querySelector(".nav-link");
  if (!underline || !nav || !navLink) return;
  const gap = 6;
  const desiredLinkTop = underline.getBoundingClientRect().bottom + gap;
  const delta = desiredLinkTop - navLink.getBoundingClientRect().top;
  nav.style.top = `${nav.getBoundingClientRect().top + delta}px`;
}

function alignLayout() {
  alignNavWithTitle();
  alignMainWithNav();
  // Keep the whois indicator bar pinned to the nav link, even when inactive.
  const navLink = document.querySelector(".nav-link");
  if (navLink) moveIndicatorTo(navLink);
}

window.addEventListener("resize", alignLayout);

// Each nav tab (whois, whatdo) is an opt-in toggle (click to show, click the
// active one again to hide), swapping the whole of #main-content. With no
// tab active, #main-content shows the page's home content (renderHomeOrBlank) -
// blank on index.html, the contact text on contact.html.
window.addEventListener("DOMContentLoaded", () => {
  alignLayout();
  renderHomeOrBlank();
});
