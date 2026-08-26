/*
 * ==========================================================
 * VA-PAX.CZ MASTER JAVASCRIPT
 *
 * Obsah:
 * 1) Minimalistický VA-PAX footer
 * 2) Odstranění Shoptet brandingu
 * 3) PAX příslušenství – "Kompatibilní s" dropdown
 * ==========================================================
 */

(function () {
    "use strict";


    /* ======================================================
       1. VA-PAX FOOTER
       ====================================================== */

    function mountVaPaxFooter() {

        var shoptetFooter =
            document.querySelector("#footer");

        if (!shoptetFooter) {
            return;
        }


        /*
         * Odstraníme "Vytvořil Shoptet"
         */
        var signature =
            shoptetFooter.querySelector("#signature");

        if (signature) {
            signature.remove();
        }


        /*
         * Pokud už náš footer existuje,
         * nevytváříme ho podruhé.
         */
        if (
            shoptetFooter.querySelector(
                "[data-vp-footer]"
            )
        ) {
            return;
        }


        var footer =
            document.createElement("div");

        footer.className =
            "vp-footer-shell vp-footer-mounted";

        footer.setAttribute(
            "data-vp-footer",
            ""
        );


        footer.innerHTML = `
            <div class="vp-footer-grid">

                <div class="vp-footer-brand">

                    <a
                        class="vp-footer-logo"
                        href="/"
                    >
                        VA-PAX.CZ
                    </a>

                    <div class="vp-footer-brand-label">
                        Autorizovaný prodejce PAX
                    </div>

                    <p class="vp-footer-brand-text">
                        Originální vaporizéry PAX,
                        nejnovější modely a příslušenství
                        na jednom místě.
                    </p>

                </div>


                <div class="vp-footer-column">

                    <span class="vp-footer-column-title">
                        Obchod
                    </span>

                    <div class="vp-footer-links">

                        <a href="/paxvaporizery/">
                            Vaporizéry PAX
                        </a>

                        <a href="/paxprislusenstvi/">
                            Příslušenství
                        </a>

                        <a href="/kontakty/">
                            Kontakt
                        </a>

                    </div>

                </div>


                <div class="vp-footer-column">

                    <span class="vp-footer-column-title">
                        Pomoc
                    </span>

                    <div class="vp-footer-links">

                        <a href="tel:+420724404653">
                            +420 724 404 653
                        </a>

                        <a href="mailto:info@va-pax.cz">
                            info@va-pax.cz
                        </a>

                        <a href="/obchodni-podminky/">
                            Obchodní podmínky
                        </a>

                    </div>

                </div>


                <div class="vp-footer-column">

                    <span class="vp-footer-column-title">
                        VA-PAX
                    </span>

                    <div class="vp-footer-links">

                        <a
                            href="https://www.instagram.com/paxlifecz/"
                            target="_blank"
                            rel="noopener"
                        >
                            Instagram @paxlifecz
                        </a>

                        <a
                            href="https://www.google.com/maps/search/?api=1&query=Z%C3%A1h%C5%99ebsk%C3%A1+10%2C+Praha+2"
                            target="_blank"
                            rel="noopener"
                        >
                            Záhřebská 10, Praha 2
                        </a>

                    </div>

                </div>

            </div>


            <div class="vp-footer-meta">

                <div class="vp-footer-meta-left">

                    <span>
                        VA-PAX.CZ
                    </span>

                    <span class="vp-footer-dot"></span>

                    <span>
                        Praha 2
                    </span>

                </div>


                <div class="vp-footer-meta-right">

                    <span>
                        Originální produkty PAX
                    </span>

                </div>

            </div>
        `;


        /*
         * Vložíme náš footer přímo před
         * Shoptet copyright.
         *
         * Díky tomu nikde nahoře neproblikává.
         */
        var footerBottom =
            shoptetFooter.querySelector(
                ".footer-bottom"
            );


        if (footerBottom) {

            shoptetFooter.insertBefore(
                footer,
                footerBottom
            );

        } else {

            shoptetFooter.appendChild(
                footer
            );

        }
    }



    /* ======================================================
       2. PAX PŘÍSLUŠENSTVÍ
       "KOMPATIBILNÍ S" DROPDOWN
       ====================================================== */

    function initCompatibleSelector() {

        /*
         * Pouze hlavní kategorie
         * /paxprislusenstvi/
         */
        if (
            !document.body ||
            !document.body.classList.contains(
                "in-paxprislusenstvi"
            )
        ) {
            return;
        }


        /*
         * Zabrání vložení dvakrát.
         */
        if (
            document.querySelector(
                ".vp-compatible-selector"
            )
        ) {
            return;
        }


        var categoryTop =
            document.querySelector(
                ".category-top"
            );


        var title =
            categoryTop &&
            categoryTop.querySelector(
                ".category-title"
            );


        var nativeCategories =
            categoryTop &&
            categoryTop.querySelector(
                "ul.subcategories.with-image"
            );


        if (
            !categoryTop ||
            !title ||
            !nativeCategories
        ) {
            return;
        }


        /*
         * Vezmeme odkazy přímo ze Shoptetu.
         *
         * Tzn. nemusíš URL kategorií
         * udržovat ručně v JS.
         */
        var sourceLinks =
            nativeCategories.querySelectorAll(
                ":scope > li > a[href]"
            );


        if (!sourceLinks.length) {
            return;
        }



        /* ==================================================
           WRAPPER
           ================================================== */

        var selector =
            document.createElement("div");

        selector.className =
            "vp-compatible-selector";



        /* ==================================================
           BUTTON
           ================================================== */

        var button =
            document.createElement("button");

        button.type =
            "button";

        button.className =
            "vp-compatible-trigger";


        button.setAttribute(
            "aria-expanded",
            "false"
        );


        button.setAttribute(
            "aria-haspopup",
            "true"
        );


        button.setAttribute(
            "aria-controls",
            "vp-compatible-menu"
        );



        var label =
            document.createElement("span");

        label.textContent =
            "Kompatibilní s:";



        var chevron =
            document.createElement("span");

        chevron.className =
            "vp-compatible-chevron";


        chevron.setAttribute(
            "aria-hidden",
            "true"
        );



        button.appendChild(
            label
        );

        button.appendChild(
            chevron
        );



        /* ==================================================
           DROPDOWN MENU
           ================================================== */

        var menu =
            document.createElement("ul");

        menu.className =
            "vp-compatible-menu";

        menu.id =
            "vp-compatible-menu";



        /*
         * První možnost = všechny produkty
         */
        var allItem =
            document.createElement("li");


        var allLink =
            document.createElement("a");


        allLink.href =
            "/paxprislusenstvi/";


        allLink.textContent =
            "Všechny";


        allItem.appendChild(
            allLink
        );


        menu.appendChild(
            allItem
        );



        /*
         * Zkopírujeme současné Shoptet kategorie:
         *
         * Pro PAX 4
         * Pro PAX Flow
         * Pro PAX Mini
         * Pro PAX Plus
         * Pro PAX 3
         * Doplňky
         */
        sourceLinks.forEach(
            function (sourceLink) {

                var item =
                    document.createElement("li");


                var link =
                    document.createElement("a");


                var textNode =
                    sourceLink.querySelector(
                        ".text"
                    );


                var text =
                    textNode
                        ? textNode.textContent
                        : sourceLink.textContent;


                /*
                 * "Pro PAX 4"
                 * ->
                 * "PAX 4"
                 */
                text =
                    text
                        .replace(
                            /^\s*Pro\s+/i,
                            ""
                        )
                        .replace(
                            /\s+/g,
                            " "
                        )
                        .trim();


                link.href =
                    sourceLink.getAttribute(
                        "href"
                    );


                link.textContent =
                    text;


                item.appendChild(
                    link
                );


                menu.appendChild(
                    item
                );

            }
        );



        selector.appendChild(
            button
        );


        selector.appendChild(
            menu
        );



        /*
         * Dropdown vložíme hned pod H1:
         *
         * PAX příslušenství
         *
         * [ Kompatibilní s:  v ]
         */
        title.insertAdjacentElement(
            "afterend",
            selector
        );



        /* ==================================================
           FUNKCE
           ================================================== */

        function closeMenu() {

            selector.classList.remove(
                "is-open"
            );


            button.setAttribute(
                "aria-expanded",
                "false"
            );

        }



        /* ==================================================
           CLICK
           ================================================== */

        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();


                var isOpen =
                    selector.classList.toggle(
                        "is-open"
                    );


                button.setAttribute(
                    "aria-expanded",
                    isOpen
                        ? "true"
                        : "false"
                );

            }
        );



        /*
         * Kliknutí mimo dropdown
         * jej zavře.
         */
        document.addEventListener(
            "click",
            function (event) {

                if (
                    !selector.contains(
                        event.target
                    )
                ) {

                    closeMenu();

                }

            }
        );



        /*
         * ESC dropdown zavře.
         */
        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Escape" &&
                    selector.classList.contains(
                        "is-open"
                    )
                ) {

                    closeMenu();

                    button.focus();

                }

            }
        );

    }



    /* ======================================================
       3. START VA-PAX
       ====================================================== */

    function initVaPax() {

        mountVaPaxFooter();

        initCompatibleSelector();

    }


    /*
     * Spuštění po připravení DOM.
     */
    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initVaPax,
            {
                once: true
            }
        );

    } else {

        initVaPax();

    }

})();
