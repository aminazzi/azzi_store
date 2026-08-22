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
async function searchProducts() {

    const input =
        document.getElementById("search-input");

    const results =
        document.getElementById("search-results");

    const text =
        input.value.trim().toLowerCase();

    if (text === "") {
        results.innerHTML = "";
        return;
    }

    try {

        const files = [
    "assets/data/models.json",
    "assets/data/books.json",
    "assets/data/mods.json",
    "assets/data/scripts.json",
    "assets/data/apps.json"
];

        const responses =
            await Promise.all(
                files.map(file => fetch(file))
            );

        const data =
            await Promise.all(
                responses.map(response => response.json())
            );

        const products =
            data.flat();

        const found =
            products.filter(product => {

                const name =
                    String(product.name || "")
                    .toLowerCase();

                return name.includes(text);

            });

        if (found.length === 0) {

            results.innerHTML =
                "<p>لم يتم العثور على المنتج.</p>";

            return;

        }

        results.innerHTML = "";

        found.forEach(product => {

            results.innerHTML += `

                <a
                    href="${product.page}"
                    class="search-result">

                    <img
                        src="${product.image}"
                        alt="${product.name}">

                    <div>

                        <h3>
                            ${product.name}
                        </h3>

                        <p>
                            ⭐ ${product.rating}
                        </p>

                        <strong>
                            $${product.price}
                        </strong>

                    </div>

                </a>

            `;

        });

    }

    catch (error) {

        console.error(error);

        results.innerHTML =
            "<p>حدث خطأ أثناء البحث.</p>";

    }

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
