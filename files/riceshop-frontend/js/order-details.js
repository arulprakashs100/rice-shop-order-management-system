// JavaScript for order-details.html

document.addEventListener("DOMContentLoaded", () => {
    // 1. Auth Guard
    if (!isAdminLoggedIn()) {
        window.location.href = "login.html";
        return;
    }

    // Set Active Store Name and Owner Name dynamically in header profile
    const activeStoreName = getActiveStoreName();
    const activeOwnerName = getActiveOwnerName();

    const headerStore = document.getElementById("header-store-name");
    if (headerStore) {
        headerStore.textContent = activeStoreName;
    }

    const headerOwner = document.getElementById("header-owner-name");
    if (headerOwner) {
        headerOwner.textContent = activeOwnerName;
    }

    const avatar = document.getElementById("header-avatar");
    if (avatar && activeStoreName) {
        avatar.textContent = activeStoreName.charAt(0).toUpperCase();
    }

    // 2. Parse URL Params for Order ID
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get("id");

    if (!orderId) {
        alert("No order ID provided. Returning to dashboard...");
        window.location.href = "dashboard.html";
        return;
    }

    // Initial Order State
    let order = null;

    // Fetch order details by ID from PostgreSQL database
    getOrderById(orderId).then(fetchedOrder => {
        if (!fetchedOrder) {
            alert(`Order ${orderId} not found in database! Returning to dashboard...`);
            window.location.href = "dashboard.html";
            return;
        }
        order = fetchedOrder;
        // Populate order details once loaded from server
        populateOrderDetails();
    });

    // DOM Elements
    const titleEl = document.getElementById("order-details-title");
    const statusBadge = document.getElementById("order-details-status-badge");
    const dateEl = document.getElementById("order-details-date");
    
    const itemsTableBody = document.getElementById("order-details-items-rows");
    
    const subtotalText = document.getElementById("details-subtotal");
    const discountRow = document.getElementById("details-discount-row");
    const discountCoupon = document.getElementById("details-discount-coupon");
    const discountAmount = document.getElementById("details-discount-amount");
    const shippingText = document.getElementById("details-shipping");
    const totalText = document.getElementById("details-total");

    const statusSelect = document.getElementById("status-select");
    const updateStatusBtn = document.getElementById("update-status-btn");
    
    const custName = document.getElementById("cust-name-val");
    const custPhone = document.getElementById("cust-phone-val");
    const custPayment = document.getElementById("cust-payment-val");
    const custAddress = document.getElementById("cust-address-val");

    const invoiceLink = document.getElementById("generate-invoice-link");
    const logoutBtn = document.getElementById("admin-logout-btn");
    const headerLogoutBtn = document.getElementById("header-logout-btn");

    // 3. Populate Order Details Screen (Called after database fetch succeeds)

    // 4. Update Status Handler
    updateStatusBtn.addEventListener("click", async () => {
        const newStatus = statusSelect.value;
        const success = await updateOrderStatus(orderId, newStatus);
        
        if (success) {
            // Visual confirmation
            updateStatusBtn.textContent = "Status Updated ✓";
            updateStatusBtn.style.backgroundColor = "var(--primary-dark)";
            
            // Reload local order data structure
            order.status = newStatus;
            
            // Refresh badge on page
            statusBadge.textContent = order.status;
            statusBadge.className = `status-badge status-${order.status.toLowerCase()}`;
            
            setTimeout(() => {
                updateStatusBtn.textContent = "Save Status Changes";
                updateStatusBtn.style.backgroundColor = "";
            }, 1000);
        } else {
            alert("Error updating order status in storage.");
        }
    });

    // Logout Action
    const performLogout = (e) => {
        e.preventDefault();
        if (confirm("Are you sure you want to log out?")) {
            setAdminLoggedIn(false);
            window.location.href = "login.html";
        }
    };

    if (logoutBtn) logoutBtn.addEventListener("click", performLogout);
    if (headerLogoutBtn) headerLogoutBtn.addEventListener("click", performLogout);

    // Populate helper
    function populateOrderDetails() {
        // Title and date meta
        titleEl.textContent = `Order Details: ${order.id}`;
        
        statusBadge.textContent = order.status;
        statusBadge.className = `status-badge status-${order.status.toLowerCase()}`;
        
        const dateStr = new Date(order.date).toLocaleString('en-IN', {
            dateStyle: 'long',
            timeStyle: 'short'
        });
        dateEl.textContent = `Placed on: ${dateStr}`;

        // Status Select Dropdown index
        statusSelect.value = order.status;

        // Customer Info Card
        custName.textContent = order.customer.name;
        custPhone.textContent = order.customer.phone;
        custPayment.textContent = order.paymentMethod;
        custAddress.textContent = order.customer.address;

        // Invoice link url targets
        invoiceLink.href = `invoice.html?id=${order.id}`;

        // Items detailed table rendering
        itemsTableBody.innerHTML = order.items.map(item => {
            // calculate unit price
            const unitPrice = item.price / item.quantity;
            
            return `
                <tr>
                    <td style="padding: 12px 0;">
                        <span style="font-weight: 600; color: var(--text-dark);">${item.name}</span>
                    </td>
                    <td style="padding: 12px 0;">${item.bagSize} kg</td>
                    <td style="padding: 12px 0;">₹${(unitPrice / item.bagSize).toFixed(1)}/kg</td>
                    <td style="padding: 12px 0; text-align: center; font-weight: 600;">${item.quantity}</td>
                    <td class="price-col" style="padding: 12px 0;">${formatPrice(item.price)}</td>
                </tr>
            `;
        }).join('');

        // Totals breakdown
        subtotalText.textContent = formatPrice(order.subtotal);
        
        if (order.discount > 0) {
            discountCoupon.textContent = order.couponApplied || "Promo Discount";
            discountAmount.textContent = `-₹${order.discount.toFixed(0)}`;
            discountRow.style.display = "flex";
        } else {
            discountRow.style.display = "none";
        }

        shippingText.textContent = order.shipping === 0 ? "FREE" : formatPrice(order.shipping);
        shippingText.style.color = order.shipping === 0 ? "var(--primary)" : "var(--text-dark)";

        totalText.textContent = formatPrice(order.total);
    }
});
