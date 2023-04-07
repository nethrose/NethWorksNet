const fs = require('fs');
const path = require('path');

const postsPath = path.join(__dirname, '..', 'blog');
const postsJsonPath = path.join(__dirname, '..', 'posts.json');

// Read the existing posts JSON file
const existingPosts = require(postsJsonPath);

// Get the list of HTML files in the /blog folder
const blogFiles = fs.readdirSync(postsPath).filter((file) => file.endsWith('.html'));

const newPosts = blogFiles.map((file) => {
  const postPath = path.join(postsPath, file);
  const content = fs.readFileSync(postPath, 'utf-8');

  // Extract the title from the file
  const titleMatch = content.match(/<h1>(.*?)<\/h1>/);
  const title = titleMatch ? titleMatch[1] : 'Untitled';

  // Check if the post already exists in the JSON file
  const existingPost = existingPosts.find((post) => post.filename === file);

  return existingPost ? existingPost : { title, filename: file };
});

// Write the new posts JSON file
fs.writeFileSync(postsJsonPath, JSON.stringify(newPosts, null, 2));
