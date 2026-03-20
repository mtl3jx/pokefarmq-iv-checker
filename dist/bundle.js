
/* ===== styles.css ===== */
(function(){
  if (document.querySelector('style[data-pfq-iv]')) return;

  const css = "/* applied to all IV blocks*/\ndiv.pfq-iv-block {\n  white-space: nowrap;\n}\n\n/* Circular count badges – shared (tooltip + overlay) */\n.pfq-iv-block .pfq-iv-badge,\n.pfq-iv-overlay .iv-zero-count,\n.pfq-iv-overlay .iv-perfect-count {\n  align-items: center;\n  justify-content: center;\n  width: 15px;\n  height: 15px;\n  font-size: 10px;\n  font-weight: bold;\n  color: #fff;\n  border-radius: 50%;\n  outline: thin solid black;\n}\n\n.pfq-iv-block .pfq-iv-badge {\n  display: inline-flex;\n  vertical-align: middle;\n}\n\n.pfq-iv-block .pfq-iv-badge-zero {\n  background: #e53935;\n}\n\n-iv-badge-perfect {\n  background: #2e7d32;\n}\n\n/* add glow around perfect and nundo badges */\n.pfq-iv-block .pfq-iv-badge.pfq-iv-badge-six,\n.pfq-iv-overlay .iv-zero-count.pfq-iv-badge-six,\n.pfq-iv-overlay .iv-perfect-count.pfq-iv-badge-six {\n  box-shadow: 0 0 10px 4px rgba(255, 255, 255, 0.9);\n}\n\n/* Badge row keeps red and green badges from overlapping on narrow sprites */\n.pfq-iv-overlay .iv-overlay-badge-row {\n  position: absolute;\n  top: 2px;\n  left: 2px;\n  right: 2px;\n  display: flex;\n  flex-direction: row;\n  align-items: flex-start;\n  min-width: 0;\n}\n\n.pfq-iv-overlay .iv-overlay-badge-row .iv-zero-count,\n.pfq-iv-overlay .iv-overlay-badge-row .iv-perfect-count {\n  position: static;\n  left: auto;\n  right: auto;\n  flex-shrink: 0;\n  display: flex;\n}\n\n.pfq-iv-overlay .iv-zero-count {\n  background: #e53935;\n}\n\n.pfq-iv-overlay .iv-perfect-count {\n  background: #2e7d32;\n  margin-left: auto;\n}\n\n/* applied to fields */\ndiv.tooltip_content div.pfq-iv-block {\n  margin-top: 6px;\n  padding-top: 5px;\n  border-top: 1px solid rgba(255, 255, 255, 0.25);\n  font-size: 10pt;\n}\n\n/* applied to party / user profiles */\ndiv.party div.pfq-iv-block {\n  text-align: right;\n  font-size: 8pt;\n  padding-bottom: 6px;\n}\n\n/* bold and underline for perfect and zero */\n.pfq-zero,\n.pfq-perfect {\n  font-weight: bold;\n  text-decoration: underline;\n}\n\n/* red for zero (works on light & dark) */\n.pfq-zero {\n  color: #e53935;\n  /* slightly darker, higher contrast red */\n}\n\n/* green for perfect (works on light & dark) */\n.pfq-perfect {\n  color: #66bb6a;\n  /* bright enough for dark backgrounds, still clear on light */\n}\n\n/* DESKTOP */\n@media only screen and (min-width: 768px) {\n\n  /* shelter QOL */\n  div.qolpokemongrid>.pfq-iv-overlay {\n    position: relative;\n    width: 99px;\n    height: 70px;\n  }\n\n  /* ensure pkmn sprite stays centered and iv overlay stacks on top*/\n  .pkmn-sprite {\n    display: grid !important;\n    justify-items: center;\n    align-items: center;\n  }\n}\n\n\n/* shelter pokemon sprite */\ndiv.pkmn-sprite.qolpokemongrid {\n  display: inline-grid !important;\n}\n\n/* stack pokemon sprite and iv overlay in same cell */\n.pkmn-sprite>* {\n  grid-area: 1 / 1;\n}\n\n/* Container overlay for each Pokémon sprite */\n.pfq-iv-overlay {\n  top: 0;\n  right: 0;\n  pointer-events: none;\n  /* Allow clicks through overlay */\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n}\n\n/* other users' fields with QOL\nAND shelter QOL for mobile */\nspan.qolGridPokeSize>.pfq-iv-overlay,\ndiv.qolpokemongrid>.pfq-iv-overlay {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n\n/* random positions in fields */\nspan.pkmn-sprite:not(.qolGridPokeSize)>.pfq-iv-overlay {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n}\n\n/* IV bars container at the bottom */\n.pfq-iv-overlay .iv-bar-container {\n  position: absolute;\n  bottom: 2px;\n  left: 2px;\n  right: 2px;\n  height: 6px;\n  display: flex;\n  align-items: flex-end;\n  gap: 1px;\n}\n\n/* Individual IV bar - height set inline from IV value (31 = full) */\n.pfq-iv-overlay .iv-bar {\n  flex: 1;\n  min-height: 2px;\n  border-radius: 1px;\n  background: currentColor;\n  /* default to text color */\n  opacity: 0.6;\n  transition: background 0.2s ease-in-out, opacity 0.2s ease-in-out;\n}\n\n/* Red bar for 0 IVs */\n.pfq-iv-overlay .iv-bar.pfq-zero {\n  background: #e53935;\n  opacity: 0.85;\n}\n\n/* Green bar for 31 IVs */\n.pfq-iv-overlay .iv-bar.pfq-perfect {\n  background: #66bb6a;\n  opacity: 0.9;\n}";
  const style = document.createElement("style");
  style.setAttribute("data-pfq-iv","true");
  style.textContent = css;

  (document.head || document.documentElement || document.body).appendChild(style);
})();

