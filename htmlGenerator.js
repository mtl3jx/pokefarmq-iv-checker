/**
 * Returns the first 6 IV values (HP, Atk, Def, SpA, SpD, Spe) from a full IV array.
 * @param {number[] | null | undefined} ivs - Full IV array including total at index 6.
 * @returns {number[] | null} Slice of the first 6 IVs, or null when no IVs are provided.
 */
function getIVParts(ivs) {
    return ivs ? ivs.slice(0, 6) : null;
}

/**
 * Returns counts of 0 and 31 IVs from the 6 IV values.
 * @param {number[] | null} ivParts - Array of 6 IV values.
 * @returns {{ num0: number, num31: number }}
 */
function getIVCounts(ivParts) {
    if (!ivParts) return { num0: 0, num31: 0 };
    return {
        num0: ivParts.filter((v) => v === 0).length,
        num31: ivParts.filter((v) => v === 31).length,
    };
}

/**
 * Creates a count badge element (circle with number).
 * @param {number} count - Number to display.
 * @param {'zero' | 'perfect'} type - Zero (red) or perfect (green).
 * @param {'overlay' | 'tooltip'} context - Overlay uses positioned divs, tooltip uses inline spans.
 * @returns {HTMLElement}
 */
/** White symbol shown when count is 6: check for perfect (31s), X for zero (0s). */
const BADGE_SIX_SYMBOL = { perfect: "✓", zero: "✕" };

function createCountBadge(count, type, context) {
    const el = document.createElement(context === "overlay" ? "div" : "span");
    const isSix = count === 6;
    el.textContent = isSix ? BADGE_SIX_SYMBOL[type] : String(count);
    if (context === "overlay") {
        el.className = type === "zero" ? "iv-zero-count" : "iv-perfect-count";
    } else {
        el.className = type === "zero" ? "pfq-iv-badge pfq-iv-badge-zero" : "pfq-iv-badge pfq-iv-badge-perfect";
    }
    if (isSix) el.classList.add("pfq-iv-badge-six");
    return el;
}

/**
 * Injects an IV overlay on top of a field party slot's Pokémon sprite (fields page).
 * @param {HTMLElement} slot - The div.slot.plateform element with data-id.
 * @returns {Promise<void>} Resolves when the overlay has been injected or skipped.
 */
async function injectPartySlotIVOverlay(slot) {
    const pokemonId = slot.getAttribute("data-id");
    if (!pokemonId || pokemonId === "hello") return;

    const sprite = slot.querySelector("div.big.pokemon");
    if (!sprite) return; // egg or empty slot

    const existing = sprite.querySelector(".pfq-iv-overlay");
    if (existing) return;

    const ivs = await fetchIVs(pokemonId);
    sprite.classList.add("pkmn-sprite");
    const overlay = generateIVOverlay(ivs);
    if (overlay) sprite.appendChild(overlay);
}

/**
 * Injects an IV overlay on top of a field Pokémon sprite.
 * @param {HTMLElement} fieldmonSpan - The span element representing the field Pokémon.
 * @returns {Promise<void>} Resolves when the overlay has been injected or skipped.
 */
async function injectIVOverlay(fieldmonSpan) {
    const pokemonId = fieldmonSpan.attributes["data-id"].value;
    const ivs = await fetchIVs(pokemonId);
    // console.log("[PFQ IV] starting addIVOverlay for:", pokemonId, ivs);

    const existing = fieldmonSpan.querySelector(".pfq-iv-overlay");
    if (existing) {
        // console.log("[PFQ IV] IV overlay already exists for:", pokemonId);
        return;
        // existing.remove();
    }

    fieldmonSpan.classList.add("pkmn-sprite");
    const overlay = generateIVOverlay(ivs);
    if (overlay) {
        // console.log("[PFQ IV] adding IV overlay for:", pokemonId);
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
    const { num0, num31 } = getIVCounts(ivParts);

    // Overlay container
    const overlay = document.createElement("div");
    overlay.className = "pfq-iv-overlay";

    const hasZero = num0 > 0;
    const hasPerfect = num31 > 0;
    if (hasZero || hasPerfect) {
        const badgeRow = document.createElement("div");
        badgeRow.className = "iv-overlay-badge-row";
        if (hasZero) badgeRow.appendChild(createCountBadge(num0, "zero", "overlay"));
        if (hasPerfect) badgeRow.appendChild(createCountBadge(num31, "perfect", "overlay"));
        overlay.appendChild(badgeRow);
    }

    const barContainer = document.createElement("div");
    barContainer.className = "iv-bar-container";
    ivParts.forEach((val) => barContainer.appendChild(createIVBar(val)));
    overlay.appendChild(barContainer);

    return overlay;
}

/**
 * Appends a space and count badge to the tooltip row when count > 0.
 * @param {HTMLElement} row - The IV row element.
 * @param {number} count - Badge count (0 or 31 IVs).
 * @param {'zero' | 'perfect'} type - Badge type.
 */
function appendTooltipBadgeIfAny(row, count, type) {
    if (count <= 0) return;
    row.appendChild(document.createTextNode(" "));
    row.appendChild(createCountBadge(count, type, "tooltip"));
}

/**
 * Generates the IV row UI for tooltips (field/party hover).
 * @param {number[] | null} ivs - Full IV array including total at index 6. Null for eggs.
 * @returns {HTMLDivElement | undefined}
 */
function generateIVTooltip(ivs) {
    if (ivs == null) {
        // console.log("[PFQ IV] This is an egg, skipping IV row generation.");
        return;
    }

    const ivParts = getIVParts(ivs);
    const total = ivs[6];
    const { num0, num31 } = getIVCounts(ivParts);

    const ivRow = document.createElement("div");
    ivRow.className = "pfq-iv-block";

    const label = document.createElement("b");
    label.textContent = "IVs: ";
    ivRow.appendChild(label);

    ivParts.forEach((val, index) => {
        const span = document.createElement("span");
        span.textContent = val;
        span.className = getIVClass(val);
        ivRow.appendChild(span);
        if (index < ivParts.length - 1) ivRow.appendChild(document.createTextNode("/"));
    });

    ivRow.appendChild(document.createTextNode("=" + total));
    appendTooltipBadgeIfAny(ivRow, num0, "zero");
    appendTooltipBadgeIfAny(ivRow, num31, "perfect");

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
 * Creates a single IV bar element (height proportional to IV value).
 * @param {number} val - IV value (0–31).
 * @returns {HTMLElement}
 */
function createIVBar(val) {
    const bar = document.createElement("div");
    bar.className = "iv-bar";
    bar.classList.add(getIVClass(val));
    bar.style.height = `${Math.round((val / 31) * 100)}%`;
    return bar;
}

/**
 * @param {number} value
 * @returns {string} CSS class for the IV value.
 */
function getIVClass(value) {
    if (value === 31) return "pfq-perfect";
    if (value === 0) return "pfq-zero";
    if (value >= 26) return "pfq-high";
    if (value <= 5) return "pfq-low";
    return "pfq-mid";
}