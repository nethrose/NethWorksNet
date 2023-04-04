const links = document.querySelectorAll("nav a");

links.forEach(function (link) {
  link.addEventListener("click", function (event) {
    event.preventDefault();
    const contentId = this.getAttribute("data-content");
    const content = document.getElementById(contentId);

    document.querySelectorAll(".content").forEach(function (c) {
      c.style.display = "none";
    });

    content.style.display = "block";
  });
});
