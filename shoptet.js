/*
 * ==========================================================
 * VA-PAX.CZ MASTER JAVASCRIPT
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


        var signature =
            shoptetFooter.querySelector("#signature");

        if (signature) {
            signature.remove();
        }


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

                    <span>VA-PAX.CZ</span>

                    <span class="vp-footer-dot"></span>

                    <span>Praha 2</span>

                </div>


                <div class="vp-footer-meta-right">

                    <span>
                        Originální produkty PAX
                    </span>

                </div>

            </div>
        `;


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
       2. PAX PŘÍSLUŠENSTVÍ DROPDOWN
       ====================================================== */

    function initCompatibleSelector() {

        var routes = [
            {
                href: "/paxprislusenstvi/",
                label: "Vše"
            },
            {
                href: "/pro-pax-4/",
                label: "PAX 4"
            },
            {
                href: "/pro-pax-flow/",
                label: "PAX Flow"
            },
            {
                href: "/pro-pax-mini/",
                label: "PAX Mini"
            },
            {
                href: "/pro-pax-plus/",
                label: "PAX Plus"
            },
            {
                href: "/pro-pax-3/",
                label: "PAX 3"
            },
            {
                href: "/doplnky/",
                label: "Doplňky"
            }
        ];


        var currentPath =
            window.location.pathname
                .replace(
                    /\/strana-\d+\/?$/i,
                    "/"
                );


        var currentRoute =
            routes.find(
                function (route) {
                    return currentPath === route.href;
                }
            );


        if (!currentRoute) {
            return;
        }


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


        if (
            !categoryTop ||
            !title
        ) {
            return;
        }


        /*
         * Schováme původní obrázkové podkategorie.
         */
        var nativeCategories =
            categoryTop.querySelector(
                "ul.subcategories.with-image"
            );


        if (nativeCategories) {
            nativeCategories.style.display =
                "none";
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



        /*
         * TADY JE HLAVNÍ ZMĚNA:
         *
         * místo "Kompatibilní s:"
         * ukážeme aktuální kategorii.
         */
        var label =
            document.createElement("span");

        label.textContent =
            currentRoute.label;



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
           MENU
           ================================================== */

        var menu =
            document.createElement("ul");

        menu.className =
            "vp-compatible-menu";

        menu.id =
            "vp-compatible-menu";



        routes.forEach(
            function (route) {

                var item =
                    document.createElement("li");


                var link =
                    document.createElement("a");


                link.href =
                    route.href;


                link.textContent =
                    route.label;



                /*
                 * Aktuálně zvolená stránka.
                 */
                if (
                    currentPath === route.href
                ) {

                    link.setAttribute(
                        "aria-current",
                        "page"
                    );

                }


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



        title.insertAdjacentElement(
            "afterend",
            selector
        );



        /* ==================================================
           OVLÁDÁNÍ
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
       3. START
       ====================================================== */

    function initVaPax() {

        mountVaPaxFooter();

        initCompatibleSelector();

    }


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
