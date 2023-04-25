// blog.js

import { updateMainContent } from './app.js';

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
  const blogContentHTML = `
    <div class="content-section rendered-content">
      <h2>Blog</h2>
      <div id="blog-posts">
        ${blogPosts}
      </div>
      <div id="blog-post-content"></div>
    </div>`;

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = blogContentHTML;
  return tempDiv.firstElementChild; // Return the first child element instead of the HTML string
};

export async function handleBlogPostClick(event) {
  event.preventDefault();
  const postFileName = event.target.getAttribute("data-post");
  console.log('Clicked post:', postFileName);

  const waitForMarked = () => {
    return new Promise((resolve) => {
      if (typeof marked === 'function') {
        resolve();
      } else {
        setTimeout(() => waitForMarked().then(resolve), 100);
      }
    });
  };

  try {
    await waitForMarked();
    const response = await fetch(`/blog/${postFileName}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const content = await response.text();
    console.log('Fetched content:', content);
    const htmlContent = marked(content);
    console.log('HTML content:', htmlContent);
    const blogPostContent = document.getElementById("blog-post-content");
    blogPostContent.innerHTML = htmlContent;

    // Scroll to the blog post content
    blogPostContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (error) {
    console.error('Error:', error);
  }
}

