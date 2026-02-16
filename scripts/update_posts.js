const fs = require('fs');
const path = require('path');
const matter = require('gray-matter'); 

const postsPath = path.join(__dirname, '..', 'blog');
const postsJsonPath = path.join(__dirname, '..', 'blog', 'posts.json');

// Read the existing posts JSON file
const existingPosts = require(postsJsonPath);

// Get the list of HTML files in the /blog folder
const blogFiles = fs.readdirSync(postsPath).filter((file) => file.endsWith('.md'));

const newPosts = blogFiles.map((file) => {
  const postPath = path.join(postsPath, file);
  const content = fs.readFileSync(postPath, 'utf-8');
  const { data } = matter(content);

  // Extract the title from the file (markdown # heading)
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : 'Untitled';

  // Check if the post already exists in the JSON file
  const existingPost = existingPosts.find((post) => post.filename === file);

  return existingPost ? existingPost : { title, filename: file };
});

// Write the new posts JSON file
fs.writeFileSync(postsJsonPath, JSON.stringify(newPosts, null, 2));
