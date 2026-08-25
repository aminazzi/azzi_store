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

    const input = document.getElementById("search-input");

    input.focus();

    input.addEventListener("input", searchProducts);
}
async function searchProducts() {

    const input = document.getElementById("search-input");
    const results = document.getElementById("search-results");

    if (!input || !results) return;

    const text = input.value.trim().toLowerCase();

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

        const responses = await Promise.all(
            files.map(file => fetch(file))
        );
        // التأكد من أن جميع الملفات موجودة
        for (const response of responses) {
            if (!response.ok) {
                throw new Error("تعذر تحميل ملف المنتجات");
            }
        }

        const data = await Promise.all(
            responses.map(response => response.json())
        );

        const products = data.flat();

        const found = products.filter(product => {

            const name = String(product.name || "")
                .toLowerCase();

            return name.includes(text);

        });


        if (found.length === 0) {

            results.innerHTML = `
                <p class="no-results">
                    لم يتم العثور على المنتج.
                </p>
                `;

            return;
        }


        results.innerHTML = "";


        found.forEach(product => {

            /*
             * إنشاء رابط المنتج مباشرة
             * بدل الاعتماد على product.page
             */
            const productLink =
            `pages/product.html?id=${encodeURIComponent(product.id)}`;


            /*
             * الصورة الموجودة في JSON
             */
            let image = product.image || "";


            /*
             * إذا كانت الصورة تبدأ بـ ../
             * نحذفها لأن البحث موجود في الصفحة الرئيسية
             */
            if (image.startsWith("../")) {
                image = image.substring(3);
            }


            results.innerHTML += `

                <a
                    href="${productLink}"
                    class="search-result">
                    <img
                        src="${image}"
                        alt="${product.name}"
                        onerror="this.style.display='none';">

                    <div class="search-result-info">

                        <h3>
                            ${product.name || "منتج"}
                        </h3>

                        <p>
                            ⭐ ${product.rating || 0}
                        </p>

                        <strong>
                            $${product.price || 0}
                        </strong>

                    </div>

                </a>

            `;

        });


    } catch (error) {

        console.error("Search error:", error);

        results.innerHTML = `
            <p class="search-error">
                حدث خطأ أثناء البحث.
            </p>
        `;
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
// ==============================
// فتح المفضلة
// ==============================

const favoritesBtn =
    document.getElementById("favorites-btn");

if (favoritesBtn) {

    favoritesBtn.addEventListener("click", function () {

        const favorites =
            JSON.parse(
                localStorage.getItem("azziFavorites") || "[]"
            );


        // إنشاء نافذة المفضلة
        const box =
            document.createElement("div");

        box.id = "favorites-box";

        box.style.cssText = `
            position:fixed;
            top:0;
            left:0;
            width:100%;
            height:100%;
            background:rgba(0,0,0,0.75);
            z-index:9999;
            padding:20px;
            box-sizing:border-box;
            overflow-y:auto;
        `;
        // ==============================
        // عنوان نافذة المفضلة
        // ==============================

        let html = `

            <div style="
                max-width:600px;
                margin:40px auto;
                background:#111827;
                padding:20px;
                border-radius:15px;
                color:white;
                direction:rtl;
            ">

                <button
                    id="close-favorites"
                    style="
                        float:left;
                        background:none;
                        border:none;
                        color:white;
                        font-size:25px;
                        cursor:pointer;
                    "
                >
                    ✕
                </button>

                <h2 style="text-align:center;">
                    ❤️ المفضلة
                </h2>
        // ==============================
        // عرض المنتجات المفضلة
        // ==============================

        if (favorites.length === 0) {

            html += `

                <p style="
                    text-align:center;
                    padding:40px 10px;
                    font-size:18px;
                ">
                    لا توجد منتجات في المفضلة ❤️
                </p>

            `;

        } else {

            favorites.forEach(function(product) {

                let image =
                    product.image || "";

                if (image.startsWith("../")) {

                    image =
                        image.substring(3);

                }
                html += `

                    <a
                        href="pages/product.html?id=${product.id}"
                        style="
                            display:flex;
                            align-items:center;
                            gap:15px;
                            margin:12px 0;
                            padding:12px;
                            background:#1f2937;
                            border-radius:12px;
                            color:white;
                            text-decoration:none;
                        "
                    >

                        <img
                            src="${image}"
                            alt="${product.name}"
                            style="
                                width:80px;
                                height:80px;
                                object-fit:cover;
                                border-radius:10px;
                            "
                        >

                        <div>

                            <h3 style="
                                margin:0 0 8px;
                            ">
                                ${product.name}
                            </h3>

                            <p style="
                                margin:0;
                            ">
                                ⭐ ${product.rating || 0}
                            </p>

                            <strong>
                                $${pro
        // ==============================
        // إظهار نافذة المفضلة
        // ==============================

        html += `

            </div>

        `;

        box.innerHTML = html;

        document.body.appendChild(box);


        // ==============================
        // زر إغلاق المفضلة
        // ==============================

        const closeFavorites =
            document.getElementById("close-favorites");

        if (closeFavorites) {

            closeFavorites.addEventListener(
                "click",
                function () {

                    box.remove();

                }
            );

        }

    });

}
