document.addEventListener("DOMContentLoaded", () => {
    // 1. REFERENCIAS A ELEMENTOS DEL DOM
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    const lightLabel = themeToggleBtn.querySelector(".light-label");
    const darkLabel = themeToggleBtn.querySelector(".dark-label");
    const bellBtn = document.getElementById("bellBtn");
    const notificationDropdown = document.getElementById("notificationDropdown");
    const logoutBtn = document.getElementById("logoutBtn");

    // 2. LOGIC INTERACTIVA PARA EL INTERRUPTOR DE TEMAS ANIMADO (VIDEO-STYLE)
    // Cambia dinámicamente de 'icono' a 'icono + texto' recreando la transición exacta
    function syncThemeToggleUI(isDark) {
        if (isDark) {
            // Desactiva el sol (pasa de 'icono + texto' a ser solo un icono circular compacto)
            lightLabel.classList.remove("active");
            lightLabel.innerHTML = '<i data-lucide="sun"></i>'; 
            
            // Activa la luna (pasa de icono simple a expandirse con el texto 'Dark')
            darkLabel.classList.add("active");
            darkLabel.innerHTML = '<i data-lucide="moon"></i> Dark'; 
        } else {
            // Desactiva la luna (vuelve a ser un icono circular compacto sin texto)
            darkLabel.classList.remove("active");
            darkLabel.innerHTML = '<i data-lucide="moon"></i>'; 
            
            // Activa el sol (se expande agregando la palabra 'Light')
            lightLabel.classList.add("active");
            lightLabel.innerHTML = '<i data-lucide="sun"></i> Light'; 
        }
        // Obliga a Lucide a renderizar de inmediato los iconos inyectados por JavaScript
        lucide.createIcons();
    }

    // Inicializar preferencia guardada en memoria local del navegador
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme === "dark") {
        document.body.classList.add("dark-mode");
        syncThemeToggleUI(true);
    } else {
        syncThemeToggleUI(false);
    }

    // Evento Click con el flujo completo de animación y cambio de variables css
    themeToggleBtn.addEventListener("click", () => {
        const isDarkNow = document.body.classList.toggle("dark-mode");
        localStorage.setItem("theme", isDarkNow ? "dark" : "light");
        syncThemeToggleUI(isDarkNow);
    });

    // 3. CONTROL DEL MENU DESPLEGABLE DE NOTIFICACIONES
    bellBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        notificationDropdown.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
        if (!notificationDropdown.contains(e.target) && e.target !== bellBtn) {
            notificationDropdown.classList.remove("show");
        }
    });

    // 4. CONFIRMACIÓN SEGURA PARA CIERRE DE SESIÓN
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (confirm("¿Está seguro de que desea cerrar la sesión de pasajero?")) {
                window.location.href = "../login/login.html";
            }
        });
    }

    // 5. RENDERIZADO INICIAL DE ICONOS NATIVOS
    lucide.createIcons();
});