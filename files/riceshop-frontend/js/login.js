// JavaScript for login.html (Tab Switcher and Owner Auth Logic)

document.addEventListener("DOMContentLoaded", () => {
    // Auth Guard - Redirect to dashboard if already logged in
    if (isAdminLoggedIn()) {
        window.location.href = "dashboard.html";
        return;
    }

    // DOM Elements
    const tabButtons = document.querySelectorAll(".login-tab-btn");
    const panels = document.querySelectorAll(".auth-form-panel");
    const errorBanner = document.getElementById("auth-error-banner");
    const successBanner = document.getElementById("auth-success-banner");

    // Login Form Elements
    const loginForm = document.getElementById("owner-login-form");
    const loginStoreInput = document.getElementById("login-store-name");
    const loginPassInput = document.getElementById("login-password");

    // Register Form Elements
    const registerForm = document.getElementById("owner-register-form");
    const regNameInput = document.getElementById("register-name");
    const regStoreInput = document.getElementById("register-store-name");
    const regPassInput = document.getElementById("register-password");

    // 1. Tab Switching Logic
    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            // Remove active classes
            tabButtons.forEach(t => t.classList.remove("active"));
            panels.forEach(p => p.classList.remove("active"));
            
            // Hide banners
            hideBanners();

            // Set active states
            btn.classList.add("active");
            const targetId = btn.getAttribute("data-target");
            document.getElementById(targetId).classList.add("active");
        });
    });

    // 2. Login Submit Handler
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        hideBanners();

        const storeName = loginStoreInput.value.trim();
        const password = loginPassInput.value.trim();

        const result = await loginStoreOwner(storeName, password);
        if (result.success) {
            window.location.href = "dashboard.html";
        } else {
            showError(result.message);
            loginPassInput.value = "";
            loginPassInput.focus();
        }
    });

    // 3. Register Submit Handler
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        hideBanners();

        const name = regNameInput.value.trim();
        const storeName = regStoreInput.value.trim();
        const password = regPassInput.value.trim();

        const result = await registerStoreOwner(name, storeName, password);
        if (result.success) {
            // Reset registration form fields
            registerForm.reset();
            
            // Show Success Notification Banner
            successBanner.style.display = "block";

            // Prefill store name in login tab
            loginStoreInput.value = storeName;

            // Automatically switch back to login tab after brief delay
            setTimeout(() => {
                document.getElementById("tab-login-trigger").click();
                loginPassInput.focus();
            }, 1500);
        } else {
            showError(result.message);
            regStoreInput.focus();
        }
    });

    // Banner Utilities
    function showError(msg) {
        errorBanner.innerHTML = `<strong>Authentication Alert!</strong> ${msg}`;
        errorBanner.style.display = "block";
        successBanner.style.display = "none";
    }

    function hideBanners() {
        errorBanner.style.display = "none";
        successBanner.style.display = "none";
    }

    // Hide error banner when typing
    const allInputs = [loginStoreInput, loginPassInput, regNameInput, regStoreInput, regPassInput];
    allInputs.forEach(input => {
        input.addEventListener("input", hideBanners);
    });
});
