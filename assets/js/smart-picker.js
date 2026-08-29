document.addEventListener("DOMContentLoaded", () => {
    const openButton = document.getElementById("open-smart-picker");
    const closeButton = document.getElementById("close-smart-picker");
    const modal = document.getElementById("smart-picker-modal");
    const content = document.getElementById("smart-picker-content");

    if (!openButton || !closeButton || !modal || !content) return;

    /*
     * ملفات المنتجات الحقيقية الموجودة في المتجر
     */
    const DATA_FILES = [
        { file: "models.json", category: "models" },
        { file: "books.json", category: "books" },
        { file: "scripts.json", category: "scripts" },
        { file: "mods.json", category: "mods" },
        { file: "apps.json", category: "apps" }
    ];

    /*
     * فتح نافذة اختر لي
     */
    openButton.addEventListener("click", () => {
        renderFirstStep();

        modal.classList.add("active");
        document.body.style.overflow = "hidden";
    });

    /*
     * إغلاق
     */
    closeButton.addEventListener("click", closePicker);

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closePicker();
        }
    });

    function closePicker() {
        modal.classList.remove("active");
        document.body.style.overflow = "";
    }
/*
     * الخطوة الأولى
     */
    function renderFirstStep() {

        content.dataset.choice = "";
        content.dataset.priority = "";
        content.dataset.budget = "";

        content.innerHTML = `
            <div class="smart-picker-step">

                <span class="smart-picker-emoji">
                    ✨
                </span>

                <h2>
                    ماذا تبحث عنه اليوم؟
                </h2>

                <p>
                    اختر ما يناسبك
                </p>

                <div class="smart-options">

                    <button type="button" data-choice="gift">
                        🎁
                        <strong>هدية</strong>
                        <span>أبحث عن هدية مميزة</span>
                    </button>

                    <button type="button" data-choice="special">
                        ✨
                        <strong>شيء مميز</strong>
                        <span>أريد شيئًا مختلفًا</span>
                    </button>

                    <button type="button" data-choice="trending">
                        🔥
                        <strong>شيء جديد</strong>
                        <span>أريد اكتشاف شيء جديد</span>
                    </button>

                    <button type="button" data-choice="myself">
                        ❤️
                        <strong>لنفسي</strong>
                        <span>أبحث عن شيء يعجبني</span>
</button>

                </div>

            </div>
        `;
    }

    /*
     * التعامل مع جميع الأزرار داخل النافذة
     */
    content.addEventListener("click", (event) => {

        const choiceButton =
            event.target.closest("[data-choice]");

        const priorityButton =
            event.target.closest("[data-priority]");

        const budgetButton =
            event.target.closest("[data-budget]");

        const finishButton =
            event.target.closest("#smart-picker-finish");

        const restartButton =
            event.target.closest("#smart-picker-restart");


        /*
         * الاختيار الأول
         */
        if (choiceButton) {

            content.dataset.choice =
                choiceButton.dataset.choice;

            renderPriorityStep(
                choiceButton.dataset.choice
            );

            return;
        }
/*
         * الأولوية
         */
        if (priorityButton) {

            content.dataset.priority =
                priorityButton.dataset.priority;

            renderBudgetStep(
                priorityButton.dataset.priority
            );

            return;
        }


        /*
         * الميزانية
         */
        if (budgetButton) {

            content.dataset.budget =
                budgetButton.dataset.budget;

            renderReadyStep();

            return;
        }


        /*
         * عرض المنتجات
         */
        if (finishButton) {

            showResults();

            return;
        }


        /*
         * إعادة الاختيار
         */
        if (restartButton) {

            renderFirstStep();

        }

    });
