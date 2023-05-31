// search.js

let client;

function initSearch(hostIdentifier, searchKey) {
  // Initialize the Elastic App Search client
  client = elasticAppSearch.createClient({
    hostIdentifier,
    searchKey,
  });
}

async function performSearch(engineName, searchTerm) {
  // Perform a search using the Elastic App Search client
  const result = await client.search(engineName, searchTerm);
  return result.results;
}

function displaySearchResults(results, container) {
  // Clear the container
  container.innerHTML = '';

  // Iterate over the results and display them in the container
  for (let result of results) {
    const resultElement = document.createElement('div');
    resultElement.textContent = result.title;
    container.appendChild(resultElement);
  }
}

export { initSearch, performSearch, displaySearchResults };
