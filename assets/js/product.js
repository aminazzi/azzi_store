const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

Promise.all([
  fetch("../assets/data/models.json").then(r => r.json()),
  fetch("../assets/data/books.json").then(r => r.json())
])
.then(([models, books]) => {

  const products = models.concat(books);

  const product = products.find(p => Number(p.id) === id);

  if (!product) {
    alert("Product not found! ID = " + id);
    return;
  }

  document.getElementById("product-image").src = product.image;
  document.getElementById("product-image").alt = product.name;

  document.getElementById("product-name").textContent = product.name;
  document.getElementById("product-rating").textContent = "⭐ " + product.rating;
  document.getElementById("product-price").textContent = "$" + product.price;
  document.getElementById("product-description").textContent = product.description;
  document.getElementById("product-format").textContent = product.format;
  document.getElementById("product-size").textContent = product.size;

  document.getElementById("buy-btn").onclick = function () {
    window.location.href = product.payhip;
  };

})
.catch(error => {
  console.error(error);
  alert("Error: " + error);
});
