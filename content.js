/**
 * Waits for a tooltip_content element to appear in the DOM.
 * @returns {Promise<Element>} Resolves with the tooltip_content element.
 */
function waitForTooltip() {
  return new Promise(resolve => {
    const existing = document.querySelector('div.field .tooltip_content');
    if (existing) {
      return resolve(existing);
    }
    const observer = new MutationObserver(() => {
      const tooltip = document.querySelector('.tooltip_content');
      if (tooltip) {
        observer.disconnect();
        resolve(tooltip);
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}
const isDebugMode = false; // Set to true to enable debug logs
const ivCache = new Map();

printLog("[PFQ IV] Extension loaded");

init();

/**
 * Initializes the extension: prefetches IVs and sets up event listeners.
 */
function init() {

  printLog("[PFQ IV] Initializing");

  prefetchAllFieldPokemon();

  document.addEventListener("mouseover", async (event) => {
    const trigger = event.target.closest("span.fieldmon.tooltip_trigger");
    if (!trigger) return;

    const pokemonID = trigger.getAttribute("data-id");
    if (!pokemonID) {
      printLog("[PFQ IV] No Pokémon ID found on hovered span");
      return;
    }
    if (pokemonID == "hello") {
      // this isn't a real pokemon ID
      return;
    }

    const url = `https://pokefarm.com/summary/${pokemonID}`;
    let ivs = ivCache.get(pokemonID);
    if (!ivs) {
      printLog("[PFQ IV] Fetching IVs for Pokémon ID:", pokemonID, url);
      ivs = await fetchIVs(url);
      ivCache.set(pokemonID, ivs);
    } else {
      printLog("[PFQ IV] Using cached IVs for Pokémon ID:", pokemonID, ivs);
    }

    waitForTooltip().then(() => {
      injectIVs(trigger, ivs);
    });
  });
}

/**
 * Prefetches IVs for all Pokémon in the field and caches them.
 */
async function prefetchAllFieldPokemon() {

  const anchors = document.querySelectorAll("a[href^='/summary/']");

  printLog("[PFQ IV] Prefetch scanning field Pokémon:", anchors.length);

  for (const a of anchors) {

    const url = a.href;

    if (url.includes("hello")) continue; // this isn't a valid pokemon ID

    if (ivCache.has(url)) continue;
    printLog("[PFQ IV] Prefetching:", url);

    fetchIVs(url).then(ivs => {

      printLog("[PFQ IV] Prefetch IVs:", url, ivs);
      const pokemonID = url.split("/summary/")[1];
      ivCache.set(pokemonID, ivs);

    });
  }

}

/**
 * Fetches IVs from the summary page for a given Pokémon.
 * @param {string} url - The summary URL for the Pokémon.
 * @returns {Promise<number[]>} Array of IV values.
 */
async function fetchIVs(url) {

  try {
    printLog("[PFQ IV] Fetch request:", url);

    const res = await fetch(url);

    const pokemonId = url.split("/summary/")[1];

    printLog("[PFQ IV] Response status:", res.status);

    const html = await res.text();

    const doc = new DOMParser().parseFromString(html, "text/html");

    const row = [...doc.querySelectorAll("tr")].find(r =>
      r.textContent.includes("IVs")
    );

    if (!row) {
      printLog("[PFQ IV] IV row not found for pokemon ID:", pokemonId);
      return null;
    }

    const tds = [...row.querySelectorAll("td")];
    // Extract all numeric values from the row
    const numbers = tds
      .map(td => parseInt(td.textContent.trim()))
      .filter(val => !isNaN(val));
    const values = numbers.slice(0, 7);
    printLog("[PFQ IV] IVs parsed for Pokémon ID:", pokemonId, values);
    return values;
  } catch (e) {
    console.error("[PFQ IV] IV fetch failed:", e);
    return null;
  }
}

/**
 * Injects IVs into the tooltip_content after the hovered trigger.
 * Underlines 31s, adds number emoji, and gold star for perfect IVs.
 * Skips injection if block already exists.
 * @param {Element} trigger - The hovered span.fieldmon.tooltip_trigger element.
 * @param {number[]} ivs - Array of IV values.
 */
function injectIVs(trigger, ivs) {
  if (!ivs) {
    printLog("[PFQ IV] No IV data to inject");
    return;
  }

  // Find the tooltip_content immediately after the hovered trigger
  let tip = null;
  let el = trigger.nextElementSibling;
  while (el && !(el.classList && el.classList.contains('tooltip_content'))) {
    el = el.nextElementSibling;
  }
  if (el && el.classList.contains('tooltip_content')) {
    tip = el;
  }
  if (!tip) {
    printLog("[PFQ IV] Could not find tooltip_content after trigger");
    return;
  }

  // Check if IV block already exists
  const oldBlock = tip.querySelector('.pfq-iv-block');
  if (oldBlock) {
    printLog('[PFQ IV] IV block already injected, skipping.');
    return;
  }

  printLog("[PFQ IV] Injecting IV block");

  // Format IVs as '[31/31/31/31/31/31/31=186]'
  const total = ivs.reduce((a, b) => a + b, 0);
  // Underline each IV that is 31
  const ivParts = ivs.slice(0, 6).map(val => val === 31 ? `<span style="text-decoration:underline">${val}</span>` : val);
  const ivString = ivParts.join('/') + '=' + ivs[6];
  const isPerfect = total === 186;
  const num31 = ivs.slice(0, 6).filter(val => val === 31).length;
  const emojiMap = {
    0: '',
    1: '1️⃣',
    2: '2️⃣',
    3: '3️⃣',
    4: '4️⃣',
    5: '5️⃣',
    6: '💯' 
  };
  const numEmoji = emojiMap[num31] || '';

  const block = document.createElement('div');
  block.className = 'pfq-iv-block';
  block.style.margin = '4px 0';
  block.style.fontSize = 'inherit'; // Match font size to other rows
  block.innerHTML = `<b>IVs: </b> [${ivString}] ${numEmoji}`;

  // Insert IV block after the level div
  const levelDiv = tip.querySelector('.expbar');
  if (levelDiv && levelDiv.parentNode) {
    levelDiv.parentNode.insertBefore(block, levelDiv.nextSibling);
  } else {
    tip.appendChild(block);
  }
}

/**
 * Returns a CSS class for an IV value.
 * @param {number} value - The IV value.
 * @returns {string} CSS class name.
 */
function getIVClass(value) {
  if (value === 31) {
    return 'underline';
  }
  return '';
}

/**
 * Only prints logs if debug mode is enabled.
 * This helps avoid cluttering the console for users who don't want to see logs.
 * @param {string} message to print to console logs
 */
function printLog(message) {
  if (isDebugMode) {
    console.log("[PFQ IV Checker]", message);
  }
}