/* ===== config/env.js ===== */
const ENV = {
  API_BASE_URL: "https://api.pokefarm.com/v1"
};

/* ===== utils/array-utils.js ===== */
window.PFQ_ARRAY_UTILS = window.PFQ_ARRAY_UTILS || {};

/**
 * Returns the sum of all the numbers in the array.
 * @param {number[]} numbers
 */
PFQ_ARRAY_UTILS.sum = function(numbers) {
    return numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
};

/* ===== utils/browser-storage.js ===== */
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


/* ===== utils/html-generator.js ===== */
window.PFQ_HTML_GENERATOR = window.PFQ_HTML_GENERATOR || {};

/** White symbol shown when count is 6: check for perfect (31s), X for zero (0s). */
const BADGE_SIX_SYMBOL = { perfect: "✓", zero: "✕" };

/**
 * Injects an IV overlay on top of a field Pokémon sprite (data-id on the span).
 * @param {HTMLElement} fieldmonSpan - The span element representing the field Pokémon.
 * @returns {Promise<void>} Resolves when the overlay has been injected or skipped.
 */
PFQ_HTML_GENERATOR.injectIVOverlay = async function (fieldmonSpan) {
    const pokemonId = fieldmonSpan.getAttribute("data-id");
    if (!pokemonId) return; // no pokemonId found
    return PFQ_HTML_GENERATOR.injectIVOverlayOnSprite(fieldmonSpan, pokemonId);
};

/**
 * Generates the IV row UI for tooltips (field/party hover).
 * @param {number[] | null} ivs - Full IV array including total at index 6. Null for eggs.
 * @returns {HTMLDivElement | undefined}
 */
