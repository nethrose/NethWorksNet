// ./netlify/functions/config.js

exports.handler = async () => {
  const { ELASTIC_SEARCH_KEY, ELASTIC_ENGINE_NAME } = process.env;

  const response = {
    engineName: ELASTIC_ENGINE_NAME,
  };

  if (SEARCH_KEY) {
    response.searchKey = ELASTIC_SEARCH_KEY;
  }

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};
