document.addEventListener("DOMContentLoaded", () => {
    // 1. REGISTRO INICIAL DE DATOS: ACTUALIZADO CON RUTAS REALES DE LOS MOCHIS, SINALOA
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
            name: "Centro - Toledo ", 
            passengers: 980, 
            trayecto: "Terminal Centro → Col. Antonio Toledo ", 
            colonias: "Centro, Bienestar, Toledo", 
            time: 30, 
            km: 9.8, 
            stops: 7, 
            status: "Activa", 
            chofer: "Luis Romero", 
            frecuencia: 15, 
            salida: "06:00", 
            llegada: "21:45", 
            paradasLista: ["Terminal Centro", "Col. Bienestar", "Lienzo Charro", "Parque Toledo ", "Ampliación Toledo"] 
        },
        { 
            id: "L4", 
            name: "Centro - Infonavit ", 
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
            name: "Centro - Malvinas ", 
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

    // 2. REFERENCIAS UNIFICADAS DE LA CABECERA
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    const lightLabel = themeToggleBtn ? themeToggleBtn.querySelector(".light-label") : null;
    const darkLabel = themeToggleBtn ? themeToggleBtn.querySelector(".dark-label") : null;
    const bellBtn = document.getElementById("bellBtn");
    const notificationDropdown = document.getElementById("notificationDropdown");
    const profileBtn = document.getElementById("profileBtn");
    const profileDropdown = document.getElementById("profileDropdown");
    const logoutButtons = document.querySelectorAll(".logout-btn");

    // 3. REFERENCIAS DE LA TABLA Y HERRAMIENTAS
    const tableBody = document.getElementById("tableBody");
    const mainSearchInput = document.getElementById("mainSearchInput");
    const statusFilter = document.getElementById("statusFilter");
    const durationFilter = document.getElementById("durationFilter");
    const passengerFilter = document.getElementById("passengerFilter");
    const clearFiltersBtn = document.getElementById("clearFiltersBtn");
    const resultsCounter = document.getElementById("resultsCounter");

    const routeModal = document.getElementById("routeModal");
    const routeForm = document.getElementById("routeForm");
    const modalTitle = document.getElementById("modalTitle");

    let currentSortColumn = null;
    let currentSortOrder = "asc";

    // SINCRONIZACIÓN DEL MODO OSCURO GLOBAL
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        updateThemeToggleUI(true);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            const isDark = document.body.classList.toggle("dark-mode");
            localStorage.setItem("theme", isDark ? "dark" : "light");
            updateThemeToggleUI(isDark);
        });
    }

    function updateThemeToggleUI(isDark) {
        if (!lightLabel || !darkLabel) return;
        if (isDark) {
            lightLabel.classList.remove("active"); lightLabel.innerHTML = '<i data-lucide="sun"></i>';
            darkLabel.classList.add("active"); darkLabel.innerHTML = '<i data-lucide="moon"></i> Dark';
        } else {
            darkLabel.classList.remove("active"); darkLabel.innerHTML = '<i data-lucide="moon"></i>';
            lightLabel.classList.add("active"); lightLabel.innerHTML = '<i data-lucide="sun"></i> Light';
        }
        if (window.lucide) lucide.createIcons();
    }

    // INTERACTIVIDAD DE MENÚS CABECERA
    if (bellBtn) {
        bellBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            profileDropdown.classList.remove("show");
            notificationDropdown.classList.toggle("show");
        });
    }

    if (profileBtn) {
        profileBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            notificationDropdown.classList.remove("show");
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

    // 4. RENDERIZACIÓN DE TABLA OMNI-FILTRADA
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
                    <button class="action-btn edit-trigger"><i data-lucide="edit-3"></i></button>
                    <button class="action-btn delete-btn"><i data-lucide="trash-2"></i></button>
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

            mainRow.querySelector(".delete-btn").addEventListener("click", (e) => {
                e.stopPropagation();
                if(confirm(`¿Desea eliminar la ruta ${route.id}?`)) {
                    mainRow.classList.add("fade-out");
                    setTimeout(() => {
                        initialRoutes = initialRoutes.filter(r => r.id !== route.id);
                        updateStats(); renderTable();
                    }, 400);
                }
            });

            mainRow.querySelector(".edit-trigger").addEventListener("click", (e) => {
                e.stopPropagation();
                modalTitle.innerText = "Editar Parámetros de Ruta";
                document.getElementById("formRouteIndex").value = initialRoutes.findIndex(r => r.id === route.id);
                document.getElementById("routeId").value = route.id;
                document.getElementById("routeId").disabled = true;
                document.getElementById("routeName").value = route.name;
                document.getElementById("routeTrayecto").value = route.trayecto;
                document.getElementById("routeColonias").value = route.colonias;
                document.getElementById("routePassengers").value = route.passengers;
                document.getElementById("routeTime").value = route.time;
                document.getElementById("routeKm").value = route.km;
                document.getElementById("routeStops").value = route.stops;
                document.getElementById("routeStatus").value = route.status;
                routeModal.classList.add("open");
            });

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

    // MODAL HANDLERS
    const openModalBtn = document.getElementById("openModalBtn");
    if (openModalBtn) {
        openModalBtn.addEventListener("click", () => {
            modalTitle.innerText = "Nueva Ruta de Transporte";
            routeForm.reset();
            document.getElementById("formRouteIndex").value = "";
            document.getElementById("routeId").disabled = false;
            routeModal.classList.add("open");
        });
    }

    const closeModal = () => routeModal.classList.remove("open");
    if(document.getElementById("closeModalBtn")) document.getElementById("closeModalBtn").addEventListener("click", closeModal);
    if(document.getElementById("cancelFormBtn")) document.getElementById("cancelFormBtn").addEventListener("click", closeModal);

    if (routeForm) {
        routeForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const indexIdx = document.getElementById("formRouteIndex").value;

            const newRouteData = {
                id: document.getElementById("routeId").value,
                name: document.getElementById("routeName").value,
                trayecto: document.getElementById("routeTrayecto").value,
                colonias: document.getElementById("routeColonias").value,
                passengers: parseInt(document.getElementById("routePassengers").value),
                time: parseInt(document.getElementById("routeTime").value),
                km: parseFloat(document.getElementById("routeKm").value),
                stops: parseInt(document.getElementById("routeStops").value),
                status: document.getElementById("routeStatus").value,
                chofer: "Por asignar", frecuencia: 15, salida: "06:00", llegada: "22:00",
                paradasLista: document.getElementById("routeColonias").value.split(", ")
            };

            if (indexIdx === "") {
                initialRoutes.push(newRouteData);
            } else {
                newRouteData.chofer = initialRoutes[indexIdx].chofer;
                newRouteData.frecuencia = initialRoutes[indexIdx].frecuencia;
                newRouteData.salida = initialRoutes[indexIdx].salida;
                newRouteData.llegada = initialRoutes[indexIdx].llegada;
                initialRoutes[indexIdx] = newRouteData;
            }

            closeModal(); updateStats(); renderTable();
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