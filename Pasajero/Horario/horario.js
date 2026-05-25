document.addEventListener("DOMContentLoaded", () => {
    // 1. ORIGEN DE DATOS EXACTO TOMADO DE RUTAS.JS
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

    // Clases estéticas basadas en inicio.css para alternancia de tarjetas
    const designClasses = ["event-lime", "event-purple", "event-slate"];

    // 2. REFERENCIAS DE ELEMENTOS DEL DOM
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    const lightLabel = themeToggleBtn.querySelector(".light-label");
    const darkLabel = themeToggleBtn.querySelector(".dark-label");
    const bellBtn = document.getElementById("bellBtn");
    const notificationDropdown = document.getElementById("notificationDropdown");
    const logoutBtn = document.getElementById("logoutBtn");
    
    const pillsContainer = document.getElementById("pillsContainer");
    const scheduleContainer = document.getElementById("scheduleContainer");

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

    // 4. GENERACIÓN DINÁMICA DE BOTONES / PÍLDORAS DE FILTRADO
    initialRoutes.forEach(route => {
        const btn = document.createElement("button");
        btn.className = "filter-btn";
        btn.setAttribute("data-filter", route.id);
        btn.innerText = route.id;
        pillsContainer.appendChild(btn);
    });

    // 5. RENDERIZADO CONTROLADO DE HORARIOS ESTILO INICIO.HTML
    function renderSchedules(filterId = "all") {
        scheduleContainer.innerHTML = "";

        const filteredRoutes = initialRoutes.filter(r => filterId === "all" || r.id === filterId);

        filteredRoutes.forEach((route, index) => {
            const cardDesign = designClasses[index % designClasses.length];
            const card = document.createElement("div");
            card.className = `schedule-card-item ${cardDesign}`;

            // Mapeo dinámico del estado a la píldora correspondiente
            let statusClass = "success";
            let statusText = "En Servicio";
            if (route.status === "Inactiva") {
                statusClass = "danger";
                statusText = "Fuera de Servicio";
            }

            card.innerHTML = `
                <div class="schedule-card-badge">${route.id}</div>
                <div class="schedule-card-body">
                    <strong>${route.name}</strong>
                    <p class="trayecto-text"><i data-lucide="map-pin"></i> ${route.trayecto}</p>
                    <div class="meta-row">
                        <span><i data-lucide="clock"></i> Frecuencia: Cada ${route.frecuencia} min</span>
                        <span><i data-lucide="play-circle"></i> Primer Despacho: ${route.salida} AM</span>
                        <span><i data-lucide="stop-circle"></i> Cierre: ${route.llegada} PM</span>
                    </div>
                </div>
                <span class="status-pill ${statusClass}">${statusText}</span>
            `;
            scheduleContainer.appendChild(card);
        });
        lucide.createIcons();
    }

    // Eventos Click en los Botones Filtro Píldora
    const filterButtons = pillsContainer.querySelectorAll(".filter-btn");
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderSchedules(btn.getAttribute("data-filter"));
        });
    });

    // 6. CONTROL DEL MENÚ DE NOTIFICACIONES
    bellBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        notificationDropdown.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
        if (!notificationDropdown.contains(e.target) && e.target !== bellBtn) {
            notificationDropdown.classList.remove("show");
        }
    });

    // 7. CONFIRMACIÓN DE CIERRE DE SESIÓN
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (confirm("¿Está seguro de que desea cerrar la sesión de pasajero?")) {
                window.location.href = "../../LOGIN/Login.html";
            }
        });
    }

    // Inicializar renders primarios
    renderSchedules();
});