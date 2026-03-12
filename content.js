// Only run logic if on the correct page
(function () {
  const path = window.location.pathname;
  if (!(path === "/fields" || path.startsWith("/fields/"))) {
    console.log("[PFQ IV] Not on a /fields page, script will not run.");
    return;
  }

  const PFQ_POKEMON_ID_KEY_PREFIX = "pfq-pokemon-id";
  // IV cache using sessionStorage
  const ivCache = {
    get: (pokemonID) => {
      const data = sessionStorage.getItem(getCacheKey(pokemonID));
      return data ? JSON.parse(data) : null;
    },
    set: (pokemonID, ivs) => {
      sessionStorage.setItem(getCacheKey(pokemonID), JSON.stringify(ivs));
    },
    has: (pokemonID) => {
      return sessionStorage.getItem(getCacheKey(pokemonID)) !== null;
    },
  };

  console.log("[PFQ IV] Extension loaded");
  setTimeout(() => {
    init(); // delay init for 1 second to allow page content to load
  }, 1000);

  /**
   * Initializes the extension: prefetches IVs and sets up event listeners.
   */
  function init() {
    prefetchAllPartyPokemon();
    setupPartyHover();
    prefetchAllFieldPokemon();
    setupFieldHover();
  }

  /**
   * Detects when a user hovers over a Pokémon in the field.
   * When hovered, it fetches the Pokémon's IVs (using cache if available) and injects them into the tooltip.
   * The IV block is only injected once per tooltip to avoid duplicates.
   */
  function setupFieldHover() {
    document.addEventListener("mouseover", async (event) => {
      const trigger = event.target.closest("span.fieldmon");
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
        // console.log("[PFQ IV] Fetching IVs for Pokémon ID:", pokemonID, url);
        ivs = await fetchIVs(url);
        ivCache.set(pokemonID, ivs);
      } else {
        // console.log("[PFQ IV] Using cached IVs for Pokémon ID:", pokemonID, ivs);
      }

      waitForTooltip().then(() => {
        injectFieldIVs(trigger, ivs);
      });
    });
  }

  /**
   * Detects when a user hovers over a Pokémon in the party.
   * When hovered, it fetches the Pokémon's IVs (using cache if available) and injects them into the tooltip.
   * The IV block is only injected once per tooltip to avoid duplicates.
   * It also handles empty party slots and eggs appropriately.
   */
  function setupPartyHover() {
    const partySlots = document.querySelectorAll(
      "#field_party div.slot.plateform",
    );
    const partyCount = document.querySelectorAll(
      "#field_party div.slot.plateform div.big.pokemon",
    ).length;

    console.log("[PFQ IV] Party slots detected:", partyCount);

    document.addEventListener("mouseover", async (event) => {
      const trigger = event.target.closest("div.slot.plateform");
      if (!trigger) return;

      const pokemonID = trigger.getAttribute("data-id");
      if (!pokemonID) { // empty slot
        // console.log("[PFQ IV] This party slot is empty");
        return;
      }

      const url = `https://pokefarm.com/summary/${pokemonID}`;
      let ivs = ivCache.get(pokemonID);
      if (!ivs) {
        // console.log("[PFQ IV] Fetching IVs for Pokémon ID:", pokemonID, url);
        ivs = await fetchIVs(url);
        ivCache.set(pokemonID, ivs);
      } else {
        // console.log("[PFQ IV] Using cached IVs for Pokémon ID:", pokemonID, ivs);
      }

      waitForTooltip().then(() => {
        injectPartyIVs(trigger, ivs);
      });
    });
  }

  /**
   * @param {*} trigger reference to the hovered party slot element
   * @param {number[]} ivs list of all 6 IVs and the total (ex. [31, 31, 31, 31, 31, 31, 186])
   * @returns the HTML that should be injected into the tooltip for a party Pokémon
   */
  function injectPartyIVs(trigger, ivs) {
    if (!ivs) { // egg slot
      // console.log("[PFQ IV] This is an egg.");
      return;
    }

    // Find the tooltip_content immediately after the hovered trigger
    let tip = null;
    let el = trigger.nextElementSibling;
    while (el && !(el.classList && el.classList.contains("tooltip_content"))) {
      el = el.nextElementSibling;
    }
    if (el && el.classList.contains("tooltip_content")) {
      tip = el;
    }
    if (!tip) {
      console.log("[PFQ IV] Could not find tooltip_content after party trigger");
      return;
    }

    if (tip.querySelector(".pfq-iv-block")) return; // skip, already done

    tip.appendChild(getIVRowHTML(ivs));

    // console.log("[PFQ IV] Party IV block injected");
  }

  /**
   * Generates the UI for the IV row to be injected in the HTML.
   * @param {number[]} ivs list of all 6 IVs and the total (ex. [31, 31, 31, 31, 31, 31, 186])
   * @returns {Element} A div element containing the formatted IV string.
   */
  function getIVRowHTML(ivs) {
    const total = ivs.reduce((a, b) => a + b, 0);

    const ivParts = ivs.slice(0, 6).map((val) =>
      val === 31 // Underline each IV that is 31
        ? `<span style="text-decoration:underline">${val}</span>`
        : val,
    );

    // Format IVs as '[31/31/31/31/31/31/31=186]'
    const ivString = ivParts.join("/") + "=" + ivs[6];

    const num31 = ivs.slice(0, 6).filter((v) => v === 31).length;

    const emojiMap = {
      0: "",
      1: "1️⃣",
      2: "2️⃣",
      3: "3️⃣",
      4: "4️⃣",
      5: "5️⃣",
      6: "💯",
    };

    const numEmoji = `<b>${emojiMap[num31]}</b>` || "";

    const ivRow = document.createElement("div");
    ivRow.className = "pfq-iv-block";
    ivRow.innerHTML = `<b>IVs:</b> [${ivString}] ${numEmoji}`;
    return ivRow;
  }

  /**
   * Prefetches IVs for all Pokémon in the user's party and caches them.
   */
  async function prefetchAllPartyPokemon() {
    const partySlots = document.querySelectorAll(
      "#field_party div.slot.plateform",
    );

    console.log("[PFQ IV] Prefetch scanning party Pokémon:", partySlots.length);

    for (const slot of partySlots) {
      // Skip eggs
      if (slot.querySelector("div.big.egg")) return;

      const pokemonID = slot.getAttribute("data-id");

      if (!pokemonID || pokemonID === "hello") return; // not a real pokemon

      // Skip if cached
      if (ivCache.has(pokemonID)) {
        // console.log("[PFQ IV] Party prefetch skipped (cached):", pokemonID);
        return;
      }

      const url = `https://pokefarm.com/summary/${pokemonID}`;

      // console.log("[PFQ IV] Party prefetch:", pokemonID);

      fetchIVs(url).then((ivs) => {
        console.log("[PFQ IV] Party Prefetch IVs:", pokemonID, ivs);
        ivCache.set(pokemonID, ivs);
      });
    }
  }

  /**
   * Prefetches IVs for all Pokémon in the field and caches them.
   */
  async function prefetchAllFieldPokemon() {
    const anchors = document.querySelectorAll(
      "div.field h3:not([style]) a[href^='/summary/']",
    );

    console.log("[PFQ IV] Prefetch scanning field Pokémon:", anchors.length);

    for (const a of anchors) {
      const url = a.href;

      if (url.includes("hello")) continue; // not a real pokemon

      const pokemonID = getPokemonIdFromUrl(url);

      // Skip if already cached
      if (ivCache.has(pokemonID)) {
        // console.log("[PFQ IV] Prefetch skipped (cached):", pokemonID);
        continue;
      }

      // console.log("[PFQ IV] Prefetching:", pokemonID);

      fetchIVs(url).then((ivs) => {
        console.log("[PFQ IV] Prefetch IVs:", pokemonID, ivs);
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
      // console.log("[PFQ IV] Fetch request:", url);

      const res = await fetch(url);

      const pokemonId = getPokemonIdFromUrl(url);

      // console.log("[PFQ IV] Response status:", res.status);

      const html = await res.text();

      const doc = new DOMParser().parseFromString(html, "text/html");

      const row = [...doc.querySelectorAll("tr")].find((r) =>
        r.textContent.includes("IVs"),
      );

      if (!row) { // will happen if it's an egg
        console.log("[PFQ IV] IV row not found for pokemon ID:", pokemonId);
        return null;
      }

      const tds = [...row.querySelectorAll("td")];
      // Extract all numeric values from the row
      const numbers = tds
        .map((td) => parseInt(td.textContent.trim()))
        .filter((val) => !isNaN(val));
      const values = numbers.slice(0, 7);
      // console.log("[PFQ IV] IVs parsed for Pokémon ID:", pokemonId, values);
      return values;
    } catch (e) {
      console.error("[PFQ IV] IV fetch failed:", e);
      return null;
    }
  }

  /**
   * Waits for a tooltip_content element to appear in the DOM.
   * @returns {Promise<Element>} Resolves with the tooltip_content element.
   */
  function waitForTooltip() {
    return new Promise((resolve) => {
      const existing = document.querySelector("div.field .tooltip_content");
      if (existing) {
        return resolve(existing);
      }
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
  }

  /**
   * Injects IVs into the tooltip_content after the hovered trigger.
   * Underlines 31s, adds number emoji, and gold star for perfect IVs.
   * Skips injection if block already exists.
   * @param {Element} trigger - The hovered span.fieldmon.tooltip_trigger element.
   * @param {number[]} ivs - Array of IV values.
   */
  function injectFieldIVs(trigger, ivs) {
    if (!ivs) {
      console.log("[PFQ IV] No IV data to inject (field)");
      return;
    }

    // Find the tooltip_content immediately after the hovered trigger
    let tip = null;
    let el = trigger.nextElementSibling;
    while (el && !(el.classList && el.classList.contains("tooltip_content"))) {
      el = el.nextElementSibling;
    }
    if (el && el.classList.contains("tooltip_content")) {
      tip = el;
    }
    if (!tip) {
      console.log("[PFQ IV] Could not find tooltip_content after field trigger");
      return;
    }

    if (tip.querySelector(".pfq-iv-block")) return; // skip, already done

    // console.log("[PFQ IV] Injecting IV block");

    tip.appendChild(getIVRowHTML(ivs));
  }

  /**
   * Extracts the Pokémon ID from the given URL.
   * @param {string} url - The URL to extract the ID from. (ex. https://pokefarm.com/summary/J6QPB6)
   * @returns {string} - The extracted Pokémon ID. (ex. J6QPB6)
   */
  function getPokemonIdFromUrl(url) {
    return url.split("/summary/")[1];
  }

  /**
   * Generates a cache key for the given Pokémon ID.
   * @param {string} pokemonId - The Pokémon ID. (ex. J6QPB6)
   * @returns {string} - The generated cache key. (ex. pfq-pokemon-id-J6QPB6)
   */
  function getCacheKey(pokemonId) {
    return PFQ_POKEMON_ID_KEY_PREFIX + pokemonId;
  }
})();
