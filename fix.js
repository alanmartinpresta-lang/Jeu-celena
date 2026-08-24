/* ============================================================
   MYSTERY LOVE ISLAND — CORRECTIF DÉMARRAGE
   ============================================================ */

(() => {
    "use strict";

    function initFix() {

        const startButton =
            document.getElementById("startBtn");

        const gameScreen =
            document.getElementById("gameScreen");

        if (!startButton || !gameScreen) {
            console.error(
                "Fix démarrage : élément introuvable."
            );
            return;
        }

        startButton.addEventListener("click", () => {

            /*
             * game.js lance déjà toute l'aventure.
             * Il oubliait simplement d'afficher
             * le conteneur principal du jeu.
             */

            requestAnimationFrame(() => {

                gameScreen.classList.remove("hidden");

                gameScreen.style.display = "block";

            });

        });

    }

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initFix,
            { once: true }
        );

    } else {

        initFix();

    }

})();
