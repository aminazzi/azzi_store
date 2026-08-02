// فتح وإغلاق القائمة الجانبية
function toggleMenu() {
    document.getElementById("sidebar").classList.toggle("active");
}

// البحث (سنطوره لاحقًا)
function toggleSearch() {
    alert("سيتم إضافة البحث الاحترافي في الإصدار القادم 🔍");
}

// تغيير اللغة
let currentLang = "ar";

document.getElementById("langBtn").addEventListener("click", function () {

    if (currentLang === "ar") {

        currentLang = "en";

        document.documentElement.lang = "en";
        document.documentElement.dir = "ltr";

        document.querySelector(".hero h2").innerText =
            "The Best Digital Marketplace";

        document.querySelector(".hero p").innerText =
            "3D Models, PDF Books, Mods, Scripts, Fonts & Templates.";

        document.querySelector(".btn").innerText =
            "Start Shopping";

    } else {

        currentLang = "ar";

        document.documentElement.lang = "ar";
        document.documentElement.dir = "rtl";

        document.querySelector(".hero h2").innerText =
            "أفضل متجر للمنتجات الرقمية";

        document.querySelector(".hero p").innerText =
            "بيع موديلات ثلاثية الأبعاد، كتب PDF، مودات، سكربتات، خطوط وقوالب.";

        document.querySelector(".btn").innerText =
            "ابدأ التسوق";
    }

});
