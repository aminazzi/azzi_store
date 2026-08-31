/* =========================================
   AZZI STORE - WHEEL
   GitHub products + Supabase payment only
========================================= */

const WHEEL_API =
    "https://swfiagrlqebsnvgshipu.supabase.co/functions/v1/wheel";

const WHEEL_DATA =
    "assets/data/wheel.json";

let wheelProducts = [];
let wheelRotation = 0;
let isSpinning = false;
let currentOrderID = null;


/* =========================================
   فتح العجلة
========================================= */

async function openWheel() {

    const modal =
        document.getElementById("wheel-modal");

    modal.classList.add("active");

    document.getElementById(
        "wheel-status"
    ).textContent =
        "جاري تحميل المنتجات...";

    document.getElementById(
        "wheel-result"
    ).innerHTML = "";

    try {

        const response =
            await fetch(WHEEL_DATA, {
                cache: "no-store"
            });

        if (!response.ok) {
            throw new Error(
                "تعذر تحميل منتجات العجلة"
            );
        }

        wheelProducts =
            await response.json();

        if (
            !Array.isArray(wheelProducts) ||
            wheelProducts.length !== 6
        ) {
            throw new Error(
                "يجب أن تحتوي العجلة على 6 منتجات"
            );
        }

        drawWheel();

        document.getElementById(
            "wheel-status"
        ).textContent =
            "ادفع 5$ ثم ستدور العجلة تلقائياً";
renderPayPal();

    } catch (error) {

        console.error(error);

        document.getElementById(
            "wheel-status"
        ).textContent =
            "حدث خطأ أثناء تحميل العجلة.";

    }

}


/* =========================================
   إغلاق العجلة
========================================= */

function closeWheel() {

    if (isSpinning) return;

    document
        .getElementById("wheel-modal")
        .classList.remove("active");

}


/* =========================================
   رسم العجلة
========================================= */

function drawWheel() {

    const canvas =
        document.getElementById("wheel-canvas");

    if (!canvas) return;

    const ctx =
        canvas.getContext("2d");

    const center =
        canvas.width / 2;

    const radius =
        center - 15;

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    const segment =
        (Math.PI * 2) /
        wheelProducts.length;

    wheelProducts.forEach(
        (product, index) => {

            const start =
                index * segment;

            const end =
                start + segment;

            ctx.beginPath();

            ctx.moveTo(
                center,
                center
            );
ctx.arc(
                center,
                center,
                radius,
                start,
                end
            );

            ctx.closePath();

            ctx.fillStyle =
                index % 2 === 0
                    ? "#6d28d9"
                    : "#db2777";

            ctx.fill();

            ctx.strokeStyle =
                "#ffffff";

            ctx.lineWidth = 3;

            ctx.stroke();

            ctx.save();

            ctx.translate(
                center,
                center
            );

            ctx.rotate(
                start + segment / 2
            );

            ctx.textAlign =
                "right";

            ctx.fillStyle =
                "#ffffff";

            ctx.font =
                "bold 17px Arial";

            let name =
                product.name || "منتج";

            if (name.length > 18) {

                name =
                    name.substring(
                        0,
                        18
                    ) + "...";

            }

            ctx.fillText(
                name,
                radius - 20,
                6
            );

            ctx.restore();

        }
    );

    /* الدائرة الوسطى */

    ctx.beginPath();

    ctx.arc(
        center,
        center,
        48,
        0,
        Math.PI * 2
    );      
ctx.fillStyle =
        "#111827";

    ctx.fill();

    ctx.strokeStyle =
        "#ffffff";

    ctx.lineWidth = 4;

    ctx.stroke();

    ctx.fillStyle =
        "#ffffff";

    ctx.font =
        "bold 16px Arial";

    ctx.textAlign =
        "center";

    ctx.fillText(
        "AZZI",
        center,
        center + 6
    );

}


/* =========================================
   تدوير العجلة
========================================= */

function spinWheel(winnerIndex) {

    if (
        isSpinning ||
        !wheelProducts[winnerIndex]
    ) {
        return;
    }

    isSpinning = true;

    const canvas =
        document.getElementById(
            "wheel-canvas"
        );

    const segment =
        360 / wheelProducts.length;

    const targetAngle =
        360 -
        (
            winnerIndex * segment +
            segment / 2
        );

    const extraSpins =
        360 * 7;

    wheelRotation +=
        extraSpins +
        targetAngle;

    canvas.style.transform =
        `rotate(${wheelRotation}deg)`;

    setTimeout(() => {

        isSpinning = false;

        showWinner(
            wheelProducts[winnerIndex]
        );

    }, 7500);

}
/* =========================================
   إظهار الفائز
========================================= */

