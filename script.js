
document.addEventListener("DOMContentLoaded", function () {

    const products = [...document.querySelectorAll(".product-card")];

    const detailImage = document.getElementById("detail-image");
    const detailName = document.getElementById("detail-name");
    const detailDescription = document.getElementById("detail-description");
    const detailPrice = document.getElementById("detail-price");
    const detailStock = document.getElementById("detail-stock");
    const quantityInput = document.getElementById("product-quantity");

    const cartItems = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const cartSubtotal = document.getElementById("cart-subtotal");
    const cartTotal = document.getElementById("cart-total");

    const STORAGE_KEY = "fatimaHijjabStoreCart_v1";

    let selectedProduct = null;
    let cart = [];

    // PRICE FORMAT
    function money(amount) {
        return "PKR " + Number(amount).toLocaleString("en-PK");
    }

    // GET PRODUCT INFORMATION
    function getProduct(card) {
        const image = card.querySelector(".product-image img");

        return {
            id: card.dataset.productId,
            name: card.dataset.name,
            price: Number(card.dataset.price),
            stock: Number(card.dataset.stock),
            image: image ? image.getAttribute("src") : ""
        };
    }

    // SAVE CART
    function saveCart() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        } catch (error) {
            console.warn("Cart could not be saved.", error);
        }
    }

    // LOAD SAVED CART
    function loadCart() {
        try {
            const saved = JSON.parse(
                localStorage.getItem(STORAGE_KEY) || "[]"
            );

            if (!Array.isArray(saved)) return [];

            return saved.map(item => {
                const card = products.find(
                    product => product.dataset.productId === item.id
                );

                if (!card) return null;

                const product = getProduct(card);
                const quantity = Number(item.quantity);

                if (
                    !Number.isInteger(quantity) ||
                    quantity < 1 ||
                    quantity > product.stock
                ) {
                    return null;
                }

                return {
                    ...product,
                    quantity: quantity
                };
            }).filter(Boolean);

        } catch (error) {
            console.warn("Saved cart could not be loaded.", error);
            return [];
        }
    }

    // SHOW PRODUCT DETAILS
    function showProduct(id) {

        const card = products.find(
            item => item.dataset.productId === id
        );

        if (!card) return;

        selectedProduct = getProduct(card);

        detailImage.src = selectedProduct.image;
        detailImage.alt = selectedProduct.name;

        detailName.textContent = selectedProduct.name;

        detailDescription.textContent =
            "Elegant modest abaya from Fatima Hijjab Store.";

        detailPrice.textContent =
            "Price: " + money(selectedProduct.price);

        detailStock.textContent =
            "Available Stock: " + selectedProduct.stock;

        quantityInput.value = 1;
        quantityInput.min = 1;
        quantityInput.max = selectedProduct.stock;

        document.getElementById("product-details")
            .scrollIntoView({ behavior: "smooth" });
    }

    // DISPLAY CART
    function renderCart() {

        cartItems.innerHTML = "";

        let subtotal = 0;
        let totalQuantity = 0;

        if (cart.length === 0) {

            cartItems.innerHTML =
                "<p>Your cart is currently empty.</p>";

        } else {

            cart.forEach(item => {

                subtotal += item.price * item.quantity;
                totalQuantity += item.quantity;

                const row = document.createElement("div");
                row.className = "cart-item";

                const image = document.createElement("img");
                image.src = item.image;
                image.alt = item.name;

                const info = document.createElement("div");

                const name = document.createElement("h3");
                name.textContent = item.name;

                const price = document.createElement("p");
                price.textContent =
                    money(item.price) + " × " + item.quantity;

                const remove = document.createElement("button");
                remove.type = "button";
                remove.textContent = "Remove";
                remove.dataset.removeProduct = item.id;

                info.append(name, price);
                row.append(image, info, remove);

                cartItems.appendChild(row);
            });
        }

        cartCount.textContent = totalQuantity;
        cartSubtotal.textContent = money(subtotal);
        cartTotal.textContent = money(subtotal);

        saveCart();
    }

    // ADD PRODUCT TO CART
    function addToCart() {

        if (!selectedProduct) {
            alert("Please select a product first.");
            return false;
        }

        const quantity = Number(quantityInput.value);

        if (!Number.isInteger(quantity) || quantity < 1) {
            alert("Please enter a valid quantity.");
            return false;
        }

        const existing = cart.find(
            item => item.id === selectedProduct.id
        );

        const alreadyAdded = existing ? existing.quantity : 0;

        if (alreadyAdded + quantity > selectedProduct.stock) {
            alert(
                "Sorry! Available stock is " +
                selectedProduct.stock + "."
            );
            return false;
        }

        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.push({
                ...selectedProduct,
                quantity: quantity
            });
        }

        renderCart();

        alert("Product successfully added to your cart!");

        return true;
    }

    // FILTER PRODUCTS
    function filterProducts(category) {

        products.forEach(card => {

            const matches =
                category === "all" ||
                card.dataset.category === category;

            card.style.display = matches ? "" : "none";
        });

        document.querySelectorAll(
            ".product-filters [data-category]"
        ).forEach(button => {

            const active = button.dataset.category === category;

            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        });
    }

    // ALL CLICK ACTIONS
    document.addEventListener("click", function (event) {

        const viewButton = event.target.closest(".view-product");

        if (viewButton) {

            const card = viewButton.closest(".product-card");

            if (card) showProduct(card.dataset.productId);

            return;
        }

        const productLink = event.target.closest(
            '.product-card a[href="#product-details"]'
        );

        if (productLink) {

            event.preventDefault();

            const card = productLink.closest(".product-card");

            if (card) showProduct(card.dataset.productId);

            return;
        }

        const filterButton = event.target.closest(
            ".product-filters [data-category]"
        );

        if (filterButton) {
            filterProducts(filterButton.dataset.category);
            return;
        }

        const removeButton = event.target.closest(
            "[data-remove-product]"
        );

        if (removeButton) {

            const id = removeButton.dataset.removeProduct;

            cart = cart.filter(item => item.id !== id);

            renderCart();
            return;
        }
    });

    // CATEGORY LINKS
    document.querySelectorAll("[data-category-link]")
        .forEach(link => {

            link.addEventListener("click", function () {

                filterProducts(this.dataset.categoryLink);
            });
        });

    // ADD TO CART BUTTON
    document.getElementById("add-to-cart")
        .addEventListener("click", addToCart);

    // BUY NOW BUTTON
    document.getElementById("buy-now")
        .addEventListener("click", function () {

            if (addToCart()) {

                document.getElementById("checkout")
                    .scrollIntoView({ behavior: "smooth" });
            }
        });

    // CHECKOUT
    document.getElementById("checkout-form")
        .addEventListener("submit", function (event) {

            event.preventDefault();

            if (cart.length === 0) {
                alert("Your cart is empty. Please add a product first.");
                return;
            }

            const form = new FormData(this);

            let order = "NEW ORDER - FATIMA HIJJAB STORE\n\n";

            order += "Customer: " + form.get("customerName") + "\n";
            order += "Phone: " + form.get("phone") + "\n";
            order += "Email: " +
                (form.get("email") || "Not provided") + "\n";

            order += "City: " + form.get("city") + "\n";
            order += "Address: " + form.get("address") + "\n";

            order += "Postal Code: " +
                (form.get("postcode") || "Not provided") + "\n";

            order += "Payment: " + form.get("payment") + "\n\n";

            order += "ORDER ITEMS:\n";

            cart.forEach(item => {

                order += item.name +
                    " | Qty: " + item.quantity +
                    " | " + money(item.price * item.quantity) +
                    "\n";
            });

            const total = cart.reduce(
                (sum, item) =>
                    sum + item.price * item.quantity,
                0
            );

            order += "\nTotal: " + money(total);

            const whatsappURL =
                "https://wa.me/923194070190?text=" +
                encodeURIComponent(order);

            window.open(whatsappURL, "_blank");
        });

    // INITIALIZE
    cart = loadCart();

    renderCart();

    filterProducts("all");

});
