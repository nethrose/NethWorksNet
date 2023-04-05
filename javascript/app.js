const links = document.querySelectorAll("nav a");
const navBar = document.querySelector(".navbar");
const contentMap = {
  about: `
    <div class="content-section profile-container">
      <div class="github-widget">
        <div class="github-card" data-github="nethrose" data-width="400" data-height="200" data-theme="default"></div>
        <script src="//cdn.jsdelivr.net/github-cards/latest/widget.js"></script>
      </div>
      <div class="linkedin-widget">
        <script type="IN/MemberProfile" data-id="https://www.linkedin.com/in/neth-rose-91463791" data-format="inline" data-related="false"></script>
      </div>
    </div>
    <script src="https://platform.linkedin.com/in.js" type="text/javascript"> lang: en_US</script>
  `,

  blog: `
  <div class="content-section">
    <h2>Blog</h2>
    <p>Content for Blog section goes here.</p>
  </div>`,
  content: `
  <div class="content-section">
    <h2>Content</h2>
    <p>Content for Content section goes here.</p>
  </div>`,
  contact: `
  <div class="content-section">
    <h2>Contact</h2>
    <p>Content for Contact section goes here.</p>
  </div>`,
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
      activeLink.style.opacity = 0.5;

      // Remove the active class from the previously active link
      activeLink.classList.remove("active");
    }

    if (activeLink === this) {
      // If the same link is clicked again, remove the active class
      this.classList.remove("active");
      document.getElementById("main-content").innerHTML = "";
      return;
    }

    // Add the active class to the clicked link
    this.classList.add("active");

    // Move the clicked link to the center under the main title
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

    // Fade out the existing content
    mainContent.style.opacity = 0;

    // Wait for the animation to complete
    setTimeout(() => {
      // Update content
      mainContent.innerHTML = contentMap[this.getAttribute("data-tab")];

      // Fade in the new content
      mainContent.style.opacity = 1;
    }, 500); // 1s matches the CSS transition duration
  });
});
