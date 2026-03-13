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
async function fetchIVs(pokemonId) {
    const existing = ivCache.get(pokemonId);
    if (existing != null) {
        console.log("[PFQ IV] Using cached IVs for Pokémon:", pokemonId, ivCache.get(pokemonId));
        return existing;
    }

    const url = `https://pokefarm.com/summary/${pokemonId}`;
    try {
        console.log("[PFQ IV] Fetching IVs for Pokémon:", pokemonId, url);
        const res = await fetch(url);
        // console.log("[PFQ IV] Response status:", res.status);
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, "text/html");

        const isEgg = doc.querySelector("div#summarypage div.egg") != null;
        if (isEgg) {
            console.log("[PFQ IV] This Pokémon is an egg, no IVs to fetch for ID:", pokemonId);
            return null;
        }

        const row = [...doc.querySelectorAll("tr")].find((r) =>
            r.textContent.includes("IVs"),
        );
        if (!row) {
            console.log("[PFQ IV] IV row not found for pokemon ID:", pokemonId);
            return null;
        }

        const tds = [...row.querySelectorAll("td")];
        const numbers = tds
            .map((td) => parseInt(td.textContent.trim()))
            .filter((val) => !isNaN(val));
        const values = numbers.slice(0, 7);
        console.log("[PFQ IV] IVs parsed for Pokémon ID:", pokemonId, values);

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