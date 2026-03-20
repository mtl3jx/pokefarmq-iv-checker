window.PFQ_SERVICE = window.PFQ_SERVICE || {};

PFQ_SERVICE.getPokemonIVs = async function (pokemonId) {
    // console.log("[PFQ IV] Fetching IVs for Pokémon:", pokemonId);
    return PFQ_FETCH_URL.get(`/pokemon/iv?shortlink=${pokemonId}`);
};

PFQ_SERVICE.validateApiKey = async function (apiKey) {
    // console.log("[PFQ IV] Fetching IVs for Pokémon:", pokemonId);
    try {
        const response = await fetch(`${ENV.API_BASE_URL}/user/me`, {
            headers: {
                "x-api-key": apiKey,
            },
        });

        return response;
    } catch (err) {
        console.error("[PFQ IV] validateApiKey failed:", err);
        return { ok: false };
    }
};