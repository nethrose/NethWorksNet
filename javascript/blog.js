// blog.js

export async function loadBlogPosts() {
  return new Promise(async (resolve) => {
    const response = await fetch(new URL("blog/posts.json", location.href).href);
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
      const response = await fetch(new URL(`blog/${file}`, location.href).href);
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
  const blogPostsHTML = `
    <div class="content-section rendered-content">
      ${blogPosts}
    </div>
  `;
  return blogPostsHTML;
}
