const REVIEWS_TABLE = "site_reviews";

function escapeReviewText(value) {
    return String(value ?? "")
        .replace(/[&<>'"]/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "'": "&#039;",
            '"': "&quot;"
        }[char]));
}

function getDisplayName(email) {
    return String(email || "مستخدم")
        .split("@")[0]
        .trim() || "مستخدم";
}

/* نجوم التقييم */
function starsHTML(rating, interactive = false) {

    rating = Number(rating) || 0;

    return Array.from({ length: 5 }, (_, i) => {

        const star = i + 1;

        if (interactive) {
            return `
                <button
                    type="button"
                    class="review-star ${star <= rating ? "selected" : ""}"
                    data-rating="${star}"
                    aria-label="${star} نجوم">
                    ★
                </button>
            `;
        }

        return `
            <span class="review-star-static ${star <= rating ? "filled" : ""}">
                ★
            </span>
        `;
    }).join("");
}
/* تحميل التقييمات */
async function loadReviews() {

    const list = document.getElementById("reviews-list");

    if (!list) return;

    list.innerHTML =
        '<p class="reviews-loading">جاري تحميل التقييمات...</p>';

    const { data, error } =
        await supabaseClient
            .from(REVIEWS_TABLE)
            .select("id,user_id,user_email,rating,comment,created_at")
            .order("created_at", { ascending: false });

    if (error) {

        console.error("Reviews error:", error);

        list.innerHTML =
            '<p class="reviews-empty">تعذر تحميل التقييمات.</p>';

        return;
    }

    const reviews = data || [];

    renderReviews(reviews);

    updateReviewsSummary(reviews);
}


/* عرض التقييمات */
function renderReviews(reviews) {

    const list = document.getElementById("reviews-list");

    if (!list) return;

    if (!reviews.length) {

        list.innerHTML =
            '<p class="reviews-empty">لا توجد تقييمات بعد. كن أول من يشارك رأيه! ⭐</p>';

        return;
    }
    list.innerHTML = reviews.map(review => {

        const name = getDisplayName(review.user_email);

        return `
            <article class="review-card">

                <div class="review-card-top">

                    <div class="review-avatar">
                        ${escapeReviewText(name).charAt(0).toUpperCase()}
                    </div>

                    <div class="review-user">

                        <strong>
                            ${escapeReviewText(name)}
                        </strong>

                        <time>
                            ${formatReviewDate(review.created_at)}
                        </time>

                    </div>

                </div>


                <!-- النجوم فوق التعليق -->
                <div
                    class="review-rating-stars"
                    aria-label="تقييم ${review.rating} من 5">

                    ${starsHTML(Number(review.rating))}

                </div>


                <!-- التعليق -->
                <p class="review-comment">
                    ${escapeReviewText(review.comment)}
                </p>

            </article>
        `;

    }).join("");
}
/* المتوسط */
function updateReviewsSummary(reviews) {

    const average =
        reviews.length
            ? reviews.reduce(
                (sum, review) =>
                    sum + Number(review.rating || 0),
                0
            ) / reviews.length
            : 0;

    const averageElement =
        document.getElementById("reviews-average");

    const countElement =
        document.getElementById("reviews-count");

    const summaryStars =
        document.getElementById("reviews-summary-stars");

    if (averageElement) {
        averageElement.textContent =
            average.toFixed(1);
    }

    if (countElement) {
        countElement.textContent =
            `${reviews.length} تقييم`;
    }

    if (summaryStars) {
        summaryStars.innerHTML =
            starsHTML(Math.round(average));
    }
}


