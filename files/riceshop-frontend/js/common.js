// Common JS Utility for Golden Grain Rice Shop - Backend REST API Integrated

const API_BASE = "http://localhost:8080/api";

// Fallback Static Product Database (if backend is down)
const STATIC_PRODUCTS = [
    {
        id: "seeraga_samba",
        name: "Seeraga Samba Rice",
        category: "Aromatic",
        description: "Tiny, short-grain aromatic rice grown traditionally. Popularly used in South India for cooking flavorful Biryanis.",
        image: "../assets/images/seeraga_samba.png",
        basePrice: 90,
        rating: 4.9,
        reviews: 320,
        stock: 450,
        origin: "Tamil Nadu"
    },
    {
        id: "nattu_ponni",
        name: "Nattu Ponni Rice",
        category: "Traditional",
        description: "Naturally grown, unpolished medium-grain white rice. Parboiled to retain essential fibers and minerals.",
        image: "../assets/images/nattu_ponni.png",
        basePrice: 65,
        rating: 4.8,
        reviews: 245,
        stock: 800,
        origin: "Thanjavur Delta"
    },
    {
        id: "karnataka_ponni",
        name: "Karnataka Ponni Rice",
        category: "Daily Use",
        description: "A popular choice for daily meals, this medium-grain rice is lightweight, soft, and cooks to a fluffy texture.",
        image: "../assets/images/nattu_ponni.png",
        basePrice: 58,
        rating: 4.7,
        reviews: 180,
        stock: 750,
        origin: "Mysore Region"
    },
    {
        id: "karnataka_rice",
        name: "Karnataka Rice (Raw)",
        category: "Daily Use",
        description: "Premium quality raw white rice. Highly versatile and ideal for daily South Indian lunch plates.",
        image: "../assets/images/nattu_ponni.png",
        basePrice: 52,
        rating: 4.6,
        reviews: 135,
        stock: 600,
        origin: "Shimoga District"
    },
    {
        id: "idli_rice",
        name: "Idli Rice",
        category: "Daily Use",
        description: "Short, thick parboiled white rice. Essential ingredient for making smooth batter for soft idlis and crispy dosas.",
        image: "../assets/images/idli_rice.png",
        basePrice: 48,
        rating: 4.8,
        reviews: 290,
        stock: 900,
        origin: "Salem Plains"
    },
    {
        id: "raw_rice",
        name: "Raw Rice (Pachai Arisi)",
        category: "Traditional",
        description: "Polished raw white rice grains. Used for making traditional festive dishes like Sweet Pongal and rice flour.",
        image: "../assets/images/nattu_ponni.png",
        basePrice: 50,
        rating: 4.5,
        reviews: 110,
        stock: 500,
        origin: "Nellore Fields"
    },
    {
        id: "small_grain",
        name: "Small Grain Rice",
        category: "Daily Use",
        description: "Short, slender grains that cook quickly. A soft texture makes it perfect for kids and curd rice preparation.",
        image: "../assets/images/nattu_ponni.png",
        basePrice: 55,
        rating: 4.6,
        reviews: 95,
        stock: 400,
        origin: "Palakkad region"
    },
    {
        id: "varagu",
        name: "Varagu Rice (Kodo Millet)",
        category: "Millets",
        description: "Gluten-free, highly nutritious whole grain millet. High in dietary fiber, iron, and antioxidants; ideal for sugar control.",
        image: "../assets/images/varagu.png",
        basePrice: 85,
        rating: 4.7,
        reviews: 154,
        stock: 300,
        origin: "Dharwad region"
    },
    {
        id: "samai",
        name: "Samai Rice (Little Millet)",
        category: "Millets",
        description: "Tiny, mineral-rich organic millet. Packed with B-vitamins and calcium. A healthy rice replacement for traditional recipes.",
        image: "../assets/images/varagu.png",
        basePrice: 95,
        rating: 4.7,
        reviews: 120,
        stock: 250,
        origin: "Madurai Hills"
    },
    {
        id: "kuthiraivali",
        name: "Kuthiraivali Rice (Barnyard Millet)",
        category: "Millets",
        description: "Barnyard millet is an ancient grain rich in digestible protein and fiber. Low glycemic index; great for weight loss.",
        image: "../assets/images/idli_rice.png",
        basePrice: 90,
        rating: 4.8,
        reviews: 142,
        stock: 350,
        origin: "Coimbatore region"
    },
    {
        id: "kambu",
        name: "Kambu Rice (Pearl Millet)",
        category: "Millets",
        description: "Organic Pearl Millet grains. Rich in iron, magnesium, and proteins. Traditionally prepared as 'Kambu Koozh' in summer.",
        image: "../assets/images/kambu.png",
        basePrice: 70,
        rating: 4.8,
        reviews: 198,
        stock: 400,
        origin: "Tirunelveli Region"
    },
    {
        id: "chinna_seeragam",
        name: "Chinna Seeragam Rice",
        category: "Aromatic",
        description: "Very tiny, premium aromatic rice variety. Extremely soft texture and rich aroma; prized for traditional South Indian feasts.",
        image: "../assets/images/seeraga_samba.png",
        basePrice: 88,
        rating: 4.9,
        reviews: 165,
        stock: 280,
        origin: "Vellore Valley"
    },
    {
        id: "chinna_kili",
        name: "Chinna Kili Rice",
        category: "Traditional",
        description: "A rare and traditional South Indian rice variety, parboiled and full of red bran nutrients. Distinct rustic flavor.",
        image: "../assets/images/nattu_ponni.png",
        basePrice: 62,
        rating: 4.7,
        reviews: 82,
        stock: 200,
        origin: "Trichy region"
    }
];

