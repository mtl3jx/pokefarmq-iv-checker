/**
 * Entry point for the PFQ IV Checker content script.
 * Sets up page detection, prefetching, overlays, and hover handlers.
 */
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
      setupFieldPartyOverlay();
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
      if (slot.querySelector(".pfq-iv-block")) continue; // skip to next, already done

      const pokemonId = slot.getAttribute("data-pid");
      if (!pokemonId || pokemonId === "hello") continue; // not a real pokemon

      const ivs = await fetchIVs(pokemonId);

      // generate and inject IVs for this party pokemon
      const ivDiv = generateIVTooltip(ivs);
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

      injectIVOverlay(trigger); // add IV overlay if not already there

      const pokemonId = trigger.getAttribute("data-id");
      if (!pokemonId || pokemonId == "hello") return;

      const ivs = await fetchIVs(pokemonId);

      waitForTooltip().then(() => appendIVTooltipIfMissing(trigger, ivs));
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

      waitForTooltip().then(() => appendIVTooltipIfMissing(trigger, ivs));
    });
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
      injectPartySlotIVOverlay(slot);
    });
  }

  /**
   * Adds IV overlays to all Pokémon currently visible in the field.
   */
  function setupFieldOverlay() {
    const fieldPokemon = document.querySelectorAll('div.field span.fieldmon');

    fieldPokemon.forEach(pokemon => {
      injectIVOverlay(pokemon);
    });
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
