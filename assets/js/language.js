const translations = {

    ar: {
        home: "الرئيسية",
        models: "موديلات 3D",
        books: "الكتب",
        scripts: "السكريبتات",
        mods: "المودات",
        apps: "التطبيقات",
        videos: "فيديوهات تعليمية",

        welcome: "مرحبًا بك في AZZI STORE",
        digital_products: "أفضل المنتجات الرقمية في مكان واحد",

        view_product: "عرض المنتج",
        buy_now: "شراء الآن",

        description: "الوصف",
        format: "النوع",
        file_size: "حجم الملف",

        add_favorite: "❤ إضافة إلى المفضلة",

        product_not_found: "المنتج غير موجود",
        loading_error: "حدث خطأ أثناء تحميل المنتجات",

        models_description: "اكتشف أفضل موديلات 3D",
        books_description: "كتب وروايات رقمية متنوعة",
        scripts_description: "سكريبتات مفيدة للمشاريع",
        mods_description: "مودات وألعاب وتعديلات",
        apps_description: "تطبيقات مفيدة وخفيفة",
        videos_description: "فيديوهات تعليمية مفيدة"
    },
    en: {
        home: "Home",
        models: "3D Models",
        books: "Books",
        scripts: "Scripts",
        mods: "Mods",
        apps: "Apps",
        videos: "Educational Videos",

        welcome: "Welcome to AZZI STORE",
        digital_products: "The best digital products in one place",

        view_product: "View Product",
        buy_now: "Buy Now",

        description: "Description",
        format: "Format",
        file_size: "File Size",

        add_favorite: "❤ Add to Favorites",

        product_not_found: "Product not found",
        loading_error: "An error occurred while loading products",

        models_description: "Discover the best 3D Models",
        books_description: "Various digital books and novels",

        scripts_description: "Useful scripts for your projects",
        mods_description: "Mods, games and modifications",
        apps_description: "Useful and lightweight applications",
        videos_description: "Useful educational videos"
    },
    fr: {
        home: "Accueil",
        models: "Modèles 3D",
        books: "Livres",
        scripts: "Scripts",
        mods: "Mods",
        apps: "Applications",
        videos: "Vidéos éducatives",

        welcome: "Bienvenue sur AZZI STORE",
        digital_products: "Les meilleurs produits numériques au même endroit",

        view_product: "Voir le produit",
        buy_now: "Acheter maintenant",

        description: "Description",
        format: "Format",
        file_size: "Taille du fichier",

        add_favorite: "❤ Ajouter aux favoris",

        product_not_found: "Produit introuvable",
        loading_error: "Une erreur s'est produite lors du chargement des produits",

        models_description: "Découvrez les meilleurs modèles 3D",
        books_description: "Divers livres et romans numériques",

        scripts_description: "Scripts utiles pour vos projets",
        mods_description: "Mods, jeux et modifications",
        apps_description: "Applications utiles et légères",
        videos_description: "Vidéos éducatives utiles"
    }
    };


// تغيير اللغة
function changeLanguage(lang) {

    if (!translations[lang]) {
        lang = "ar";
    }

    localStorage.setItem("language", lang);

    applyLanguage(lang);
}


// تطبيق اللغة
function applyLanguage(lang) {

    if (!translations[lang]) {
        lang = "ar";
    }

    document.querySelectorAll("[data-i18n]").forEach(element => {

        const key = element.getAttribute("data-i18n");

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


// اللغة المحفوظة
const savedLanguage =
    localStorage.getItem("language") || "ar";


// تطبيق اللغة عند فتح الصفحة
document.addEventListener("DOMContentLoaded", () => {

    applyLanguage(savedLanguage);

});
// فتح وإغلاق قائمة اللغات
function toggleLanguageMenu() {

    const menu =
        document.getElementById("language-options");

    if (menu) {

        menu.classList.toggle("show");

    }

}


// اختيار اللغة
function selectLanguage(lang) {

    changeLanguage(lang);

    const menu =
        document.getElementById("language-options");

    if (menu) {

        menu.classList.remove("show");

    }

}