// Active Products Pointer
let PRODUCTS = [];

// Load products from backend REST API with local fallback
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE}/products`);
        if (response.ok) {
            PRODUCTS = await response.json();
        } else {
            throw new Error("HTTP error " + response.status);
        }
    } catch (e) {
        console.warn("Backend products API failed, using static fallback catalog", e);
        PRODUCTS = STATIC_PRODUCTS;
    }
    return PRODUCTS;
}

// Coupon database
const COUPONS = {
    "RICE10": 0.10, // 10% off
    "WELCOME5": 0.05, // 5% off
    "FARMER20": 0.20 // 20% off
};

// Bag Size Config
const BAG_SIZES = [
    { size: 5, discount: 0 },       // 5 kg bag
    { size: 10, discount: 0.05 },   // 10 kg bag (5% discount)
    { size: 25, discount: 0.10 }    // 25 kg bag (10% discount)
];

// Local Storage Wrappers
const storage = {
    get: (key, defaultValue) => {
        try {
            const val = localStorage.getItem(`riceshop_${key}`);
            return val ? JSON.parse(val) : defaultValue;
        } catch (e) {
            console.error("Error reading localStorage", e);
            return defaultValue;
        }
    },
    set: (key, val) => {
        try {
            localStorage.setItem(`riceshop_${key}`, JSON.stringify(val));
        } catch (e) {
            console.error("Error writing localStorage", e);
        }
    },
    remove: (key) => {
        localStorage.removeItem(`riceshop_${key}`);
    }
};

// Helper methods for Cart (Stays client-side in localStorage before final order submittal)
function getCart() {
    return storage.get("cart", []);
}

function saveCart(cart) {
    storage.set("cart", cart);
    window.dispatchEvent(new Event("cart-updated"));
}

function clearCart() {
    storage.remove("cart");
    storage.remove("coupon");
    window.dispatchEvent(new Event("cart-updated"));
}

function addToCart(productId, bagSize) {
    const cart = getCart();
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const sizeConfig = BAG_SIZES.find(b => b.size === bagSize);
    if (!sizeConfig) return;

    const existingIndex = cart.findIndex(item => item.id === productId && item.bagSize === bagSize);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            image: product.image,
            basePrice: product.basePrice,
            bagSize: bagSize,
            quantity: 1,
            discount: sizeConfig.discount
        });
    }

    saveCart(cart);
}

// Helper methods for Orders (API calls to PostgreSQL database)
async function getOrders() {
    try {
        const response = await fetch(`${API_BASE}/orders`);
        if (response.ok) {
            return await response.json();
        }
        return [];
    } catch (e) {
        console.error("Failed to load orders list from backend", e);
        return [];
    }
}

async function getOrderById(orderId) {
    try {
        const response = await fetch(`${API_BASE}/orders/${orderId}`);
        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch (e) {
        console.error("Failed to fetch order ID " + orderId + " from backend", e);
        return null;
    }
}

async function saveOrder(order) {
    try {
        // Map UI schema fields to backend JPA entity schema structure
        const backendOrder = {
            id: order.id,
            customer: {
                name: order.customer.name,
                phone: order.customer.phone,
                address: order.customer.address
            },
            items: order.items.map(it => ({
                productId: it.id,
                name: it.name,
                bagSize: it.bagSize,
                quantity: it.quantity,
                price: it.price
            })),
            subtotal: order.subtotal,
            shipping: order.shipping,
            discount: order.discount,
            couponApplied: order.couponApplied,
            total: order.total,
            paymentMethod: order.paymentMethod,
            status: order.status
        };

        const response = await fetch(`${API_BASE}/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(backendOrder)
        });

        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch (e) {
        console.error("Failed to save order to database", e);
        return null;
    }
}

