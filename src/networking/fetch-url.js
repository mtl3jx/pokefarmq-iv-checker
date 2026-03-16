window.PFQ_FETCH_URL = window.PFQ_FETCH_URL || {};

PFQ_FETCH_URL.get = async function (path) {
  const url = `${ENV.API_BASE_URL}${path}`;
  return fetchJSON(url);
};

/**
 * @param {*} url endpoint path (ex. /pokemon/iv)
 * @param {*} options 
 * @returns 
 */
async function fetchJSON(url, options = {}) {
  // console.log(`[PFQ IV] fetchJSON:`, url);

  const apiKey = PFQ_BROWSER_STORAGE.getApiKey();
  if (!apiKey) {
    console.error("[PFQ IV] pfq-api-key not set in browser storage");
    return null;
  }

  const response = await fetch(url, {
    options: options,
    headers: {
      'x-api-key': apiKey,
    }
  });

  if (!response.ok) {
    // console.log(`[PFQ IV] Request failed: ${response.status} ${url}`, response.error);
    return null;
  }

  return response.json();
}
