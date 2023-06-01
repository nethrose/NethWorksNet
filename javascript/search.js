// Assuming Elastic App Search client is available globally
let client;
let config;

async function getConfig() {
  const response = await fetch('/.netlify/functions/config');
  return response.json();
}

export async function initSearch(searchKey) {
  // Fetch the engine name
  config = await getConfig();

  // Initialize the Elastic App Search client
  client = ElasticAppSearch.createClient({
    searchKey,
    engineName: config.engineName,
    endpointBase: config.endpointBase
  });
}

export async function performSearch(query) {
  if (!client) {
    await initSearch();
  }

  var options = {
    search_fields: { title: {} },
    result_fields: { id: { raw: {} }, title: { raw: {} } }
  };

  // Perform the search using Elastic App Search JavaScript client
  const response = await client.search(query, options);
  return response.results.map(result => ({ id: result.getRaw("id"), title: result.getRaw("title") }));
}
