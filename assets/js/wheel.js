/* =========================================
   AZZI STORE - WHEEL
========================================= */

const WHEEL_API =
    "https://swfiagrlqebsnvgshipu.supabase.co/functions/v1/wheel";

let wheelProducts = [];
let wheelRotation = 0;
let isSpinning = false;


/* =========================================
   فتح العجلة
========================================= */

async function openWheel() {

    const modal =
        document.getElementById("wheel-modal");

    modal.classList.add("active");

    document.getElementById(
        "wheel-status"
    ).textContent = "جاري تحميل المنتجات...";

    document.getElementById(
        "wheel-result"
    ).innerHTML = "";

    try {

        const response =
            await fetch(WHEEL_API + "?action=products");

        if (!response.ok) {
            throw new Error("Products error");
        }

        wheelProducts =
            await response.json();

        if (wheelProducts.length !== 6) {

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

    const ctx =
        canvas.getContext("2d");

    const center = 250;
    const radius = 235;

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
/* اسم المنتج */

            ctx.save();

            ctx.translate(
                center,
                center
            );

            ctx.rotate(
                start +
                segment / 2
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

    if (isSpinning) return;

    isSpinning = true;

    const canvas =
        document.getElementById(
            "wheel-canvas"
        );
/*
       كل قطعة = 60 درجة
    */

    const segment =
        360 / wheelProducts.length;

    /*
       نضع القطعة الفائزة أمام السهم
    */

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
   إظهار المنتج
========================================= */

function showWinner(product) {

    document.getElementById(
        "wheel-status"
    ).textContent =
        "🎉 مبروك! لقد ربحت:";


    document.getElementById(
        "wheel-result"
    ).innerHTML = `

        <div class="winner-card">

            <img
                src="${product.image_url}"
                alt="${product.name}">

            <h3>
                ${product.name}
            </h3>

            <p>
                🎉 هذا المنتج أصبح لك!
            </p>

            <button
                class="download-wheel-btn"
                onclick="downloadWheelProduct('${product.id}')">

                ⬇️ تحميل المنتج

            </button>

        </div>

    `;

}
/* =========================================
   تحميل المنتج
========================================= */

async function downloadWheelProduct(productId) {

    const status =
        document.getElementById(
            "wheel-status"
        );

    status.textContent =
        "جاري تجهيز رابط التحميل...";


    try {

        const response =
            await fetch(
                WHEEL_API +
                "?action=download&id=" +
                encodeURIComponent(productId)
            );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.error ||
                "Download error"
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

    container.innerHTML = "";


    paypal.Buttons({

        style: {

            layout: "vertical",

            shape: "rect",

            label: "paypal"

        },


        /* إنشاء طلب */

        createOrder: async function () {

            const response =
                await fetch(
                    WHEEL_API +
                    "?action=create-order",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json"
                        }
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Could not create order"
                );

            }
return data.id;

        },


        /* بعد نجاح الدفع */

        onApprove: async function (data) {

            document.getElementById(
                "paypal-wheel-button"
            ).style.display =
                "none";


            document.getElementById(
                "wheel-status"
            ).textContent =
                "تم الدفع بنجاح! 🎉 جاري تدوير العجلة...";


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
                        result.error
                    );

                }


                /*
                   الفائز يحدده السيرفر
                */

                spinWheel(
                    result.winnerIndex
                );


            } catch (error) {

                console.error(error);

                document.getElementById(
                    "wheel-status"
                ).textContent =
                    "حدث خطأ بعد الدفع. تواصل معنا.";

            }

        },


        onCancel: function () {

            document.getElementById(
                "wheel-status"
            ).textContent =
                "تم إلغاء الدفع.";

        },


        onError: function (error) {

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

