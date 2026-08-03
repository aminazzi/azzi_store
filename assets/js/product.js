const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

fetch("../assets/data/models.json")
  .then(response => response.json())
  .then(products => {

    const product = products.find(p => p.id === id);

    if (!product) return;

    document.getElementById("product-image").src = product.image;
    document.getElementById("product-name").textContent = product.name;
    document.getElementById("product-rating").textContent = "⭐ " + product.rating;
    document.getElementById("product-price").textContent = "$" + product.price;
    document.getElementById("product-description").textContent = product.description;
    document.getElementById("product-format").textContent = product.format;
    document.getElementById("product-size").textContent = product.size;

  });
