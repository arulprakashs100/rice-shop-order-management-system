// JavaScript for select-rice.html

document.addEventListener("DOMContentLoaded", () => {
    // State management for product size selection (defaults to 5kg for each product)
    const productSizesState = {};

    // DOM Elements
    const productsGrid = document.getElementById("products-grid-container");
    const searchInput = document.getElementById("search-input");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const resultsCountText = document.getElementById("results-count");
    
    // Cart Elements
    const cartSidebar = document.getElementById("cart-sidebar");
    const cartBackdrop = document.getElementById("cart-backdrop");
    const cartToggleBtn = document.getElementById("cart-toggle-btn");
    const cartCloseBtn = document.getElementById("cart-close-btn");
    const cartItemsContainer = document.getElementById("cart-items-container");
    const cartBadgeCount = document.getElementById("cart-badge-count");
    
    const cartTotalCount = document.getElementById("cart-total-count");
    const cartSubtotalText = document.getElementById("cart-subtotal");
    const cartShippingText = document.getElementById("cart-shipping");
    const cartGrandtotalText = document.getElementById("cart-grandtotal");
    const checkoutBtn = document.getElementById("checkout-btn");

    let activeCategory = "all";
    let searchQuery = "";

    // 1. Initial Render & Event Listeners - Loaded from Database
    loadProducts().then((loadedProducts) => {
        loadedProducts.forEach(p => {
            productSizesState[p.id] = 5; // default size is 5kg
        });
        renderProducts();
        updateCategoryCounts();
        updateCartUI();
    });

    searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderProducts();
    });

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            activeCategory = btn.getAttribute("data-category");
            renderProducts();
        });
    });

    // Cart Sidebar Toggles
    cartToggleBtn.addEventListener("click", toggleCart);
    cartCloseBtn.addEventListener("click", toggleCart);
    cartBackdrop.addEventListener("click", toggleCart);

    function toggleCart() {
        cartSidebar.classList.toggle("open");
        cartBackdrop.classList.toggle("open");
    }

    // Checkout Navigation
    checkoutBtn.addEventListener("click", () => {
        const cart = getCart();
        if (cart.length === 0) {
            alert("Your cart is empty! Please add some rice before checking out.");
            return;
        }
        window.location.href = "customer-details.html";
    });

    // Listen to custom cart updates
    window.addEventListener("cart-updated", updateCartUI);

    // 2. Render functions
    function renderProducts() {
        const filtered = PRODUCTS.filter(p => {
            const matchesCategory = (activeCategory === "all" || p.category === activeCategory);
            const matchesSearch = (p.name.toLowerCase().includes(searchQuery) || 
                                   p.description.toLowerCase().includes(searchQuery) ||
                                   p.origin.toLowerCase().includes(searchQuery));
            return matchesCategory && matchesSearch;
        });

        resultsCountText.textContent = `Showing ${filtered.length} item${filtered.length === 1 ? '' : 's'}`;

        if (filtered.length === 0) {
            productsGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
                    <div style="font-size: 48px; margin-bottom: 16px;">🌾</div>
                    <h3>No products found</h3>
                    <p style="margin-top: 8px;">Try refining your search keyword or clearing the filters.</p>
                </div>
            `;
            return;
        }

        productsGrid.innerHTML = filtered.map(product => {
            const selectedSize = productSizesState[product.id];
            const sizeConfig = BAG_SIZES.find(b => b.size === selectedSize);
            
            // Calculate price based on size and its discount
            const rawPrice = product.basePrice * selectedSize;
            const finalPrice = rawPrice * (1 - sizeConfig.discount);

            // Generate size chips HTML
            const sizeChipsHTML = BAG_SIZES.map(b => {
                const isSelected = b.size === selectedSize;
                const discountText = b.discount > 0 ? `<span class="size-discount">${b.discount * 100}% Off</span>` : '';
                return `
                    <button class="size-chip ${isSelected ? 'selected' : ''}" data-prod-id="${product.id}" data-size="${b.size}">
                        ${b.size} kg
                        ${discountText}
                    </button>
                `;
            }).join('');

            return `
                <div class="card product-card">
                    <div class="product-image-container">
                        <img src="${product.image}" alt="${product.name}" class="product-image">
                        <span class="product-badge">Organic</span>
                    </div>
                    <div class="product-content">
                        <div class="product-meta">
                            <span>${product.category}</span>
                            <div class="product-rating">
                                <span>★</span> <span>${product.rating}</span> <span>(${product.reviews})</span>
                            </div>
                        </div>
                        <h3 class="product-title">${product.name}</h3>
                        <p class="product-desc">${product.description}</p>
                        
                        <div class="size-selector">
                            <div class="size-selector-label">Select Package Size:</div>
                            <div class="size-chips">
                                ${sizeChipsHTML}
                            </div>
                        </div>

                        <div class="price-container">
                            <span class="price-tag">${formatPrice(finalPrice)}</span>
                            <span class="price-unit">(₹${(finalPrice / selectedSize).toFixed(1)}/kg)</span>
                        </div>

                        <button class="btn btn-primary add-to-cart-btn" data-prod-id="${product.id}" style="width: 100%; margin-top: auto;">
                            Add to Cart
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // Bind events to dynamically created buttons
        bindDynamicEvents();
    }

    function bindDynamicEvents() {
        // Size chip click handlers
        const chips = productsGrid.querySelectorAll(".size-chip");
        chips.forEach(chip => {
            chip.addEventListener("click", (e) => {
                const prodId = chip.getAttribute("data-prod-id");
                const size = parseInt(chip.getAttribute("data-size"));
                productSizesState[prodId] = size;
                renderProducts(); // Re-render this card's pricing
            });
        });

        // Add to cart click handlers
        const addBtns = productsGrid.querySelectorAll(".add-to-cart-btn");
        addBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const prodId = btn.getAttribute("data-prod-id");
                const selectedSize = productSizesState[prodId];
                addToCart(prodId, selectedSize);
                
                // Visual bounce/confirmation on button
                const prevText = btn.textContent;
                btn.textContent = "Added ✓";
                btn.style.backgroundColor = "var(--primary-dark)";
                
                // Open cart sidebar to show the user the item was added
                setTimeout(() => {
                    btn.textContent = prevText;
                    btn.style.backgroundColor = "";
                    if (!cartSidebar.classList.contains("open")) {
                        toggleCart();
                    }
                }, 800);
            });
        });
    }

    function updateCategoryCounts() {
        // Compute count for each category
        const allBtn = document.getElementById("count-all");
        if (allBtn) allBtn.textContent = PRODUCTS.length;

        const cats = ["Traditional", "Aromatic", "Daily Use", "Millets"];
        const ids = ["count-traditional", "count-aromatic", "count-daily", "count-millets"];

        cats.forEach((cat, index) => {
            const count = PRODUCTS.filter(p => p.category === cat).length;
            const element = document.getElementById(ids[index]);
            if (element) element.textContent = count;
        });
    }

    // 3. Cart Updates
    function updateCartUI() {
        const cart = getCart();
        const totalItemsQty = cart.reduce((sum, item) => sum + item.quantity, 0);

        // Update Nav Badge
        if (totalItemsQty > 0) {
            cartBadgeCount.textContent = totalItemsQty;
            cartBadgeCount.style.display = "flex";
            cartTotalCount.textContent = `${totalItemsQty} bag${totalItemsQty > 1 ? 's' : ''}`;
        } else {
            cartBadgeCount.style.display = "none";
            cartTotalCount.textContent = "0 bags";
        }

        // Render Cart Items
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="cart-empty">
                    <div style="font-size: 50px;">🛒</div>
                    <p>Your shopping cart is empty.</p>
                    <button class="btn btn-secondary" id="start-shopping-cart-btn">Start Shopping</button>
                </div>
            `;
            const startShopBtn = document.getElementById("start-shopping-cart-btn");
            if (startShopBtn) {
                startShopBtn.addEventListener("click", toggleCart);
            }
            checkoutBtn.disabled = true;
            checkoutBtn.style.opacity = "0.5";
            checkoutBtn.style.cursor = "not-allowed";
        } else {
            checkoutBtn.disabled = false;
            checkoutBtn.style.opacity = "";
            checkoutBtn.style.cursor = "";

            cartItemsContainer.innerHTML = cart.map((item, index) => {
                const itemRawTotal = item.basePrice * item.bagSize * item.quantity;
                const itemFinalTotal = itemRawTotal * (1 - item.discount);
                
                return `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                        <div class="cart-item-info">
                            <h5>${item.name}</h5>
                            <p>${item.bagSize} kg Bag</p>
                            <div class="cart-qty-controls">
                                <button class="cart-qty-btn qty-dec" data-index="${index}">-</button>
                                <span style="font-weight: 600; font-size: 14px;">${item.quantity}</span>
                                <button class="cart-qty-btn qty-inc" data-index="${index}">+</button>
                            </div>
                        </div>
                        <div class="cart-item-price">
                            <span class="cart-item-total">${formatPrice(itemFinalTotal)}</span>
                            <button class="cart-item-remove" data-index="${index}">Remove</button>
                        </div>
                    </div>
                `;
            }).join('');

            // Bind Cart Item Buttons
            bindCartEvents();
        }

        // Calculate Totals
        const subtotal = cart.reduce((sum, item) => {
            const raw = item.basePrice * item.bagSize * item.quantity;
            return sum + (raw * (1 - item.discount));
        }, 0);

        cartSubtotalText.textContent = formatPrice(subtotal);
        
        // Shipping rules: Free shipping over ₹1500, otherwise ₹100
        const shippingFee = (subtotal === 0 || subtotal >= 1500) ? 0 : 100;
        cartShippingText.textContent = shippingFee === 0 ? "FREE" : formatPrice(shippingFee);
        cartShippingText.style.color = shippingFee === 0 ? "var(--primary)" : "var(--text-dark)";

        const grandtotal = subtotal + shippingFee;
        cartGrandtotalText.textContent = formatPrice(grandtotal);
    }

    function bindCartEvents() {
        const cart = getCart();

        // Increment Qty
        const incBtns = cartItemsContainer.querySelectorAll(".qty-inc");
        incBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const index = parseInt(btn.getAttribute("data-index"));
                cart[index].quantity += 1;
                saveCart(cart);
            });
        });

        // Decrement Qty
        const decBtns = cartItemsContainer.querySelectorAll(".qty-dec");
        decBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const index = parseInt(btn.getAttribute("data-index"));
                if (cart[index].quantity > 1) {
                    cart[index].quantity -= 1;
                } else {
                    cart.splice(index, 1);
                }
                saveCart(cart);
            });
        });

        // Remove Item
        const removeBtns = cartItemsContainer.querySelectorAll(".cart-item-remove");
        removeBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const index = parseInt(btn.getAttribute("data-index"));
                cart.splice(index, 1);
                saveCart(cart);
            });
        });
    }
});
