// Assuming Elastic App Search client is available globally
let client;
let config;

async function getConfig() {
  const response = await fetch('/.netlify/functions/config');
  return response.json();
}

async function initSearch() {
  // Fetch the search key, and engine name
  config = await getConfig();

  // Initialize the Elastic App Search client
  client = window.ElasticAppSearch.createClient(config);
}

async function performSearch(query, options) {
  if (!client) {
    await initSearch();
  }

  // Perform the search using Elastic App Search JavaScript client
  return client
    .search(query, options)
    .then((resultList) => {
      // Process the search results
      resultList.results.forEach((result) => {
        console.log(`id: ${result.getRaw('id')} raw: ${result.getRaw('title')}`);
      });
    })
    .catch((error) => {
      console.error(`Error performing search: ${error}`);
    });
}
