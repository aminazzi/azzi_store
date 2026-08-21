const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

console.log("Product ID:", id);

Promise.all([
  fetch("../assets/data/models.json").then(r => r.json()),
  fetch("../assets/data/books.json").then(r => r.json()),
  fetch("../assets/data/scripts.json").then(r => r.json()),
  fetch("../assets/data/mods.json").then(r => r.json()),
  fetch("../assets/data/apps.json").then(r => r.json())
])

.then(([models, books, scripts, mods, apps]) => {

  const products = [
    ...models,
    ...books,
    ...scripts,
    ...mods,
    ...apps
  ];

  const product = products.find(
    p => Number(p.id) === id
  );

  if (!product) {

    document.body.innerHTML = `
      <div style="text-align:center; padding:50px;">
        <h2>❌ Product not found</h2>
        <p>المنتج غير موجود.</p>
      </div>
    `;

    return;
      }

  // الصورة
  document.getElementById("product-image").src =
    product.image;

  // الاسم
  document.getElementById("product-name").textContent =
    product.name;

  // التقييم
  document.getElementById("product-rating").textContent =
    "⭐ " + product.rating;

  // السعر
  document.getElementById("product-price").textContent =
    "$" + product.price;

  // الوصف
  document.getElementById("product-description").textContent =
    product.description;

  // النوع
  document.getElementById("product-format").textContent =
    product.format;

  // الحجم
  document.getElementById("product-size").textContent =
    product.size;

  // زر الشراء
  document.getElementById("buy-btn").onclick = function () {

    if (product.payhip) {
      window.location.href = product.payhip;
    } else {
      alert("رابط الشراء غير متوفر لهذا المنتج.");
   }

  };

})

.catch(error => {

  console.error("Error loading product:", error);

});
