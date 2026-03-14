/**
 * Maps the count of 31 IVs to the corresponding emoji representation.
 * Keys are the number of perfect (31) IVs, values are emoji strings.
 * @type {Record<number, string>}
 */
const IV_EMOJI_MAP = {
    0: "",
    1: "1️⃣",
    2: "2️⃣",
    3: "3️⃣",
    4: "4️⃣",
    5: "5️⃣",
    6: "✅",
};

/**
 * Returns the first 6 IV values (HP, Atk, Def, SpA, SpD, Spe) from a full IV array.
 * @param {number[] | null | undefined} ivs - Full IV array including total at index 6.
 * @returns {number[] | null} Slice of the first 6 IVs, or null when no IVs are provided.
 */
function getIVParts(ivs) {
    return ivs ? ivs.slice(0, 6) : null;
}

/**
 * Computes the emoji to display based on the number of perfect (31) IVs.
 * @param {number[] | null} ivParts - Array of 6 IV values.
 * @returns {string} Emoji representing how many perfect IVs there are, or empty string.
 */
function getNumEmojiFromIVParts(ivParts) {
    if (!ivParts) return "";
    const num31 = ivParts.filter((v) => v === 31).length; // check how many perfect IVs
    if (num31 <= 0 && ivParts.every(item => item === 0)) {
        return "❌"; // perfect-nundo
    } else {
        return IV_EMOJI_MAP[num31] || "";
    }
}

/**
 * Injects an IV overlay on top of a field Pokémon sprite.
 * @param {HTMLElement} fieldmonSpan - The span element representing the field Pokémon.
 * @returns {Promise<void>} Resolves when the overlay has been injected or skipped.
 */
async function injectIVOverlay(fieldmonSpan) {
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

    const overlay = generateIVOverlay(ivs);
    if (overlay) {
        // console.log("[PFQ IV] adding IV overlay for:", pokemonId)
        fieldmonSpan.appendChild(overlay);
    }
}

/**
 * Generates a visual IV overlay element for a Pokémon.
 * @param {number[] | null} ivs - Array of IVs for the Pokémon, or null if not available.
 * @returns {HTMLElement | null} A div containing the IV overlay, or null when no overlay should be shown.
 */
function generateIVOverlay(ivs) {
    if (!ivs) return null;

    const ivParts = getIVParts(ivs);
    if (!ivParts) return null;
    const numEmoji = getNumEmojiFromIVParts(ivParts);

    // Overlay container
    const overlay = document.createElement("div");
    overlay.className = "pfq-iv-overlay";

    // Emoji
    if (numEmoji) {
        const emojiEl = document.createElement("div");
        emojiEl.className = "iv-emoji";
        emojiEl.textContent = numEmoji;
        overlay.appendChild(emojiEl);
    }

    // Bar container
    const barContainer = document.createElement("div");
    barContainer.className = "iv-bar-container";

    ivParts.forEach((val) => {
        const bar = document.createElement("div");
        bar.className = "iv-bar";
        // Reuse the same IV class used for text so CSS can color bars
        bar.classList.add(getIVClass(val));
        // Height proportional to IV (31 = full height)
        const heightPct = Math.round((val / 31) * 100);
        bar.style.height = `${heightPct}%`;
        barContainer.appendChild(bar);
    });

    overlay.appendChild(barContainer);

    return overlay;
}

/**
 * Generates the UI for the IV row to be injected in the HTML.
 * @param {number[] | null} ivs - List of all 6 IVs and the total (ex. [31, 31, 31, 31, 31, 31, 186]).
 *    When null, this is an egg or an empty slot.
 * @returns {HTMLDivElement | undefined} A div element containing the formatted IV string, or undefined if skipped.
 */
function generateIVTooltip(ivs) {
    if (ivs == null) {
        // console.log("[PFQ IV] This is an egg, skipping IV row generation.");
        return;
    }

    // Calculate IV parts and classes
    const ivParts = getIVParts(ivs);
    const ivStringTotal = ivParts.join("/"); // currently unused, kept for potential future display
    const total = ivs[6];

    const numEmoji = getNumEmojiFromIVParts(ivParts);

    // Create IV row div
    const ivRow = document.createElement("div");
    ivRow.className = "pfq-iv-block";

    // Bold label
    const label = document.createElement("b");
    label.textContent = "IVs: ";
    ivRow.appendChild(label);

    // Add IV spans with classes
    ivParts.forEach((val, index) => {
        const span = document.createElement("span");
        span.textContent = val;
        span.className = getIVClass(val); // your existing function
        ivRow.appendChild(span);

        // Add "/" separator except after last number
        if (index < ivParts.length - 1) {
            ivRow.appendChild(document.createTextNode("/"));
        }
    });

    // Add total part
    ivRow.appendChild(document.createTextNode("=" + total));

    // Add emoji
    if (numEmoji) {
        ivRow.appendChild(document.createTextNode(` ${numEmoji}`));
    }

    return ivRow;
}

/**
 * Appends an IV tooltip block to the tooltip for the given trigger, if not already present.
 * Safely no-ops if IV data or tooltip cannot be found.
 * @param {Element} trigger - The hovered element that owns the tooltip.
 * @param {number[] | null} ivs - Full IV array including total at index 6.
 */
function appendIVTooltipIfMissing(trigger, ivs) {
    if (!ivs) {
        return;
    }

    const tip = getTooltip(trigger);
    if (!tip) {
        return;
    }

    if (tip.querySelector(".pfq-iv-block")) return; // skip, already done

    tip.appendChild(generateIVTooltip(ivs));
}

/**
 * Injects IV information into the tooltip for a party Pokémon slot.
 * @param {Element} trigger - Reference to the hovered party slot element.
 * @param {number[] | null} ivs - List of all 6 IVs and the total (ex. [31, 31, 31, 31, 31, 31, 186]).
 */
function injectFieldPartyIVs(trigger, ivs) {
    appendIVTooltipIfMissing(trigger, ivs);
    // console.log("[PFQ IV] Party IV block injected");
}

/**
 * Injects IVs into the tooltip_content after the hovered trigger.
 * @param {Element} trigger - The hovered field Pokémon element.
 * @param {number[] | null} ivs - Full IV array including total at index 6.
 */
function injectFieldIVs(trigger, ivs) {
    appendIVTooltipIfMissing(trigger, ivs);
    // console.log("[PFQ IV] Field IV block injected");
}

/**
 * Waits until a tooltip element for a field Pokémon exists in the DOM.
 * @returns {Promise<HTMLElement>} Resolves with the tooltip element once it is available.
 */
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

/**
 * Finds the tooltip element associated with the given trigger element.
 * @param {Element} trigger - The element that triggers the tooltip.
 * @returns {HTMLElement | null} The tooltip element, or null if not found.
 */
function getTooltip(trigger) {
    let el = trigger.nextElementSibling;
    while (el && !(el.classList && el.classList.contains("tooltip_content"))) {
        el = el.nextElementSibling;
    }
    if (el && el.classList.contains("tooltip_content")) return el;
    return null;
}

/**
 * @param {number} value 
 * @returns string of CSS class based on IV {value}
 */
function getIVClass(value) {
    if (value === 31) return "pfq-perfect";
    if (value === 0) return "pfq-zero";
    if (value >= 26) return "pfq-high";
    if (value <= 5) return "pfq-low";
    return "pfq-mid";
}