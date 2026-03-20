window.PFQ_BROWSER_STORAGE = window.PFQ_BROWSER_STORAGE || {};
window.PFQ_INVALID_API_KEY = window.PFQ_INVALID_API_KEY || "PFQ_INVALID_API_KEY";

// Cached state
window.pfqApiKey = window.pfqApiKey ?? null;

PFQ_BROWSER_STORAGE.getApiKey = async function () {
    // console.log("[PFQ IV] Checking cached API key:", window.pfqApiKey);

    // Already known invalid
    if (window.pfqApiKey === window.PFQ_INVALID_API_KEY) return null;

    // Already cached valid key
    if (window.pfqApiKey) return window.pfqApiKey;

    const tempKey = getPFQApiKey('.userscript-api-key');
    // console.log("[PFQ IV] Found API key from userscript:", tempKey);

    if (!tempKey) { // no key found from localstorage - user needs to set up lib-api with api key 
        window.pfqApiKey = window.PFQ_INVALID_API_KEY;
        return null;
    }

    window.pfqApiKey = tempKey;
    return tempKey;
};

/* Finds and returns the PFQ API Key that is already stored by QOL. */
function getPFQApiKey(partialKey) {
    // Iterate over all keys in localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        // Check if the current key includes the partial string
        if (key && key.includes(partialKey)) {
            // If it matches, retrieve the value using getItem()
            const value = localStorage.getItem(key);
            return value;
        }
    }

    return null;
}