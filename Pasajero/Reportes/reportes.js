document.addEventListener("DOMContentLoaded", () => {
    // 1. ARREGLO DE RUTAS EXTRACTO EXACTO DE RUTAS.JS
    const rutasDisponibles = [
        { id: "L1", name: "Centro - Macapule" },
        { id: "L2", name: "Centro - UAS" },
        { id: "L3", name: "Centro - Toledo" },
        { id: "L4", name: "Centro - Infonavit" },
        { id: "L5", name: "Centro - Malvinas" }
    ];

    // 2. REFERENCIAS GENERALES DE INTERFAZ DEL DOM
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    const lightLabel = themeToggleBtn.querySelector(".light-label");
    const darkLabel = themeToggleBtn.querySelector(".dark-label");
    const bellBtn = document.getElementById("bellBtn");
    const notificationDropdown = document.getElementById("notificationDropdown");
    const logoutBtn = document.getElementById("logoutBtn");

    const selectRuta = document.getElementById('ruta-select');
    const optionsIncident = document.querySelectorAll('.incident-option');
    const btnEnviar = document.getElementById('btnEnviar');
    const container = document.getElementById('main-report-container');

    let selectedIncident = null;

    // 3. LOGIC INTERACTIVA PARA EL INTERRUPTOR DE TEMAS ANIMADO (VIDEO-STYLE)
    function syncThemeToggleUI(isDark) {
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
        lucide.createIcons();
    }

    const currentTheme = localStorage.getItem("theme");
    if (currentTheme === "dark") {
        document.body.classList.add("dark-mode");
        syncThemeToggleUI(true);
    } else {
        syncThemeToggleUI(false);
    }

    themeToggleBtn.addEventListener("click", () => {
        const isDarkNow = document.body.classList.toggle("dark-mode");
        localStorage.setItem("theme", isDarkNow ? "dark" : "light");
        syncThemeToggleUI(isDarkNow);
    });

    // 4. INYECTAR RUTAS AL DROPDOWN SELECTOR
    rutasDisponibles.forEach(ruta => {
        const opt = document.createElement('option');
        opt.value = ruta.id;
        opt.textContent = `${ruta.id} - ${ruta.name}`;
        selectRuta.appendChild(opt);
    });

    // 5. EVENTOS INTERACTIVOS PARA LAS PÍLDORAS DE INCIDENTES
    optionsIncident.forEach(opt => {
        opt.addEventListener('click', () => {
            optionsIncident.forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            selectedIncident = opt.dataset.type;
            validarFormulario();
        });
    });

    selectRuta.addEventListener('change', validarFormulario);

    function validarFormulario() {
        if (selectedIncident && selectRuta.value !== "") {
            btnEnviar.disabled = false;
        } else {
            btnEnviar.disabled = true;
        }
    }

    // 6. FLUJO DE ENVÍO EXITOSO CON CONTENEDOR REACTIVO ELEGANTE
    btnEnviar.addEventListener('click', () => {
        container.innerHTML = `
            <div class="success-report-card">
                <div class="success-check-circle">
                    <i data-lucide="check" style="width: 36px; height: 36px;"></i>
                </div>
                <h2>¡Reporte Enviado con Éxito!</h2>
                <p>Muchas gracias por tu aportación, Jesús Alfonso. El equipo técnico de supervisión revisará el caso de la línea ${selectRuta.value} a la brevedad para ajustar las frecuencias o sancionar a la unidad.</p>
                <button onclick="location.reload()" class="btn-reload-form">
                    <i data-lucide="refresh-cw"></i> Crear otro reporte
                </button>
            </div>
        `;
        lucide.createIcons();
    });

    // NOTIFICACIONES Y LOGOUT
    bellBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        notificationDropdown.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
        if (!notificationDropdown.contains(e.target) && e.target !== bellBtn) {
            notificationDropdown.classList.remove("show");
        }
    });

    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (confirm("¿Está seguro de que desea cerrar la sesión de pasajero?")) {
                window.location.href = "../../LOGIN/Login.html";
            }
        });
    }

    lucide.createIcons();
});