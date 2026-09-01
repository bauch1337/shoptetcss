/*
 * ==========================================================
 * VINOTEKAZBIROH.COM
 * MASTER JAVASCRIPT
 * Shoptet / Waltz
 * ==========================================================
 *
 * Určeno k použití společně s:
 * vinotekazbiroh-master.css
 *
 * Co tento soubor dělá:
 * 1) odstraní případné zbytky starého VA-PAX custom JS,
 * 2) NEVYTVÁŘÍ vlastní footer – používá nativní Shoptet footer,
 * 3) stabilizuje desktopový Waltz dropdown proti inline
 *    slideDown / slideUp stylům,
 * 4) na mobilní navigaci záměrně nesahá,
 * 5) nechává Shoptetu košík, cookie lištu, 18+ kontrolu,
 *    přihlášení, vyhledávání a další systémové funkce.
 */

(function () {
    "use strict";

    var DESKTOP_BREAKPOINT = 1001;
    var dropdownObserver = null;
    var navigationObserver = null;
    var rafId = null;


    /* ======================================================
       1. HELPERS
       ====================================================== */

    function isDesktop() {
        return window.innerWidth >= DESKTOP_BREAKPOINT;
    }


    function schedule(callback) {
        if (rafId) {
            window.cancelAnimationFrame(rafId);
        }

        rafId = window.requestAnimationFrame(function () {
            rafId = null;
            callback();
        });
    }


    /* ======================================================
       2. ODSTRANĚNÍ STARÝCH VA-PAX PRVKŮ
       ====================================================== */

    function cleanupLegacyVaPax() {
        var legacySelectors = [
            "[data-vp-footer]",
            ".vp-compatible-selector"
        ];

        document
            .querySelectorAll(legacySelectors.join(","))
            .forEach(function (element) {
                element.remove();
            });
    }


    /* ======================================================
       3. DESKTOP WALTZ DROPDOWN FIX
       ======================================================

       Waltz / starší Shoptet JS může při hoveru používat
       jQuery slideDown / slideUp a zapisovat inline hodnoty:

       display
       height
       overflow

       CSS master má vlastní desktopový dropdown, takže na
       desktopu tyto inline hodnoty průběžně odstraníme.

       Na mobilu se do submenu NEZASAHUJE.
       ====================================================== */

    function getDesktopDropdowns() {
        return document.querySelectorAll(
            ".navigation-in > ul > li > ul.menu-level-2"
        );
    }


    function normalizeDropdown(dropdown) {
        if (!dropdown || !isDesktop()) {
            return;
        }

        var style = dropdown.style;

        [
            "display",
            "height",
            "min-height",
            "max-height",
            "overflow",
            "overflow-x",
            "overflow-y"
        ].forEach(function (property) {
            if (style.getPropertyValue(property)) {
                style.removeProperty(property);
            }
        });
    }


    function normalizeAllDropdowns() {
        if (!isDesktop()) {
            return;
        }

        getDesktopDropdowns().forEach(function (dropdown) {
            normalizeDropdown(dropdown);
        });
    }


    function stopDropdownObserver() {
        if (dropdownObserver) {
            dropdownObserver.disconnect();
            dropdownObserver = null;
        }
    }


    function observeDropdownStyles() {
        stopDropdownObserver();

        if (!isDesktop()) {
            return;
        }

        var navigation =
            document.querySelector(".navigation-in");

        if (!navigation) {
            return;
        }

        dropdownObserver =
            new MutationObserver(function (mutations) {

                var needsNormalize = false;

                mutations.forEach(function (mutation) {

                    if (
                        mutation.type === "attributes" &&
                        mutation.attributeName === "style" &&
                        mutation.target.matches(
                            ".navigation-in > ul > li > ul.menu-level-2"
                        )
                    ) {
                        needsNormalize = true;
                    }

                });


                if (needsNormalize) {
                    schedule(normalizeAllDropdowns);
                }

            });


        dropdownObserver.observe(
            navigation,
            {
                subtree: true,
                attributes: true,
                attributeFilter: ["style"]
            }
        );
    }


    /* ======================================================
       4. NAVIGACE – OBNOVA PŘI DYNAMICKÉ ZMĚNĚ DOM
       ====================================================== */

    function initNavigationFix() {
        normalizeAllDropdowns();
        observeDropdownStyles();
    }


    function observeNavigationReplacement() {

        if (navigationObserver) {
            navigationObserver.disconnect();
        }


        var header =
            document.querySelector("#header");


        if (!header) {
            return;
        }


        navigationObserver =
            new MutationObserver(function (mutations) {

                var navigationChanged =
                    mutations.some(function (mutation) {
                        return mutation.type === "childList";
                    });


                if (navigationChanged) {
                    schedule(initNavigationFix);
                }

            });


        navigationObserver.observe(
            header,
            {
                childList: true,
                subtree: true
            }
        );
    }


    /* ======================================================
       5. BREAKPOINT / RESIZE
       ====================================================== */

    function bindViewportChanges() {

        var lastDesktopState =
            isDesktop();


        window.addEventListener(
            "resize",
            function () {

                schedule(function () {

                    var currentDesktopState =
                        isDesktop();


                    if (
                        currentDesktopState !==
                        lastDesktopState
                    ) {

                        lastDesktopState =
                            currentDesktopState;

                        initNavigationFix();

                        return;
                    }


                    if (currentDesktopState) {
                        normalizeAllDropdowns();
                    }

                });

            },
            {
                passive: true
            }
        );
    }


    /* ======================================================
       6. START
       ====================================================== */

    function initVinotekaZbiroh() {

        cleanupLegacyVaPax();

        initNavigationFix();

        observeNavigationReplacement();

        bindViewportChanges();


        document
            .documentElement
            .classList
            .add("vz-js-ready");
    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initVinotekaZbiroh,
            {
                once: true
            }
        );

    } else {

        initVinotekaZbiroh();

    }

})();
