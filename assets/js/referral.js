const site = "https://aminazzi.github.io/azzi_store/";

async function getReferralLink() {

    const user = await getCurrentUser();

    if (!user) return site;

    return site + "?ref=" + user.id;
}

async function openReferral() {

    document
        .getElementById("referralPage")
        .classList.add("show");

    const link = await getReferralLink();

    document.getElementById("referralLink").value = link;

    if (typeof showPoints === "function") {
        showPoints();
    }
}

function closeReferral() {
    document
        .getElementById("referralPage")
        .classList.remove("show");
}

async function copyReferral() {

    const link = await getReferralLink();

    await navigator.clipboard.writeText(link);

    alert("تم نسخ رابط الإحالة ✅");
}

async function shareReferral() {

    const link = await getReferralLink();

    if (navigator.share) {

        navigator.share({
            title: "AZZI STORE",
            text: "اكتشف AZZI STORE 🚀",
            url: link
        });

    } else {

        await navigator.clipboard.writeText(link);

        alert("تم نسخ رابط الإحالة ✅");
    }
}

async function whatsapp() {

    const link = await getReferralLink();

    window.open(
        "https://wa.me/?text=" +
        encodeURIComponent(
            "اكتشف AZZI STORE 🚀 " + link
        )
    );
}
async function telegram() {

    const link = await getReferralLink();

    window.open(
        "https://t.me/share/url?url=" +
        encodeURIComponent(link) +
        "&text=" +
        encodeURIComponent(
            "اكتشف AZZI STORE 🚀"
        )
    );
}

async function facebook() {

    const link = await getReferralLink();

    window.open(
        "https://www.facebook.com/sharer/sharer.php?u=" +
        encodeURIComponent(link)
    );
}

async function twitter() {

    const link = await getReferralLink();

    window.open(
        "https://twitter.com/intent/tweet?url=" +
        encodeURIComponent(link) +
        "&text=" +
        encodeURIComponent(
            "اكتشف AZZI STORE 🚀"
        )
    );
}
