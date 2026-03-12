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
const ivCache = new Map();

console.log("[PFQ IV] Extension loaded");

init();

function init() {

  console.log("[PFQ IV] Initializing");

  prefetchAllFieldPokemon();

  document.addEventListener("mouseover", async (event) => {
    const trigger = event.target.closest("span.fieldmon.tooltip_trigger");
    if (!trigger) return;

    const pokemonID = trigger.getAttribute("data-id");
    if (!pokemonID) {
      console.log("[PFQ IV] No Pokémon ID found on hovered span");
      return;
    }
    if (pokemonID == "hello") {
      // this isn't a real pokemon ID
      return;
    }

    const url = `https://pokefarm.com/summary/${pokemonID}`;
    let ivs = ivCache.get(pokemonID);
    if (!ivs) {
      console.log("[PFQ IV] Fetching IVs for Pokémon ID:", pokemonID, url);
      ivs = await fetchIVs(url);
      ivCache.set(pokemonID, ivs);
    } else {
      console.log("[PFQ IV] Using cached IVs for Pokémon ID:", pokemonID, ivs);
    }

    waitForTooltip().then(() => {
      injectIVs(trigger, ivs);
    });
  });
}

async function prefetchAllFieldPokemon() {

  const anchors = document.querySelectorAll("a[href^='/summary/']");

  console.log("[PFQ IV] Prefetch scanning field Pokémon:", anchors.length);

  for (const a of anchors) {

    const url = a.href;

    if (url.includes("hello")) continue; // this isn't a valid pokemon ID

    if (ivCache.has(url)) continue;
    // console.log("[PFQ IV] Prefetching:", url);

    fetchIVs(url).then(ivs => {

    //   console.log("[PFQ IV] Prefetch IVs:", url, ivs);
      const pokemonID = url.split("/summary/")[1];
      ivCache.set(pokemonID, ivs);

    });
  }

}

async function fetchIVs(url) {

  try {
    // console.log("[PFQ IV] Fetch request:", url);

    const res = await fetch(url);

    const pokemonId = url.split("/summary/")[1];

    // console.log("[PFQ IV] Response status:", res.status);

    const html = await res.text();

    const doc = new DOMParser().parseFromString(html, "text/html");

    const row = [...doc.querySelectorAll("tr")].find(r =>
      r.textContent.includes("IVs")
    );

    if (!row) {
      console.log("[PFQ IV] IV row not found for pokemon ID:", pokemonId);
      return null;
    }

    const tds = [...row.querySelectorAll("td")];
    // Extract all numeric values from the row
    const numbers = tds
      .map(td => parseInt(td.textContent.trim()))
      .filter(val => !isNaN(val));
    const values = numbers.slice(0, 7);
    console.log("[PFQ IV] IVs parsed for Pokémon ID:", pokemonId, values);
    return values;
  } catch (e) {
    console.error("[PFQ IV] IV fetch failed:", e);
    return null;
  }
}

function injectIVs(trigger, ivs) {
  if (!ivs) {
    console.log("[PFQ IV] No IV data to inject");
    return;
  }

  console.log("[PFQ IV] Injecting IV block");

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
    console.log("[PFQ IV] Could not find tooltip_content after trigger");
    return;
  }

  // Remove any previous IV block
  const oldBlock = tip.querySelector('.pfq-iv-block');
  if (oldBlock) oldBlock.remove();


  // Format IVs as '[31/31/31/31/31/31/31=186]'
  const total = ivs[6];
  // Underline each IV that is 31
  const ivParts = ivs.slice(0, 6).map(val => val === 31 ? `<span style="text-decoration:underline">${val}</span>` : val);
  const ivString = ivParts.join('/') + '=' + total;
  const isPerfect = total === 186;

  const block = document.createElement('div');
  block.className = 'pfq-iv-block';
  block.style.margin = '4px 0';
  block.innerHTML = `<b>IVs: </b> [${ivString}]${isPerfect ? ' <span style="color:gold">★</span>' : ''}`;

  console.log("IV Block HTML to be Injected:", block);

  // Insert IV block after the level div
  const levelDiv = tip.querySelector('.expbar');
  if (levelDiv && levelDiv.parentNode) {
    levelDiv.parentNode.insertBefore(block, levelDiv.nextSibling);
  } else {
    tip.appendChild(block);
  }

  console.log("After Injection:", tip);
}

function getIVClass(value) {

  if (value === 31) return "pfq-perfect";
  if (value >= 26) return "pfq-high";
  if (value <= 5) return "pfq-low";

  return "pfq-mid";

}