PFQ_HTML_GENERATOR.generateIVTooltip = function (ivs) {
    if (ivs == null) {
        // console.log("[PFQ IV] This is an egg, skipping IV row generation.");
        return; // likely an egg, if IVs are missing
    }

    const ivParts = getIVParts(ivs);
    const total = ivs[6];
    const { num0, num31 } = getIVCounts(ivParts);

    const ivRow = document.createElement("div");
    ivRow.className = "pfq-iv-block";

    const label = document.createElement("b");
    label.textContent = "IVs: ";
    ivRow.appendChild(label);

    ivParts.forEach((val, index) => {
        const span = document.createElement("span");
        span.textContent = val;
        span.className = getIVClass(val);
        ivRow.appendChild(span);
        if (index < ivParts.length - 1) ivRow.appendChild(document.createTextNode("/"));
    });

    // console.log("[PFQ IV] generateIVTooltip: ivRow -", ivRow);

    ivRow.appendChild(document.createTextNode("=" + total));
    appendTooltipBadgeIfAny(ivRow, num0, "zero");
    appendTooltipBadgeIfAny(ivRow, num31, "perfect");

    return ivRow;
};

/**
 * Injects an IV overlay on top of a field party slot's Pokémon sprite (fields page).
 * @param {HTMLElement} slot - The div.slot.plateform element with data-id.
 * @returns {Promise<void>} Resolves when the overlay has been injected or skipped.
 */
PFQ_HTML_GENERATOR.injectPartySlotIVOverlay = async function (slot) {
    const pokemonId = slot.getAttribute("data-id");
    if (!pokemonId || pokemonId === "hello") return; // not a real pokemon

    const sprite = slot.querySelector("div.big.egg");
    if (sprite != null) return; // egg

    const desktopSprite = slot.querySelector("div.big.pokemon"); // desktop
    const mobileSprite = slot.querySelector("div.small"); // mobile
    if (desktopSprite == null && mobileSprite == null) return; // empty slot

    if (desktopSprite.checkVisibility()) {
        return PFQ_HTML_GENERATOR.injectIVOverlayOnSprite(desktopSprite, pokemonId)
    } else if (mobileSprite.checkVisibility()) {
        return PFQ_HTML_GENERATOR.injectIVOverlayOnSprite(mobileSprite, pokemonId)
    } else {
        return; // error - not possible?
    }
};

/**
 * Injects an IV overlay on top of a sprite element when the Pokémon ID is known.
 * Used by field (span.fieldmon) and shelter (div.pokemon) overlays.
 * @param {HTMLElement} spriteElement - The sprite element to attach the overlay to.
 * @param {string} pokemonId - The Pokémon ID (e.g. from data-id or data-adopt).
 * @returns {Promise<void>} Resolves when the overlay has been injected or skipped.
 */
PFQ_HTML_GENERATOR.injectIVOverlayOnSprite = async function (spriteElement, pokemonId) {
    const existing = spriteElement.querySelector(".pfq-iv-overlay");
    if (existing) return; // overlay already present, skip

    // console.log("[PFQ IV] injectIVOverlayOnSprite:", pokemonId);
    const ivs = await PFQ_REPOSITORY.fetchIVs(pokemonId);
    spriteElement.classList.add("pkmn-sprite");
    const overlay = generateIVOverlay(ivs);
    if (overlay) spriteElement.appendChild(overlay);
};


/**
 * Appends an IV tooltip block to the tooltip for the given trigger, if not already present.
 * Safely no-ops if IV data or tooltip cannot be found.
 * @param {Element} trigger - The hovered element that owns the tooltip.
 * @param {number[] | null} ivs - Full IV array including total at index 6.
 */
PFQ_HTML_GENERATOR.appendIVTooltipIfMissing = function (trigger, ivs) {
    if (!ivs) return; // no IV data available to display

    const tip = getTooltip(trigger);
    if (!tip) return; // tooltip not available

    if (tip.querySelector(".pfq-iv-block")) return; // skip, already done

    // console.log("[PFQ IV] appendIVTooltipIfMissing: ivs -", ivs);

    tip.appendChild(PFQ_HTML_GENERATOR.generateIVTooltip(ivs));
};

/**
 * Waits until a tooltip element for a field Pokémon exists in the DOM.
 * @returns {Promise<HTMLElement>} Resolves with the tooltip element once it is available.
 */
