// JavaScript for order-summary.html

document.addEventListener("DOMContentLoaded", () => {
    // 1. Verify Cart & Customer Details
    const cart = getCart();
    const customer = getCustomerDetails();

    if (cart.length === 0) {
        alert("Your cart is empty! Redirecting to products page...");
        window.location.href = "select-rice.html";
        return;
    }

    if (!customer.name || !customer.phone || !customer.address) {
        alert("Shipping details are incomplete! Redirecting to address details...");
        window.location.href = "customer-details.html";
        return;
    }

    // DOM Elements
    const custName = document.getElementById("summary-cust-name");
    const custPhone = document.getElementById("summary-cust-phone");
    const custAddress = document.getElementById("summary-cust-address");
    const custPayment = document.getElementById("summary-cust-payment");

    const itemsContainer = document.getElementById("summary-detailed-items-container");

    const couponInput = document.getElementById("coupon-code-input");
    const applyCouponBtn = document.getElementById("apply-coupon-btn");
    const couponFeedback = document.getElementById("coupon-feedback");

    const discountRow = document.getElementById("discount-row");
    const discountPercentage = document.getElementById("discount-percentage");
    const breakdownSubtotal = document.getElementById("breakdown-subtotal");
    const breakdownDiscount = document.getElementById("breakdown-discount");
    const breakdownShipping = document.getElementById("breakdown-shipping");
    const breakdownTotal = document.getElementById("breakdown-total");
    
    const placeOrderBtn = document.getElementById("place-order-btn");

    // 2. Render Customer Details
    custName.textContent = customer.name;
    custPhone.textContent = customer.phone;
    custAddress.textContent = customer.address;
    custPayment.textContent = customer.paymentMethod;

    // Load any previously applied coupon code from session
    let activeCoupon = getAppliedCoupon();
    if (activeCoupon) {
        couponInput.value = activeCoupon;
        validateCouponCode(activeCoupon, false); // apply silently
    }

    // 3. Render Order Items list
    renderDetailedItems();
    calculateTotals();

    // 4. Coupon Application Events
    applyCouponBtn.addEventListener("click", () => {
        const code = couponInput.value.trim();
        if (!code) {
            showCouponFeedback("Please enter a coupon code.", "error");
            return;
        }
        validateCouponCode(code, true);
    });

    // 5. Finalize Place Order (Asynchronously saved to PostgreSQL database)
    placeOrderBtn.addEventListener("click", async () => {
        // Disable button to prevent double submit
        placeOrderBtn.disabled = true;
        placeOrderBtn.textContent = "Processing Order...";

        // Generate unique order ID
        const orderId = `GS-${Math.floor(10000 + Math.random() * 90000)}`;

        // Gather subtotal, discount, shipping, total
        const subtotal = calculateSubtotal();
        const promoDiscountRate = activeCoupon ? COUPONS[activeCoupon] : 0;
        const discountVal = subtotal * promoDiscountRate;
        const shippingFee = subtotal >= 1500 ? 0 : 100;
        const total = subtotal - discountVal + shippingFee;

        // Map items to orders collection
        const orderItems = cart.map(item => {
            const rawPrice = item.basePrice * item.bagSize * item.quantity;
            const finalPrice = rawPrice * (1 - item.discount);
            return {
                id: item.id,
                name: item.name,
                bagSize: item.bagSize,
                quantity: item.quantity,
                price: finalPrice
            };
        });

        // Construct final order payload
        const newOrder = {
            id: orderId,
            customer: {
                name: customer.name,
                phone: customer.phone,
                address: customer.address
            },
            items: orderItems,
            subtotal: subtotal,
            shipping: shippingFee,
            discount: discountVal,
            couponApplied: activeCoupon || "",
            total: total,
            paymentMethod: customer.paymentMethod,
            status: "Pending"
        };

        // Save order to PostgreSQL database
        const savedOrder = await saveOrder(newOrder);

        if (savedOrder) {
            // Keep track of the last order ID for the success page
            localStorage.setItem("riceshop_last_order_id", savedOrder.id);

            // Clear active cart & active coupon
            clearCart();

            // Redirect to success page
            setTimeout(() => {
                window.location.href = "order-success.html";
            }, 1200);
        } else {
            alert("Failed to register order with the server. Please check database connectivity and try again.");
            placeOrderBtn.disabled = false;
            placeOrderBtn.textContent = "Place Order";
        }
    });

    // Render & Calculation helper methods
    function renderDetailedItems() {
        itemsContainer.innerHTML = cart.map(item => {
            const rawPrice = item.basePrice * item.bagSize * item.quantity;
            const finalPrice = rawPrice * (1 - item.discount);
            
            return `
                <div class="cart-item" style="border-bottom: 1px solid var(--border-color); padding: 12px 0;">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img" style="width: 60px; height: 60px;">
                    <div class="cart-item-info">
                        <h5 style="font-size: 15px; margin-bottom: 2px;">${item.name}</h5>
                        <p style="font-size: 12px;">${item.bagSize} kg Bag &times; ${item.quantity}</p>
                        <p style="font-size: 11px; color: var(--primary);">₹${item.basePrice}/kg ${item.discount > 0 ? `| ${item.discount * 100}% Size Discount` : ''}</p>
                    </div>
                    <div class="cart-item-price">
                        <span class="cart-item-total" style="font-size: 15px;">${formatPrice(finalPrice)}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    function calculateSubtotal() {
        return cart.reduce((sum, item) => {
            const raw = item.basePrice * item.bagSize * item.quantity;
            return sum + (raw * (1 - item.discount));
        }, 0);
    }

    function calculateTotals() {
        const subtotal = calculateSubtotal();
        breakdownSubtotal.textContent = formatPrice(subtotal);

        let discountVal = 0;
        if (activeCoupon && COUPONS[activeCoupon]) {
            const rate = COUPONS[activeCoupon];
            discountVal = subtotal * rate;
            
            discountPercentage.textContent = `${rate * 100}%`;
            breakdownDiscount.textContent = `-₹${discountVal.toFixed(0)}`;
            discountRow.style.display = "flex";
        } else {
            discountRow.style.display = "none";
        }

        const shippingFee = (subtotal === 0 || subtotal >= 1500) ? 0 : 100;
        breakdownShipping.textContent = shippingFee === 0 ? "FREE" : formatPrice(shippingFee);
        breakdownShipping.style.color = shippingFee === 0 ? "var(--primary)" : "var(--text-dark)";

        const total = subtotal - discountVal + shippingFee;
        breakdownTotal.textContent = formatPrice(total);
    }

    function validateCouponCode(code, alertUser) {
        const result = applyCoupon(code);
        if (result.success) {
            activeCoupon = code.trim().toUpperCase();
            calculateTotals();
            if (alertUser) {
                showCouponFeedback(`Promo code '${activeCoupon}' applied successfully!`, "success");
            }
        } else {
            if (alertUser) {
                showCouponFeedback("Invalid promo code. Please try WELCOME5, RICE10, or FARMER20.", "error");
            }
        }
    }

    function showCouponFeedback(msg, type) {
        couponFeedback.textContent = msg;
        couponFeedback.className = `coupon-msg ${type}`;
    }
});
