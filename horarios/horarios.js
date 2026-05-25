document.addEventListener("DOMContentLoaded", () => {
    // DATA COMPLETA BASADA EN LA GRID ORIGINAL DE SALIDAS EN VIVO (Imagen 90429f.png)
    let scheduleDatabase = [
        { routeId: "L2", routeName: "Sur - Universidad", trayecto: "Terminal Sur ➔ C.U. UAS", start: "05:30", end: "06:00", driver: "Miguel Torres", licencia: "LIC-2020-045", status: "A tiempo" },
        { routeId: "L2", routeName: "Sur - Universidad", trayecto: "Terminal Sur ➔ C.U. UAS", start: "05:40", end: "06:10", driver: "Miguel Torres", licencia: "LIC-2020-045", status: "A tiempo" },
        { routeId: "L2", routeName: "Sur - Universidad", trayecto: "Terminal Sur ➔ C.U. UAS", start: "05:50", end: "06:20", driver: "Miguel Torres", licencia: "LIC-2020-045", status: "A tiempo" },
        { routeId: "L1", routeName: "Centro - Aeropuerto Topolobampo", trayecto: "Plaza Central ➔ El Macapule", start: "06:00", end: "06:45", driver: "Roberto Silva", licencia: "LIC-2019-001", status: "A tiempo" },
        { routeId: "L2", routeName: "Sur - Universidad", trayecto: "Terminal Sur ➔ C.U. UAS", start: "06:00", end: "06:30", driver: "Miguel Torres", licencia: "LIC-2020-045", status: "Cancelado" },
        { routeId: "L3", routeName: "Este - Zona Rosa", trayecto: "Terminal Centro ➔ Col. Toledo Corro", start: "06:10", end: "06:35", driver: "Luis Ramírez", licencia: "LIC-2018-112", status: "A tiempo" },
        { routeId: "L1", routeName: "Centro - Aeropuerto Topolobampo", trayecto: "Plaza Central ➔ El Macapule", start: "06:15", end: "07:00", driver: "Roberto Silva", licencia: "LIC-2019-001", status: "A tiempo" },
        { routeId: "L3", routeName: "Este - Zona Rosa", trayecto: "Terminal Centro ➔ Col. Toledo Corro", start: "06:22", end: "06:47", driver: "Luis Ramírez", licencia: "LIC-2018-112", status: "A tiempo" },
        { routeId: "L1", routeName: "Centro - Aeropuerto Topolobampo", trayecto: "Plaza Central ➔ El Macapule", start: "06:30", end: "07:15", driver: "Roberto Silva", licencia: "LIC-2019-001", status: "Retrasado" },
        { routeId: "L3", routeName: "Este - Zona Rosa", trayecto: "Terminal Centro ➔ Col. Toledo Corro", start: "06:34", end: "06:59", driver: "Luis Ramírez", licencia: "LIC-2018-112", status: "Retrasado" },
        { routeId: "L1", routeName: "Centro - Aeropuerto Topolobampo", trayecto: "Plaza Central ➔ El Macapule", start: "06:45", end: "07:30", driver: "Roberto Silva", licencia: "LIC-2019-001", status: "A tiempo" }
    ];

    // REFERENCIAS DEL DOM
    const scheduleCardsStack = document.getElementById("scheduleCardsStack");
    const chipsContainer = document.getElementById("chipsContainer");
    const resultsCounter = document.getElementById("resultsCounter");
    
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    const editScheduleModal = document.getElementById("editScheduleModal");
    const editScheduleForm = document.getElementById("editScheduleForm");

    let currentRouteFilter = "Todas";

    // 2. CONFIGURACIÓN DEL DARK MODE
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
        const lightLabel = themeToggleBtn?.querySelector(".light-label");
        const darkLabel = themeToggleBtn?.querySelector(".dark-label");
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

    // 3. RENDERIZACIÓN DE TARJETAS HORIZONTALES
    function renderScheduleCards() {
        if (!scheduleCardsStack) return;
        scheduleCardsStack.innerHTML = "";

        // Filtrado por Chip activo
        let filtered = scheduleDatabase.filter(item => {
            return currentRouteFilter === "Todas" || item.routeId === currentRouteFilter;
        });

        resultsCounter.innerText = `Mostrando ${filtered.length} de ${scheduleDatabase.length} salidas`;

        filtered.forEach((item, index) => {
            const card = document.createElement("div");
            card.className = "schedule-horizontal-card card";
            
            const initials = item.driver.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
            const statusClass = item.status.toLowerCase().replace(" ", "-");
            const routeClass = item.routeId.toLowerCase();

            card.innerHTML = `
                <div class="col-ruta route-profile-cell">
                    <div class="route-badge-circle ${routeClass}">${item.routeId}</div>
                    <div class="route-meta-text">
                        <strong>${item.routeName}</strong>
                        <span>${item.trayecto}</span>
                    </div>
                </div>

                <div class="col-horario time-connector-block">
                    <span>${item.start}</span>
                    <i data-lucide="arrow-right"></i>
                    <span>${item.end}</span>
                </div>

                <div class="col-chofer driver-profile-cell">
                    <div class="driver-fallback-avatar">${initials}</div>
                    <div class="driver-meta-text">
                        <strong>${item.driver}</strong>
                        <span>${item.licencia}</span>
                    </div>
                </div>

                <div class="col-text col-estado">
                    <span class="status-pill-badge ${statusClass}">${item.status}</span>
                </div>

                <div class="col-acciones actions-cell-inline">
                    <button class="action-minimal-btn edit-btn" data-index="${index}"><i data-lucide="edit-3" style="width:14px; height:14px;"></i></button>
                    <button class="action-minimal-btn report-btn" onclick="alert('Incidencia reportada con éxito para la ruta ${item.routeId}')"><i data-lucide="alert-triangle" style="width:14px; height:14px;"></i></button>
                </div>
            `;
            scheduleCardsStack.appendChild(card);
        });

        if (window.lucide) lucide.createIcons();
        attachCardEvents();
    }

    // INTERACTIVIDAD DE LOS BOTONES EDITAR
    function attachCardEvents() {
        document.querySelectorAll(".edit-btn").forEach(btn => {
            btn.onclick = () => {
                const idx = btn.getAttribute("data-index");
                document.getElementById("modalScheduleIndex").value = idx;
                document.getElementById("modalStatusSelect").value = scheduleDatabase[idx].status;
                editScheduleModal.classList.add("open");
            };
        });
    }

    editScheduleForm.onsubmit = (e) => {
        e.preventDefault();
        const idx = document.getElementById("modalScheduleIndex").value;
        scheduleDatabase[idx].status = document.getElementById("modalStatusSelect").value;
        editScheduleModal.classList.remove("open");
        renderScheduleCards();
    };

    document.getElementById("closeModalBtn").onclick = () => editScheduleModal.classList.remove("open");
    document.getElementById("btnCancelModal").onclick = () => editScheduleModal.classList.remove("open");

    // 4. FILTRADO CON CHIPS SUPERIORES
    if (chipsContainer) {
        const chips = chipsContainer.querySelectorAll(".chip-filter-btn");
        chips.forEach(chip => {
            chip.onclick = () => {
                chips.forEach(c => c.classList.remove("active"));
                chip.classList.add("active");
                currentRouteFilter = chip.getAttribute("data-route");
                renderScheduleCards();
            };
        });
    }

    // Inicializar
    renderScheduleCards();
});