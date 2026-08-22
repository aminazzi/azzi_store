const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

console.log("Product ID:", id);

Promise.all([
    fetch("../assets/data/models.json").then(r => {
        if (!r.ok) throw new Error("models.json");
        return r.json();
    }),

    fetch("../assets/data/books.json").then(r => {
        if (!r.ok) throw new Error("books.json");
        return r.json();
    }),

    fetch("../assets/data/scripts.json").then(r => {
        if (!r.ok) throw new Error("scripts.json");
        return r.json();
    }),

    fetch("../assets/data/mods.json").then(r => {
        if (!r.ok) throw new Error("mods.json");
        return r.json();
    }),

    fetch("../assets/data/apps.json").then(r => {
        if (!r.ok) throw new Error("apps.json");
        return r.json();
    })
])
.then(([models, books, scripts, mods, apps]) => {

    const products = [
        ...models,
        ...books,
        ...scripts,
        ...mods,
        ...apps
    ];

    console.log("All products:", products);

    const product = products.find(
        p => Number(p.id) === id
    );

    console.log("Found product:", product);

    if (!product) {

        document.body.innerHTML = `
            <div style="
                text-align:center;
                padding:50px;
                font-family:Arial;
            ">
                <h2>❌ Product not found</h2>
                <p>المنتج غير موجود.</p>
            </div>
        `;

        return;
    }
  // =========================
    // تصحيح مسار الصورة
    // =========================

    let image = product.image || "";

    if (image.startsWith("../")) {
        image = image.substring(3);
    }

    console.log("Product image:", image);


    // =========================
    // عرض الصورة
    // =========================

    const productImage =
        document.getElementById("product-image");

    if (productImage) {

        productImage.src = image;

        productImage.alt =
            product.name || "Product";

        productImage.onerror = function () {

            console.error(
                "Image not found:",
                image
            );

        };
    }
  // =========================
    // الاسم
    // =========================

    const productName =
        document.getElementById("product-name");

    if (productName) {
        productName.textContent =
            product.name || "بدون اسم";
    }


    // =========================
    // التقييم
    // =========================

    const productRating =
        document.getElementById("product-rating");

    if (productRating) {

        productRating.textContent =
            "⭐ " + (product.rating || 0);
    }


    // =========================
    // السعر
    // =========================

    const productPrice =
        document.getElementById("product-price");

    if (productPrice) {

        productPrice.textContent =
            "$" + (product.price || 0);
    }
  // =========================
    // الوصف
    // =========================

    const productDescription =
        document.getElementById(
            "product-description"
        );

    if (productDescription) {

        productDescription.textContent =
            product.description ||
            "لا يوجد وصف لهذا المنتج.";
    }


    // =========================
    // النوع / Format
    // =========================

    const productFormat =
        document.getElementById(
            "product-format"
        );

    if (productFormat) {

        productFormat.textContent =
            product.format || "غير محدد";
    }


    // =========================
    // الحجم
    // =========================

    const productSize =
        document.getElementById(
            "product-size"
        );

    if (productSize) {

        productSize.textContent =
            product.size || "غير محدد";
    }
  // =========================
    // زر الشراء
    // =========================

    const buyButton =
        document.getElementById("buy-btn");

    if (buyButton) {

        buyButton.onclick = function () {

            if (product.payhip) {

                window.location.href =
                    product.payhip;

            } else {

                alert(
                    "رابط الشراء غير متوفر لهذا المنتج."
                );
            }
        };
    }

})

.catch(error => {

    console.error(
        "Error loading product:",
        error
    );

    document.body.innerHTML = `
        <div style="
            text-align:center;
            padding:50px;
            font-family:Arial;
        ">

            <h2>❌ حدث خطأ</h2>

            <p>
                لم نتمكن من تحميل بيانات المنتج.
            </p>

            <p style="color:#777;">
                ${error.message}
            </p>

        </div>
    `;
});
