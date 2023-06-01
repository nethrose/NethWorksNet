// ./netlify/functions/config.js

exports.handler = async () => {
  const { ELASTIC_SEARCH_KEY, ELASTIC_ENGINE_NAME, ELASTIC_ENDPOINT_BASE } = process.env;

  const response = {
    engineName: ELASTIC_ENGINE_NAME,
    endpointBase: ELASTIC_ENDPOINT_BASE 
  };

  if (ELASTIC_SEARCH_KEY) {
    response.searchKey = ELASTIC_SEARCH_KEY;
  }

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};
