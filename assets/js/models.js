fetch("../assets/data/models.json")
  .then(response => response.json())
  .then(products => {

    const container = document.getElementById("products-container");

    products.forEach(product => {

      container.innerHTML += `
        <a href="${product.page}" class="card">

          <img src="${product.image}"
               style="width:100%;border-radius:10px;">

          <h3>${product.name}</h3>

          <p>⭐ ${product.rating}</p>

          <p><strong>$${product.price}</strong></p>

        </a>
      `;

    });

  });