async function updateOrderStatus(orderId, newStatus) {
    try {
        const response = await fetch(`${API_BASE}/orders/${orderId}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ status: newStatus })
        });
        if (response.ok) {
            const data = await response.json();
            return data.success;
        }
        return false;
    } catch (e) {
        console.error("Failed to update status on backend", e);
        return false;
    }
}

// Customer details helper
function getCustomerDetails() {
    return storage.get("customer_details", {
        name: "",
        phone: "",
        address: "",
        paymentMethod: "COD"
    });
}

function saveCustomerDetails(details) {
    storage.set("customer_details", details);
}

// Active Coupon helper
function getAppliedCoupon() {
    return storage.get("coupon", "");
}

function applyCoupon(code) {
    const cleanCode = code.trim().toUpperCase();
    if (COUPONS[cleanCode] !== undefined) {
        storage.set("coupon", cleanCode);
        return { success: true, discount: COUPONS[cleanCode] };
    }
    return { success: false, message: "Invalid Coupon Code" };
}

// Store Owner Accounts (Registration & Login via PostgreSQL backend)
async function registerStoreOwner(name, storeName, password) {
    try {
        const response = await fetch(`${API_BASE}/owners/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, storeName, password })
        });
        return await response.json();
    } catch (e) {
        console.error("Failed to register owner on backend", e);
        return { success: false, message: "Network error; server connection failed." };
    }
}

async function loginStoreOwner(storeName, password) {
    try {
        const response = await fetch(`${API_BASE}/owners/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ storeName, password })
        });

        const data = await response.json();
        if (data.success) {
            storage.set("admin_logged_in", true);
            storage.set("active_store_name", data.storeName);
            storage.set("active_owner_name", data.name);
        }
        return data;
    } catch (e) {
        console.error("Failed to sign in owner on backend", e);
        return { success: false, message: "Network error; server connection failed." };
    }
}

function getActiveStoreName() {
    return storage.get("active_store_name", "System Administrator");
}

function getActiveOwnerName() {
    return storage.get("active_owner_name", "Owner Access");
}

function isAdminLoggedIn() {
    return storage.get("admin_logged_in", false);
}

function setAdminLoggedIn(status) {
    storage.set("admin_logged_in", status);
    if (!status) {
        storage.remove("active_store_name");
        storage.remove("active_owner_name");
    }
}

// Currency Formatter
function formatPrice(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}
