(function () {
    "use strict";

    function updateNavigationSize() {
        const header = document.querySelector(".header");

        if (!header) return;

        const height = header.getBoundingClientRect().height;

        document.documentElement.style.setProperty(
            "--nav-height",
            height + "px"
        );
    }

    function exitSite() {

        window.close();

        setTimeout(function () {
            window.location.href = "about:blank";
        }, 150);

    }

    function init() {

        updateNavigationSize();

        window.addEventListener(
            "resize",
            updateNavigationSize
        );

        window.addEventListener(
            "orientationchange",
            updateNavigationSize
        );

        window.addEventListener(
            "load",
            updateNavigationSize
        );

        const exitButton =
            document.getElementById("exitSiteButton");

        if (exitButton) {
            exitButton.addEventListener(
                "click",
                exitSite
            );
        }
    }

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    } else {

        init();

    }

})();
