/* =========================================
   AZZI STORE THEME
   Dark / Light Mode
========================================= */

(function () {

    "use strict";

    const STORAGE_KEY = "azzi-store-theme";

    function getTheme() {
        return localStorage.getItem(STORAGE_KEY) || "dark";
    }

    function applyTheme(theme) {

        if (theme === "light") {
            document.body.classList.add("light-mode");
        } else {
            document.body.classList.remove("light-mode");
        }

        updateButton(theme);
    }

    function updateButton(theme) {

        const button =
            document.getElementById("themeToggle");

        if (!button) {
            return;
        }

        const icon =
            button.querySelector(".theme-icon");

        const text =
            button.querySelector(".theme-text");

        if (theme === "light") {

            if (icon) {
                icon.textContent = "🌙";
            }

            if (text) {
                text.textContent = "الوضع الليلي";
            }

        } else {

            if (icon) {
                icon.textContent = "☀️";
            }

            if (text) {
                text.textContent = "الوضع النهاري";
            }
        }
    }
function toggleTheme() {

        const isLight =
            document.body.classList.contains("light-mode");

        const newTheme =
            isLight ? "dark" : "light";

        localStorage.setItem(
            STORAGE_KEY,
            newTheme
        );

        applyTheme(newTheme);
    }

    function init() {

        const savedTheme = getTheme();

        applyTheme(savedTheme);

        const button =
            document.getElementById("themeToggle");

        if (button) {

            button.addEventListener(
                "click",
                toggleTheme
            );

        }
    }

    /*
       نطبق الوضع قبل ظهور الصفحة
       وننتظر DOM إذا لزم الأمر
    */

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
