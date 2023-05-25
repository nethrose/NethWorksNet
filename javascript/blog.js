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

    attachBlogPostClickListeners();  // Attach click listeners after blog posts are added to the DOM
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

function waitForMarked(callback) {
  if (typeof marked === 'function') {
    console.log('Marked is available, invoking callback');
    console.log('Testing marked:', marked('# Hello, world!'));
    callback();
  } else {
    console.log('Marked is not available, retrying in 100ms');
    setTimeout(() => waitForMarked(callback), 100);
  }
}


export async function handleBlogPostClick(event) {
  console.log('Blog post link clicked');
  event.preventDefault();
  const postFileName = event.target.getAttribute("data-post");
  console.log('Clicked post:', postFileName);

  waitForMarked(async () => {
    try {
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
      mainContent.innerHTML = `<div class="rendered-content">${htmlContent}</div>`;

    } catch (error) {
      console.error('Error:', error);
    }
  });
}

export function attachBlogPostClickListeners() {
  const blogPostLinks = document.querySelectorAll(".blog-post-link");
  console.log(`Found ${blogPostLinks.length} blog post links`); 
  blogPostLinks.forEach((link) => {
    console.log(`Attaching event listener to ${link}`); 
    link.addEventListener("click", handleBlogPostClick);
  });
}
