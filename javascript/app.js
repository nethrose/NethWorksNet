const links = document.querySelectorAll("nav a");
const navBar = document.querySelector(".navbar");

async function loadBlogPosts() {
  return new Promise(async (resolve) => {
    const response = await fetch("/blog/post-list.json");
    const blogPostFiles = await response.json();

    blogPostFiles.sort((a, b) => {
      const dateA = a.split("-").splice(0, 3).join("-");
      const dateB = b.split("-").splice(0, 3).join("-");
      return new Date(dateB) - new Date(dateA);
    });

    let blogPosts = '';

    for (const file of blogPostFiles) {
      const response = await fetch(`blog/${file}`);
      const content = await response.text();
      const title = content.match(/<h2>(.*?)<\/h2>/)[1];

      blogPosts += `<a href="#" class="blog-post-link" data-post="${file}">${title}</a><br>`;
    }

    resolve(blogPosts);
  });
}

const contentMap = {
  about: `
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
  blog: async () => {
    const blogPosts = await loadBlogPosts();
    return `
      <div class="content-section rendered-content">
        <h2>Blog</h2>
        <div id="blog-posts">
          ${blogPosts}
        </div>
        <div id="blog-post-content"></div>
      </div>`;
  },
  content: `
    <div class="content-section rendered-content">
      <h2>Content</h2>
      <p>Content for Content section goes here.</p>
    </div>`,
  contact: `
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
  Promise.resolve(htmlOrPromise).then((html) => {
    container.innerHTML = html;
  
    const scripts = Array.from(container.getElementsByTagName("script"));

          scripts.forEach(function (script) {
        const newScript = document.createElement("script");
        Array.from(script.attributes).forEach(function (attr) {
          newScript.setAttribute(attr.name, attr.value);
        });
        newScript.innerHTML = script.innerHTML;
        script.parentNode.replaceChild(newScript, script);
      });

      if (callback) {
        callback();
      }
    });
  }

const titleRect = document.querySelector(".header").getBoundingClientRect();

async function handleBlogPostClick(event) {
  event.preventDefault();
  const postFileName = event.target.getAttribute("data-post");
  const response = await fetch(`/blog/${postFileName}`);
  const content = await response.text();
  document.getElementById("blog-post-content").innerHTML = content;
}

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
      insertHTMLAndExecuteScripts(mainContent, contentMap[this.getAttribute("data-tab")], () => {
        if (this.getAttribute("data-tab") === "about") {
          if (window.IN && window.IN.parse) {
            window.IN.parse(mainContent);
          }
        } else if (this.getAttribute("data-tab") === "blog") {
          const blogPostLinks = document.querySelectorAll(".blog-post-link");
          blogPostLinks.forEach((blogPostLink) => {
            blogPostLink.addEventListener("click", handleBlogPostClick);
          });
        }
      });

      window.addEventListener("scroll", updateActiveLinkPosition);
      window.addEventListener("resize", updateActiveLinkPosition);
      updateActiveLinkPosition();
      mainContent.style.opacity = 1;
    }, 500); // 1s matches the CSS transition duration
  });
});
