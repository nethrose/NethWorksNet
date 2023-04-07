// blog.js
export async function loadBlogPosts() {
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

export const blogContent = async () => {
  const blogPosts = await loadBlogPosts();
  return `
    <div class="content-section rendered-content">
      <h2>Blog</h2>
      <div id="blog-posts">
        ${blogPosts}
      </div>
      <div id="blog-post-content"></div>
    </div>`;
};

export async function handleBlogPostClick(event) {
  event.preventDefault();
  const postFileName = event.target.getAttribute("data-post");
  const response = await fetch(`/blog/${postFileName}`);
  const content = await response.text();
  document.getElementById("blog-post-content").innerHTML = content;
}