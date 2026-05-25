
document.addEventListener("DOMContentLoaded", () => {
    // 1. ARREGLO DE RUTAS COMPLETO BASADO EN RUTAS.JS
    const initialRoutes = [
        { 
            id: "L1", 
            name: "Centro - Macapule", 
            passengers: 1240, 
            trayecto: "Plaza Central → Fracc. El Macapule", 
            colonias: "Centro, Scally, El Real, Fracc. El Macapule", 
            time: 35, 
            km: 11.2, 
            stops: 8, 
            status: "Activa", 
            chofer: "Juan Pérez", 
            frecuencia: 12, 
            salida: "05:30", 
            llegada: "22:00", 
            paradasLista: ["Plaza Central (Zaragoza)", "Blvd. Jiquilpan", "Plaza Paseo", "Col. Scally", "Fracc. El Macapule"] 
        },
        { 
            id: "L2", 
            name: "Centro - UAS", 
            passengers: 2100, 
            trayecto: "Terminal Centro → Ciudad Universitaria UAS", 
            colonias: "Centro, Jiquilpan, Infonavit Macapule", 
            time: 25, 
            km: 8.5, 
            stops: 6, 
            status: "Activa", 
            chofer: "Pedro Soto", 
            frecuencia: 8, 
            salida: "06:00", 
            llegada: "22:15", 
            paradasLista: ["Terminal Centro", "Blvd. Antonio Rosales", "Ley Jiquilpan", "UAS Mochis"] 
        },
        { 
            id: "L3", 
            name: "Centro - Toledo", 
            passengers: 980, 
            trayecto: "Terminal Centro → Col. Antonio Toledo", 
            colonias: "Centro, Bienestar, Toledo", 
            time: 30, 
            km: 9.8, 
            stops: 7, 
            status: "Activa", 
            chofer: "Luis Romero", 
            frecuencia: 15, 
            salida: "06:00", 
            llegada: "21:45", 
            paradasLista: ["Terminal Centro", "Col. Bienestar", "Lienzo Charro", "Parque Toledo", "Ampliación Toledo"] 
        },
        { 
            id: "L4", 
            name: "Centro - Infonavit", 
            passengers: 560, 
            trayecto: "Zona 30- Infonavit- UAS", 
            colonias: "Infonavit, Zaragoza, Viñedos", 
            time: 40, 
            km: 13.4, 
            stops: 9, 
            status: "Inactiva", 
            chofer: "Sin asignar", 
            frecuencia: 20, 
            salida: "06:30", 
            llegada: "21:00", 
            paradasLista: ["Plaza Central", "Col. Díaz Ordaz", "UAS", "Viñedos", "Fracc. Infonavit"] 
        },
        { 
            id: "L5", 
            name: "Centro - Malvinas", 
            passengers: 750, 
            trayecto: "Terminal Centro → Malvinas", 
            colonias: "Centro, Malvinas, Zaragoza, Naranjos", 
            time: 45, 
            km: 14.2, 
            stops: 8, 
            status: "Activa", 
            chofer: "Carlos Ruíz", 
            frecuencia: 15, 
            salida: "05:15", 
            llegada: "22:30", 
            paradasLista: ["Terminal Centro", "Col. Malvinas", "Zaragoza", "Naranjos"] 
        }
    ];

    const designClasses = ["event-purple", "event-lime", "event-slate"];

    // 2. ELEMENTOS DEL INTERRUPTOR DE TEMAS Y COMPONENTES GLOBALES
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    const lightLabel = themeToggleBtn.querySelector(".light-label");
    const darkLabel = themeToggleBtn.querySelector(".dark-label");
    const bellBtn = document.getElementById("bellBtn");
    const notificationDropdown = document.getElementById("notificationDropdown");
    const logoutBtn = document.getElementById("logoutBtn");

    const origenSelect = document.getElementById("origenSelect");
    const destinoSelect = document.getElementById("destinoSelect");
    const btnPlanificar = document.getElementById("btnPlanificar");
    const resultsContainer = document.getElementById("plannerResultsContainer");

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

    // 4. SISTEMA DE GEOLOCALIZACIÓN Y RECOMENDACIÓN DE RUTAS CERCANAS
    btnPlanificar.addEventListener("click", () => {
        const origenValue = origenSelect.value;
        const destinoValue = destinoSelect.value;

        if (!origenValue || !destinoValue) {
            alert("Por favor, selecciona tanto un origen como un destino final.");
            return;
        }

        resultsContainer.innerHTML = `<div class="empty-state-message"><p>Buscando las mejores opciones de transporte...</p></div>`;

        if (origenValue === "GPS") {
            // Intentar usar la API de Geolocalización nativa del navegador
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        // Simulación exitosa basada en tu ubicación real de Los Mochis
                        // Mapeamos que por GPS estás cerca de la zona Scally/Jiquilpan
                        processRoutePlanning("Scally", destinoValue, true);
                    },
                    (error) => {
                        // Si el usuario deniega el permiso GPS, avisamos y usamos fallback sutil
                        console.warn("Permiso de GPS denegado. Usando Centro como fallback.");
                        processRoutePlanning("Centro", destinoValue, false);
                    }
                );
            } else {
                processRoutePlanning("Centro", destinoValue, false);
            }
        } else {
            processRoutePlanning(origenValue, destinoValue, false);
        }
    });

    // 5. PROCESAMIENTO FILTRADO LOGICO OMNI-RECOMENDADOR
    function processRoutePlanning(origen, destino, isRealTimeGPS) {
        resultsContainer.innerHTML = "";

        // Filtramos rutas que contengan tanto la colonia de origen como la de destino en su trayecto
        let sugeridas = initialRoutes.filter(route => {
            const contieneOrigen = route.colonias.toLowerCase().includes(origen.toLowerCase());
            const contieneDestino = route.colonias.toLowerCase().includes(destino.toLowerCase());
            return contieneOrigen && contieneDestino;
        });

        if (sugeridas.length === 0) {
            resultsContainer.innerHTML = `
                <div class="empty-state-message">
                    <i data-lucide="alert-circle" style="color: var(--accent-danger);"></i>
                    <p>No se encontraron líneas directas para ese trayecto específico. Te sugerimos tomar un trasbordo en la terminal Centro.</p>
                </div>`;
            lucide.createIcons();
            return;
        }

        // Renderizar los bloques de eventos estilizados
        sugeridas.forEach((route, index) => {
            const cardDesign = designClasses[index % designClasses.length];
            const card = document.createElement("div");
            card.className = `schedule-card-item ${cardDesign}`;

            let gpsBadgeHtml = isRealTimeGPS 
                ? `<span class="gps-alert-badge"><i data-lucide="navigation-2"></i> Pasa a 2 cuadras de tu ubicación</span>` 
                : "";

            card.innerHTML = `
                <div class="schedule-card-badge">${route.id}</div>
                <div class="schedule-card-body">
                    <strong>Línea Recomendada: ${route.name}</strong>
                    <p class="trayecto-text"><i data-lucide="git-commit"></i> Trayecto optimizado: ${route.trayecto}</p>
                    <div class="meta-row">
                        <span><i data-lucide="clock"></i> Duración viaje: ~${route.time} min</span>
                        <span><i data-lucide="activity"></i> Frecuencia: Cada ${route.frecuencia} min</span>
                        <span><i data-lucide="navigation"></i> Distancia: ${route.km} km</span>
                    </div>
                    ${gpsBadgeHtml}
                </div>
                <span class="status-pill success">Recomendada</span>
            `;
            resultsContainer.appendChild(card);
        });
        lucide.createIcons();
    }

    // 6. MENÚS DESPLEGABLES DE NOTIFICACIONES Y LOGOUT
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
                window.location.href = "../login/login.html";
            }
        });
    }
});