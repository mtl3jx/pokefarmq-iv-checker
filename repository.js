const PFQ_POKEMON_ID_KEY_PREFIX = "pfq-pokemon-id";

/**
   * IV cache using sessionStorage
   */
const ivCache = {
    get: (pokemonId) => {
        const data = sessionStorage.getItem(getCacheKey(pokemonId));
        return data ? JSON.parse(data) : null;
    },
    set: (pokemonId, ivs) => {
        sessionStorage.setItem(getCacheKey(pokemonId), JSON.stringify(ivs));
    },
    has: (pokemonId) => {
        return sessionStorage.getItem(getCacheKey(pokemonId)) !== null;
    },
};

/**
 * Fetches IVs from the summary page for a given Pokémon.
 * @param {string} url - The summary URL for the Pokémon.
 * @returns {Promise<number[]>} Array of IV values.
 */
async function fetchIVs(pokemonId) {
    if (ivCache.has(pokemonId)) {
        // console.log("[PFQ IV] Using cached IVs for party Pokémon:", pokemonId, ivCache.get(pokemonId));
        return ivCache.get(pokemonId);
      }

    const url = `https://pokefarm.com/summary/${pokemonId}`;
    try {
        // console.log("[PFQ IV] Fetching IVs for Pokémon:", pokemonId, url);
        const res = await fetch(url);
        // console.log("[PFQ IV] Response status:", res.status);
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, "text/html");

        const isEgg = doc.querySelector("div#summarypage div.egg") != null;
        if (isEgg) {
            // console.log("[PFQ IV] This Pokémon is an egg, no IVs to fetch for ID:", pokemonId);
            return null;
        }

        const row = [...doc.querySelectorAll("tr")].find((r) =>
            r.textContent.includes("IVs"),
        );
        if (!row) {
            // console.log("[PFQ IV] IV row not found for pokemon ID:", pokemonId);
            return null;
        }

        const tds = [...row.querySelectorAll("td")];
        const numbers = tds
            .map((td) => parseInt(td.textContent.trim()))
            .filter((val) => !isNaN(val));
        const values = numbers.slice(0, 7);
        // console.log("[PFQ IV] IVs parsed for Pokémon ID:", pokemonId, values);

        ivCache.set(pokemonId, values); // save IVs to cache
        return values;
    } catch (e) {
        console.warn("[PFQ IV] IV fetch failed for Pokémon ID:", pokemonId, e);
        return null;
    }
}

/**
 * Generates a cache key for the given Pokémon ID.
 * @param {string} pokemonId - The Pokémon ID. (ex. J6QPB6)
 * @returns {string} - The generated cache key. (ex. pfq-pokemon-id-J6QPB6)
 */
function getCacheKey(pokemonId) {
    return PFQ_POKEMON_ID_KEY_PREFIX + pokemonId;
}