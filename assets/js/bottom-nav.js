(function () {

    "use strict";

    function updateNavigationSize() {

        const header =
            document.querySelector(".header");

        const bottomNav =
            document.querySelector(".bottom-nav");

        /* ارتفاع الهيدر */
        if (header) {

            const headerHeight =
                header.getBoundingClientRect().height;

            document.documentElement.style.setProperty(
                "--header-height",
                headerHeight + "px"
            );
        }

        /* ارتفاع القائمة السفلية */
        if (bottomNav) {

            const navHeight =
                bottomNav.getBoundingClientRect().height;

            document.documentElement.style.setProperty(
                "--nav-height",
                navHeight + "px"
            );
        }
    }


    function exitSite() {
/*
         * محاولة إغلاق النافذة
         * إذا كان المتصفح يمنع ذلك
         * ننتقل إلى صفحة فارغة
         */
        try {
            window.close();
        } catch (error) {
            console.log(error);
        }

        setTimeout(function () {

            try {
                window.location.href = "about:blank";
            } catch (error) {
                console.log(error);
            }

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


    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    } else {

        init();
    }

})();
