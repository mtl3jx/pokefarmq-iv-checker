window.PFQ_SERVICE = window.PFQ_SERVICE || {};

PFQ_SERVICE.getPokemonIVs = async function (pokemonId) {
    // console.log("[PFQ IV] Fetching IVs for Pokémon:", pokemonId);
    return PFQ_FETCH_URL.get(`/pokemon/iv?shortlink=${pokemonId}`);
};
