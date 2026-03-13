(function () {
  // Only run logic if on PFQ
  if (window.location.hostname !== "pokefarm.com") {
    console.log("[PFQ IV] Not on pokefarm.com, script will not run.");
    return;
  }

  // Only run logic on Party or Fields pages
  const path = window.location.pathname;
  isField = false;
  isParty = false;
  if (path.startsWith("/fields")) {
    isField = true; // includes your fields and other users' fields
  }
  if (path.startsWith("/party") || path.startsWith("/user")) {
    isParty = true;
  }
  if (!isField && !isParty) {
    console.log("[PFQ IV] Not on a Field or Party or User page, script will not run.");
    return;
  }

  console.log("[PFQ IV] Extension Detected");

  setTimeout(() => {
    init(); // delay init for 0.5 second to allow page content to load
  }, 500);

  /**
   * Initializes the extension: prefetches IVs and sets up event listeners.
   */
  function init() {
    if (isParty) {
      getPartyIVs();
    }
    if (isField) {
      prefetchFieldPartyPokemon();
      setupFieldPartyHover();
      prefetchAllFieldPokemon();
      setupFieldOverlay();
      setupFieldHover();
    }
  }

  // ---------------- PARTY WIDE / INJECTION ----------------

  /**
   * Prefetches IVs for all Pokémon currently in party.
   */
  async function getPartyIVs() {
    const party = document.querySelectorAll("div.party.wide > div[data-pid]");
    // console.log("[PFQ IV] Prefetching party Pokémon:", party.length);

    for (const slot of party) {
      if (slot.querySelector(".pfq-iv-block")) return; // skip, already done

      const pokemonId = slot.getAttribute("data-pid");
      if (!pokemonId || pokemonId === "hello") continue;

      const ivs = await fetchIVs(pokemonId);

      // generate and inject IVs for this party pokemon
      const ivDiv = getIVTooltipHTML(ivs);
      if (ivDiv != null) {
        const whereToInject = slot.querySelector("div.action");
        whereToInject.prepend(ivDiv);
      }
    }
  }

  // ---------------- FIELD / PARTY HOVER LOGIC ----------------

  /**
   * Detects when a user hovers over a Pokémon in the field.
   * When hovered, it fetches the Pokémon's IVs (using cache if available) and injects them into the tooltip.
   * The IV block is only injected once per tooltip to avoid duplicates.
   */
  function setupFieldHover() {
    document.addEventListener("mouseover", async (event) => {
      const trigger = event.target.closest("span.fieldmon");
      if (!trigger) return;

      addIVOverlay(trigger); // add IV overlay if not already there

      const pokemonId = trigger.getAttribute("data-id");
      if (!pokemonId || pokemonId == "hello") return;

      const ivs = await fetchIVs(pokemonId);

      waitForTooltip().then(() => injectFieldIVs(trigger, ivs));
    });
  }

  /**
   * Detects when a user hovers over a Pokémon in the party.
   * When hovered, it fetches the Pokémon's IVs (using cache if available) and injects them into the tooltip.
   * The IV block is only injected once per tooltip to avoid duplicates.
   * It also handles empty party slots and eggs appropriately.
   */
  function setupFieldPartyHover() {
    document.addEventListener("mouseover", async (event) => {
      const trigger = event.target.closest("div.slot.plateform");
      if (!trigger) return;

      const pokemonId = trigger.getAttribute("data-id");
      if (!pokemonId) {
        // empty slot
        // console.log("[PFQ IV] This party slot is empty");
        return;
      }

      const ivs = await fetchIVs(pokemonId);

      waitForTooltip().then(() => injectFieldPartyIVs(trigger, ivs));
    });
  }

  // ---------------- FIELD OVERLAY LOGIC ----------------

  function setupFieldOverlay() {
    const fieldPokemon = document.querySelectorAll('div.field span.fieldmon');

    fieldPokemon.forEach(pokemon => {
      addIVOverlay(pokemon);
    });
  }

  async function addIVOverlay(fieldmonSpan) {
    const pokemonId = fieldmonSpan.attributes['data-id'].value;
    const ivs = await fetchIVs(pokemonId);
    // console.log("[PFQ IV] starting addIVOverlay for:", pokemonId, ivs)

    const existing = fieldmonSpan.querySelector('.pfq-iv-overlay');
    if (existing) {
      // console.log("[PFQ IV] IV overlay already exists for:", pokemonId)
      return; // skip because IV overlay already exists
      // existing.remove();
    }

    // Ensure sprite has base class
    fieldmonSpan.classList.add('pkmn-sprite');

    const overlay = getIVOverlayHTML(ivs);
    if (overlay) {
      // console.log("[PFQ IV] adding IV overlay for:", pokemonId)
      fieldmonSpan.appendChild(overlay);
    }
  }

  // ---------------- IV HTML INJECTION ----------------

  /**
   * @param {*} trigger reference to the hovered party slot element
   * @param {number[]} ivs list of all 6 IVs and the total (ex. [31, 31, 31, 31, 31, 31, 186])
   * @returns the HTML that should be injected into the tooltip for a party Pokémon
   */
  function injectFieldPartyIVs(trigger, ivs) {
    if (!ivs) {
      // egg slot
      // console.log("[PFQ IV] This is an egg.");
      return;
    }

    const tip = getTooltip(trigger);
    if (!tip) {
      // console.log("[PFQ IV] Could not find tooltip_content after party trigger");
      return;
    }

    if (tip.querySelector(".pfq-iv-block")) return; // skip, already done

    tip.appendChild(getIVTooltipHTML(ivs));
    // console.log("[PFQ IV] Party IV block injected");
  }

  /**
   * Injects IVs into the tooltip_content after the hovered trigger.
   * @param {Element} trigger
   * @param {number[]} ivs
   */
  function injectFieldIVs(trigger, ivs) {
    if (!ivs) {
      // console.log("[PFQ IV] No IV data to inject (field)");
      return;
    }

    const tip = getTooltip(trigger);
    if (!tip) {
      // console.log("[PFQ IV] Could not find tooltip_content after field trigger");
      return;
    }

    if (tip.querySelector(".pfq-iv-block")) return; // skip, already done

    tip.appendChild(getIVTooltipHTML(ivs));
    // console.log("[PFQ IV] Field IV block injected");
  }

  function waitForTooltip() {
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
  }

  function getTooltip(trigger) {
    let el = trigger.nextElementSibling;
    while (el && !(el.classList && el.classList.contains("tooltip_content"))) {
      el = el.nextElementSibling;
    }
    if (el && el.classList.contains("tooltip_content")) return el;
    return null;
  }

  // ---------------- FETCHING IV DATA ----------------

  /**
   * Prefetches IVs for all Pokémon in the user's party and caches them.
   */
  async function prefetchFieldPartyPokemon() {
    const partySlots = document.querySelectorAll(
      "#field_party div.slot.plateform",
    );
    // console.log("[PFQ IV] Prefetch scanning party Pokémon:", partySlots.length);

    for (const slot of partySlots) {
      if (slot.querySelector("div.big.egg")) return;

      const pokemonId = slot.getAttribute("data-id");
      if (!pokemonId || pokemonId === "hello") return;

      // console.log("[PFQ IV] Party prefetch:", pokemonId);

      await fetchIVs(pokemonId).then((ivs) => {
        // console.log("[PFQ IV] Party Prefetch IVs:", pokemonId, ivs);
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
    // console.log("[PFQ IV] Prefetch scanning field Pokémon:", anchors.length);

    for (const a of anchors) {
      const url = a.href;
      if (url.includes("hello")) continue;

      const pokemonId = getPokemonIdFromUrl(url);

      // console.log("[PFQ IV] Prefetching:", pokemonId);
      await fetchIVs(pokemonId).then((ivs) => {
        // console.log("[PFQ IV] Prefetch IVs:", pokemonId, ivs);
      });
    }
  }

  // ---------------- HELPER FUNCTIONS ----------------
  /**
   * Extracts the Pokémon ID from the given URL.
   * @param {string} url - The URL to extract the ID from. (ex. https://pokefarm.com/summary/J6QPB6)
   * @returns {string} - The extracted Pokémon ID. (ex. J6QPB6)
   */
  function getPokemonIdFromUrl(url) {
    return url.split("/summary/")[1];
  }
})();
