/* AZZI STORE - Referral Points */

const REF_KEY = "azzi_referrer";

function saveReferral() {
    const ref = new URLSearchParams(location.search).get("ref");

    if (ref) {
        localStorage.setItem(REF_KEY, ref);
    }
}

async function claimReferral() {
    const referrer = localStorage.getItem(REF_KEY);

    if (!referrer || !window.supabaseClient) return;

    const user = await getCurrentUser();

    if (!user) return;

    const { error } = await supabaseClient.rpc(
        "claim_referral",
        {
            p_referrer: referrer
        }
    );

    if (!error) {
        localStorage.removeItem(REF_KEY);
        showPoints();
    }
}

async function showPoints() {

    const user = await getCurrentUser();

    if (!user) return;

    const { data } = await supabaseClient
        .from("profiles")
        .select("points")
        .eq("id", user.id)
        .single();

    if (!data) return;

    let box = document.getElementById("azziPoints");

    if (!box) {

        box = document.createElement("div");
        box.id = "azziPoints";

        document.body.appendChild(box);
    }

    box.innerHTML = `⭐ ${data.points || 0}`;
}

saveReferral();

document.addEventListener("DOMContentLoaded", async () => {

    setTimeout(async () => {
        await claimReferral();
        await showPoints();
    }, 1000);

});
const pointsStyle = document.createElement("style");

pointsStyle.textContent = `
#azziPoints {
    position: fixed;
    top: 15px;
    left: 15px;
    z-index: 99999;

    padding: 7px 12px;

    background: rgba(20, 15, 45, .92);
    color: #fff;

    border: 1px solid #a855f7;
    border-radius: 12px;

    font-size: 13px;
    font-weight: bold;

    box-shadow: 0 0 15px rgba(168,85,247,.35);

    direction: rtl;
}
`;

document.head.appendChild(pointsStyle);