/* التاريخ */
function formatReviewDate(date) {

    if (!date) return "";

    return new Intl.DateTimeFormat(
        "ar-MA",
        {
            dateStyle: "medium"
        }
    ).format(new Date(date));
}
/* تجهيز نموذج التقييم */
async function setupReviewForm() {

    const form =
        document.getElementById("review-form");

    const loginMessage =
        document.getElementById("review-login-message");

    const formArea =
        document.getElementById("review-form-area");

    const stars =
        document.getElementById("review-stars-input");

    const ratingInput =
        document.getElementById("review-rating");

    if (!form || !stars || !ratingInput) {
        return;
    }

    const user =
        await getCurrentUser();


    /* المستخدم غير مسجل */
    if (!user) {

        if (formArea)
            formArea.style.display = "none";

        if (loginMessage)
            loginMessage.style.display = "block";

        return;
    }
    /* المستخدم مسجل */
    if (formArea)
        formArea.style.display = "block";

    if (loginMessage)
        loginMessage.style.display = "none";


    /* منع تكرار إضافة الأحداث */
    if (form.dataset.ready === "true") {
        return;
    }

    form.dataset.ready = "true";


    stars.innerHTML =
        starsHTML(0, true);


    /* اختيار النجوم */
    stars.querySelectorAll(".review-star")
        .forEach(button => {

            button.addEventListener("click", () => {

                const rating =
                    Number(button.dataset.rating);

                ratingInput.value = rating;


                stars.querySelectorAll(".review-star")
                    .forEach(star => {

                        star.classList.toggle(
                            "selected",
                            Number(star.dataset.rating) <= rating
                        );

                    });

            });

        });
    form.addEventListener(
        "submit",
        submitReview
    );
}


/* إرسال التقييم */
async function submitReview(event) {

    event.preventDefault();

    const user =
        await getCurrentUser();

    if (!user) {

        alert(
            "يجب تسجيل الدخول لإضافة تقييم."
        );

        return;
    }


    const rating =
        Number(
            document.getElementById(
                "review-rating"
            ).value
        );


    const comment =
        document.getElementById(
            "review-comment"
        ).value.trim();


    const button =
        document.getElementById(
            "review-submit"
        );


    const message =
        document.getElementById(
            "review-form-message"
        );


    /* التحقق من النجوم */
    if (rating < 1 || rating > 5) {

        message.textContent =
            "⭐ اختر تقييمًا من 1 إلى 5 نجوم.";

        return;
    }
    /* التحقق من التعليق */
    if (comment.length < 3) {

        message.textContent =
            "✍️ اكتب تعليقًا من 3 أحرف على الأقل.";

        return;
    }


    button.disabled = true;

    button.textContent =
        "جاري النشر...";

    message.textContent = "";


    /* إرسال إلى Supabase */
    const { error } =
        await supabaseClient
            .from(REVIEWS_TABLE)
            .insert({

                user_id: user.id,

                user_email: user.email,

                rating: rating,

                comment: comment

            });


    if (error) {

        console.error(
            "Submit review error:",
            error
        );


        if (error.code === "23505") {

            message.textContent =
                "⚠️ لديك تقييم منشور بالفعل.";

        } else {

            message.textContent =
                "❌ تعذر نشر التقييم. تأكد من إعداد جدول Supabase.";

        }

    } else {
        /* تنظيف النموذج */

        document.getElementById(
            "review-comment"
        ).value = "";

        document.getElementById(
            "review-rating"
        ).value = "0";


        document.getElementById(
            "review-stars-input"
        ).innerHTML =
            starsHTML(0, true);


        message.textContent =
            "✅ تم نشر تقييمك بنجاح!";


        /* إعادة تحميل التقييمات */
        await loadReviews();


        /* إعادة تشغيل النجوم */
        const form =
            document.getElementById("review-form");

        form.dataset.ready = "false";

        await setupReviewForm();
    }


    button.disabled = false;

    button.textContent =
        "نشر التقييم";
}


/* تشغيل */
document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await loadReviews();

        await setupReviewForm();

    }
);
/* عند تسجيل الدخول / الخروج */
supabaseClient.auth.onAuthStateChange(
    async () => {

        const form =
            document.getElementById("review-form");

        if (form) {
            form.dataset.ready = "false";
        }

        await setupReviewForm();
    }
);
