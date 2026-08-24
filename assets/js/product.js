const params = new URLSearchParams(window.location.search);

const id = Number(params.get("id"));

console.log("Product ID:", id);


Promise.all([

    fetch("../assets/data/models.json")
        .then(response => response.json()),

    fetch("../assets/data/books.json")
        .then(response => response.json()),

    fetch("../assets/data/scripts.json")
        .then(response => response.json()),

    fetch("../assets/data/mods.json")
        .then(response => response.json()),

    fetch("../assets/data/apps.json")
        .then(response => response.json())

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
        item => Number(item.id) === id
    );

    console.log("Found product:", product);

    if (!product) {

        document.body.innerHTML = `

            <div style="
                text-align:center;
                padding:50px;
                font-family:Arial;
            ">

                <h2>❌ المنتج غير موجود</h2>

                <p>
                    لم يتم العثور على هذا المنتج.
                </p>

            </div>

        `;

        return;
    }
 // ==============================
    // الصورة
    // ==============================

    const productImage =
        document.getElementById("product-image");

    if (productImage) {

        productImage.src =
            product.image;

        productImage.alt =
            product.name || "Product";

    }


    // ==============================
    // الاسم
    // ==============================

    const productName =
        document.getElementById("product-name");

    if (productName) {

        productName.textContent =
            product.name || "بدون اسم";

    }


    // ==============================
    // التقييم
    // ==============================

    const productRating =
        document.getElementById("product-rating");

    if (productRating) {

        productRating.textContent =
            "⭐ " +
            (product.rating || 0);

    }
 // ==============================
    // السعر
    // ==============================

    const productPrice =
        document.getElementById("product-price");

    if (productPrice) {

        productPrice.textContent =
            "$" +
            (product.price || 0);

    }


    // ==============================
    // الوصف
    // ==============================

    const productDescription =
        document.getElementById(
            "product-description"
        );

    if (productDescription) {

        productDescription.textContent =
            product.description ||
            "لا يوجد وصف لهذا المنتج.";

    }


    // ==============================
    // الصيغة
    // ==============================

    const productFormat =
        document.getElementById(
            "product-format"
        );

    if (productFormat) {

        productFormat.textContent =
            product.format ||
            "غير محدد";

    }


    // ==============================
    // الحجم
    // ==============================

    const productSize =
        document.getElementById(
            "product-size"
        );

    if (productSize) {

        productSize.textContent =
            product.size ||
            "غير محدد";

    }
 // ==============================
    // زر الشراء
    // ==============================

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
    // ==============================
// نظام المفضلة
// ==============================

const favoriteButton =
    document.getElementById("favorite-btn");


if (favoriteButton) {

    // قراءة المفضلة المحفوظة
    let favorites =
        JSON.parse(
            localStorage.getItem("azziFavorites") || "[]"
        );


    // التأكد هل المنتج موجود مسبقًا
    const isFavorite =
        favorites.some(
            item => Number(item.id) === Number(product.id)
        );


    // تغيير شكل الزر إذا كان المنتج محفوظًا
    if (isFavorite) {

        favoriteButton.innerHTML =
            "❤️ Added to Favorites";

    } else {

        favoriteButton.innerHTML =
            "🤍 Add to Favorites";

    }


    // عند الضغط على زر المفضلة
    favoriteButton.onclick = function () {

        let favorites =
            JSON.parse(
                localStorage.getItem("azziFavorites") || "[]"
            );


        const index =
            favorites.findIndex(
                item =>
                    Number(item.id) === Number(product.id)
            );


        // إذا كان المنتج موجودًا → حذفه
        if (index !== -1) {

            favorites.splice(index, 1);

            favoriteButton.innerHTML =
                "🤍 Add to Favorites";

        }

        // إذا لم يكن موجودًا → إضافته
        else {

            favorites.push(product);

            favoriteButton.innerHTML =
                "❤️ Added to Favorites";

        }
        // حفظ المفضلة
        localStorage.setItem(
            "azziFavorites",
            JSON.stringify(favorites)
        );

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
