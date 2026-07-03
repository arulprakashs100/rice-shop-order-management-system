// JavaScript for dashboard.html

document.addEventListener("DOMContentLoaded", () => {
    // 1. Auth Guard
    if (!isAdminLoggedIn()) {
        window.location.href = "login.html";
        return;
    }

    // Set Active Store Name and Owner Name dynamically
    const activeStoreName = getActiveStoreName();
    const activeOwnerName = getActiveOwnerName();
    
    const welcomeHeader = document.getElementById("welcome-store-name");
    if (welcomeHeader) {
        welcomeHeader.textContent = `${activeStoreName}`;
    }
    
    const headerStore = document.getElementById("header-store-name");
    if (headerStore) {
        headerStore.textContent = activeStoreName;
    }

    const headerOwner = document.getElementById("header-owner-name");
    if (headerOwner) {
        headerOwner.textContent = activeOwnerName;
    }

    // Update avatar letter to match store initial
    const avatar = document.getElementById("header-avatar");
    if (avatar && activeStoreName) {
        avatar.textContent = activeStoreName.charAt(0).toUpperCase();
    }

    // Set Current Date Display
    const dateText = document.getElementById("current-date-text");
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateText.textContent = new Date().toLocaleDateString('en-US', options);

    // DOM Elements
    const statsSales = document.getElementById("stats-total-revenue");
    const statsOrders = document.getElementById("stats-total-orders");
    const statsPending = document.getElementById("stats-pending-deliveries");
    const statsAverage = document.getElementById("stats-avg-order-value");

    const searchInput = document.getElementById("order-search-input");
    const statusFilter = document.getElementById("order-status-filter");
    const tableBody = document.getElementById("orders-table-rows");
    
    const logoutBtn = document.getElementById("admin-logout-btn");
    const headerLogoutBtn = document.getElementById("header-logout-btn");

    let ordersList = [];
    let searchQuery = "";
    let statusQuery = "All";

    // 2. Initial Setup & Listeners
    renderDashboard();

    searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderTableOnly();
    });

    statusFilter.addEventListener("change", (e) => {
        statusQuery = e.target.value;
        renderTableOnly();
    });

    // Wire up both logout buttons (Sidebar & Header Corner)
    const performLogout = (e) => {
        e.preventDefault();
        if (confirm("Are you sure you want to log out of the owner panel?")) {
            setAdminLoggedIn(false);
            window.location.href = "login.html";
        }
    };

    if (logoutBtn) logoutBtn.addEventListener("click", performLogout);
    if (headerLogoutBtn) headerLogoutBtn.addEventListener("click", performLogout);

    // 3. Render Dashboard Data & Stats
    async function renderDashboard() {
        ordersList = await getOrders(); // reload from database

        // Calculate and render stats widgets
        let totalRevenue = 0;
        let nonCancelledOrdersCount = 0;
        let pendingShippingsCount = 0;

        ordersList.forEach(order => {
            if (order.status !== "Cancelled") {
                totalRevenue += order.total;
                nonCancelledOrdersCount += 1;
                
                if (order.status === "Pending" || order.status === "Packing" || order.status === "Shipped") {
                    pendingShippingsCount += 1;
                }
            }
        });

        const avgOrderValue = nonCancelledOrdersCount > 0 ? (totalRevenue / nonCancelledOrdersCount) : 0;

        // Populate widget cards
        statsSales.textContent = formatPrice(totalRevenue);
        statsOrders.textContent = nonCancelledOrdersCount;
        statsPending.textContent = pendingShippingsCount;
        statsAverage.textContent = formatPrice(avgOrderValue);

        // Populate table list
        renderTableOnly();
    }

    function renderTableOnly() {
        const filtered = ordersList.filter(o => {
            const matchesStatus = (statusQuery === "All" || o.status === statusQuery);
            const matchesSearch = (o.id.toLowerCase().includes(searchQuery) ||
                                   o.customer.name.toLowerCase().includes(searchQuery) ||
                                   o.customer.phone.includes(searchQuery));
            return matchesStatus && matchesSearch;
        });

        if (filtered.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">
                        <span style="font-size: 32px; display: block; margin-bottom: 8px;">📋</span>
                        No orders match the search filters.
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = filtered.map(order => {
            // Format order date
            const dateStr = new Date(order.date).toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short'
            });

            // Format items preview (e.g. Basmati Rice (10kg) x2)
            const itemsSummary = order.items.map(it => {
                return `${it.name} (${it.bagSize}kg) &times; ${it.quantity}`;
            }).join(", ");

            // Set status CSS badge class name
            const statusClass = `status-${order.status.toLowerCase()}`;

            return `
                <tr>
                    <td style="font-weight: 700; color: var(--primary-dark);">
                        <a href="order-details.html?id=${order.id}" style="text-decoration: underline;">${order.id}</a>
                    </td>
                    <td style="white-space: nowrap;">${dateStr}</td>
                    <td>
                        <div style="font-weight: 600;">${order.customer.name}</div>
                        <div style="font-size: 12px; color: var(--text-muted);">${order.customer.phone}</div>
                    </td>
                    <td style="max-width: 250px; font-size: 13.5px;" title="${itemsSummary.replace(/&times;/g, 'x')}">
                        ${itemsSummary}
                    </td>
                    <td style="text-align: right; font-weight: 700; color: var(--accent-dark);">${formatPrice(order.total)}</td>
                    <td>
                        <span class="status-badge ${statusClass}">${order.status}</span>
                    </td>
                    <td style="white-space: nowrap; text-align: center;">
                        <a href="order-details.html?id=${order.id}" class="btn btn-outline" style="padding: 6px 12px; font-size: 12.5px; border-radius: 6px;">Manage</a>
                        <a href="invoice.html?id=${order.id}" target="_blank" class="btn btn-secondary" style="padding: 6px 12px; font-size: 12.5px; border-radius: 6px; border-width: 1px; margin-left: 4px;">Invoice</a>
                    </td>
                </tr>
            `;
        }).join('');
    }
});
