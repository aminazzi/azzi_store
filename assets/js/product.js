const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

console.log("Product ID:", id);

Promise.all([
    fetch("../assets/data/models.json").then(r => r.json()),
    fetch("../assets/data/books.json").then(r => r.json()),
    fetch("../assets/data/scripts.json").then(r => r.json())
])

.then(([models, books, scripts]) => {

    const products = [
        ...models,
        ...books,
        ...scripts
    ];

    const product = products.find(p => p.id === id);

    if (!product) {

        document.body.innerHTML =
            "<h2>Product not found</h2>";

        return;
    }

    console.log("Product found:", product);

    // Image
    const image =
        document.getElementById("product-image");

    if (image) {
        image.src = product.image;
        image.alt = product.name;
    }

    // Name
    const name =
        document.getElementById("product-name");

    if (name) {
        name.textContent = product.name;
    }

    // Rating
    const rating =
        document.getElementById("product-rating");
    if (rating) {
        rating.textContent =
            "⭐ " + product.rating;
    }

    // Price
    const price =
        document.getElementById("product-price");

    if (price) {
        price.textContent =
            "$" + product.price;
    }

    // Description
    const description =
        document.getElementById("product-description");

    if (description) {
        description.textContent =
            product.description;
    }

    // Format
    const format =
        document.getElementById("product-format");

    if (format) {
        format.textContent =
            product.format;
    }

    // Size
    const size =
        document.getElementById("product-size");

    if (size) {
        size.textContent =
            product.size;
    }

    // Buy button
    const buyButton =
        document.getElementById("buy-btn")
    ;

    if (buyButton) {

        buyButton.onclick = function () {

            if (product.payhip) {

                window.location.href =
                    product.payhip;

            } else {

                alert(
                    "Payhip link is not available yet."
                );

            }

        };
    }

})

.catch(error => {

    console.error(
        "Error loading product:",
        error
    );

});
