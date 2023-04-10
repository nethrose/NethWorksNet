// blog.js

export async function loadBlogPosts() {
  return new Promise(async (resolve) => {
    const response = await fetch("/blog/posts.json");
    const blogPostFiles = await response.json();
    const mdBlogPostFiles = blogPostFiles.filter(fileObj => fileObj.filename.endsWith('.md'));

    mdBlogPostFiles.sort((a, b) => {
      const dateA = a.filename.split("-").splice(0, 3).join("-");
      const dateB = b.filename.split("-").splice(0, 3).join("-");
      return new Date(dateB) - new Date(dateA);
    });

    let blogPosts = '';

    for (const fileObj of mdBlogPostFiles) {
      const file = fileObj.filename;
      const response = await fetch(`/blog/${file}`);
      const content = await response.text();
      const titleMatch = content.match(/^#\s+(.+)$/m);
      if (titleMatch) {
        const title = titleMatch[1];
        blogPosts += `<a href="#" class="blog-post-link" data-post="${file}">${title}</a><br>`;
      }
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
  const postFileName = event.currentTarget.getAttribute("data-post");

  const waitForMarked = (callback) => {
    if (typeof marked === 'function') {
      callback();
    } else {
      setTimeout(() => waitForMarked(callback), 100);
    }
  };

  waitForMarked(async () => {
    const response = await fetch(`/blog/${postFileName}`);
    const content = await response.text();
    const htmlContent = marked(content);
    document.getElementById("blog-post-content").innerHTML = htmlContent;
  });
}
