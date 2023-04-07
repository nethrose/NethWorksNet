const fs = require("fs");
const path = require("path");

const [_, __, newPost] = process.argv;
const postsJsonPath = path.resolve(__dirname, "./blog/posts.json");

fs.readFile(postsJsonPath, "utf-8", (err, data) => {
  if (err) {
    console.error(`Error reading posts.json: ${err}`);
    process.exit(1);
  }

  const posts = JSON.parse(data);

  const postFilename = path.basename(newPost);
  if (!posts.includes(postFilename)) {
    posts.push(postFilename);
    fs.writeFile(postsJsonPath, JSON.stringify(posts, null, 2), (err) => {
      if (err) {
        console.error(`Error updating posts.json: ${err}`);
        process.exit(1);
      }
      console.log(`Added ${postFilename} to posts.json`);
    });
  } else {
    console.log(`${postFilename} already exists in posts.json`);
  }
});
