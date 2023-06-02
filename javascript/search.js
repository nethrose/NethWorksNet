// search.js

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

  addSearchEventListener();
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

function displaySearchResults(results, resultsContainer) {
  // Clear any previous results
  resultsContainer.innerHTML = '';

  // Loop through each result and add it to the results container
  results.forEach(result => {
    const resultElement = document.createElement('div');
    resultElement.textContent = `ID: ${result.id}, Title: ${result.title}`;
    resultsContainer.appendChild(resultElement);
  });

  // If there are results, show the results container
  if (results.length > 0) {
    resultsContainer.style.display = 'block';
  } else {
    resultsContainer.style.display = 'none';
  }
}

function addSearchEventListener() {
  // Add an event listener to the search form
  document.getElementById('search-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Get the search term from the input field
    const searchTerm = document.getElementById('search-bar').value;

    // Perform a search with the fetched engine name
    const results = await performSearch(searchTerm);

    // Display the search results
    const resultsContainer = document.getElementById('results-container');
    displaySearchResults(results, resultsContainer);
  });
}
