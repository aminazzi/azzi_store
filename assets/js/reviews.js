// ==========================================
// AZZI STORE - REVIEWS SYSTEM
// ==========================================

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

    const name =
        String(email || "مستخدم")
        .split("@")[0]
        .trim();

    return name || "مستخدم";

}


function starsHTML(rating, interactive = false) {

    return Array.from(
        { length: 5 },
        (_, i) => {

            const star = i + 1;

            if (interactive) {

                return `
                <button
                        type="button"
                        class="review-star ${
                            star <= rating
                                ? "selected"
                                : ""
                        }"
                        data-rating="${star}"
                        aria-label="${star} نجوم">
                        ★
                    </button>
                `;

            }

            return `
                <span
                    class="review-star-static ${
                        star <= rating
                            ? "filled"
                            : ""
                    }">
                    ★
                </span>
            `;

        }
    ).join("");

}
/* تحميل التقييمات */

async function loadReviews() {

    const list =
        document.getElementById("reviews-list");

    if (!list) return;

    list.innerHTML =
        '<p class="reviews-loading">جاري تحميل التقييمات...</p>';


    const { data, error } =
        await supabaseClient
            .from(REVIEWS_TABLE)
            .select(
                "id, user_email, rating, comment, created_at"
            )
            .order(
                "created_at",
                { ascending: false }
            );


    if (error) {

        console.error(
            "Reviews error:",
            error
        );

        list.innerHTML =
            '<p class="reviews-empty">تعذر تحميل التقييمات حاليًا.</p>';

        return;
    }


    const reviews = data || [];

    renderReviews(reviews);

    updateReviewsSummary(reviews);

}
/* عرض التعليقات */

function renderReviews(reviews) {

    const list =
        document.getElementById("reviews-list");


    if (!reviews.length) {

        list.innerHTML =
            '<p class="reviews-empty">لا توجد تقييمات بعد. كن أول من يشارك رأيه! ⭐</p>';

        return;
    }


    list.innerHTML = reviews.map(review => {

        const name =
            getDisplayName(review.user_email);

        return `

            <article class="review-card">

                <div class="review-card-top">

                    <div class="review-avatar">
                        ${escapeReviewText(
                            name
                        ).charAt(0).toUpperCase()}
                    </div>

                    <div class="review-user">

                        <strong>
                            ${escapeReviewText(name)}
                        </strong>

                        <time>
                            ${formatReviewDate(
                                review.created_at
                            )}
                            </time>

                    </div>

                    <div
                        class="review-stars"
                        aria-label="تقييم ${
                            review.rating
                        } من 5">

                        ${starsHTML(
                            Number(review.rating)
                        )}

                    </div>

                </div>

                <p class="review-comment">
                    ${escapeReviewText(
                        review.comment
                    )}
                </p>

            </article>

        `;

    }).join("");

}
/* حساب المتوسط */

function updateReviewsSummary(reviews) {

    const average =
        reviews.length

            ? reviews.reduce(
                (sum, review) =>
                    sum +
                    Number(review.rating || 0),
                0
            ) / reviews.length

            : 0;


    const averageElement =
        document.getElementById(
            "reviews-average"
        );

    const countElement =
        document.getElementById(
            "reviews-count"
        );

    const summaryStars =
        document.getElementById(
            "reviews-summary-stars"
        );


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
            starsHTML(
                Math.round(average)
            );

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


/* إعداد نموذج التقييم */

async function setupReviewForm() {

    const form =
        document.getElementById(
            "review-form"
        );

    const loginMessage =
        document.getElementById(
            "review-login-message"
        );

    const formArea =
        document.getElementById(
            "review-form-area"
        );

    const stars =
        document.getElementById(
            "review-stars-input"
        );

    const ratingInput =
        document.getElementById(
            "review-rating"
        );


    if (
        !form ||
        !stars ||
        !ratingInput
    ) {
        return;
    }


    const user =
        await getCurrentUser();
  /* غير مسجل */

    if (!user) {

        if (formArea)
            formArea.style.display =
                "none";

        if (loginMessage)
            loginMessage.style.display =
                "block";

        return;
    }


    /* مسجل */

    if (formArea)
        formArea.style.display =
            "block";

    if (loginMessage)
        loginMessage.style.display =
            "none";


    stars.innerHTML =
        starsHTML(0, true);


    stars
        .querySelectorAll(".review-star")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const rating =
                        Number(
                            button.dataset.rating
                        );

                    ratingInput.value =
                        rating;


                    stars
                        .querySelectorAll(
                            ".review-star"
                        )
                        .forEach(star => {

                            star.classList.toggle(
                                "selected",
                                Number(
                                    star.dataset.rating
                                ) <= rating
                            );

                        });

                }
            );

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


    if (
        rating < 1 ||
        rating > 5
    ) {

        message.textContent =
            "⭐ اختر تقييمًا من نجمة إلى 5 نجوم.";

        return;
    }
  message.textContent =
            "✍️ اكتب رأيًا من 3 أحرف على الأقل.";

        return;
    }


    button.disabled = true;

    button.textContent =
        "جاري النشر...";

    message.textContent = "";


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


        message.textContent =
            error.code === "23505"

                ? "⚠️ لديك تقييم منشور بالفعل."

                : "❌ تعذر نشر التقييم، حاول مرة أخرى.";

    }

    else {

        document.getElementById(
            "review-comment"
        ).value = "";

        document.getElementById(
            "review-rating"
        ).value = "0";


        message.textContent =
            "✅ تم نشر تقييمك، شكرًا لك!";


        await loadReviews();

    }
button.disabled = false;

    button.textContent =
        "نشر التقييم";

}


/* تشغيل النظام */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await loadReviews();

        await setupReviewForm();

    }
);


supabaseClient.auth.onAuthStateChange(
    async () => {

        await setupReviewForm();

    }
);
