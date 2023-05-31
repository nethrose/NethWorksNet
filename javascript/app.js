// app.js

import { loadBlogPosts, blogContent } from './blog.js';
import { initSearch, performSearch, displaySearchResults } from './search.js';

const marked = window.marked;

const links = document.querySelectorAll("nav a");
const navBar = document.querySelector(".navbar");

const contentMap = {
  about: () => `
    <div class="content-section profile-container">
      <div class="github-widget">
        <div class="github-card" data-github="nethrose" data-width="400" data-height="318" data-theme="medium"></div>
        <script src="//cdn.jsdelivr.net/github-cards/latest/widget.js"></script>
      </div>
      <div class="pdf-widget">
        <iframe src="https://drive.google.com/file/d/1a5NZHkTW_YsSrGCTynd2_9XUquK-x10F/preview" width="100%" height="300" frameborder="0"></iframe>
      </div>
    </div>
  `,
  blog: async () => await blogContent(),
  contact: () => `
    <div class="content-section rendered-content">
      <h2>Contact</h2>
      <p>Content for Contact section goes here.</p>
    </div>`,
};

function updateActiveLinkPosition() {
  const activeLink = document.querySelector(".nav-link.active");
  if (!activeLink) return;

  activeLink.style.transition = "none";
  const titleRect = document.querySelector(".header").getBoundingClientRect();
  const linkRect = activeLink.getBoundingClientRect();
  const header = document.querySelector(".header");
  const titleCenter = header.offsetLeft + header.offsetWidth / 2;
  const y = titleRect.bottom + 0.2;
  const dy = y - linkRect.top;

  activeLink.style.top = `${linkRect.top + dy - (activeLink.offsetHeight / 2)}px`;
  activeLink.style.left = `${titleCenter}px`;
  setTimeout(() => {
    activeLink.style.transition = "";
  }, 100);
}

function insertHTMLAndExecuteScripts(container, htmlOrPromise, callback) {
  Promise.resolve(htmlOrPromise).then((content) => {
    if (content instanceof HTMLElement) {
      container.innerHTML = '';
      container.appendChild(content);
    } else {
      container.innerHTML = content;
    }

    const scripts = Array.from(container.getElementsByTagName("script"));
    const externalScripts = scripts.filter(script => script.src);
    const inlineScripts = scripts.filter(script => !script.src);

    const loadExternalScripts = (scripts, onload) => {
      let loadedScripts = 0;
      scripts.forEach((script) => {
        const newScript = document.createElement('script');
        newScript.src = script.src;
        newScript.onload = () => {
          loadedScripts++;
          if (loadedScripts === scripts.length && onload) {
            onload();
          }
        };
        script.parentNode.removeChild(script);
        container.appendChild(newScript);
      });
    };

    loadExternalScripts(externalScripts, () => {
      inlineScripts.forEach(function (script) {
        eval(script.innerHTML);
        script.parentNode.removeChild(script);
      });

      if (callback) {
        callback();
      }

      if (content.callback) {
        content.callback();
      }
    });
  });
}

const titleRect = document.querySelector(".header").getBoundingClientRect();

links.forEach(function (link) {
  link.addEventListener("click", function (event) {
    event.preventDefault();

    const activeLink = document.querySelector(".nav-link.active");

    if (activeLink) {
      activeLink.style.top = "";
      activeLink.style.left = "";
      activeLink.style.transform = "";
      activeLink.style.opacity = 0.5;
      activeLink.classList.remove("active");
    }

    if (activeLink === this) {
      this.classList.remove("active");
      document.getElementById("main-content").innerHTML = "";
      return;
    }

    this.classList.add("active");

    const linkRect = this.getBoundingClientRect();
    const header = document.querySelector(".header");
    const titleCenter = header.offsetLeft + header.offsetWidth / 2;
    const y = titleRect.bottom + 0.2;
    const dy = y - linkRect.top;

    this.style.top = `${linkRect.top + dy - (this.offsetHeight / 2)}px`;
    this.style.left = `${titleCenter}px`;
    this.style.transform = "translate(-50%, -50%)";
    this.style.opacity = 1;

    const mainContent = document.getElementById("main-content");
    mainContent.style.opacity = 0;

    setTimeout(() => {
      insertHTMLAndExecuteScripts(mainContent, contentMap[this.getAttribute("data-tab")]());

      updateActiveLinkPosition();
      mainContent.style.opacity = 1;
    }, 500); // 1s matches the CSS transition duration
  });
});

document.querySelector('#main-content').addEventListener('click', async function(event) {
  if (!event.target.matches('.blog-post-link')) return;

  event.preventDefault();

  const postFileName = event.target.getAttribute('data-post');

  const response = await fetch(`/blog/${postFileName}`);
  const content = await response.text();
  const htmlContent = marked.parse(content, {mangle: false, headerIds: false});

  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = `<div class="rendered-content">${htmlContent}</div>`;
});

window.addEventListener("scroll", updateActiveLinkPosition);
window.addEventListener("resize", updateActiveLinkPosition);

initSearch('your-host-identifier', 'your-search-key');

// Add an event listener to the search form
document.getElementById('search-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  
  // Get the search term from the input field
  const searchTerm = document.getElementById('search-input').value;
  
  // Perform a search
  const results = await performSearch('your-engine-name', searchTerm);
  
  // Display the search results
  const resultsContainer = document.getElementById('results-container');
  displaySearchResults(results, resultsContainer);
});
