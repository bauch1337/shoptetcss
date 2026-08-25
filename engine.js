
(function () {

    if (window.VaPaxRelatedEngineLoaded) {
        return;
    }

    window.VaPaxRelatedEngineLoaded = true;


    function clean(text) {
        return (text || "")
            .replace(/\s+/g, " ")
            .trim();
    }


    function normalize(text) {
        return clean(text)
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }


    function absoluteUrl(url) {
        if (!url) return "";

        try {
            return new URL(
                url,
                window.location.origin
            ).href;
        } catch (e) {
            return url;
        }
    }


    function fetchDocument(url) {
        return fetch(url, {
            credentials: "same-origin",
            cache: "default"
        })
        .then(function (response) {
            if (!response.ok) {
                throw new Error(
                    "HTTP " + response.status
                );
            }

            return response.text();
        })
        .then(function (html) {
            return new DOMParser()
                .parseFromString(
                    html,
                    "text/html"
                );
        });
    }


    function firstUsefulSrc(value) {
        if (!value) return "";

        var source =
            value.split(",")[0]
                .trim()
                .split(/\s+/)[0];

        if (
            !source ||
            source.indexOf("data:image") === 0 ||
            source === "about:blank"
        ) {
            return "";
        }

        return absoluteUrl(source);
    }


    function getImageFromElement(img) {
        if (!img) return "";

        var attrs = [
            "data-src",
            "data-original",
            "data-lazy",
            "data-image",
            "data-srcset",
            "srcset",
            "src"
        ];

        for (
            var i = 0;
            i < attrs.length;
            i++
        ) {
            var src =
                firstUsefulSrc(
                    img.getAttribute(
                        attrs[i]
                    )
                );

            if (src) return src;
        }

        return "";
    }


    function findNameLink(product) {
        var selectors = [
            "a.name[href]",
            ".p-in-in a[href]",
            "[data-micro='name']",
            "[itemprop='name']",
            "a[href][title]"
        ];

        for (
            var i = 0;
            i < selectors.length;
            i++
        ) {
            var node =
                product.querySelector(
                    selectors[i]
                );

            if (!node) continue;

            if (
                node.tagName &&
                node.tagName.toLowerCase() !== "a"
            ) {
                node =
                    node.closest("a[href]");
            }

            if (!node) continue;

            var text =
                clean(
                    node.textContent
                );

            if (
                text &&
                !/^(detail|do košíku|koupit)$/i.test(
                    text
                )
            ) {
                return node;
            }
        }

        return null;
    }


    function findPrice(product) {
        var selectors = [
            ".price-final",
            ".price-final-holder",
            ".price",
            "[data-micro='price']",
            "[itemprop='price']"
        ];

        for (
            var i = 0;
            i < selectors.length;
            i++
        ) {
            var node =
                product.querySelector(
                    selectors[i]
                );

            if (!node) continue;

            var text =
                clean(
                    node.textContent ||
                    node.getAttribute("content")
                );

            if (
                text &&
                /\d/.test(text)
            ) {
                return text;
            }
        }

        return "";
    }


    function findStock(product) {
        var node =
            product.querySelector(
                ".availability," +
                ".availability-value," +
                "[class*='availability']"
            );

        if (!node) return "";

        var text =
            clean(
                node.textContent
            );

        return text.length <= 45
            ? text
            : "";
    }


    function findFlag(product) {
        var nodes =
            product.querySelectorAll(
                ".flag," +
                ".flags," +
                ".flags-default," +
                "[class*='flag-']"
            );

        var text = "";

        nodes.forEach(
            function (node) {
                text +=
                    " " +
                    node.textContent;
            }
        );

        text =
            normalize(text);

        if (
            text.indexOf("novinka") !== -1
        ) {
            return {
                text: "Novinka",
                css: "is-new"
            };
        }

        if (
            text.indexOf("akce") !== -1
        ) {
            return {
                text: "Akce",
                css: "is-action"
            };
        }

        if (
            text.indexOf("sleva") !== -1
        ) {
            return {
                text: "Sleva",
                css: "is-sale"
            };
        }

        if (
            text.indexOf("tip") !== -1
        ) {
            return {
                text: "Tip",
                css: "is-tip"
            };
        }

        return null;
    }


    function findImage(product) {
        var images =
            product.querySelectorAll(
                "img"
            );

        for (
            var i = 0;
            i < images.length;
            i++
        ) {
            var src =
                getImageFromElement(
                    images[i]
                );

            if (src) return src;
        }

        return "";
    }


    function getProductContainers(doc) {
        var selectors = [
            ".products-block .product",
            ".products.products-block .product",
            ".products-inline .product",
            "#products .product",
            ".products .product",
            "[data-micro='product']",
            "[itemtype*='Product']"
        ];

        var best = [];

        selectors.forEach(
            function (selector) {
                var found =
                    Array.prototype.slice.call(
                        doc.querySelectorAll(
                            selector
                        )
                    );

                if (
                    found.length >
                    best.length
                ) {
                    best = found;
                }
            }
        );

        return best.length
            ? best
            : Array.prototype.slice.call(
                doc.querySelectorAll(
                    ".product"
                )
            );
    }


    function extractProducts(doc) {
        var containers =
            getProductContainers(doc);

        var products = [];
        var seen = {};

        containers.forEach(
            function (container) {
                var nameLink =
                    findNameLink(
                        container
                    );

                if (!nameLink) return;

                var href =
                    absoluteUrl(
                        nameLink.getAttribute(
                            "href"
                        )
                    );

                var name =
                    clean(
                        nameLink.textContent
                    );

                if (
                    !href ||
                    !name ||
                    seen[href]
                ) {
                    return;
                }

                seen[href] = true;

                products.push({
                    href: href,
                    name: name,
                    price:
                        findPrice(
                            container
                        ),
                    stock:
                        findStock(
                            container
                        ),
                    image:
                        findImage(
                            container
                        ),
                    flag:
                        findFlag(
                            container
                        )
                });
            }
        );

        return products;
    }


    function fetchFallbackImage(url) {
        return fetchDocument(url)
            .then(function (doc) {
                var meta =
                    doc.querySelector(
                        'meta[property="og:image"],' +
                        'meta[name="twitter:image"]'
                    );

                return (
                    meta &&
                    meta.content
                )
                    ? absoluteUrl(
                        meta.content
                    )
                    : "";
            })
            .catch(function () {
                return "";
            });
    }


    function buildCard(product, duplicate) {
        var card =
            document.createElement(
                "article"
            );

        card.className =
            "vp-related-card";

        if (duplicate) {
            card.setAttribute(
                "aria-hidden",
                "true"
            );
        }


        var hit =
            document.createElement(
                "a"
            );

        hit.className =
            "vp-related-hit";

        hit.href =
            product.href;

        hit.setAttribute(
            "aria-label",
            product.name
        );


        var image =
            document.createElement(
                "div"
            );

        image.className =
            "vp-related-image";


        if (product.flag) {
            var badge =
                document.createElement(
                    "span"
                );

            badge.className =
                "vp-related-badge " +
                product.flag.css;

            badge.textContent =
                product.flag.text;

            image.appendChild(
                badge
            );
        }


        var img =
            document.createElement(
                "img"
            );

        img.alt =
            product.name;

        img.loading =
            "lazy";

        img.decoding =
            "async";


        if (product.image) {
            img.src =
                product.image;
        } else {
            image.classList.add(
                "is-loading"
            );
        }

        image.appendChild(
            img
        );


        var body =
            document.createElement(
                "div"
            );

        body.className =
            "vp-related-body";


        var title =
            document.createElement(
                "h3"
            );

        title.className =
            "vp-related-name";

        title.textContent =
            product.name;


        var stock =
            document.createElement(
                "div"
            );

        stock.className =
            "vp-related-stock";

        stock.textContent =
            product.stock || "";


        var bottom =
            document.createElement(
                "div"
            );

        bottom.className =
            "vp-related-bottom";


        var price =
            document.createElement(
                "div"
            );

        price.className =
            "vp-related-price";

        price.textContent =
            product.price || "";


        var detail =
            document.createElement(
                "span"
            );

        detail.className =
            "vp-related-detail";

        detail.textContent =
            "Detail";


        bottom.appendChild(
            price
        );

        bottom.appendChild(
            detail
        );

        body.appendChild(
            title
        );

        body.appendChild(
            stock
        );

        body.appendChild(
            bottom
        );

        card.appendChild(
            hit
        );

        card.appendChild(
            image
        );

        card.appendChild(
            body
        );


        if (!product.image) {
            fetchFallbackImage(
                product.href
            )
            .then(function (
                resolved
            ) {
                image.classList.remove(
                    "is-loading"
                );

                if (resolved) {
                    img.src =
                        resolved;
                } else {
                    img.remove();
                }
            });
        }

        return card;
    }


    function setupInfiniteRail(
        rail,
        products
    ) {
        var SETS = 7;
        var CENTER = 3;

        rail.innerHTML = "";

        for (
            var s = 0;
            s < SETS;
            s++
        ) {
            products.forEach(
                function (product) {
                    rail.appendChild(
                        buildCard(
                            product,
                            s !== CENTER
                        )
                    );
                }
            );
        }

        var setWidth = 0;
        var relocating = false;
        var timer = null;

        requestAnimationFrame(
            function () {
                requestAnimationFrame(
                    function () {
                        setWidth =
                            rail.scrollWidth /
                            SETS;

                        if (!setWidth) return;

                        rail.scrollLeft =
                            setWidth *
                            CENTER;
                    }
                );
            }
        );


        function keepCentered() {
            if (
                relocating ||
                !setWidth
            ) {
                return;
            }

            var x =
                rail.scrollLeft;

            if (
                x < setWidth ||
                x > setWidth *
                    (SETS - 2)
            ) {
                relocating = true;

                var relative =
                    (
                        x % setWidth +
                        setWidth
                    ) %
                    setWidth;

                var snap =
                    rail.style.scrollSnapType;

                var behavior =
                    rail.style.scrollBehavior;

                rail.style.scrollSnapType =
                    "none";

                rail.style.scrollBehavior =
                    "auto";

                rail.scrollLeft =
                    setWidth *
                    CENTER +
                    relative;

                requestAnimationFrame(
                    function () {
                        rail.style.scrollSnapType =
                            snap;

                        rail.style.scrollBehavior =
                            behavior;

                        relocating = false;
                    }
                );
            }
        }


        rail.addEventListener(
            "scroll",
            function () {
                clearTimeout(timer);

                timer =
                    setTimeout(
                        keepCentered,
                        70
                    );
            },
            {
                passive: true
            }
        );


        return function step(
            direction
        ) {
            var card =
                rail.querySelector(
                    ".vp-related-card"
                );

            if (!card) return;

            var style =
                getComputedStyle(
                    rail
                );

            var gap =
                parseFloat(
                    style.gap ||
                    "14"
                );

            var distance =
                card
                    .getBoundingClientRect()
                    .width +
                (
                    isNaN(gap)
                        ? 14
                        : gap
                );

            rail.scrollBy({
                left:
                    distance *
                    direction,
                behavior:
                    "smooth"
            });
        };
    }


    function getExcludedUrls(
        section
    ) {
        var id =
            section.getAttribute(
                "data-vp-exclude-from"
            );

        if (!id) {
            return [];
        }

        var source =
            document.getElementById(
                id
            );

        return (
            source &&
            Array.isArray(
                source._vpLoadedUrls
            )
        )
            ? source._vpLoadedUrls
            : [];
    }


    function initSection(section) {
        if (
            section.dataset.vpReady ===
            "1"
        ) {
            return Promise.resolve();
        }

        section.dataset.vpReady =
            "1";

        var category =
            section.getAttribute(
                "data-vp-category"
            );

        var rail =
            section.querySelector(
                ".vp-related-rail"
            );

        var prev =
            section.querySelector(
                "[data-vp-prev]"
            );

        var next =
            section.querySelector(
                "[data-vp-next]"
            );

        if (
            !category ||
            !rail
        ) {
            return Promise.resolve();
        }


        return fetchDocument(
            category
        )
        .then(function (doc) {
            var excluded =
                getExcludedUrls(
                    section
                );

            var products =
                extractProducts(
                    doc
                )
                .filter(
                    function (product) {
                        return (
                            excluded.indexOf(
                                product.href
                            ) === -1
                        );
                    }
                );

            if (!products.length) {
                throw new Error(
                    "No products found"
                );
            }

            section._vpLoadedUrls =
                products.map(
                    function (product) {
                        return product.href;
                    }
                );

            var step =
                setupInfiniteRail(
                    rail,
                    products
                );

            if (prev) {
                prev.addEventListener(
                    "click",
                    function () {
                        step(-1);
                    }
                );
            }

            if (next) {
                next.addEventListener(
                    "click",
                    function () {
                        step(1);
                    }
                );
            }
        })
        .catch(function () {
            var all =
                section.querySelector(
                    ".vp-related-all"
                );

            rail.innerHTML =
                '<div class="vp-related-status">' +
                'Produkty se momentálně nepodařilo načíst.' +
                (
                    all
                        ? ' <a href="' +
                          all.href +
                          '" style="color:#111;text-decoration:underline!important;">Otevřít kategorii →</a>'
                        : ''
                ) +
                '</div>';
        });
    }


    function initAll() {
        var sections =
            Array.prototype.slice.call(
                document.querySelectorAll(
                    ".vp-related-section[data-vp-category]"
                )
            );

        /*
         * Sekce se načítají postupně.
         * Díky tomu může "Doplňky" vyřadit URL,
         * které už zobrazilo modelové příslušenství.
         */
        sections.reduce(
            function (
                promise,
                section
            ) {
                return promise.then(
                    function () {
                        return initSection(
                            section
                        );
                    }
                );
            },
            Promise.resolve()
        );
    }


    if (
        document.readyState ===
        "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            initAll
        );
    } else {
        initAll();
    }

})();
