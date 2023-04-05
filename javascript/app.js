const links = document.querySelectorAll("nav a");
const navBar = document.querySelector(".navbar");
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

const titleRect = document.querySelector(".header").getBoundingClientRect();

links.forEach(function (link) {
  link.addEventListener("click", function (event) {
    event.preventDefault();

    const activeLink = document.querySelector(".nav-link.active");

    if (activeLink) {
      // Animate the active link back to its original position
      activeLink.style.top = "";
      activeLink.style.left = "";
      activeLink.style.transform = "";
    }

    if (activeLink === this) {
      // If the same link is clicked again, remove the active class
      this.classList.remove("active");
      document.getElementById("main-content").innerHTML = "";
      return;
    }

    // Remove the active class from the previously active link
    if (activeLink) {
      activeLink.classList.remove("active");
    }

    // Add the active class to the clicked link
    this.classList.add("active");

    // Move the clicked link to the center under the main title
    const linkRect = this.getBoundingClientRect();
    const x = titleRect.left + (titleRect.width / 2);
    const y = titleRect.bottom + 20;
    const dx = x - (linkRect.left + (linkRect.width / 2));
    const dy = y - (linkRect.top + (linkRect.height / 2));

    this.style.top = `${linkRect.top + dy}px`;
    this.style.left = `${linkRect.left + dx}px`;
    this.style.transform = "";

    const mainContent = document.getElementById("main-content");

    // Fade out the existing content
    mainContent.style.opacity = 0;

    // Wait for the animation to complete
    setTimeout(() => {
      // Update content
      mainContent.innerHTML = contentMap[this.getAttribute("data-tab")];

      // Fade in the new content
      mainContent.style.opacity = 1;
    }, 1000); // 1s matches the CSS transition duration
  });
});
