(function () {
    "use strict";

    function updateNavigationSize() {

        const header =
            document.querySelector(".header");

        if (!header) return;

        const height =
            header.getBoundingClientRect().height;

        document.documentElement.style.setProperty(
            "--nav-height",
            height + "px"
        );
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

        // تحديث بعد تحميل الصور والخطوط
        window.addEventListener(
            "load",
            updateNavigationSize
        );
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