function showWinner(product) {

    document.getElementById(
        "wheel-status"
    ).textContent =
        "🎉 مبروك! لقد ربحت:";

    const safeName =
        escapeHtml(
            product.name || "منتج"
        );

    const safeImage =
        escapeHtml(
            product.image || ""
        );

    const safeId =
        escapeHtml(
            product.id || ""
        );

    document.getElementById(
        "wheel-result"
    ).innerHTML = `

        <div class="winner-card">

            <img
                src="${safeImage}"
                alt="${safeName}">

            <h3>
                ${safeName}
            </h3>

            <p>
                🎉 هذا المنتج أصبح لك!
            </p>

            <button
                class="download-wheel-btn"
                onclick="downloadWheelProduct('${safeId}')">

                ⬇️ تحميل المنتج

            </button>

        </div>

    `;

}
/* =========================================
   تحميل المنتج
========================================= */

async function downloadWheelProduct(
    productId
) {

    const status =
        document.getElementById(
            "wheel-status"
        );

    status.textContent =
        "جاري تجهيز رابط التحميل...";

    try {

        if (!currentOrderID) {

            throw new Error(
                "رقم الطلب غير موجود"
            );

        }

        const response =
            await fetch(
                WHEEL_API +
                "?action=download" +
                "&orderID=" +
                encodeURIComponent(
                    currentOrderID
                ) +
                "&productId=" +
                encodeURIComponent(
                    productId
                )
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.error ||
                "تعذر إنشاء رابط التحميل"
            );

        }

        if (!data.url) {

            throw new Error(
                "رابط التحميل غير موجود"
            );

        }

        window.location.href =
            data.url;

    } catch (error) {

        console.error(error);

        status.textContent =
            "تعذر إنشاء رابط التحميل.";

    }

}
/* =========================================
   PayPal
========================================= */

function renderPayPal() {

    const container =
        document.getElementById(
            "paypal-wheel-button"
        );

    if (!container) return;

    container.innerHTML = "";

    if (
        typeof paypal ===
        "undefined"
    ) {

        document.getElementById(
            "wheel-status"
        ).textContent =
            "PayPal غير متاح حالياً.";

        return;

    }

    paypal.Buttons({

        style: {

            layout: "vertical",

            shape: "rect",

            label: "paypal"

        },


        /* إنشاء الطلب */

        createOrder:
            async function () {

                const response =
                    await fetch(
                        WHEEL_API +
                        "?action=create-order",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    amount: "5.00",
                                    currency:
                                        "USD"
                                })
                        }
                    );
const data =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.error ||
                        "تعذر إنشاء طلب الدفع"
                    );

                }

                currentOrderID =
                    data.id;

                return data.id;

            },


        /* بعد موافقة PayPal */

        onApprove:
            async function (data) {

                document.getElementById(
                    "paypal-wheel-button"
                ).style.display =
                    "none";

                document.getElementById(
                    "wheel-status"
                ).textContent =
                    "جاري تأكيد الدفع...";

                try {

                    const response =
                        await fetch(
                            WHEEL_API +
                            "?action=capture-order",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },
body:
                                    JSON.stringify({
                                        orderID:
                                            data.orderID
                                    })
                            }
                        );

                    const result =
                        await response.json();

                    if (!response.ok) {

                        throw new Error(
                            result.error ||
                            "فشل تأكيد الدفع"
                        );

                    }

                    currentOrderID =
                        data.orderID;

                    document.getElementById(
                        "wheel-status"
                    ).textContent =
                        "تم الدفع بنجاح! 🎉 جاري تدوير العجلة...";

                    spinWheel(
                        Number(
                            result.winnerIndex
                        )
                    );

                } catch (error) {

                    console.error(error);

                    document.getElementById(
                        "wheel-status"
                    ).textContent =
                        "حدث خطأ بعد الدفع. تواصل معنا.";

                    document.getElementById(
                        "paypal-wheel-button"
                    ).style.display =
                        "";

                }

            },
onCancel:
            function () {

                document.getElementById(
                    "wheel-status"
                ).textContent =
                    "تم إلغاء الدفع.";

            },


        onError:
            function (error) {

                console.error(error);

                document.getElementById(
                    "wheel-status"
                ).textContent =
                    "حدث خطأ في PayPal.";

            }

    }).render(
        "#paypal-wheel-button"
    );

}


/* =========================================
   حماية HTML
========================================= */

function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


