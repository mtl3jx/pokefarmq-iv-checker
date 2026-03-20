/**
 * Entry point for the PFQ IV Checker content script.
 * Sets up page detection, prefetching, overlays, and hover handlers.
 */
(function () {
  if (window.location.hostname !== "pokefarm.com") {
    console.log("[PFQ IV] Not on pokefarm.com, script will not run.");
    return;
  }

  const { isField, isParty, isTrade, isShelter, isDaycare } = getPageContext(window.location.pathname);
  if (!isField && !isParty && !isTrade && !isShelter && !isDaycare) {
    console.log("[PFQ IV] Not on a supported page, script will not run.");
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
    if (isDaycare) {
      getPartyIVs();
      setupFieldOverlay();
      setupFieldHover();
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
   * Observes when a certain REST network call is made (ex. user changed fields).
   * Currently supported on user pages, fields, shelter, and trade center.
   */
  function injectNetworkListener() {
    window.addEventListener("message", (event) => {
      if (event.source !== window) return;

      if (event.data?.type === "NETWORK_RESPONSE") {
        // console.log("[PFQ IV] injectNetworkListener:", event);
        const { url, body } = event.data.payload;
        if (isField && url.includes("/fields/field")) {
          // console.log("[PFQ IV] Field change on Fields detected...:", JSON.parse(body));
          setupFieldOverlay();
        } else if (isDaycare) {
          if (url.includes("/daycare/add") || url.includes("/daycare/remove")) {
            // console.log("[PFQ IV] Daycare pokemon changed...:", JSON.parse(body));
            getPartyIVs();

          } else if (url.includes("/fields/pkmnlist")) {
            // console.log("[PFQ IV] Field change in Daycare detected...:", JSON.parse(body));
            setupFieldOverlay();
            setupFieldHover();
          }

        } else if (isParty && url.includes("/users/load")) {
          // console.log("[PFQ IV] New user party detected...:", JSON.parse(body));
          getPartyIVs();

        } else if (isShelter && url.includes("/shelter/load")) {
          // console.log("[PFQ IV] Reload page in Shelter detected...:", JSON.parse(body));
          setupShelterOverlay();

        } else if (isTrade && url.includes("/fields/pkmnlist")) {
          // console.log("[PFQ IV] Field change in Trade Center detected...:", JSON.parse(body));
          setupFieldOverlay();
          setupFieldHover()
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
      isDaycare: path.startsWith("/daycare"),
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
