// ==============================
// نظام عرض المفضلة
// ==============================

const favoritesButton =
    document.getElementById("favorites-btn");

if (favoritesButton) {

    favoritesButton.addEventListener("click", function () {

        const favorites =
            JSON.parse(
                localStorage.getItem("azziFavorites") || "[]"
            );

        console.log("Favorites:", favorites);
        // ==============================
        // إنشاء نافذة المفضلة
        // ==============================

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
        // عرض المنتجات المحفوظة
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

                // تصحيح مسار الصورة
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
                                $${product.price || 0}
                            </strong>

                        </div>

                    </a>

                `;

            });

        }
        // ==============================
        // إكمال نافذة المفضلة
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
