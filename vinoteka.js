/*
 * ==========================================================
 * VINOTEKAZBIROH.COM
 * MASTER JAVASCRIPT
 * Shoptet / Waltz
 * ==========================================================
 */

(function () {
    "use strict";


    /* ======================================================
       1. VINOTÉKA ZBIROH FOOTER
       ====================================================== */

    function mountVinotekaFooter() {

        var shoptetFooter =
            document.querySelector("#footer");

        if (!shoptetFooter) {
            return;
        }


        /*
         * Odstranění Shoptet signature.
         */
        var signature =
            shoptetFooter.querySelector("#signature");

        if (signature) {
            signature.remove();
        }


        /*
         * Footer už existuje = nic dalšího nevkládáme.
         */
        if (
            shoptetFooter.querySelector(
                "[data-vp-footer]"
            )
        ) {
            return;
        }


        /*
         * Vytvoření vlastního footeru.
         */
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

                <!-- ==========================================
                     BRAND
                     ========================================== -->

                <div class="vp-footer-brand">

                    <a
                        class="vp-footer-logo"
                        href="/"
                    >
                        VINOTÉKA ZBIROH
                    </a>

                    <div class="vp-footer-brand-label">
                        Zámecká vinotéka
                    </div>

                    <p class="vp-footer-brand-text">
                        Vína z nejvýše položené registrované
                        vinice v České republice, přímo
                        ze Zámku Zbiroh.
                    </p>

                </div>


                <!-- ==========================================
                     OBCHOD
                     ========================================== -->

                <div class="vp-footer-column">

                    <span class="vp-footer-column-title">
                        Obchod
                    </span>

                    <div class="vp-footer-links">

                        <a href="/vino/">
                            Víno
                        </a>

                        <a href="/ochutnavky-vin/">
                            Ochutnávky vín
                        </a>

                        <a href="/kontakty/">
                            Kontakt
                        </a>

                    </div>

                </div>


                <!-- ==========================================
                     KONTAKT / POMOC
                     ========================================== -->

                <div class="vp-footer-column">

                    <span class="vp-footer-column-title">
                        Kontakt
                    </span>

                    <div class="vp-footer-links">

                        <a href="tel:+420601001430">
                            +420 601 001 430
                        </a>

                        <a href="mailto:info@zbiroh.com">
                            info@zbiroh.com
                        </a>

                        <a href="/obchodni-podminky/">
                            Obchodní podmínky
                        </a>

                    </div>

                </div>


                <!-- ==========================================
                     ZBIROH
                     ========================================== -->

                <div class="vp-footer-column">

                    <span class="vp-footer-column-title">
                        ZBIROH
                    </span>

                    <div class="vp-footer-links">

                        <a
                            href="https://www.zbiroh.com/"
                            target="_blank"
                            rel="noopener"
                        >
                            Zámek Zbiroh
                        </a>

                        <a
                            href="https://www.instagram.com/chateauzbiroh/"
                            target="_blank"
                            rel="noopener"
                        >
                            Instagram
                        </a>

                        <a
                            href="https://www.google.com/maps/search/?api=1&query=Z%C3%A1mek+Zbiroh%2C+Z%C3%A1mek+1%2C+338+08+Zbiroh"
                            target="_blank"
                            rel="noopener"
                        >
                            Zámek č.p. 1, 338 08 Zbiroh
                        </a>

                    </div>

                </div>

            </div>


            <!-- ==============================================
                 SPODNÍ META ŘÁDEK
                 ============================================== -->

            <div class="vp-footer-meta">

                <div class="vp-footer-meta-left">

                    <span>
                        VINOTÉKA ZBIROH
                    </span>

                    <span class="vp-footer-dot"></span>

                    <span>
                        Zbiroh
                    </span>

                </div>


                <div class="vp-footer-meta-right">

                    <span>
                        Vína ze Zámku Zbiroh
                    </span>

                </div>

            </div>
        `;


        /*
         * Vložíme vlastní footer PŘED systémový footer-bottom,
         * stejně jako u VA-PAX.
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
       2. START
       ====================================================== */

    function initVinotekaZbiroh() {

        mountVinotekaFooter();

    }


    /*
     * Pokud ještě není DOM načtený,
     * počkáme na DOMContentLoaded.
     */
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