/*
     * الخطوة الثانية
     */
    function renderPriorityStep(choice) {

        content.dataset.choice = choice;

        content.innerHTML = `
            <div class="smart-picker-step">

                <span class="smart-picker-emoji">
                    💫
                </span>

                <h2>
                    ما الذي يهمك أكثر؟
                </h2>

                <p>
                    سنستخدم اختيارك لترتيب المنتجات
                </p>

                <div class="smart-options">

                    <button type="button" data-priority="price">
                        💰
                        <strong>السعر</strong>
                        <span>
                            أريد شيئًا مناسبًا للميزانية
                        </span>
                    </button>

                    <button type="button" data-priority="quality">
                        💎
                        <strong>الجودة</strong>
                        <span>
                            التقييم والجودة أهم شيء بالنسبة لي
                        </span>
                    </button>

                    <button type="button" data-priority="design">
                        🎨
                        <strong>الشكل</strong>
                        <span>
                            أريد شيئًا جميلًا ومميزًا
                        </span>
                    </button>
<button type="button" data-priority="new">
                        🚀
                        <strong>الجِدّة</strong>
                        <span>
                            أريد أحدث شيء
                        </span>
                    </button>

                </div>

            </div>
        `;
    }


    /*
     * الخطوة الثالثة
     */
    function renderBudgetStep(priority) {

        content.dataset.priority = priority;

        content.innerHTML = `
            <div class="smart-picker-step">

                <span class="smart-picker-emoji">
                    🪄
                </span>

                <h2>
                    وأين تريد أن نبحث؟
                </h2>

                <p>
                    اختر مستوى السعر
                </p>

                <div class="smart-options">

                    <button type="button" data-budget="low">
                        🪙
                        <strong>
                            اقتصادي
                        </strong>
                        <span>
                            المنتجات الأقل سعرًا
                        </span>
                    </button>

                    <button type="button" data-budget="medium">
                        💳
                        <strong>
                            متوسط
                        </strong>
                        <span>
                            المنتجات الأقرب للسعر المتوسط
</span>
                    </button>

                    <button type="button" data-budget="high">
                        👑
                        <strong>
                            مميز
                        </strong>
                        <span>
                            المنتجات الأعلى سعرًا
                        </span>
                    </button>

                </div>

            </div>
        `;
    }


    /*
     * قبل عرض النتائج
     */
    function renderReadyStep() {

        content.innerHTML = `
            <div class="smart-picker-step">

                <span class="smart-picker-emoji">
                    ✨
                </span>

                <h2>
                    جاهز!
                </h2>

                <p>
                    سنبحث الآن في جميع منتجات Azzi Store
                    ونختار لك أقرب 3 منتجات فقط.
                </p>

                <button
                    type="button"
                    class="smart-picker-button"
                    id="smart-picker-finish">

                    🔍 عرض اختياراتي

                </button>

            </div>
        `;
    }
/*
     * تحميل كل المنتجات الحقيقية
     */
    async function loadProducts() {

        const results = await Promise.all(

            DATA_FILES.map(async ({ file, category }) => {

                const response =
                    await fetch(`assets/data/${file}`);

                if (!response.ok) {

                    throw new Error(
                        `تعذر تحميل ${file}`
                    );

                }

                const data =
                    await response.json();

                return data.map(product => ({
                    ...product,
                    category
                }));

            })

        );

        return results
            .flat()
            .filter(product =>
                Number.isFinite(Number(product.price))
            );
    }


    /*
     * تطبيع رقم بين 0 و 1
     */
    function normalize(value, min, max) {

        if (max === min) {
            return 1;
        }
return (
            (value - min) /
            (max - min)
        );
    }


    /*
     * حساب مدى توافق السعر
     *
     * low    = الأرخص
     * medium = الأقرب للسعر المتوسط
     * high   = الأغلى
     */
    function getBudgetScore(
        product,
        budget,
        minPrice,
        maxPrice,
        medianPrice
    ) {

        const price =
            Number(product.price);

        const priceNorm =
            normalize(
                price,
                minPrice,
                maxPrice
            );


        if (budget === "low") {

            return 1 - priceNorm;

        }


        if (budget === "high") {

            return priceNorm;

        }


        /*
         * متوسط
         */
        const maxDistance =
            Math.max(
                maxPrice - minPrice,
                0.01
            );

        return 1 -
            Math.min(
                Math.abs(
                    price - medianPrice
                ) / maxDistance,
                1
            );
    }
