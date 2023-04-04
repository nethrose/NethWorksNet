const navLinks = document.querySelectorAll(".nav-links li a");

navLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const href = link.getAttribute("href");
    const section = document.querySelector(href);
    const topOffset = header.offsetHeight;
    const elementPosition = section.offsetTop - topOffset;

    window.scrollTo({
      top: elementPosition,
      behavior: "smooth"
    });

    navLinks.forEach(link => link.classList.remove("active"));
    link.classList.add("active");
  });
});

window.addEventListener("scroll", () => {
  const fromTop = window.scrollY + header.offsetHeight;

  navLinks.forEach(link => {
    const section = document.querySelector(link.getAttribute("href"));
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;

    if (fromTop >= sectionTop && fromTop < sectionTop + sectionHeight) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
});
