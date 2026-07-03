// JavaScript for customer-details.html

document.addEventListener("DOMContentLoaded", () => {
    // 1. Verify Cart contains items
    const cart = getCart();
    if (cart.length === 0) {
        alert("Your cart is empty! Redirecting to products page...");
        window.location.href = "select-rice.html";
        return;
    }

    // DOM Elements
    const form = document.getElementById("details-form");
    const nameInput = document.getElementById("customer-name");
    const phoneInput = document.getElementById("customer-phone");
    const addressInput = document.getElementById("customer-address");
    
    const paymentCards = document.querySelectorAll(".payment-card");
    const summaryItemsList = document.getElementById("summary-items-list");
    const summarySubtotal = document.getElementById("summary-subtotal");
    const summaryShipping = document.getElementById("summary-shipping");
    const summaryTotal = document.getElementById("summary-total");

    // 2. Pre-fill Form from LocalStorage
    const savedDetails = getCustomerDetails();
    nameInput.value = savedDetails.name || "";
    phoneInput.value = savedDetails.phone || "";
    addressInput.value = savedDetails.address || "";
    
    // Select payment method from storage
    if (savedDetails.paymentMethod) {
        const targetRadio = document.querySelector(`input[name="payment-method"][value="${savedDetails.paymentMethod}"]`);
        if (targetRadio) {
            targetRadio.checked = true;
            // update selection classes
            paymentCards.forEach(c => c.classList.remove("selected"));
            targetRadio.closest(".payment-card").classList.add("selected");
        }
    }

    // 3. Render Cart Overview
    renderCartOverview();

    // 4. Payment Radio Card Interaction
    paymentCards.forEach(card => {
        card.addEventListener("click", () => {
            paymentCards.forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");
            
            const radio = card.querySelector('input[type="radio"]');
            radio.checked = true;
        });
    });

    // 5. Submit Handler
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Get selected payment radio
        const selectedRadio = document.querySelector('input[name="payment-method"]:checked');
        
        const details = {
            name: nameInput.value.trim(),
            phone: phoneInput.value.trim(),
            address: addressInput.value.trim(),
            paymentMethod: selectedRadio ? selectedRadio.value : "UPI"
        };

        // Save to state
        saveCustomerDetails(details);

        // Redirect to summary
        window.location.href = "order-summary.html";
    });

    // Render Helpers
    function renderCartOverview() {
        // Items list
        summaryItemsList.innerHTML = cart.map(item => {
            const rawPrice = item.basePrice * item.bagSize * item.quantity;
            const finalPrice = rawPrice * (1 - item.discount);
            return `
                <div class="summary-item-line">
                    <div>
                        <div class="name">${item.name}</div>
                        <div class="detail">${item.bagSize} kg Bag &times; ${item.quantity}</div>
                    </div>
                    <span class="price">${formatPrice(finalPrice)}</span>
                </div>
            `;
        }).join('');

        // Totals
        const subtotal = cart.reduce((sum, item) => {
            const raw = item.basePrice * item.bagSize * item.quantity;
            return sum + (raw * (1 - item.discount));
        }, 0);

        summarySubtotal.textContent = formatPrice(subtotal);
        
        const shippingFee = subtotal >= 1500 ? 0 : 100;
        summaryShipping.textContent = shippingFee === 0 ? "FREE" : formatPrice(shippingFee);
        summaryShipping.style.color = shippingFee === 0 ? "var(--primary)" : "var(--text-dark)";

        const total = subtotal + shippingFee;
        summaryTotal.textContent = formatPrice(total);
    }
});