/*
     * الأولوية
     */
    function getPriorityScore(
        product,
        priority,
        priceNorm,
        ratingNorm,
        recencyNorm
    ) {

        switch (priority) {

            case "price":

                return 1 - priceNorm;


            case "quality":

                return ratingNorm;


            case "new":

                return recencyNorm;


            case "design":

                /*
                 * بما أن JSON الحالي لا يحتوي
                 * على حقل خاص بالتصميم،
                 * نستخدم التقييم + حداثة المنتج.
                 */

                return (
                    ratingNorm * 0.65
                ) + (
                    recencyNorm * 0.35
                );


            default:

                return (
                    ratingNorm * 0.5
                ) + (
                    recencyNorm * 0.5
                );
        }
    }
/*
     * الاختيار الأول
     */
    function getChoiceScore(
        product,
        choice,
        ratingNorm,
        recencyNorm,
        priceNorm
    ) {

        switch (choice) {

            case "gift":

                return (
                    ratingNorm * 0.7
                ) + (
                    recencyNorm * 0.3
                );


            case "special":

                return (
                    ratingNorm * 0.45
                ) + (
                    recencyNorm * 0.35
                ) + (
                    priceNorm * 0.2
                );


            case "trending":

                return (
                    recencyNorm * 0.7
                ) + (
                    ratingNorm * 0.3
                );


            case "myself":

                return (
                    ratingNorm * 0.55
                ) + (
                    priceNorm * 0.45
                );


            default:

                return ratingNorm;
        }
    }
/*
     * الحصول على النتائج
     */
    async function showResults() {

        const choice =
            content.dataset.choice;

        const priority =
            content.dataset.priority;

        const budget =
            content.dataset.budget;


        content.innerHTML = `
            <div class="smart-picker-step smart-picker-results-loading">

                <span class="smart-picker-emoji">
                    ⏳
                </span>

                <h2>
                    نبحث في منتجات المتجر...
                </h2>

                <p>
                    جارٍ اختيار أقرب 3 منتجات لك.
                </p>

            </div>
        `;


        try {

            /*
             * تحميل المنتجات
             */
            const products =
                await loadProducts();


            if (!products.length) {

                throw new Error(
                    "لا توجد منتجات"
                );

            }
/*
             * الأسعار
             */
            const prices =
                products.map(product =>
                    Number(product.price)
                );


            /*
             * التقييمات
             */
            const ratings =
                products.map(product =>
                    Number(product.rating) || 0
                );


            /*
             * المعرفات
             * نستخدمها كدليل على حداثة المنتج
             */
            const ids =
                products.map(product =>
                    Number(product.id) || 0
                );


            const minPrice =
                Math.min(...prices);

            const maxPrice =
                Math.max(...prices);


            const minRating =
                Math.min(...ratings);

            const maxRating =
                Math.max(...ratings);


            const minId =
                Math.min(...ids);

            const maxId =
                Math.max(...ids);
/*
             * السعر المتوسط
             */
            const sortedPrices =
                [...prices].sort(
                    (a, b) => a - b
                );

            const middle =
                Math.floor(
                    sortedPrices.length / 2
                );


            const medianPrice =
                sortedPrices.length % 2

                    ? sortedPrices[middle]

                    : (
                        sortedPrices[middle - 1] +
                        sortedPrices[middle]
                    ) / 2;


            /*
             * حساب درجة كل منتج
             */
            const scored =
                products.map(product => {

                    const price =
                        Number(product.price);

                    const rating =
                        Number(product.rating) || 0;

                    const id =
                        Number(product.id) || 0;


                    const priceNorm =
                        normalize(
                            price,
                            minPrice,
                            maxPrice
                        );
                    const ratingNorm =
                        normalize(
                            rating,
                            minRating,
                            maxRating
                        );


                    const recencyNorm =
                        normalize(
                            id,
                            minId,
                            maxId
                        );


                    /*
                     * توافق الميزانية
                     */
                    const budgetScore =
                        getBudgetScore(
                            product,
                            budget,
                            minPrice,
                            maxPrice,
                            medianPrice
                        );


                    /*
                     * توافق الأولوية
                     */
                    const priorityScore =
                        getPriorityScore(
                            product,
                            priority,
                            priceNorm,
                            ratingNorm,
                            recencyNorm
                        );
/*
                     * توافق الاختيار الأول
                     */
                    const choiceScore =
                        getChoiceScore(
                            product,
                            choice,
                            ratingNorm,
                            recencyNorm,
                            priceNorm
                        );


                    /*
                     * النتيجة النهائية
                     *
                     * الميزانية هي العامل الأقوى،
                     * لذلك:
                     *
                     * اقتصادي = يميل للأرخص
                     * متوسط  = يميل للمتوسط
                     * مميز   = يميل للأغلى
                     */
                    const score =

                        (budgetScore * 0.70) +

                        (priorityScore * 0.20) +

                        (choiceScore * 0.10);


                    return {
                        ...product,
                        score
                    };

                });


            /*
             * ترتيب المنتجات
             */
            scored.sort((a, b) => {

                if (b.score !== a.score) {

                    return b.score - a.score;

                }
return (
                    Number(b.rating || 0) -
                    Number(a.rating || 0)
                );

            });


            /*
             * نأخذ 3 فقط
             */
            const recommendations =
                scored.slice(0, 3);


            renderResults(
                recommendations
            );


        } catch (error) {

            console.error(
                "Smart Picker error:",
                error
            );


            content.innerHTML = `
                <div class="smart-picker-step">

                    <span class="smart-picker-emoji">
                        ⚠️
                    </span>

                    <h2>
                        حدث خطأ
                    </h2>

                    <p>
                        تعذر تحميل المنتجات حاليًا.
                    </p>

                    <button
                        type="button"
                        class="smart-picker-button"
                        id="smart-picker-restart">

                        ↩ إعادة المحاولة

                    </button>

                </div>
            `;
        }
    }
