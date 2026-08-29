document.addEventListener("DOMContentLoaded", () => {

    const openButton =
        document.getElementById("open-smart-picker");

    const closeButton =
        document.getElementById("close-smart-picker");

    const modal =
        document.getElementById("smart-picker-modal");

    const content =
        document.getElementById("smart-picker-content");


    if (!openButton || !modal || !content) {
        return;
    }


    // فتح النافذة
    openButton.addEventListener("click", () => {

        modal.classList.add("active");

        document.body.style.overflow = "hidden";

    });


    // إغلاق النافذة
    closeButton.addEventListener("click", closePicker);


    // الضغط خارج النافذة
    modal.addEventListener("click", (event) => {

        if (event.target === modal) {
            closePicker();
        }

    });


    function closePicker() {

        modal.classList.remove("active");

        document.body.style.overflow = "";

    }
// اختيار المستخدم
    content.addEventListener("click", (event) => {

        const button =
            event.target.closest("[data-choice]");

        if (!button) return;

        const choice =
            button.dataset.choice;

        showSecondStep(choice);

    });


    function showSecondStep(choice) {

        content.innerHTML = `

            <div class="smart-picker-step">

                <span class="smart-picker-emoji">
                    💫
                </span>

                <h2>
                    ما الذي يهمك أكثر؟
                </h2>

                <p>
                    سنستخدم اختيارك لترشيح المنتجات
                </p>

                <div class="smart-options">

                    <button data-priority="price">
                        💰
                        <strong>السعر</strong>
                        <span>أريد شيئًا مناسبًا للميزانية</span>
                    </button>

                    <button data-priority="quality">
                        💎
                        <strong>الجودة</strong>
                        <span>الجودة أهم شيء بالنسبة لي</span>
                    </button>

                    <button data-priority="design">
                        🎨
                        <strong>الشكل</strong>
                        <span>أريد شيئًا جميلًا ومميزًا</span>
                    </button>

                    <button data-priority="new">
                        🚀
<strong>الجِدّة</strong>
                        <span>أريد أحدث شيء</span>
                    </button>

                </div>

            </div>

        `;


        content.dataset.choice = choice;

    }


    content.addEventListener("click", (event) => {

        const button =
            event.target.closest("[data-priority]");

        if (!button) return;

        const priority =
            button.dataset.priority;

        const choice =
            content.dataset.choice;

        showBudgetStep(choice, priority);

    });
function showBudgetStep(choice, priority) {

        content.innerHTML = `

            <div class="smart-picker-step">

                <span class="smart-picker-emoji">
                    🪄
                </span>

                <h2>
                    وأين تريد أن نبحث؟
                </h2>

                <p>
                    اختر الميزانية التي تناسبك
                </p>

                <div class="smart-options">

                    <button data-budget="low">
                        🪙
                        <strong>اقتصادي</strong>
                        <span>أفضل قيمة مقابل السعر</span>
                    </button>

                    <button data-budget="medium">
                        💳
                        <strong>متوسط</strong>
                        <span>توازن بين السعر والجودة</span>
                    </button>

                    <button data-budget="high">
                        👑
                        <strong>مميز</strong>
                        <span>أبحث عن شيء فاخر</span>
                    </button>

                </div>

            </div>
`;


        content.dataset.choice = choice;
        content.dataset.priority = priority;

    }


    content.addEventListener("click", (event) => {

        const button =
            event.target.closest("[data-budget]");

        if (!button) return;

        const budget =
            button.dataset.budget;

        const choice =
            content.dataset.choice;

        const priority =
            content.dataset.priority;


        showResult(
            choice,
            priority,
            budget
        );

    });


    function showResult(
        choice,
        priority,
        budget
    ) {

        content.innerHTML = `

            <div class="smart-picker-step">

                <span class="smart-picker-emoji">
                    ✨
                </span>
<h2>
                    وجدنا لك اختيارات مميزة
                </h2>

                <p>
                    بناءً على اختياراتك، سنبحث عن
                    المنتجات الأنسب لك.
                </p>

                <button
                    class="smart-picker-button"
                    id="smart-picker-finish">

                    🔍 عرض اختياراتي

                </button>

            </div>

        `;


        const finish =
            document.getElementById(
                "smart-picker-finish"
            );


        finish.addEventListener("click", () => {

            closePicker();

            /*
             * هنا سنربط الاختيارات
             * بمنتجات موقعك الفعلية.
             */

            console.log({
                choice,
                priority,
                budget
            });

        });

    }

});
