fetch("../assets/data/models.json")
  .then(response => response.json())
  .then(products => {

    const container = document.getElementById("products-container");

    products.forEach(product => {

      container.innerHTML += `
<div class="card">

<img src="${product.image}" class="product-img">

<h3>${product.name}</h3>

<p class="rating">⭐⭐⭐⭐⭐ ${product.rating}</p>

<p class="price">$${product.price}</p>

<a href="${product.page}" class="btn">
View Product
</a>

</div>
`;

    });

  });
