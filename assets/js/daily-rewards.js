/* AZZI STORE - DAILY REWARDS 🎁 */

const DAILY_REWARDS = [
  10,20,30,50,75,100,125,150,200,250,
  300,350,400,450,500,550,600,650,700,750,
  800,850,900,950,1000,1050,1200,1350,1500
];

let dailyState = {
  claimed_day: 0,
  last_claimed_date: null
};

function casablancaDate() {
  const d = new Date();
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Casablanca"
  }).format(d);
}

async function openDailyRewards() {

  const user = await getCurrentUser();

  if (!user) {
    window.location.href = "pages/login.html";
    return;
  }

  document.getElementById("dailyRewardsPage")
    .classList.add("active");

  await loadDailyRewards();
}

function closeDailyRewards() {
  document.getElementById("dailyRewardsPage")
    .classList.remove("active");
}
async function loadDailyRewards() {

  const user = await getCurrentUser();
  if (!user) return;

  const { data, error } = await supabaseClient
    .from("daily_rewards")
    .select("claimed_day,last_claimed_date")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error(error);
    return;
  }

  dailyState = data || {
    claimed_day: 0,
    last_claimed_date: null
  };

  renderDailyRewards();
}

function renderDailyRewards() {

  const grid = document.getElementById("dailyGrid");
  if (!grid) return;

  const today = casablancaDate();
  const claimedToday =
    dailyState.last_claimed_date === today;

  grid.innerHTML = DAILY_REWARDS.map((reward, i) => {

    const day = i + 1;
    let status = "locked";
    let action = "🔒";

    if (day <= dailyState.claimed_day) {
      status = "claimed";
      action = "✓ تم";
    }
else if (
      day === dailyState.claimed_day + 1 &&
      !claimedToday
    ) {
      status = "available";
      action = "استلام";
    }
    else if (
      day === dailyState.claimed_day + 1 &&
      claimedToday
    ) {
      status = "tomorrow";
      action = "⏳ غدًا";
    }

    return `
      <div class="daily-card ${status}">
        <b>اليوم ${day}</b>
        <strong>⭐ ${reward}</strong>

        ${
          status === "available"
          ? `<button onclick="claimDailyReward()">
               ${action}
             </button>`
          : `<span class="daily-status">${action}</span>`
        }
      </div>
    `;

  }).join("");
}

async function claimDailyReward() {

  const user = await getCurrentUser();

  if (!user) {
    window.location.href = "pages/login.html";
    return;
  }

  const { data, error } =
    await supabaseClient.rpc("claim_daily_reward");

  if (error) {
    console.error(error);
    alert("حدث خطأ أثناء استلام المكافأة");
    return;
  }
if (!data.ok) {
    alert("⏳ " + data.message);
    return;
  }

  alert(
    `🎉 حصلت على ⭐ ${data.reward} نقطة!\n` +
    `اليوم ${data.day}`
  );

  await loadDailyRewards();

  if (typeof showPoints === "function") {
    await showPoints();
  }
}

/* إنشاء الزر والمربع */

function setupDailyRewards() {

  const nav = document.getElementById("bottomNav");

  if (nav && !document.getElementById("dailyRewardsButton")) {

    const button = document.createElement("button");

    button.id = "dailyRewardsButton";
    button.className = "bottom-nav-button";
    button.type = "button";
    button.onclick = openDailyRewards;

    button.innerHTML = `
      <span>🎁</span>
      <small>اليومية</small>
    `;

    const exit =
      document.getElementById("exitSiteButton");

    nav.insertBefore(button, exit);
  }
if (!document.getElementById("dailyRewardsPage")) {

    document.body.insertAdjacentHTML("beforeend", `
      <div id="dailyRewardsPage" class="daily-page">

        <div class="daily-box">

          <button
            class="daily-close"
            onclick="closeDailyRewards()">✕</button>

          <div class="daily-title">
            🎁 المكافأة اليومية
          </div>

          <p class="daily-subtitle">
            سجل دخولك يوميًا واحصل على نقاط أكثر
          </p>

          <div id="dailyGrid"
               class="daily-grid"></div>

          <div class="daily-note">
            ⭐ كل حساب له جوائزه الخاصة
          </div>

        </div>

      </div>
    `);
  }
}
/* التصميم */

const dailyStyle = document.createElement("style");

dailyStyle.textContent = `
.daily-page{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,.72);
  display:none;
  align-items:center;
  justify-content:center;
  padding:15px;
  z-index:99999;
}

.daily-page.active{
  display:flex;
}

.daily-box{
  width:min(520px,100%);
  max-height:88vh;
  overflow:auto;
  background:#111827;
  border:1px solid rgba(168,85,247,.45);
  border-radius:22px;
  padding:20px;
  box-shadow:0 0 35px rgba(168,85,247,.25);
  direction:rtl;
  position:relative;
}

.daily-close{
  position:absolute;
  top:10px;
  left:10px;
  width:34px;
  height:34px;
  border:0;
  border-radius:50%;
  background:#ef4444;
  color:#fff;
  cursor:pointer;
}

.daily-title{
  text-align:center;
  font-size:22px;
  font-weight:900;
}

.daily-subtitle{
  text-align:center;
  color:#aaa;
  margin:8px 0 18px;
}

.daily-grid{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:10px;
}
.daily-card{
  min-height:105px;
  padding:10px;
  border-radius:15px;
  background:rgba(255,255,255,.06);
  border:1px solid rgba(255,255,255,.08);
  text-align:center;
  display:flex;
  flex-direction:column;
  justify-content:center;
  gap:7px;
}

.daily-card strong{
  font-size:17px;
}

.daily-card button{
  border:0;
  border-radius:10px;
  padding:7px;
  background:#8b5cf6;
  color:white;
  font-weight:bold;
  cursor:pointer;
}

.daily-card.claimed{
  opacity:.7;
  border-color:#22c55e;
}

.daily-card.available{
  border-color:#f59e0b;
  box-shadow:0 0 12px rgba(245,158,11,.18);
}

.daily-card.locked{
  opacity:.45;
}

.daily-status{
  font-size:13px;
}

.daily-note{
  text-align:center;
  margin-top:15px;
  color:#aaa;
  font-size:13px;
}

@media(max-width:400px){
  .daily-grid{
    grid-template-columns:repeat(2,1fr);
  }
}
body.light-mode .daily-box{
  background:#fff;
  color:#111827;
}
`;

document.head.appendChild(dailyStyle);

document.addEventListener("DOMContentLoaded", setupDailyRewards);
