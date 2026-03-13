

function getIVOverlayHTML(ivs) {
    if (!ivs) return null;

    const ivParts = ivs.slice(0, 6);
    const num31 = ivParts.filter(v => v === 31).length;

    const emojiMap = {
        0: "",
        1: "1️⃣",
        2: "2️⃣",
        3: "3️⃣",
        4: "4️⃣",
        5: "5️⃣",
        6: "✅",
    };
    const numEmoji = emojiMap[num31] || "";

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

    ivParts.forEach(val => {
        const bar = document.createElement("div");
        bar.className = "iv-bar";
        // Height or color based on IV
        const percentage = Math.floor((val / 31) * 100);
        bar.style.background = `linear-gradient(to top, #4CAF50 ${percentage}%, rgba(0,0,0,0.2) 0%)`;
        barContainer.appendChild(bar);
    });

    overlay.appendChild(barContainer);

    return overlay;
}

/**
 * Generates the UI for the IV row to be injected in the HTML.
 * @param {number[]} ivs list of all 6 IVs and the total (ex. [31, 31, 31, 31, 31, 31, 186])
 *    When null, that means this is an egg or an empty slot.
 * @returns {Element} A div element containing the formatted IV string.
 */
function getIVTooltipHTML(ivs) {
    if (ivs == null) {
        // console.log("[PFQ IV] This is an egg, skipping IV row generation.");
        return;
    }

    // Calculate IV parts and classes
    const ivParts = ivs.slice(0, 6);
    const ivStringTotal = ivParts.join("/");
    const total = ivs[6];

    const num31 = ivParts.filter((v) => v === 31).length;
    const emojiMap = {
        0: "",
        1: "1️⃣",
        2: "2️⃣",
        3: "3️⃣",
        4: "4️⃣",
        5: "5️⃣",
        6: "✅",
    };
    const numEmoji = emojiMap[num31] || "";

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