const translations = {

    ar: {

        home: "الرئيسية",
        models: "موديلات 3D",
        books: "الكتب",
        scripts: "السكريبتات",
        mods: "المودات",
        apps: "التطبيقات",
        videos: "فيديوهات تعليمية",

        favorites: "المفضلة",
        cart: "السلة",
        contact: "اتصل بنا",
        about: "من نحن",

        hero_title: "أفضل متجر للمنتجات الرقمية",

        hero_description:
        "الأدوات التي يستخدمها المحترفون... أصبحت بين يديك. تخيل أن تبدأ مشروعك وتجد أمامك عالماً متكاملاً من المنتجات الرقمية.",

        shop_now: "ابدأ التسوق",

        categories: "الأقسام"

    },

    en: {

        home: "Home",
        models: "3D Models",
        books: "Books",
        scripts: "Scripts",
        mods: "Mods",
        apps: "Apps",
        videos: "Educational Videos",

        favorites: "Favorites",
        cart: "Cart",
        contact: "Contact Us",
        about: "About Us",

        hero_title: "The Best Digital Products Store",

        hero_description:
        "The tools used by professionals are now in your hands. Start your project with a complete collection of digital products.",

        shop_now: "Start Shopping",

        categories: "Categories"

    },
    fr: {

        home: "Accueil",
        models: "Modèles 3D",
        books: "Livres",
        scripts: "Scripts",
        mods: "Mods",
        apps: "Applications",
        videos: "Vidéos éducatives",

        favorites: "Favoris",
        cart: "Panier",
        contact: "Contact",
        about: "À propos",

        hero_title:
        "Le meilleur magasin de produits numériques",

        hero_description:
        "Les outils utilisés par les professionnels sont maintenant entre vos mains. Commencez votre projet avec une collection complète de produits numériques.",

        shop_now: "Commencer les achats",

        categories: "Catégories"

    }

};
function changeLanguage(lang) {

    if (!translations[lang]) {
        lang = "ar";
    }

    localStorage.setItem("language", lang);

    applyLanguage(lang);

}


function applyLanguage(lang) {

    if (!translations[lang]) {
        lang = "ar";
    }

    document
    .querySelectorAll("[data-i18n]")
    .forEach(element => {

        const key =
            element.getAttribute("data-i18n");

        if (translations[lang][key]) {

            element.textContent =
                translations[lang][key];

        }

    });


    document.documentElement.lang = lang;


    if (lang === "ar") {

        document.documentElement.dir = "rtl";

    } else {

        document.documentElement.dir = "ltr";

    }

}
const savedLanguage =
    localStorage.getItem("language") || "ar";


document.addEventListener("DOMContentLoaded", () => {

    applyLanguage(savedLanguage);

});


function toggleLanguageMenu() {

    const menu =
        document.getElementById("language-options");

    if (menu) {

        menu.classList.toggle("show");

    }

}


function selectLanguage(lang) {

    changeLanguage(lang);

    const menu =
        document.getElementById("language-options");

    if (menu) {

        menu.classList.remove("show");

    }

}
