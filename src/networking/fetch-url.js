window.PFQ_FETCH_URL = window.PFQ_FETCH_URL || {};

PFQ_FETCH_URL.get = async function (path, options = {}) {
  const url = `${ENV.API_BASE_URL}${path}`;
  return fetchJSON(url, options);
};

async function fetchJSON(url, options = {}) {
  // console.log(`[PFQ IV] fetchJSON:`, url);

  const apiKey = await PFQ_BROWSER_STORAGE.getApiKey();
  if (apiKey == null) {
    // console.log("[PFQ IV] pfq-api-key not set in browser storage");
    return null;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        "x-api-key": apiKey,
      },
    });

    // 🔥 First 403 disables all future requests
    if (response.status === 403) {
      console.warn("[PFQ IV] API key invalidated (403). Disabling all future requests.");
      window.pfqApiKey = window.PFQ_INVALID_API_KEY;
      return null;
    } else if (!response.ok) {
      console.error(`[PFQ IV] Request failed: ${response.status} ${url}`, response.error);
      return null;
    }

    return await response.json();
  } catch (err) {
    console.error("[PFQ IV] fetch error:", err);
    return null;
  }
}
