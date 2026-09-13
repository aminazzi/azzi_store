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
