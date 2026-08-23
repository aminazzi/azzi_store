 const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

console.log("Product ID:", id);

Promise.all([
    fetch("assets/data/models.json").then(r => r.json()),
    fetch("assets/data/books.json").then(r => r.json()),
    fetch("assets/data/scripts.json").then(r => r.json()),
    fetch("assets/data/mods.json").then(r => r.json()),
    fetch("assets/data/apps.json").then(r => r.json())
])
.then(([models, books, scripts, mods, apps]) => {

    const products = [
        ...models,
        ...books,
        ...scripts,
        ...mods,
        ...apps
    ];

    const product = products.find(
        p => Number(p.id) === id
    );

    console.log("Product:", product);

    if (!product) {
        document.body.innerHTML = `
            <div style="text-align:center;padding:50px;">
                <h2>❌ المنتج غير موجود</h2>
                <p>لم يتم العثور على هذا المنتج.</p>
            </div>
        `;
        return;
    }
// تصحيح مسار الصورة
    let image = product.image || "";

    if (image.startsWith("../")) {
        image = image.substring(3);
    }

    console.log("Image:", image);


    // عرض الصورة
    const productImage =
        document.getElementById("product-image");

    if (productImage) {
        productImage.src = image;
        productImage.alt =
            product.name || "Product";
    }


    // عرض الاسم
    const productName =
        document.getElementById("product-name");

    if (productName) {
        productName.textContent =
            product.name || "بدون اسم";
    }


    // عرض التقييم
    const productRating =
        document.getElementById("product-rating");

    if (productRating) {
        productRating.textContent =
            "⭐ " + (product.rating || 0);
    }
// عرض السعر
    const productPrice =
        document.getElementById("product-price");

    if (productPrice) {
        productPrice.textContent =
            "$" + (product.price || 0);
    }


    // عرض الوصف
    const productDescription =
        document.getElementById("product-description");

    if (productDescription) {
        productDescription.textContent =
            product.description ||
            "لا يوجد وصف لهذا المنتج.";
    }


    // عرض الصيغة
    const productFormat =
        document.getElementById("product-format");

    if (productFormat) {
        productFormat.textContent =
            product.format ||
            "غير محدد";
    }


    // عرض الحجم
    const productSize =
        document.getElementById("product-size");

    if (productSize) {
        productSize.textContent =
            product.size ||
            "غير محدد";
    }
// زر الشراء
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
.catch(function(error) {

    console.error(
        "Product Error:",
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

            <p>
                ${error.message}
            </p>

        </div>
    `;

});



