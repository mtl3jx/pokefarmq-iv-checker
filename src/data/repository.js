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
    return `${PFQ_POKEMON_ID_KEY_PREFIX}-${pokemonId}`;
}
