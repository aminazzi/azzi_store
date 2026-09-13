const site = "https://aminazzi.github.io/azzi_store/";

function openReferral() {
  document.getElementById("referralPage").classList.add("show");
  document.getElementById("referralLink").value = site;
}

function closeReferral() {
  document.getElementById("referralPage").classList.remove("show");
}

function copyReferral() {
  navigator.clipboard.writeText(site);
  alert("تم نسخ رابط الموقع ✅");
}

function shareReferral() {
  if (navigator.share) {
    navigator.share({
      title: "AZZI STORE",
      text: "اكتشف AZZI STORE 🚀",
      url: site
    });
  } else {
    copyReferral();
  }
}

function whatsapp() {
  window.open(
    "https://wa.me/?text=" +
    encodeURIComponent("اكتشف AZZI STORE 🚀 " + site)
  );
}

function telegram() {
  window.open(
    "https://t.me/share/url?url=" +
    encodeURIComponent(site) +
    "&text=" +
    encodeURIComponent("اكتشف AZZI STORE 🚀")
  );
}

function facebook() {
  window.open(
    "https://www.facebook.com/sharer/sharer.php?u=" +
    encodeURIComponent(site)
  );
}

function twitter() {
  window.open(
    "https://twitter.com/intent/tweet?url=" +
    encodeURIComponent(site) +
    "&text=" +
    encodeURIComponent("اكتشف AZZI STORE 🚀")
  );
}
