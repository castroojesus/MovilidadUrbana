document.addEventListener("DOMContentLoaded", () => {
    // 1. SELECT ELEMENT REFERENCES
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    const lightLabel = themeToggleBtn.querySelector(".light-label");
    const darkLabel = themeToggleBtn.querySelector(".dark-label");
    
    const bellBtn = document.getElementById("bellBtn");
    const notificationDropdown = document.getElementById("notificationDropdown");
    
    const profileBtn = document.getElementById("profileBtn");
    const profileDropdown = document.getElementById("profileDropdown");
    
    const filterButtons = document.querySelectorAll(".filter-btn");
    const logoutButtons = document.querySelectorAll(".logout-btn");

    // 2. DARK / LIGHT THEME TOGGLE
    // Check if user has previously set a preference
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        updateThemeToggleUI(true);
    }

    themeToggleBtn.addEventListener("click", () => {
        const isDarkNow = document.body.classList.toggle("dark-mode");
        localStorage.setItem("theme", isDarkNow ? "dark" : "light");
        updateThemeToggleUI(isDarkNow);
    });

    function updateThemeToggleUI(isDark) {
        if (isDark) {
            lightLabel.classList.remove("active");
            lightLabel.innerHTML = '<i data-lucide="sun"></i>';
            darkLabel.classList.add("active");
            darkLabel.innerHTML = '<i data-lucide="moon"></i> Dark';
        } else {
            darkLabel.classList.remove("active");
            darkLabel.innerHTML = '<i data-lucide="moon"></i>';
            lightLabel.classList.add("active");
            lightLabel.innerHTML = '<i data-lucide="sun"></i> Light';
        }
        // Re-render lucide icons inside mutated elements
        lucide.createIcons();
    }

    // 3. DROPDOWNS TOGGLE FUNCTIONALITY
    // Toggle Notification Menu
    bellBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        profileDropdown.classList.remove("show"); // close other
        notificationDropdown.classList.toggle("show");
    });

    // Toggle Profile Menu
    profileBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        notificationDropdown.classList.remove("show"); // close other
        profileDropdown.classList.toggle("show");
    });

    // Close dropdowns when clicking anywhere outside
    document.addEventListener("click", (e) => {
        if (!document.getElementById("notificationMenuWrapper").contains(e.target)) {
            notificationDropdown.classList.remove("show");
        }
        if (!document.getElementById("profileMenuWrapper").contains(e.target)) {
            profileDropdown.classList.remove("show");
        }
    });

    // 4. FILTER PILL BUTTONS CLICK INTERACTION
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            console.log(`Filtro cambiado a: ${btn.getAttribute("data-filter")}`);
        });
    });

    // 5. SECURE LOGOUT WITH CONFIRMATION
    logoutButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const confirmLogout = confirm("¿Está seguro de que desea cerrar la sesión de encargado de movilidad?");
            if (confirmLogout) {
                // Redirección relativa según los requerimientos solicitados
                window.location.href = "../login/login.html";
            }
        });
    });
});