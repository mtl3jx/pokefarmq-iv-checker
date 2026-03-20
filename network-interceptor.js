(function () {
    // console.log("[PFQ IV] network-interceptor.js loaded");

    function emit(url, body) {
        window.postMessage(
            {
                type: "NETWORK_RESPONSE",
                payload: { url, body }
            },
            "*"
        );
    }

    /**
     * -----------------------------
     * FETCH INTERCEPTION
     * -----------------------------
     */
    const originalFetch = window.fetch;

    window.fetch = async function (...args) {
        try {
            const response = await originalFetch.apply(this, args);

            const clone = response.clone();

            clone.text().then(body => {
                const url =
                    typeof args[0] === "string"
                        ? args[0]
                        : args[0]?.url;

                emit(url, body);
            }).catch(() => { });

            return response;
        } catch (err) {
            return originalFetch.apply(this, args);
        }
    };

    /**
     * -----------------------------
     * XHR INTERCEPTION
     * -----------------------------
     */
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
        this._pfqUrl = url;
        return originalOpen.call(this, method, url, ...rest);
    };

    XMLHttpRequest.prototype.send = function (...args) {
        this.addEventListener("load", function () {
            try {
                emit(this._pfqUrl, this.responseText);
            } catch (e) { }
        });

        return originalSend.apply(this, args);
    };

})();