/*
     * تنسيق السعر
     */
    function formatPrice(price) {

        const number =
            Number(price);

        if (!Number.isFinite(number)) {

            return "السعر غير متوفر";

        }

        return `${number.toFixed(2)}$`;
    }


    /*
     * إصلاح مسار الصورة
     *
     * JSON فيه:
     * ../assets/images/...
     *
     * لكن index.html في الجذر
     */
    function getImageUrl(image) {

        if (!image) {
            return "";
        }

        return image.replace(
            /^\.\.\//,
            ""
        );
    }


    /*
     * صفحة المنتج
     */
    function getProductUrl(product) {

        return (
            `pages/product.html?id=` +
            encodeURIComponent(product.id)
        );
    }
/*
     * حماية النصوص داخل HTML
     */
    function escapeHtml(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /*
     * عرض النتائج
     */
    function renderResults(products) {

        const cards =
            products.map((product, index) => {

                return `
                    <a
                        class="smart-product-card"
                        href="${getProductUrl(product)}">

                        <div class="smart-product-number">
                            ${index + 1}
                        </div>

                        <img
                            class="smart-product-image"
                            src="${escapeHtml(
                                getImageUrl(
                                    product.image
                                )
                            )}"
                            alt="${escapeHtml(
                                product.name
                            )}"
                            loading="lazy"
                        >

                        <div class="smart-product-info">

                            <h3>
                                ${escapeHtml(
                                    product.name
)}
                            </h3>

                            <div class="smart-product-meta">

                                <span>
                                    ⭐
                                    ${escapeHtml(
                                        Number(
                                            product.rating || 0
                                        ).toFixed(1)
                                    )}
                                </span>

                                <strong>
                                    ${escapeHtml(
                                        formatPrice(
                                            product.price
                                        )
                                    )}
                                </strong>

                            </div>

                        </div>

                    </a>
                `;

            }).join("");


        content.innerHTML = `
            <div class="smart-picker-step smart-picker-results">
<span class="smart-picker-emoji">
                    🎯
                </span>

                <h2>
                    هذه أفضل 3 منتجات لك
                </h2>

                <p>
                    تم الاختيار من منتجات Azzi Store
                    الحقيقية حسب تفضيلاتك.
                </p>

                <div class="smart-products-grid">

                    ${cards}

                </div>

                <button
                    type="button"
                    class="smart-picker-restart"
                    id="smart-picker-restart">

                    🔄 اختيار من جديد

                </button>

            </div>
        `;
    }

});
