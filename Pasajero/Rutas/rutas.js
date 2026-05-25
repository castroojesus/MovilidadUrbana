document.addEventListener("DOMContentLoaded", () => {
    // 1. REGISTRO INICIAL DE DATOS DE LOS MOCHIS, SINALOA
    let initialRoutes = [
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

    // 2. REFERENCIAS UNIFICADAS DE LA CABECERA Y HERRAMIENTAS
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    const lightLabel = themeToggleBtn.querySelector(".light-label");
    const darkLabel = themeToggleBtn.querySelector(".dark-label");
    const bellBtn = document.getElementById("bellBtn");
    const notificationDropdown = document.getElementById("notificationDropdown");
    const profileBtn = document.getElementById("profileBtn");
    const profileDropdown = document.getElementById("profileDropdown");
    const logoutButtons = document.querySelectorAll(".logout-btn");

    const tableBody = document.getElementById("tableBody");
    const mainSearchInput = document.getElementById("mainSearchInput");
    const statusFilter = document.getElementById("statusFilter");
    const durationFilter = document.getElementById("durationFilter");
    const passengerFilter = document.getElementById("passengerFilter");
    const clearFiltersBtn = document.getElementById("clearFiltersBtn");
    const resultsCounter = document.getElementById("resultsCounter");

    let currentSortColumn = null;
    let currentSortOrder = "asc";

    // 3. SINCRONIZACIÓN Y ANIMACIÓN TRANSICIONAL DEL BOTÓN DE TEMAS
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

    // INTERACTIVIDAD DE MENÚS CABECERA
    if (bellBtn) {
        bellBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (profileDropdown) profileDropdown.classList.remove("show");
            notificationDropdown.classList.toggle("show");
        });
    }

    if (profileBtn) {
        profileBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (notificationDropdown) notificationDropdown.classList.remove("show");
            profileDropdown.classList.toggle("show");
        });
    }
    
    document.addEventListener("click", () => {
        if (notificationDropdown) notificationDropdown.classList.remove("show");
        if (profileDropdown) profileDropdown.classList.remove("show");
    });

    logoutButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            if(confirm("¿Seguro que desea cerrar sesión del panel de rutas?")) {
                window.location.href = "../login/login.html";
            }
        });
    });

    // 4. RENDERIZACIÓN DE TABLA OMNI-FILTRADA (SOLO VISUALIZACIÓN)
    function renderTable() {
        if (!tableBody) return;
        
        let filtered = initialRoutes.filter(route => {
            const term = mainSearchInput.value.toLowerCase();
            const matchesText = route.name.toLowerCase().includes(term) || 
                                route.trayecto.toLowerCase().includes(term) || 
                                route.colonias.toLowerCase().includes(term);

            const matchesStatus = statusFilter.value === "all" || route.status === statusFilter.value;

            let matchesDuration = true;
            if (durationFilter.value === "short") matchesDuration = route.time < 30;
            else if (durationFilter.value === "medium") matchesDuration = route.time >= 30 && route.time <= 45;
            else if (durationFilter.value === "long") matchesDuration = route.time > 45;

            let matchesPassengers = true;
            if (passengerFilter.value === "high") matchesPassengers = route.passengers > 1000;
            else if (passengerFilter.value === "mid") matchesPassengers = route.passengers > 500;

            return matchesText && matchesStatus && matchesDuration && matchesPassengers;
        });

        if (currentSortColumn) {
            filtered.sort((a, b) => {
                let valA = a[currentSortColumn];
                let valB = b[currentSortColumn];
                return currentSortOrder === "asc" ? valA - valB : valB - valA;
            });
        }

        tableBody.innerHTML = "";
        
        filtered.forEach((route) => {
            const mainRow = document.createElement("tr");
            mainRow.className = "route-row-main";
            mainRow.innerHTML = `
                <td><span class="route-tag-pill">${route.id}</span>${route.name}</td>
                <td class="text-muted">${route.trayecto}</td>
                <td>${route.colonias.split(', ').map(c => `<span class="colonia-tag">${c}</span>`).join('')}</td>
                <td><strong>${route.passengers.toLocaleString()}</strong> <small class="text-muted">/día</small></td>
                <td>${route.time} min</td>
                <td>${route.km} km</td>
                <td><span class="status-indicator ${route.status === 'Activa' ? 'active' : 'inactive'}">${route.status}</span></td>
                <td class="actions-cell" onclick="event.stopPropagation();">
                    <button class="action-btn expand-trigger"><i data-lucide="eye"></i></button>
                </td>
            `;

            const expandedRow = document.createElement("tr");
            expandedRow.className = "expanded-row";
            expandedRow.innerHTML = `
                <td colspan="8">
                    <div class="expanded-detail-box">
                        <div>
                            <div class="detail-title">Trayecto Secuencial de Paradas (${route.stops} en total)</div>
                            <div class="paradas-timeline">
                                ${route.paradasLista ? route.paradasLista.map(p => `<div class="timeline-item">${p}</div>`).join('') : '<div class="timeline-item">Centro - Rutas Principales</div>'}
                            </div>
                        </div>
                        <div>
                            <div class="detail-title">Información de Logística</div>
                            <div class="detail-metrics-list">
                                <div><strong>Chofer Asignado:</strong> <span class="text-muted">${route.chofer}</span></div>
                                <div><strong>Frecuencia de Paso:</strong> <span class="text-muted">Cada ${route.frecuencia} min</span></div>
                                <div><strong>Primer Despacho:</strong> <span class="text-muted">${route.salida} AM</span></div>
                                <div><strong>Cierre de Circuito:</strong> <span class="text-muted">${route.llegada} PM</span></div>
                            </div>
                        </div>
                    </div>
                </td>
            `;

            mainRow.addEventListener("click", () => {
                const isOpen = expandedRow.classList.contains("open");
                document.querySelectorAll(".expanded-row").forEach(r => r.classList.remove("open"));
                if (!isOpen) expandedRow.classList.add("open");
            });

            mainRow.querySelector(".expand-trigger").addEventListener("click", () => mainRow.click());

            tableBody.appendChild(mainRow);
            tableBody.appendChild(expandedRow);
        });

        resultsCounter.innerText = `Mostrando ${filtered.length} de ${initialRoutes.length} rutas`;
        if (mainSearchInput.value || statusFilter.value !== "all" || durationFilter.value !== "all" || passengerFilter.value !== "all") {
            clearFiltersBtn.classList.remove("hide");
        } else {
            clearFiltersBtn.classList.add("hide");
        }
        if (window.lucide) lucide.createIcons();
    }

    // 5. CONTROL DE PANEL DE MÉTRICAS SUPERIORES
    function updateStats() {
        const total = initialRoutes.length;
        const active = initialRoutes.filter(r => r.status === "Activa").length;
        const inactive = total - active;
        const totalPass = initialRoutes.reduce((acc, curr) => acc + parseInt(curr.passengers || 0), 0);

        if(document.getElementById("statTotal")) document.getElementById("statTotal").innerText = total;
        if(document.getElementById("statActive")) document.getElementById("statActive").innerText = active;
        if(document.getElementById("statInactive")) document.getElementById("statInactive").innerText = inactive;
        if(document.getElementById("statPassengers")) document.getElementById("statPassengers").innerText = totalPass.toLocaleString();
        if(document.getElementById("routesCountSubtitle")) document.getElementById("routesCountSubtitle").innerText = `${total} rutas registradas`;
    }

    // LISTENERS DE CONTROL DE INPUTS
    if (mainSearchInput) mainSearchInput.addEventListener("input", renderTable);
    if (statusFilter) statusFilter.addEventListener("change", renderTable);
    if (durationFilter) durationFilter.addEventListener("change", renderTable);
    if (passengerFilter) passengerFilter.addEventListener("change", renderTable);

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener("click", () => {
            mainSearchInput.value = ""; statusFilter.value = "all";
            durationFilter.value = "all"; passengerFilter.value = "all";
            renderTable();
        });
    }

    // ORDER COLUMNS
    document.querySelectorAll(".sortable").forEach(th => {
        th.addEventListener("click", () => {
            const colName = th.getAttribute("data-sort");
            if (currentSortColumn === colName) {
                currentSortOrder = currentSortOrder === "asc" ? "desc" : "asc";
            } else {
                currentSortColumn = colName; currentSortOrder = "asc";
            }
            renderTable();
        });
    });

    // INICIALIZACIÓN
    updateStats();
    renderTable();
});
