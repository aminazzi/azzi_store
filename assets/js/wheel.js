/* ==========================================
   AZZI STORE - POINTS WHEEL
   ========================================== */

let wheelSpinning = false;

const wheelRewards = [
    {
        points: 10,
        weight: 70
    },
    {
        points: 30,
        weight: 40
    },
    {
        points: 80,
        weight: 20
    },
    {
        points: 200,
        weight: 10
    },
    {
        points: 1000,
        weight: 5
    }
];


// ==========================================
// فتح العجلة
// ==========================================

async function openWheel() {

    const user = await getCurrentUser();

    if (!user) {

        window.location.href =
            "pages/login.html";

        return;
    }

    const modal =
        document.getElementById("wheel-modal");

    if (!modal) return;

    modal.classList.add("active");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    checkWheelStatus();
}


// ==========================================
// إغلاق العجلة
// ==========================================

function closeWheel() {

    const modal =
        document.getElementById("wheel-modal");

    if (!modal) return;

    modal.classList.remove("active");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );
}
// ==========================================
// حساب الوقت المتبقي
// ==========================================

async function checkWheelStatus() {

    const message =
        document.getElementById(
            "wheel-message"
        );

    const button =
        document.getElementById(
            "spin-wheel-btn"
        );

    if (!message || !button) return;


    /*
       نستدعي الدالة فقط للفحص.
       إذا كانت اللفة متاحة لن نحصل على
       reward لأن الدالة لا تنفذ اللفة إلا
       عند نجاح الشرط.
    */

    message.textContent =
        "🎁 اللفة مجانية مرة كل 24 ساعة";

    button.disabled =
        wheelSpinning;

    button.textContent =
        "🎰 لف العجلة";
}


// ==========================================
// تدوير العجلة
// ==========================================

async function spinWheel() {

    if (wheelSpinning) return;


    const user =
        await getCurrentUser();

    if (!user) {

        window.location.href =
            "pages/login.html";

        return;
    }


    const button =
        document.getElementById(
            "spin-wheel-btn"
        );

    const message =
        document.getElementById(
            "wheel-message"
        );

    const wheel =
        document.getElementById(
            "points-wheel"
        );
if (!button || !message || !wheel)
        return;


    wheelSpinning = true;

    button.disabled = true;

    button.textContent =
        "⏳ جاري التدوير...";

    message.textContent = "";


    // ======================================
    // طلب النتيجة من Supabase
    // ======================================

    const { data, error } =
        await supabaseClient.rpc(
            "spin_wheel"
        );


    if (error) {

        console.error(
            "Wheel error:",
            error
        );

        wheelSpinning = false;

        button.disabled = false;

        button.textContent =
            "🎰 لف العجلة";

        message.textContent =
            "❌ حدث خطأ، حاول مرة أخرى.";

        return;
    }


    // ======================================
    // لم يحن وقت اللفة
    // ======================================

    if (!data.ok) {

        wheelSpinning = false;

        button.disabled = false;

        button.textContent =
            "🎰 لف العجلة";

        message.textContent =
            "⏳ " + data.message;

        if (data.remaining_seconds) {

            startWheelCountdown(
                data.remaining_seconds
            );

        }

        return;
    }


    const reward =
        Number(data.reward);
// ======================================
    // معرفة رقم الشريحة
    // ======================================

    const rewardIndex =
        wheelRewards.findIndex(
            item =>
                item.points === reward
        );


    if (rewardIndex === -1) {

        wheelSpinning = false;

        button.disabled = false;

        return;
    }


    // ======================================
    // حساب مركز الشريحة
    // ======================================

    const totalWeight =
        wheelRewards.reduce(
            (sum, item) =>
                sum + item.weight,
            0
        );


    let startWeight = 0;

    for (
        let i = 0;
        i < rewardIndex;
        i++
    ) {

        startWeight +=
            wheelRewards[i].weight;
    }


    const sliceCenter =
        (
            startWeight +
            wheelRewards[rewardIndex].weight / 2
        ) / totalWeight * 360;


    /*
       نضيف عدة دورات حتى تكون الحركة
       جميلة وواضحة.
    */

    const extraTurns =
        6 * 360;


    const finalRotation =
        extraTurns +
        (360 - sliceCenter);


    wheel.style.transform =
        `rotate(${finalRotation}deg)`;
// ======================================
    // انتظار انتهاء الحركة
    // ======================================

    setTimeout(() => {

        message.innerHTML =
            `
            🎉 مبروك!
            <br>
            ربحت
            <strong>⭐ ${reward}</strong>
            نقطة
            `;


        button.textContent =
            "⏳ عد غدًا للمحاولة مرة أخرى";

        wheelSpinning = false;


        startWheelCountdown(
            24 * 60 * 60
        );


        // تحديث صندوق النقاط
        if (
            typeof showPoints ===
            "function"
        ) {

            showPoints();

        }

    }, 6200);
}


// ==========================================
// عداد 24 ساعة
// ==========================================

function startWheelCountdown(seconds) {

    const countdown =
        document.getElementById(
            "wheel-countdown"
        );

    if (!countdown) return;


    let remaining =
        Number(seconds);


    const update = () => {

        if (remaining <= 0) {

            countdown.textContent =
                "🎁 اللفة متاحة الآن!";

            const button =
                document.getElementById(
                    "spin-wheel-btn"
                );

            if (button) {

                button.disabled = false;

                button.textContent =
                    "🎰 لف العجلة";

            }

            return;
        }
const hours =
            Math.floor(
                remaining / 3600
            );


        const minutes =
            Math.floor(
                (remaining % 3600) / 60
            );


        const secs =
            remaining % 60;


        countdown.textContent =
            `⏳ اللفة القادمة بعد:
             ${hours}س
             ${minutes}د
             ${secs}ث`;


        remaining--;

        setTimeout(
            update,
            1000
        );
    };


    update();
}


// ==========================================
// إغلاق عند الضغط خارج النافذة
// ==========================================

document.addEventListener(
    "click",
    function(event) {

        const modal =
            document.getElementById(
                "wheel-modal"
            );

        if (
            modal &&
            event.target === modal
        ) {

            closeWheel();

        }

    }
);
