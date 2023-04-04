const links = document.querySelectorAll("nav a");

const contentMap = {
  about: `
    <h2>About</h2>
    <p>Content for About section goes here.</p>
  `,
  blog: `
    <h2>Blog</h2>
    <p>Content for Blog section goes here.</p>
  `,
  content: `
    <h2>Content</h2>
    <p>Content for Content section goes here.</p>
  `,
  contact: `
    <h2>Contact</h2>
    <p>Content for Contact section goes here.</p>
  `,
};

links.forEach(function (link) {
  link.addEventListener("click", function (event) {
    event.preventDefault();
    const tab = this.getAttribute("data-tab");
    const mainContent = document.getElementById("main-content");
    mainContent.innerHTML = contentMap[tab];
  });
});
