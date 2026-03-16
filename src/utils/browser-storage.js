window.PFQ_BROWSER_STORAGE = window.PFQ_BROWSER_STORAGE || {};

pfqApiKey = null

PFQ_BROWSER_STORAGE.getApiKey = function () {
    if (pfqApiKey == null) {
        pfqApiKey = getStorageKey('pfq-api-key')
        console.log("[PFQ IV] PFQ API key:", pfqApiKey);
    }
    return pfqApiKey;
};

function getStorageKey(key) {
    // TODO: ensure this compatibility with multiple browsers
    if (typeof localStorage !== "undefined") {
        return localStorage.getItem(key);
    }
    console.error("[PFQ IV] localStorage not compatible on this browser... cannot get pfq-api-key");
    return null;
}

function setStorageKey(key, value) {
    let storageAPI = null;

    if (typeof chrome !== "undefined" && chrome?.storage?.local) {
        storageAPI = chrome.storage;
    } else if (typeof browser !== "undefined" && browser?.storage?.local) {
        storageAPI = browser.storage;
    } else {
        throw new Error("No compatible storage API found");
    }

    const data = {};
    data[key] = value;

    return new Promise((resolve, reject) => {
        if (storageAPI.set.length === 2) {
            storageAPI.local.set(data, () => {
                if (chrome.runtime?.lastError) return reject(chrome.runtime.lastError);
                resolve();
            });
        } else {
            storageAPI.local.set(data).then(() => resolve()).catch(reject);
        }
    });
}
