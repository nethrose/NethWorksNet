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
  const blogPostsHTML = `
    <div class="content-section rendered-content">
      ${blogPosts}
    </div>
  `;

  return blogPostsHTML;
}


export async function handleBlogPostClick(event) {
  event.preventDefault();
  const postFileName = event.target.getAttribute("data-post");
  console.log('Clicked post:', postFileName);

  const waitForMarked = () => {
    return new Promise((resolve) => {
      const checkMarked = () => {
        if (typeof marked === 'function') {
          resolve();
        } else {
          setTimeout(checkMarked, 100);
        }
      };
      checkMarked();
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

    const mainContent = document.getElementById("main-content");
    mainContent.style.opacity = 0;

    setTimeout(() => {
      mainContent.innerHTML = `<div class="rendered-content">${htmlContent}</div>`;
      mainContent.style.opacity = 1;
    }, 500);

  } catch (error) {
    console.error('Error:', error);
  }
}

export function attachBlogPostClickListeners() {
  const blogPostLinks = document.querySelectorAll(".blog-post-link");
  blogPostLinks.forEach((link) => {
    link.addEventListener("click", handleBlogPostClick);
  });
}