PFQ_HTML_GENERATOR.waitForTooltip = function () {
    return new Promise((resolve) => {
        const existing = document.querySelector("div.field .tooltip_content");
        if (existing) return resolve(existing);
        const observer = new MutationObserver(() => {
            const tooltip = document.querySelector(".tooltip_content");
            if (tooltip) {
                observer.disconnect();
                resolve(tooltip);
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
};

/**
 * Returns the first 6 IV values (HP, Atk, Def, SpA, SpD, Spe) from a full IV array.
 * @param {number[] | null | undefined} ivs - Full IV array including total at index 6.
 * @returns {number[] | null} Slice of the first 6 IVs, or null when no IVs are provided.
 */
function getIVParts(ivs) {
    return ivs ? ivs.slice(0, 6) : null;
}

/**
 * Returns counts of 0 and 31 IVs from the 6 IV values.
 * @param {number[] | null} ivParts - Array of 6 IV values.
 * @returns {{ num0: number, num31: number }}
 */
function getIVCounts(ivParts) {
    if (!ivParts) return { num0: 0, num31: 0 };
    return {
        num0: ivParts.filter((v) => v === 0).length,
        num31: ivParts.filter((v) => v === 31).length,
    };
}

/**
 * Creates a count badge element (circle with number).
 * @param {number} count - Number to display.
 * @param {'zero' | 'perfect'} type - Zero (red) or perfect (green).
 * @param {'overlay' | 'tooltip'} context - Overlay uses positioned divs, tooltip uses inline spans.
 * @returns {HTMLElement}
 */
function createCountBadge(count, type, context) {
    const el = document.createElement(context === "overlay" ? "div" : "span");
    const isSix = count === 6;
    el.textContent = isSix ? BADGE_SIX_SYMBOL[type] : String(count);
    if (context === "overlay") {
        el.className = type === "zero" ? "iv-zero-count" : "iv-perfect-count";
    } else {
        el.className = type === "zero" ? "pfq-iv-badge pfq-iv-badge-zero" : "pfq-iv-badge pfq-iv-badge-perfect";
    }
    if (isSix) el.classList.add("pfq-iv-badge-six");
    return el;
}

/**
 * Generates a visual IV overlay element for a Pokémon.
 * @param {number[] | null} ivs - Array of IVs for the Pokémon, or null if not available.
 * @returns {HTMLElement | null} A div containing the IV overlay, or null when no overlay should be shown.
 */
function generateIVOverlay(ivs) {
    if (!ivs) return null;

    const ivParts = getIVParts(ivs);
    if (!ivParts) return null;
    const { num0, num31 } = getIVCounts(ivParts);

    // console.log("[PFQ IV] generateIVOverlay:", ivs);

    // Overlay container
    const overlay = document.createElement("div");
    overlay.className = "pfq-iv-overlay";

    const hasZero = num0 > 0;
    const hasPerfect = num31 > 0;
    if (hasZero || hasPerfect) {
        const badgeRow = document.createElement("div");
        badgeRow.className = "iv-overlay-badge-row";
        if (hasZero) badgeRow.appendChild(createCountBadge(num0, "zero", "overlay"));
        if (hasPerfect) badgeRow.appendChild(createCountBadge(num31, "perfect", "overlay"));
        overlay.appendChild(badgeRow);
    }

    const barContainer = document.createElement("div");
    barContainer.className = "iv-bar-container";
    ivParts.forEach((val) => barContainer.appendChild(createIVBar(val)));
    overlay.appendChild(barContainer);

    // console.log("[PFQ IV] generateIVOverlay: overlay -", overlay);

    return overlay;
}

/**
 * Appends a space and count badge to the tooltip row when count > 0.
 * @param {HTMLElement} row - The IV row element.
 * @param {number} count - Badge count (0 or 31 IVs).
 * @param {'zero' | 'perfect'} type - Badge type.
 */
function appendTooltipBadgeIfAny(row, count, type) {
    if (count <= 0) return;
    row.appendChild(document.createTextNode(" "));
    row.appendChild(createCountBadge(count, type, "tooltip"));
}

/**
 * Finds the tooltip element associated with the given trigger element.
 * @param {Element} trigger - The element that triggers the tooltip.
 * @returns {HTMLElement | null} The tooltip element, or null if not found.
 */
function getTooltip(trigger) {
    let el = trigger.nextElementSibling;
    while (el && !(el.classList && el.classList.contains("tooltip_content"))) {
        el = el.nextElementSibling;
    }
    if (el && el.classList.contains("tooltip_content")) return el;
    return null;
}

/**
 * Creates a single IV bar element (height proportional to IV value).
 * @param {number} val - IV value (0–31).
 * @returns {HTMLElement}
 */
function createIVBar(val) {
    const bar = document.createElement("div");
    bar.className = "iv-bar";
    bar.classList.add(getIVClass(val));
    bar.style.height = `${Math.round((val / 31) * 100)}%`;
    return bar;
}

/**
 * @param {number} value
 * @returns {string} CSS class for the IV value.
 */
function getIVClass(value) {
    if (value === 31) return "pfq-perfect";
    if (value === 0) return "pfq-zero";
    if (value >= 26) return "pfq-high";
    if (value <= 5) return "pfq-low";
    return "pfq-mid";
}

/* ===== networking/fetch-url.js ===== */
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


/* ===== networking/pfq-service.js ===== */
window.PFQ_SERVICE = window.PFQ_SERVICE || {};

PFQ_SERVICE.getPokemonIVs = async function (pokemonId) {
    // console.log("[PFQ IV] Fetching IVs for Pokémon:", pokemonId);
    return PFQ_FETCH_URL.get(`/pokemon/iv?shortlink=${pokemonId}`);
};


/* ===== data/repository.js ===== */
window.PFQ_REPOSITORY = window.PFQ_REPOSITORY || {};

const PFQ_POKEMON_ID_KEY_PREFIX = "pfq-pokemon-id";

/**
 * IV cache using sessionStorage.
 */
const ivCache = {
    /**
     * Retrieves cached IVs for a given Pokémon ID.
     * @param {string} pokemonId - The Pokémon ID.
     * @returns {number[] | null} The cached IV array, or null if not present.
     */
    get: (pokemonId) => {
        const data = sessionStorage.getItem(getCacheKey(pokemonId));
        return data ? JSON.parse(data) : null;
    },
    /**
     * Stores IVs in the cache for a given Pokémon ID.
     * @param {string} pokemonId - The Pokémon ID.
     * @param {number[] | null} ivs - The IV array to cache, or null for eggs/unknown.
     * @returns {void}
     */
    set: (pokemonId, ivs) => {
        sessionStorage.setItem(getCacheKey(pokemonId), JSON.stringify(ivs));
    }
};

/**
 * Fetches IVs from the summary page for a given Pokémon.
 * @param {string} url - The summary URL for the Pokémon.
 * @returns {Promise<number[]>} Array of IV values.
 */
PFQ_REPOSITORY.fetchIVs = async function (pokemonId) {
    const existing = ivCache.get(pokemonId);
    if (existing != null) {
        // console.log("[PFQ IV] Using cached IVs for Pokémon:", pokemonId, ivCache.get(pokemonId));
        return existing;
    }

    try {
        const response = await PFQ_SERVICE.getPokemonIVs(pokemonId);
        // console.log(`[PFQ IV] fetchIVs: response`, response);
        const ivList = response?.iv;
        if (ivList == null) return; // network request failed

        ivList.push(PFQ_ARRAY_UTILS.sum(ivList)); // add total to end of array at index 6
        ivCache.set(pokemonId, ivList); // save IVs to cache
        return ivList;
    } catch (e) {
        console.warn("[PFQ IV] IV fetch failed for Pokémon ID:", pokemonId, e);
        return null;
    }
};

/**
 * Generates a cache key for the given Pokémon ID.
 * @param {string} pokemonId - The Pokémon ID. (ex. J6QPB6)
 * @returns {string} - The generated cache key. (ex. pfq-pokemon-id-J6QPB6)
 */
function getCacheKey(pokemonId) {
    return PFQ_POKEMON_ID_KEY_PREFIX + pokemonId;
}


/* ===== content.js ===== */
/**
 * Entry point for the PFQ IV Checker content script.
 * Sets up page detection, prefetching, overlays, and hover handlers.
 */
(function () {
  if (window.location.hostname !== "pokefarm.com") {
    console.log("[PFQ IV] Not on pokefarm.com, script will not run.");
    return;
  }

  const { isField, isParty, isTrade, isShelter } = getPageContext(window.location.pathname);
  if (!isField && !isParty && !isTrade && !isShelter) {
    console.log("[PFQ IV] Not on a Field, Party, User, Trade, or Shelter page, script will not run.");
    return;
  }

  console.log("[PFQ IV] Extension Detected");
  setTimeout(() => init(), 500);

  // ---------------- INIT ----------------

  /**
   * Initializes the extension based on the current page: prefetches IVs and sets up event listeners.
   */
  function init() {
    if (isParty) {
      getPartyIVs();
    }
    if (isField) {
      prefetchFieldPartyPokemon();
      setupFieldPartyHover();
      setupFieldPartyOverlay();
      prefetchAllFieldPokemon();
      setupFieldOverlay();
      setupFieldHover();
    }
    if (isTrade) {
      setupTradeSelectionOverlay();
      injectTradeCollectionIVs();
    }
    if (isShelter) {
      setupShelterOverlay();
    }
    injectNetworkInterceptor();
    injectNetworkListener();
  }

  /**
   *  Injects a Network Interceptor to detect any native REST calls made by PFQ.
   */
  function injectNetworkInterceptor() {
    const script = document.createElement("script");

    script.src = chrome.runtime.getURL("network-interceptor.js");

    script.onload = () => {
      console.log("[PFQ IV] injectNetworkInterceptor()");
      script.remove();
    };

    (document.head || document.documentElement).appendChild(script);
  }

  /**
   * Observes when a certain REST network call is made (ex. user changed fields),
   * and run some custom logic. Currently supported on user pages, fields, and trade center.
   */
  function injectNetworkListener() {
    window.addEventListener("message", (event) => {
      if (event.source !== window) return;

      if (event.data?.type === "NETWORK_RESPONSE") {
        // console.log("[PFQ IV] injectNetworkListener:", event);
        const { url, body } = event.data.payload;
        if (isField && url.includes("/fields/field")) {
          const data = JSON.parse(body);
          // console.log("[PFQ IV] Field selection on Fields detected...:", data);
          setupFieldOverlay();

        } else if (isShelter && url.includes("/shelter/load")) {
          const data = JSON.parse(body);
          console.log("[PFQ IV] Reload page in Shelter detected...:", data);
          // TODO: fetch shelter IVs on reload

        } else if (isTrade && url.includes("/fields/pkmnlist")) {
          const data = JSON.parse(body);
          // console.log("[PFQ IV] Field selection in Trade Center detected...:", data);
          setupFieldOverlay();
        }
        else if (isParty && url.includes("/users/load")) {
          const data = JSON.parse(body);
          // console.log("[PFQ IV] New user party detected...:", data);
          getPartyIVs();

        }
      }
    });
  }

  // ---------------- PARTY WIDE / INJECTION ----------------

  /**
   * Injects IV rows for all Pokémon in the party (party/user page).
   */
  async function getPartyIVs() {
    const party = document.querySelectorAll("div.party.wide > div[data-pid]");
    for (const slot of party) {
      if (slot.querySelector(".pfq-iv-block")) continue; // already shown
      if (slot.querySelector('div.name a.summarylink').innerText.includes('Egg')) continue; // this is an egg

      const pokemonId = slot.getAttribute("data-pid");
      if (!isValidPokemonId(pokemonId)) continue;

      const ivs = await PFQ_REPOSITORY.fetchIVs(pokemonId);
      const ivDiv = PFQ_HTML_GENERATOR.generateIVTooltip(ivs);
      if (ivDiv != null) {
        slot.querySelector("div.action").prepend(ivDiv);
      }
    }
  }

  // ---------------- FIELD / PARTY HOVER LOGIC ----------------

  /**
   * Fetches IVs for the given trigger and appends the IV tooltip block when the tooltip is available.
   * @param {Element} trigger - The hovered element that owns the tooltip.
   * @param {string} pokemonId - The Pokémon ID (e.g. from data-id).
   */
  function fetchAndAppendIVTooltip(trigger, pokemonId) {
    PFQ_REPOSITORY.fetchIVs(pokemonId).then((ivs) => {
      PFQ_HTML_GENERATOR.waitForTooltip().then(() => PFQ_HTML_GENERATOR.appendIVTooltipIfMissing(trigger, ivs));
    });
  }

  /**
   * Registers a mouseover listener that injects IVs into the tooltip when the user hovers over a matching trigger.
   * @param {string} triggerSelector - Selector for the trigger element (e.g. "span.fieldmon").
   * @param {function(Element): string} getPokemonId - Function that returns the Pokémon ID from the trigger (e.g. data-id).
   * @param {function(Element): void} [onBeforeFetch] - Optional callback run before fetching (e.g. inject overlay).
   */
  function setupTooltipHover(triggerSelector, getPokemonId, onBeforeFetch) {
    document.addEventListener("mouseover", (event) => {
      const trigger = event.target.closest(triggerSelector);
      if (!trigger) return;

      const pokemonId = getPokemonId(trigger);
      if (!isValidPokemonId(pokemonId)) return;

      if (onBeforeFetch) onBeforeFetch(trigger);
      fetchAndAppendIVTooltip(trigger, pokemonId);
    });
  }

  /**
   * Detects hover over a field Pokémon: adds sprite overlay and injects IVs into the tooltip.
   */
  function setupFieldHover() {
    setupTooltipHover(
      "span.fieldmon",
      (trigger) => trigger.getAttribute("data-id"),
      (trigger) => PFQ_HTML_GENERATOR.injectIVOverlay(trigger),
    );
  }

  /**
   * Detects hover over a party slot on the fields page and injects IVs into the tooltip.
   */
  function setupFieldPartyHover() {
    setupTooltipHover("div.slot.plateform", (trigger) => trigger.getAttribute("data-id"));
  }

  // ---------------- FIELD OVERLAY LOGIC ----------------

  /**
   * Adds IV overlays to party Pokémon icons on the fields page.
   */
  function setupFieldPartyOverlay() {
    const partySlots = document.querySelectorAll(
      "#field_party div.slot.plateform[data-id]",
    );
    partySlots.forEach((slot) => {
      PFQ_HTML_GENERATOR.injectPartySlotIVOverlay(slot);
    });
  }

  /**
   * Adds IV overlays to all Pokémon currently visible in the field.
   */
  function setupFieldOverlay() {
    const fieldPokemon = document.querySelectorAll('div.field span.fieldmon');
    fieldPokemon.forEach((pokemon) => PFQ_HTML_GENERATOR.injectIVOverlay(pokemon));
  }

  // ---------------- SHELTER OVERLAY ----------------

  /**
   * Adds IV overlays to all shelter Pokémon sprites on page load.
   */
  function setupShelterOverlay() {
    const sprites = document.querySelectorAll("div#shelter div.pokemon");
    sprites.forEach((sprite) => {
      if (sprite.getAttribute("data-stage").includes('egg')) return; // skip eggs
      const tooltip = sprite.nextElementSibling;
      if (!tooltip?.classList.contains("tooltip_content")) return;
      const pokemonId = tooltip.getAttribute("data-adopt");
      if (isValidPokemonId(pokemonId)) PFQ_HTML_GENERATOR.injectIVOverlayOnSprite(sprite, pokemonId);
    });
  }

  // ---------------- TRADE COLLECTION IV INJECTION ----------------

  /**
 * Adds IV overlays to Pokemon sprites when selecting what to trade.
 */
  function setupTradeSelectionOverlay() {
    const sprites = document.querySelectorAll("div.field span.fieldmon");
    sprites.forEach((sprite) => {
      const tooltip = sprite.nextElementSibling;
      if (!tooltip?.classList.contains("tooltip_content")) return;
      const pokemonId = tooltip.getAttribute("data-id");
      if (isValidPokemonId(pokemonId)) PFQ_HTML_GENERATOR.injectIVOverlayOnSprite(sprite, pokemonId);
    });
  }

  /**
   * On trade page load: finds each .fieldmontip, fetches IVs from the summary URL,
   * and appends the IV row as the last child of the tooltip.
   */
  async function injectTradeCollectionIVs() {
    const pkmns = document.querySelectorAll(".fieldmontip");
    for (const pokemon of pkmns) {
      if (pokemon.querySelector(".pfq-iv-block")) continue;

      const anchor = getSummaryAnchor(pokemon);
      if (!anchor) continue;

      const pokemonId = getPokemonIdFromUrl(anchor.href);
      if (!isValidPokemonId(pokemonId)) continue;

      const ivs = await PFQ_REPOSITORY.fetchIVs(pokemonId);
      const ivRow = PFQ_HTML_GENERATOR.generateIVTooltip(ivs);
      if (!ivRow) continue;

      pokemon.appendChild(ivRow);
    }
  }

  // ---------------- PREFETCH (CACHE IVs) ----------------

  /**
   * Prefetches IVs for Pokémon in the field party and caches them for tooltip/overlay use.
   */
  async function prefetchFieldPartyPokemon() {
    const partySlots = document.querySelectorAll("#field_party div.slot.plateform");
    for (const slot of partySlots) {
      if (slot.querySelector("div.big.egg")) continue;
      const pokemonId = slot.getAttribute("data-id");
      if (!isValidPokemonId(pokemonId)) continue;
      await PFQ_REPOSITORY.fetchIVs(pokemonId);
    }
  }

  /**
   * Prefetches IVs for all Pokémon in the field and caches them.
   */
  async function prefetchAllFieldPokemon() {
    const anchors = document.querySelectorAll("div.field h3:not([style]) a[href^='/summary/']");
    for (const a of anchors) {
      if (a.href.includes("hello")) continue;
      const pokemonId = getPokemonIdFromUrl(a.href);
      if (!isValidPokemonId(pokemonId)) continue;
      await PFQ_REPOSITORY.fetchIVs(pokemonId);
    }
  }

  // ---------------- HELPER FUNCTIONS ----------------

  /**
   * Determines which page context we're on from the pathname.
   * @param {string} path - window.location.pathname.
   * @returns {{ isField: boolean, isParty: boolean, isTrade: boolean, isShelter: boolean }}
   */
  function getPageContext(path) {
    return {
      isField: path.startsWith("/fields"),
      isParty: path.startsWith("/party") || path.startsWith("/user"),
      isTrade: path.startsWith("/trade"),
      isShelter: path.startsWith("/shelter"),
    };
  }

  /**
   * Returns true if the value is a non-placeholder Po`kémon ID.
   * @param {string} id - e.g. from data-id or summary URL.
   * @returns {boolean}
   */
  function isValidPokemonId(id) {
    return id != null && id !== "" && id !== "hello";
  }

  /**
   * Extracts the Pokémon ID from a summary URL.
   * @param {string} url - e.g. "https://pokefarm.com/summary/J6QPB6"
   * @returns {string|undefined} - e.g. "J6QPB6"
   */
  function getPokemonIdFromUrl(url) {
    return url.split("/summary/")[1];
  }

  /**
   * Returns the summary link from a .fieldmontip that points to a real Pokémon (not the "hello" placeholder).
   * @param {Element} pokemon - Element containing the tooltip content.
   * @returns {Element|null} - The anchor element or null.
   */
  function getSummaryAnchor(pokemon) {
    const anchors = pokemon.querySelectorAll('h3 a[href^="/summary/"]');
    return [...anchors].find((a) => !a.getAttribute("href").includes("hello")) ?? null;
  }
})();

