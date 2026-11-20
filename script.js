
// Fatima Hijjab Store - JavaScript

document.addEventListener("DOMContentLoaded", function () {

    let cart = [];

    // Add products to cart
    const addButtons = document.querySelectorAll(".add-to-cart");

    addButtons.forEach(function (button) {
        button.addEventListener("click", function () {

            const product = button.closest(".product-card");

            if (!product) return;

            const name = product.querySelector("h3")?.textContent.trim();
            const priceText = product.querySelector(".price")?.textContent || "";
            const price = Number(priceText.replace(/[^0-9.]/g, ""));

            if (!name || !price) {
                alert("Product ki details abhi complete nahi hain.");
                return;
            }

            const existing = cart.find(item => item.name === name);

            if (existing) {
                existing.quantity++;
            } else {
                cart.push({
                    name: name,
                    price: price,
                    quantity: 1
                });
            }

            updateCart();
            alert(name + " cart mein add ho gaya!");
        });
    });

    // Update cart display
    function updateCart() {

        const cartItems = document.querySelector("#cart-items");
        const cartTotal = document.querySelector("#cart-total");
        const cartCount = document.querySelector("#cart-count");

        let total = 0;
        let count = 0;

        if (cartItems) {
            cartItems.innerHTML = "";
        }

        cart.forEach(function (item, index) {

            total += item.price * item.quantity;
            count += item.quantity;

            if (cartItems) {
                const div = document.createElement("div");

                div.innerHTML = `
                    <p>${item.name} - Rs. ${item.price}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <button data-index="${index}" class="remove-cart-item">
                        Remove
                    </button>
                `;

                cartItems.appendChild(div);
            }
        });

        if (cartTotal) {
            cartTotal.textContent = "Rs. " + total.toLocaleString();
        }

        if (cartCount) {
            cartCount.textContent = count;
        }
    }

    // Remove item from cart
    document.addEventListener("click", function (event) {

        if (event.target.classList.contains("remove-cart-item")) {

            const index = Number(event.target.dataset.index);

            cart.splice(index, 1);
            updateCart();
        }
    });

    // WhatsApp checkout
    const checkoutForm = document.querySelector("#checkout-form");

    if (checkoutForm) {

        checkoutForm.addEventListener("submit", function (event) {

            event.preventDefault();

            if (cart.length === 0) {
                alert("Pehle shopping cart mein product add karein.");
                return;
            }

            const formData = new FormData(checkoutForm);

            let message = "Assalam-o-Alaikum! Fatima Hijjab Store se order karna hai.\n\n";

            message += "Customer Details:\n";

            formData.forEach(function (value, key) {
                message += key + ": " + value + "\n";
            });

            message += "\nOrder Details:\n";

            let total = 0;

            cart.forEach(function (item) {
                message += item.name + " x " + item.quantity +
                    " = Rs. " + (item.price * item.quantity) + "\n";

                total += item.price * item.quantity;
            });

            message += "\nTotal: Rs. " + total;

            const whatsappURL =
                "https://wa.me/923194070190?text=" +
                encodeURIComponent(message);

            window.open(whatsappURL, "_blank");
        });
    }

    // Mobile navigation
    const menuButton = document.querySelector(".menu-toggle");
    const navigation = document.querySelector("nav");

    if (menuButton && navigation) {
        menuButton.addEventListener("click", function () {
            navigation.classList.toggle("active");
        });
    }

    updateCart();

});
