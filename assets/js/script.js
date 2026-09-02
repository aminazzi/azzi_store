// فتح وإغلاق القائمة الجانبية
function toggleMenu() {

    const sidebar = document.getElementById("sidebar");

    if (!sidebar) return;

    sidebar.classList.toggle("active");

    const isOpen = sidebar.classList.contains("active");

    document.documentElement.classList.toggle(
        "sidebar-open",
        isOpen
    );

    document.body.classList.toggle(
        "sidebar-open",
        isOpen
    );
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

