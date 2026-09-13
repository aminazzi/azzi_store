/* AZZI STORE - Referral Fix */

document.addEventListener("DOMContentLoaded", () => {

  const style = document.createElement("style");

  style.textContent = `
  /* ===== زر الإحالة في القائمة السفلية ===== */

  .bottom-nav-item {
    flex: 1 1 0 !important;
    height: 100% !important;
    min-width: 0 !important;
    padding: 4px !important;
    margin: 0 !important;

    background: transparent !important;
    border: none !important;
    outline: none !important;
    box-shadow: none !important;

    color: white !important;

    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;

    font-family: inherit !important;
    cursor: pointer !important;
  }

  .bottom-nav-item:hover,
  .bottom-nav-item:active,
  .bottom-nav-item:focus {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    outline: none !important;
  }

  .bottom-nav-item span {
    font-size: 25px !important;
    line-height: 1 !important;
  }

  .bottom-nav-item small {
    font-size: 11px !important;
    margin-top: 5px !important;
  }
/* ===== صفحة الإحالة ===== */

  .referral-page {
    background:
      radial-gradient(
        circle at top,
        rgba(139,92,246,.25),
        transparent 45%
      ) !important;

    background-color: #080b1a !important;
  }

  .referral-box {
    background: rgba(17,24,39,.96) !important;
    border: 1px solid rgba(168,85,247,.55) !important;
    border-radius: 24px !important;

    box-shadow:
      0 0 30px rgba(139,92,246,.18),
      0 15px 40px rgba(0,0,0,.45) !important;

    color: white !important;
  }

  .referral-box h2 {
    color: white !important;
    text-shadow: 0 0 15px rgba(168,85,247,.8) !important;
  }

  .referral-box p {
    color: #cbd5e1 !important;
  }


  /* حذف مربع المكافآت */
  .referral-box .reward {
    display: none !important;
  }


  /* ===== رابط الإحالة ===== */

  .link-box input {
    background: #0f172a !important;
    color: #e2e8f0 !important;
    border: 1px solid rgba(168,85,247,.5) !important;
  }

  .link-box button {
    background: #a855f7 !important;
    color: white !important;
  }
/* ===== زر المشاركة ===== */

  .share-btn {
    background:
      linear-gradient(
        90deg,
        #8b5cf6,
        #a855f7,
        #ec4899
      ) !important;

    box-shadow:
      0 0 20px rgba(168,85,247,.3) !important;

    color: white !important;
  }


  /* ===== أزرار التواصل ===== */

  .social button {
    background: #151b35 !important;
    border: 1px solid rgba(168,85,247,.25) !important;
    color: white !important;

    transition: .2s !important;
  }

  .social button:hover {
    border-color: #a855f7 !important;
    transform: translateY(-2px);
  }


  /* ألوان الأيقونات */

  .social button:nth-child(1)::first-letter {
    color: #25D366;
  }

  .social button:nth-child(2)::first-letter {
    color: #229ED9;
  }

  .social button:nth-child(3)::first-letter {
    color: #1877F2;
  }


  /* زر الرجوع */

  .back-btn {
    background: #151b35 !important;
    color: white !important;
    border: 1px solid rgba(168,85,247,.4) !important;
  }
  `;

  document.head.appendChild(style);


  /* حذف مربع المكافآت */
  const reward = document.querySelector(".referral-box .reward");

  if (reward) {
    reward.remove();
  }

});
