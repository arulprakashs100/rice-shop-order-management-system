// JavaScript for invoice.html

document.addEventListener("DOMContentLoaded", () => {
    // 1. Parse URL Params for Order ID
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get("id");

    if (!orderId) {
        alert("No order ID provided. Closing window...");
        window.close();
        return;
    }

    let order = null;

    // Load matching order from database
    getOrderById(orderId).then(fetchedOrder => {
        if (!fetchedOrder) {
            alert(`Order ${orderId} not found in database. Closing window...`);
            window.close();
            return;
        }
        order = fetchedOrder;

        // Set Document Title for PDF save defaults
        document.title = `Invoice_Receipt_${order.id}`;

        // DOM Elements
        const invoiceNo = document.getElementById("invoice-no-val");
        const invoiceDate = document.getElementById("invoice-date-val");
        const invoiceOrderId = document.getElementById("invoice-order-id-val");
        
        const custName = document.getElementById("inv-cust-name");
        const custPhone = document.getElementById("inv-cust-phone");
        const custAddress = document.getElementById("inv-cust-address");
        const paymentMethod = document.getElementById("inv-payment-method");
        
        const itemsTableBody = document.getElementById("invoice-items-rows");
        
        const subtotalText = document.getElementById("invoice-subtotal");
        const discountRow = document.getElementById("invoice-discount-row");
        const discountCoupon = document.getElementById("invoice-coupon-code");
        const discountAmount = document.getElementById("invoice-discount-amount");
        const shippingText = document.getElementById("invoice-shipping");
        const totalText = document.getElementById("invoice-total");

        // 2. Populate Invoice Receipt
        populateInvoice();
    });

    function populateInvoice() {
        // Generate Invoice Number (e.g. INV-89104 from GS-89104)
        const numericPart = order.id.split("-")[1] || Math.floor(10000 + Math.random() * 90000);
        invoiceNo.textContent = `INV-${numericPart}`;

        // Date of order placement
        const orderDateStr = new Date(order.date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        invoiceDate.textContent = orderDateStr;
        invoiceOrderId.textContent = order.id;

        // Customer Details
        custName.textContent = order.customer.name;
        custPhone.textContent = order.customer.phone;
        custAddress.textContent = order.customer.address;
        paymentMethod.textContent = order.paymentMethod;

        // Render Invoice Line Items Table
        itemsTableBody.innerHTML = order.items.map(item => {
            const unitPrice = item.price / item.quantity;
            
            return `
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid var(--border-color);">
                        <span style="font-weight: 600; color: var(--text-dark);">${item.name}</span>
                    </td>
                    <td style="padding: 10px; border-bottom: 1px solid var(--border-color); text-align: right;">${item.bagSize} kg</td>
                    <td style="padding: 10px; border-bottom: 1px solid var(--border-color); text-align: right;">₹${(unitPrice / item.bagSize).toFixed(1)}/kg</td>
                    <td style="padding: 10px; border-bottom: 1px solid var(--border-color); text-align: center; font-weight: 600;">${item.quantity}</td>
                    <td style="padding: 10px; border-bottom: 1px solid var(--border-color); text-align: right; font-weight: 600; color: var(--text-dark);">${formatPrice(item.price)}</td>
                </tr>
            `;
        }).join('');

        // Pricing summary breakdown
        subtotalText.textContent = formatPrice(order.subtotal);

        if (order.discount > 0) {
            discountCoupon.textContent = order.couponApplied || "Promo Coupon";
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
