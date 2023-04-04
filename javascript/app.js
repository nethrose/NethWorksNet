const navLinks = document.querySelectorAll(".nav-links li a");
const pages = document.querySelectorAll(".page");

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const target = link.getAttribute("data-link");
    pages.forEach((page) => {
      page.classList.remove("active");
      if (page.getAttribute("id") === target) {
        page.classList.add("active");
      }
    });
  });
});
