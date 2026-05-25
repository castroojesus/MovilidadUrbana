

document.addEventListener("DOMContentLoaded", () => {
    // 1. BASE DE DATOS INICIAL DE LOS 4 CHOFERES CON DATOS REALES DE SINALOA
    let driversDatabase = [
        {
            id: "DRV-001",
            name: "Roberto Silva",
            phone: "+52 668-123-4502",
            email: "r.silva@movilidad.mx",
            rutaId: "L1",
            rutaName: "Centro-Macapule",
            trayecto: "Plaza Central → El Macapule",
            trips: 6,
            licencia: "LIC-2019-001",
            status: "En ruta",
            rating: 4.8,
            punctuality: 94,
            turno: "Matutino",
            hours: "06:00 - 14:00",
            daysWorked: "19/22",
            notes: "Excelente historial. Recordatorio de mantenimiento regular de la unidad.",
            incidencias: [
                { fecha: "18/05/2026", tipo: "Menor", desc: "Desvío menor de ruta por bloqueo en Blvd. Jiquilpan." },
                { fecha: "04/05/2026", tipo: "Advertencia", desc: "Exceso de velocidad registrado por GPS (62 km/h en zona escolar)." }
            ],
        },
        {
            id: "DRV-002",
            name: "Miguel Torres",
            phone: "+52 668-889-4233",
            email: "m.torres@movilidad.mx",
            rutaId: "L2",
            rutaName: "Centro-UAS",
            trayecto: "Terminal Centro → C.U. UAS",
            trips: 4,
            licencia: "LIC-2020-045",
            status: "Disponible",
            rating: 4.6,
            punctuality: 89,
            turno: "Vespertino",
            hours: "14:00 - 22:00",
            daysWorked: "18/22",
            notes: "Ninguna observación negativa.",
            incidencias: [],
        },
        {
            id: "DRV-003",
            name: "Luis Ramírez",
            phone: "+52 668-276-4245",
            email: "l.ramirez@movilidad.mx",
            rutaId: "L3",
            rutaName: "Centro-Toledo",
            trayecto: "Terminal Centro → Col. Toledo Corro",
            trips: 5,
            licencia: "LIC-2018-112",
            status: "En ruta",
            rating: 4.9,
            punctuality: 97,
            turno: "Matutino",
            hours: "06:00 - 14:00",
            daysWorked: "21/22",
            notes: "Operador del mes recurrente. Alta eficiencia de combustible.",
            incidencias: [
                { fecha: "11/05/2026", tipo: "Menor", desc: "Retraso de 10 min por ponchadura de llanta trasera." }
            ],
        },
        {
            id: "DRV-004",
            name: "Jorge Herrera",
            phone: "+52 667-123-4504",
            email: "j.herrera@movilidad.mx",
            rutaId: "L5",
            rutaName: "Centro-Malvinas",
            trayecto: "Terminal Centro → Los Virreyes",
            trips: 0,
            licencia: "LIC-2021-078",
            status: "Inactivo",
            rating: 4.3,
            punctuality: 82,
            turno: "Nocturno",
            hours: "22:00 - 06:00",
            daysWorked: "14/22",
            notes: "Licencia de conducir del estado de Sinaloa próxima a vencer.",
            incidencias: [
                { fecha: "30/04/2026", tipo: "Crítico", desc: "Ausencia injustificada al turno nocturno sin previo aviso." }
            ],
        }
    ];

    // Mapeo auxiliar de nombres de rutas para inserciones rápidas
    const routeNamesCatalog = {
        "L1": { name: "Centro-Macapule", trayecto: "Plaza Central → El Macapule" },
        "L2": { name: "Centro-UAS", trayecto: "Terminal Centro → C.U. UAS" },
        "L3": { name: "Centro-Toledo", trayecto: "Terminal Centro → Col. Toledo Corro" },
        "L4": { name: "Centro-Infonavit", trayecto: "Terminal Centro → Infonavit" },
        "L5": { name: "Centro-Malvinas", trayecto: "Terminal Centro → Los Virreyes" }
    };

    // 2. REFERENCIAS DE ELEMENTOS DE INTERFAZ
    const cardsViewContainer = document.getElementById("cardsViewContainer");
    const tableViewContainer = document.getElementById("tableViewContainer");
    const tableBody = document.getElementById("tableBody");
    const viewGridBtn = document.getElementById("viewGridBtn");
    const viewListBtn = document.getElementById("viewListBtn");
    
    // Filtros e Inputs
    const mainSearchInput = document.getElementById("mainSearchInput");
    const statusFilter = document.getElementById("statusFilter");
    const routeFilter = document.getElementById("routeFilter");
    const ratingFilter = document.getElementById("ratingFilter");
    const resultsCounter = document.getElementById("resultsCounter");

    // Modales y Formularios
    const driverModal = document.getElementById("driverModal");
    const driverForm = document.getElementById("driverForm");
    const modalTitle = document.getElementById("modalTitle");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const cancelFormBtn = document.getElementById("cancelFormBtn");
    const openAddModalBtn = document.getElementById("openAddModalBtn");

    // Preview de foto
    const driverPhotoInput = document.getElementById("driverPhoto");
    const avatarPreviewImg = document.getElementById("avatarPreviewImg");
    const avatarPreviewFallback = document.getElementById("avatarPreviewFallback");
    let base64PhotoStr = ""; // Almacenará la foto si se sube una local

    // Modal Eliminar
    const deleteConfirmModal = document.getElementById("deleteConfirmModal");
    const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
    let driverIdToDelete = null;

    // Drawer de Incidencias
    const incidentsDrawer = document.getElementById("incidentsDrawer");
    const closeDrawerBtn = document.getElementById("closeDrawerBtn");
    const drawerDriverName = document.getElementById("drawerDriverName");
    const incidentCountBadge = document.getElementById("incidentCountBadge");
    const incidentsTimelineContainer = document.getElementById("incidentsTimelineContainer");

    // Componentes Comunes de Cabecera
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    const lightLabel = themeToggleBtn?.querySelector(".light-label");
    const darkLabel = themeToggleBtn?.querySelector(".dark-label");
    const bellBtn = document.getElementById("bellBtn");
    const notificationDropdown = document.getElementById("notificationDropdown");
    const profileBtn = document.getElementById("profileBtn");
    const profileDropdown = document.getElementById("profileDropdown");
    const logoutButtons = document.querySelectorAll(".logout-btn");

    let activeViewMode = "grid"; // grid o list

    // 3. LOGICA GLOBAL DE CABECERA (Modo Oscuro, Notificaciones, Logout)
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
            if (confirm("¿Estás seguro de que deseas cerrar sesión de la sección de choferes?")) {
                window.location.href = "../login/login.html";
            }
        });
    });

    // 4. CONTROL DE COMPONENTES DE VISTA (RENDER CARDS & TABLA)
    function renderDrivers() {
        const searchTerm = mainSearchInput.value.toLowerCase().trim();
        const selStatus = statusFilter.value;
        const selRoute = routeFilter.value;
        const selRating = ratingFilter.value;

        // Filtrado combinado omni-operacional
        let filtered = driversDatabase.filter(drv => {
            const matchesSearch = drv.name.toLowerCase().includes(searchTerm) || 
                                  drv.licencia.toLowerCase().includes(searchTerm) || 
                                  drv.rutaName.toLowerCase().includes(searchTerm) ||
                                  drv.rutaId.toLowerCase().includes(searchTerm);
            
            const matchesStatus = (selStatus === "all" || drv.status === selStatus);
            const matchesRoute = (selRoute === "all" || drv.rutaId === selRoute);
            
            let matchesRating = true;
            if (selRating === "4.5") matchesRating = drv.rating >= 4.5;
            else if (selRating === "4.0") matchesRating = drv.rating >= 4.0;
            else if (selRating === "low") matchesRating = drv.rating < 4.0;

            return matchesSearch && matchesStatus && matchesRoute && matchesRating;
        });

        // Vaciar contenedores
        cardsViewContainer.innerHTML = "";
        tableBody.innerHTML = "";

        // Actualizar contador superior e intermedio
        resultsCounter.innerText = `Mostrando ${filtered.length} de ${driversDatabase.length} choferes`;

        if (filtered.length === 0) {
            const noDataHtml = `<div class="card text-center" style="grid-column: span 2; padding: 40px; color: var(--text-muted);">
                <i data-lucide="user-x" style="width: 48px; height: 48px; margin: 0 auto 12px auto; opacity: 0.6;"></i>
                <p style="font-weight: 700;">No se encontraron choferes que coincidan con los filtros aplicados.</p>
            </div>`;
            cardsViewContainer.innerHTML = noDataHtml;
            tableBody.innerHTML = `<tr><td colspan="9" class="text-center" style="padding: 30px; color: var(--text-muted);">Sin resultados de operadores.</td></tr>`;
            if (window.lucide) lucide.createIcons();
            return;
        }

        // Renderizar elementos
        filtered.forEach(drv => {
            const initials = drv.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
            const statusClass = drv.status.toLowerCase().replace(" ", "-");
            const routeClass = drv.rutaId.toLowerCase();

            // A: RENDER VISTA CARDS (GRID MODE)
            const cardEl = document.createElement("div");
            cardEl.className = "driver-card fadeIn";
            cardEl.setAttribute("data-id", drv.id);
            cardEl.innerHTML = `
                <div class="status-badge ${statusClass}">${drv.status}</div>
                <div class="card-driver-header">
                    <div class="driver-avatar-box">
                        ${drv.photo ? `<img src="${drv.photo}" alt="${drv.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` : ''}
                        <div class="fallback" style="${drv.photo ? 'display:none;' : 'display:flex;'}">${initials}</div>
                    </div>
                    <div class="driver-identity">
                        <h4>${drv.name}</h4>
                        <div class="rating-inline">
                            <i data-lucide="star" class="star-icon"></i>
                            <span><strong>${drv.rating}</strong></span>
                            <span class="text-muted">(${drv.trips + 12} eval)</span>
                        </div>
                        <div class="punctuality-box">
                            <span class="pct-text">Puntualidad: <strong>${drv.punctuality}%</strong></span>
                            <div class="pct-bar-bg"><div class="pct-bar-fill" style="width: ${drv.punctuality}%"></div></div>
                        </div>
                    </div>
                </div>

                <div class="driver-contact-list">
                    <div class="contact-item"><i data-lucide="mail"></i> <span>${drv.email}</span></div>
                    <div class="contact-item"><i data-lucide="phone"></i> <span>${drv.phone}</span></div>
                    <div class="contact-item"><i data-lucide="file-text"></i> <span style="font-family: monospace;">Licencia: ${drv.licencia}</span></div>
                </div>

                <div class="route-badge-block">
                    <div class="route-tag ${routeClass}">${drv.rutaId}</div>
                    <div class="route-info-mini">
                        <h5>${drv.rutaName}</h5>
                        <p>${drv.trayecto}</p>
                    </div>
                </div>

                <div class="card-ops-row">
                    <div class="ops-item"><span>Viajes Hoy</span><p style="color:var(--accent-purple-dark)">${drv.trips}</p></div>
                    <div class="ops-item"><span>Incidencias</span><p style="color:${drv.incidencias.length > 0 ? 'var(--accent-danger)' : 'var(--text-main)'}">${drv.incidencias.length}</p></div>
                    <div class="ops-item"><span>Efectividad</span><p>92%</p></div>
                </div>

                <div class="chips-row">
                    <div class="chip-pill ${drv.status !== 'Inactivo' ? 'active-shift' : ''}"><i data-lucide="clock"></i> Turno: ${drv.hours}</div>
                    <div class="chip-pill"><i data-lucide="calendar"></i>  ${drv.daysWorked} asistencias</div>
                </div>

                <div class="card-actions-footer" onclick="event.stopPropagation();">
                    <button class="btn-toggle-state ${drv.status !== 'Inactivo' ? 'active-now' : ''}" data-id="${drv.id}">
                        <i data-lucide="${drv.status !== 'Inactivo' ? 'user-minus' : 'user-check'}"></i> 
                        ${drv.status !== 'Inactivo' ? 'Desactivar' : 'Activar'}
                    </button>
                    <button class="btn-incident-trigger" data-id="${drv.id}"><i data-lucide="alert-circle"></i> Historial</button>
                    <button class="btn-edit-trigger" data-id="${drv.id}"><i data-lucide="edit-2"></i></button>
                    <button class="btn-del-trigger" data-id="${drv.id}"><i data-lucide="trash-2"></i></button>
                </div>
            `;
            cardsViewContainer.appendChild(cardEl);

            // B: RENDER VISTA TABLA (LIST MODE)
            const rowEl = document.createElement("tr");
            rowEl.innerHTML = `
                <td>
                    <div class="table-driver-profile">
                        ${drv.photo ? `<img src="${drv.photo}" alt="${drv.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` : ''}
                        <div class="table-avatar-fallback" style="${drv.photo ? 'display:none;' : 'display:flex;'}">${initials}</div>
                        <div><strong>${drv.name}</strong><br><small class="text-muted">ID: ${drv.id}</small></div>
                    </div>
                </td>
                <td style="font-family: monospace;">${drv.licencia}</td>
                <td><small>${drv.email}<br>${drv.phone}</small></td>
                <td><span class="route-tag ${routeClass}" style="display:inline-block; margin-right:4px;">${drv.rutaId}</span> ${drv.rutaName}</td>
                <td><small>${drv.turno}<br>(${drv.hours})</small></td>
                <td class="text-center"><strong>${drv.trips}</strong></td>
                <td><strong>⭐ ${drv.rating}</strong></td>
                <td><span class="status-badge ${statusClass}" style="position:static; display:inline-block;">${drv.status}</span></td>
                <td>
                    <div class="actions-cell-row" onclick="event.stopPropagation();">
                        <button class="table-act-btn inc" data-id="${drv.id}" title="Incidencias"><i data-lucide="alert-circle" style="width:14px; height:14px;"></i></button>
                        <button class="table-act-btn edit" data-id="${drv.id}" title="Editar"><i data-lucide="edit-2" style="width:14px; height:14px;"></i></button>
                        <button class="table-act-btn del" data-id="${drv.id}" title="Eliminar"><i data-lucide="trash-2" style="width:14px; height:14px;"></i></button>
                    </div>
                </td>
            `;
            tableBody.appendChild(rowEl);
        });

        if (window.lucide) lucide.createIcons();
        attachDynamicEventListeners();
    }

    // 5. CONTROL PANEL MÉTRICAS SUPERIORES (DASHBOARD STATS)
    function updateTopSummaryStats() {
        const total = driversDatabase.length;
        const onRoute = driversDatabase.filter(d => d.status === "En ruta").length;
        const totalTrips = driversDatabase.reduce((acc, curr) => acc + curr.trips, 0);
        
        let sumRating = driversDatabase.reduce((acc, curr) => acc + curr.rating, 0);
        let avgRating = total > 0 ? (sumRating / total).toFixed(1) : 0.0;

        document.getElementById("statTotalDrivers").innerText = total;
        document.getElementById("statOnRoute").innerText = onRoute;
        document.getElementById("statTotalTrips").innerText = totalTrips;
        document.getElementById("statAvgRating").innerText = avgRating;
        document.getElementById("driversCountSubtitle").innerText = `${total} choferes registrados`;
    }

    // 6. ENLACE DE EVENTOS DINÁMICOS (ACCIONES DE FILAS Y TARJETAS)
    function attachDynamicEventListeners() {
        // Botón Activar / Desactivar Estado Operativo rápido
        document.querySelectorAll(".btn-toggle-state").forEach(btn => {
            btn.addEventListener("click", () => {
                const dId = btn.getAttribute("data-id");
                const targetDriver = driversDatabase.find(d => d.id === dId);
                if (targetDriver) {
                    if (targetDriver.status !== "Inactivo") {
                        targetDriver.status = "Inactivo";
                        targetDriver.trips = 0; // Se detiene su conteo operativo
                    } else {
                        targetDriver.status = "Disponible";
                    }
                    updateTopSummaryStats();
                    renderDrivers();
                }
            });
        });

        // Botón Ver Historial Drawer Lateral
        document.querySelectorAll(".btn-incident-trigger, .table-act-btn.inc").forEach(btn => {
            btn.addEventListener("click", () => {
                const dId = btn.getAttribute("data-id");
                openIncidentsDrawer(dId);
            });
        });

        // Botón Editar Chofer (Carga datos en el modal principal)
        document.querySelectorAll(".btn-edit-trigger, .table-act-btn.edit").forEach(btn => {
            btn.addEventListener("click", () => {
                const dId = btn.getAttribute("data-id");
                openEditDriverModal(dId);
            });
        });

        // Botón Lanzar Modal de Eliminación Estilizado
        document.querySelectorAll(".btn-del-trigger, .table-act-btn.del").forEach(btn => {
            btn.addEventListener("click", () => {
                const dId = btn.getAttribute("data-id");
                openDeleteConfirmation(dId);
            });
        });
    }

    // 7. FUNCIONES ASOCIADAS A FILTROS E INPUTS
    mainSearchInput.addEventListener("input", renderDrivers);
    statusFilter.addEventListener("change", renderDrivers);
    routeFilter.addEventListener("change", renderDrivers);
    ratingFilter.addEventListener("change", renderDrivers);

    // Conmutador de Vistas (Cards vs Tabla)
    viewGridBtn.addEventListener("click", () => {
        activeViewMode = "grid";
        viewGridBtn.classList.add("active");
        viewListBtn.classList.remove("active");
        cardsViewContainer.classList.remove("hide");
        tableViewContainer.classList.add("hide");
    });

    viewListBtn.addEventListener("click", () => {
        activeViewMode = "list";
        viewListBtn.classList.add("active");
        viewGridBtn.classList.remove("active");
        cardsViewContainer.classList.add("hide");
        tableViewContainer.classList.remove("hide");
    });

    // 8. FLUJO COMPLETO DEL FORMULARIO MODAL (AGREGAR / EDITAR)
    openAddModalBtn.addEventListener("click", () => {
        modalTitle.innerText = "Registrar Nuevo Chofer";
        driverForm.reset();
        document.getElementById("formDriverId").value = "";
        
        // Reset preview imagen
        base64PhotoStr = "";
        avatarPreviewImg.src = "";
        avatarPreviewImg.classList.add("hide");
        avatarPreviewFallback.style.display = "flex";
        avatarPreviewFallback.innerText = "UP";
        
        driverModal.classList.add("open");
    });

    // Preview de foto en tiempo real mediante FileReader API
    driverPhotoInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert("El archivo excede el límite permitido de 2MB.");
                driverPhotoInput.value = "";
                return;
            }
            const reader = new FileReader();
            reader.onload = function(evt) {
                base64PhotoStr = evt.target.result;
                avatarPreviewImg.src = base64PhotoStr;
                avatarPreviewImg.classList.remove("hide");
                avatarPreviewFallback.style.display = "none";
            };
            reader.readAsDataURL(file);
        }
    });

    function openEditDriverModal(id) {
        const drv = driversDatabase.find(d => d.id === id);
        if (!drv) return;

        modalTitle.innerText = "Editar Parámetros del Chofer";
        document.getElementById("formDriverId").value = drv.id;
        document.getElementById("driverName").value = drv.name;
        document.getElementById("driverPhone").value = drv.phone;
        document.getElementById("driverEmail").value = drv.email;
        document.getElementById("driverLicencia").value = drv.licencia;
        document.getElementById("driverRuta").value = drv.rutaId;
        document.getElementById("driverTurno").value = drv.turno;
        document.getElementById("driverStatus").value = drv.status;
        document.getElementById("driverNotes").value = drv.notes || "";

        // Cargar foto en preview si existe
        if (drv.photo) {
            base64PhotoStr = drv.photo;
            avatarPreviewImg.src = drv.photo;
            avatarPreviewImg.classList.remove("hide");
            avatarPreviewFallback.style.display = "none";
        } else {
            base64PhotoStr = "";
            avatarPreviewImg.src = "";
            avatarPreviewImg.classList.add("hide");
            avatarPreviewFallback.style.display = "flex";
            avatarPreviewFallback.innerText = drv.name.substring(0,2).toUpperCase();
        }

        driverModal.classList.add("open");
    }

    const closeMainModal = () => { driverModal.classList.remove("open"); base64PhotoStr = ""; };
    closeModalBtn.addEventListener("click", closeMainModal);
    cancelFormBtn.addEventListener("click", closeMainModal);

    // Evento Submit de Guardado / Actualización con validaciones regex integradas
    driverForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const nameValue = document.getElementById("driverName").value.trim();
        const phoneValue = document.getElementById("driverPhone").value.trim();
        const emailValue = document.getElementById("driverEmail").value.trim();
        const licenciaValue = document.getElementById("driverLicencia").value.trim().toUpperCase();
        const rutaValue = document.getElementById("driverRuta").value;
        const turnoValue = document.getElementById("driverTurno").value;
        const statusValue = document.getElementById("driverStatus").value;
        const notesValue = document.getElementById("driverNotes").value.trim();
        const existingId = document.getElementById("formDriverId").value;

        // Validaciones Estrictas de Formato
        const phoneRegex = /^\+52\s6(68|67)-\d{3}-\d{4}$/;
        if (!phoneRegex.test(phoneValue)) {
            alert("Formato de teléfono inválido. Debe cumplir la lada de Sinaloa requerida: +52 668-XXX-XXXX o +52 667-XXX-XXXX");
            return;
        }

        const licRegex = /^LIC-\d{4}-\d{3}$/;
        if (!licRegex.test(licenciaValue)) {
            alert("Formato de licencia inválido. Debe seguir el patrón institucional de control: LIC-YYYY-NNN");
            return;
        }

        // Mapeo dinámico de horas según turno seleccionado
        let mappedHours = "06:00 - 14:00";
        if (turnoValue === "Vespertino") mappedHours = "14:00 - 22:00";
        else if (turnoValue === "Nocturno") mappedHours = "22:00 - 06:00";

        const targetCatalog = routeNamesCatalog[rutaValue];

        if (existingId === "") {
            // OPERACIÓN: AGREGAR CHOFER NUEVO
            const newId = `DRV-${String(driversDatabase.length + 1).padStart(3, '0')}`;
            const newDriverObj = {
                id: newId,
                name: nameValue,
                phone: phoneValue,
                email: emailValue,
                rutaId: rutaValue,
                rutaName: targetCatalog.name,
                trayecto: targetCatalog.trayecto,
                trips: statusValue === "En ruta" ? 1 : 0,
                licencia: licenciaValue,
                status: statusValue,
                rating: 5.0, // Inicia con puntuación limpia excelente
                punctuality: 100,
                turno: turnoValue,
                hours: mappedHours,
                daysWorked: "1/22",
                notes: notesValue,
                incidencias: [],
                photo: base64PhotoStr || `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 90)}.jpg`
            };
            driversDatabase.push(newDriverObj);
            
            // Render e iluminación selectiva de la nueva tarjeta agregada
            closeMainModal();
            updateTopSummaryStats();
            renderDrivers();
            
            setTimeout(() => {
                const elementHighlight = document.querySelector(`[data-id="${newId}"]`);
                if(elementHighlight) {
                    elementHighlight.style.outline = "3px solid var(--accent-purple-dark)";
                    setTimeout(() => elementHighlight.style.outline = "none", 2000);
                }
            }, 200);

        } else {
            // OPERACIÓN: EDITAR PARAMETROS CHOFER EXISTENTE
            const indexDriver = driversDatabase.findIndex(d => d.id === existingId);
            if (indexDriver !== -1) {
                driversDatabase[indexDriver].name = nameValue;
                driversDatabase[indexDriver].phone = phoneValue;
                driversDatabase[indexDriver].email = emailValue;
                driversDatabase[indexDriver].licencia = licenciaValue;
                driversDatabase[indexDriver].rutaId = rutaValue;
                driversDatabase[indexDriver].rutaName = targetCatalog.name;
                driversDatabase[indexDriver].trayecto = targetCatalog.trayecto;
                driversDatabase[indexDriver].turno = turnoValue;
                driversDatabase[indexDriver].hours = mappedHours;
                driversDatabase[indexDriver].status = statusValue;
                driversDatabase[indexDriver].notes = notesValue;
                if(base64PhotoStr) driversDatabase[indexDriver].photo = base64PhotoStr;

                closeMainModal();
                updateTopSummaryStats();
                renderDrivers();
            }
        }
    });

    // 9. FLUJO ELIMINAR CHOFER CON ANIMACIÓN FADEOUT
    function openDeleteConfirmation(id) {
        const drv = driversDatabase.find(d => d.id === id);
        if (!drv) return;
        driverIdToDelete = id;
        document.getElementById("deleteDriverNameTarget").innerText = drv.name;
        deleteConfirmModal.classList.add("open");
    }

    cancelDeleteBtn.addEventListener("click", () => { deleteConfirmModal.classList.remove("open"); driverIdToDelete = null; });

    confirmDeleteBtn.addEventListener("click", () => {
        if (driverIdToDelete) {
            const targetId = driverIdToDelete;
            deleteConfirmModal.classList.remove("open");

            // Ejecutar animación fadeOut en la interfaz antes de purgar los datos
            const cardNode = document.querySelector(`.driver-card[data-id="${targetId}"]`);
            if (cardNode) {
                cardNode.classList.add("fadeOut");
                setTimeout(() => {
                    driversDatabase = driversDatabase.filter(d => d.id !== targetId);
                    driverIdToDelete = null;
                    updateTopSummaryStats();
                    renderDrivers();
                }, 300);
            } else {
                driversDatabase = driversDatabase.filter(d => d.id !== targetId);
                driverIdToDelete = null;
                updateTopSummaryStats();
                renderDrivers();
            }
        }
    });

    // 10. TIMELINE DRAWER LATERAL: CONTROL DE INCIDENCIAS
    function openIncidentsDrawer(id) {
        const drv = driversDatabase.find(d => d.id === id);
        if (!drv) return;

        drawerDriverName.innerText = `${drv.name} — Código: ${drv.id}`;
        incidentCountBadge.innerText = `${drv.incidencias.length} incidencias`;
        incidentsTimelineContainer.innerHTML = "";

        if (drv.incidencias.length === 0) {
            incidentsTimelineContainer.innerHTML = `<div class="text-center" style="padding:40px 10px; color:var(--text-muted);">
                <i data-lucide="check-circle-2" style="width:36px; height:36px; color:var(--accent-green); margin:0 auto 10px auto; opacity:0.8;"></i>
                <p style="font-size:13px; font-weight:700;">Historial Limpio. Este chofer no cuenta con reportes o incidencias registradas en el servidor.</p>
            </div>`;
        } else {
            drv.incidencias.forEach(inc => {
                const isCritical = inc.tipo.toLowerCase() === "crítico";
                const node = document.createElement("div");
                node.className = `incident-node ${isCritical ? 'critico' : ''}`;
                node.innerHTML = `
                    <div class="incident-meta">
                        <span>Clasificación: <strong style="color:${isCritical ? 'var(--accent-danger)' : 'var(--accent-orange)'}">${inc.tipo}</strong></span>
                        <span>📅 ${inc.fecha}</span>
                    </div>
                    <div class="incident-desc">${inc.desc}</div>
                `;
                incidentsTimelineContainer.appendChild(node);
            });
        }

        if (window.lucide) lucide.createIcons();
        incidentsDrawer.classList.add("open");
    }

    closeDrawerBtn.addEventListener("click", () => incidentsDrawer.classList.remove("open"));

    // Inicializar Datos al Cargar
    updateTopSummaryStats();
    renderDrivers();
});