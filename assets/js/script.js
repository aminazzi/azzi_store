// فتح وإغلاق القائمة الجانبية
function toggleMenu() {
    document.getElementById("sidebar").classList.toggle("active");
}

function toggleSearch() {

    let box = document.getElementById("search-box");

    if (box) {
        box.remove();
        return;
    }

    box = document.createElement("div");

    box.id = "search-box";

    box.innerHTML = `
        <input
            type="text"
            id="search-input"
            placeholder="ابحث عن منتج..."
            autocomplete="off">

        <div id="search-results"></div>
    `;

    document.body.appendChild(box);

    const input =
        document.getElementById("search-input");

    input.focus();

    input.addEventListener("input", searchProducts);
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
