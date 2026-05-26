/* panel del chofer - movilidad urbana
   aquí vive toda la talacha: cambiar de vista, el viaje, el turno y los reportes */

document.addEventListener("DOMContentLoaded", () => {

    // localStorage a prueba de balas (pa que no truene si el navegador anda de malitas)
    const store = {
        get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
        set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ni modo */ } }
    };

    // datos de mentiritas pa probar (al rato salen de la base de datos)
    const chofer = {
        nombre: store.get("nombreUsuario") || "Andrew Minyard",
        ruta: "L1 · Centro – Macapule",
        unidad: "#14",
        placas: "VHT-2841",
        licencia: "LIC-2019-001",
        calificacion: 4.8
    };

    const paradas = [
        { nombre: "Plaza Central (Zaragoza)", sub: "Punto de salida" },
        { nombre: "Blvd. Jiquilpan",          sub: "Parada intermedia" },
        { nombre: "Plaza Paseo",              sub: "Parada intermedia" },
        { nombre: "Col. Scally",              sub: "Parada intermedia" },
        { nombre: "Fracc. El Macapule",       sub: "Destino final" }
    ];

    const horariosHoy = [
        { id: 1, hora: "06:00 → 06:35", ruta: "Centro – Macapule", estado: "A tiempo" },
        { id: 2, hora: "07:15 → 07:50", ruta: "Macapule – Centro", estado: "A tiempo" },
        { id: 3, hora: "09:30 → 10:05", ruta: "Centro – Macapule", estado: "Retrasado" },
        { id: 4, hora: "11:45 → 12:20", ruta: "Macapule – Centro", estado: "A tiempo" },
        { id: 5, hora: "13:00 → 13:35", ruta: "Centro – Macapule", estado: "A tiempo" }
    ];

    // cómo anda todo ahorita
    const estado = {
        vista: "inicio",
        viajeIniciado: false,
        viajePausado: false,
        paradaActual: 0,
        turnoActivo: false,
        horaInicioTurno: null,
        tipoIncidencia: null
    };

    // agarramos lo del html
    const contentArea = document.getElementById("contentArea");
    const headerTitle = document.getElementById("headerTitle");
    const navItems = document.querySelectorAll(".nav-menu .nav-item[data-view]");

    // ponemos el nombre y sacamos las inicialitas pal avatar
    const iniciales = chofer.nombre.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();
    document.getElementById("profileName").textContent = chofer.nombre;
    document.getElementById("profileNameFull").textContent = chofer.nombre;
    document.getElementById("profileAvatar").textContent = iniciales;

    const TITULOS = {
        inicio:   "Inicio",
        ruta:     "Mi Ruta",
        horario:  "Horario",
        turno:    "Mi Turno",
        reportar: "Reportar"
    };

    // ===== aquí se arma cada pantallita =====
    function viewInicio() {
        const trips = horariosHoy.slice(0, 3).map(h => `
            <div class="schedule-row">
                <div class="trip-meta">
                    <div class="trip-index">${h.id}</div>
                    <div>
                        <div class="trip-time">${h.hora}</div>
                        <div class="trip-route">${h.ruta}</div>
                    </div>
                </div>
                <span class="status-pill ${pillClass(h.estado)}">${h.estado}</span>
            </div>`).join("");

        return `
        <div class="view active">
            <section class="hero-section">
                <div class="welcome-block">
                    <span class="welcome-top-text">¡Buen turno,</span>
                    <h2>${chofer.nombre.split(" ")[0]}!</h2>
                    <span class="rating"><i data-lucide="star"></i> ${chofer.calificacion} · ${chofer.ruta}</span>
                </div>
                <div class="hero-stats">
                    <div class="hero-stat-card">
                        <span class="hero-stat-label">Viajes hoy</span>
                        <div class="hero-stat-value">3<span class="hero-stat-sub">/5</span></div>
                    </div>
                    <div class="hero-stat-card">
                        <span class="hero-stat-label">Puntualidad</span>
                        <div class="hero-stat-value">92%</div>
                    </div>
                </div>
            </section>

            <section class="stats-grid">
                <div class="stat-card">
                    <div class="stat-card-icon bg-purple"><i data-lucide="route"></i></div>
                    <div class="stat-card-info"><h3>3/5</h3><p>Viajes completados</p></div>
                </div>
                <div class="stat-card">
                    <div class="stat-card-icon bg-green"><i data-lucide="users"></i></div>
                    <div class="stat-card-info"><h3>148</h3><p>Pasajeros hoy</p></div>
                </div>
                <div class="stat-card">
                    <div class="stat-card-icon bg-blue"><i data-lucide="gauge"></i></div>
                    <div class="stat-card-info"><h3>67 km</h3><p>Recorrido</p></div>
                </div>
                <div class="stat-card">
                    <div class="stat-card-icon bg-lime"><i data-lucide="timer"></i></div>
                    <div class="stat-card-info"><h3>92%</h3><p>Puntualidad</p></div>
                </div>
            </section>

            <section class="split-grid">
                <div class="card lift">
                    <div class="route-banner">
                        <div class="route-line-badge">L1</div>
                        <div class="route-banner-text">
                            <h3>Centro – Macapule</h3>
                            <p><i data-lucide="map-pin"></i> ${paradas[0].nombre} → ${paradas[paradas.length-1].nombre}</p>
                        </div>
                    </div>
                    <div class="route-meta-row">
                        <div class="meta-item"><i data-lucide="clock"></i><strong>35 min</strong><span>Duración</span></div>
                        <div class="meta-item"><i data-lucide="milestone"></i><strong>11.2 km</strong><span>Distancia</span></div>
                        <div class="meta-item"><i data-lucide="map-pin"></i><strong>${paradas.length}</strong><span>Paradas</span></div>
                    </div>
                    <button class="btn btn-primary" data-action="ir-ruta">
                        <i data-lucide="navigation"></i> ${estado.viajeIniciado ? "Continuar viaje" : "Iniciar viaje"}
                    </button>
                </div>

                <div class="card lift">
                    <div class="card-header-container">
                        <h3>Próximos viajes</h3>
                        <button class="manage-link" data-view="horario">Ver horario <i data-lucide="arrow-right"></i></button>
                    </div>
                    ${trips}
                </div>
            </section>
        </div>`;
    }

    function viewRuta() {
        // si todavía no arranca, mostramos la pantalla de "ándale, dale play"
        if (!estado.viajeIniciado) {
            return `
            <div class="view active">
                <div class="card lift" style="max-width:680px;">
                    <div class="route-banner">
                        <div class="route-line-badge">L1</div>
                        <div class="route-banner-text">
                            <h3>Centro – Macapule</h3>
                            <p><i data-lucide="map-pin"></i> ${paradas[0].nombre} → ${paradas[paradas.length-1].nombre}</p>
                        </div>
                    </div>
                    <div class="route-meta-row">
                        <div class="meta-item"><i data-lucide="clock"></i><strong>35 min</strong><span>Duración</span></div>
                        <div class="meta-item"><i data-lucide="milestone"></i><strong>11.2 km</strong><span>Distancia</span></div>
                        <div class="meta-item"><i data-lucide="map-pin"></i><strong>${paradas.length}</strong><span>Paradas</span></div>
                    </div>
                    <p style="color:var(--text-muted); font-weight:600; font-size:14px; margin-bottom:18px;">
                        Cuando estés listo en la base, inicia el viaje para registrar tu salida y empezar a marcar paradas.
                    </p>
                    <button class="btn btn-success" style="width:100%;" data-action="iniciar">
                        <i data-lucide="play"></i> Iniciar viaje
                    </button>
                </div>
            </div>`;
        }

        // ya en marcha: sacamos el progreso y cuál sigue
        const total = paradas.length - 1;
        const progreso = Math.round((estado.paradaActual / total) * 100);
        const proxima = paradas[estado.paradaActual + 1] || paradas[paradas.length - 1];
        const enDestino = estado.paradaActual >= total;

        const timeline = paradas.map((p, i) => {
            let cls = "";
            let icon = "";
            if (i < estado.paradaActual) { cls = "done"; icon = '<i data-lucide="check"></i>'; }
            else if (i === estado.paradaActual) { cls = "current"; }
            return `
                <div class="stop-node ${cls}">
                    <div class="stop-dot">${icon}</div>
                    <div class="stop-info">
                        <div class="stop-name">${p.nombre}</div>
                        <div class="stop-sub">${p.sub}</div>
                    </div>
                </div>`;
        }).join("");

        return `
        <div class="view active">
            <section class="split-grid">
                <div class="card lift">
                    <div class="route-banner">
                        <div class="route-line-badge">L1</div>
                        <div class="route-banner-text">
                            <h3>Centro – Macapule</h3>
                            <p><i data-lucide="activity"></i> Viaje ${estado.viajePausado ? "en pausa" : "en curso"}</p>
                        </div>
                    </div>

                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width:${progreso}%"></div>
                    </div>
                    <div class="progress-endpoints">
                        <span>${paradas[0].nombre}</span>
                        <span>${progreso}%</span>
                        <span>${paradas[paradas.length-1].nombre}</span>
                    </div>

                    <div class="next-stop-box">
                        <div class="pulse"><i data-lucide="navigation"></i></div>
                        <div>
                            <div class="label">${enDestino ? "Estado" : "Próxima parada"}</div>
                            <strong>${enDestino ? "Llegaste al destino final" : proxima.nombre}</strong>
                        </div>
                    </div>

                    <div class="btn-row">
                        <button class="btn ${estado.viajePausado ? "btn-success" : "btn-warning"}" data-action="pausar">
                            <i data-lucide="${estado.viajePausado ? "play" : "pause"}"></i> ${estado.viajePausado ? "Reanudar" : "Pausar"}
                        </button>
                        <button class="btn ${enDestino ? "btn-danger" : "btn-ghost"}" data-action="siguiente">
                            <i data-lucide="${enDestino ? "flag" : "skip-forward"}"></i> ${enDestino ? "Finalizar" : "Siguiente parada"}
                        </button>
                    </div>
                </div>

                <div class="card lift">
                    <div class="card-header-container">
                        <h3>Paradas del recorrido</h3>
                        <span class="status-pill success">${estado.paradaActual}/${total} completadas</span>
                    </div>
                    <div class="stops-timeline">${timeline}</div>
                </div>
            </section>
        </div>`;
    }

    function viewHorario() {
        const lista = horariosHoy.map(h => `
            <div class="schedule-row">
                <div class="trip-meta">
                    <div class="trip-index">${h.id}</div>
                    <div>
                        <div class="trip-time">${h.hora}</div>
                        <div class="trip-route">${h.ruta}</div>
                    </div>
                </div>
                <span class="status-pill ${pillClass(h.estado)}">${h.estado}</span>
            </div>`).join("");

        const aTiempo = horariosHoy.filter(h => h.estado === "A tiempo").length;
        const retraso = horariosHoy.filter(h => h.estado === "Retrasado").length;
        const cancel = horariosHoy.filter(h => h.estado === "Cancelado").length;

        return `
        <div class="view active">
            <section class="card lift">
                <div class="mini-stats">
                    <div class="mini-stat ok"><div class="num">${aTiempo}</div><div class="lbl">A tiempo</div></div>
                    <div class="mini-stat late"><div class="num">${retraso}</div><div class="lbl">Retrasados</div></div>
                    <div class="mini-stat cancel"><div class="num">${cancel}</div><div class="lbl">Cancelados</div></div>
                </div>
            </section>

            <section class="split-grid">
                <div class="card lift">
                    <div class="card-header-container">
                        <h3>Viajes programados hoy</h3>
                        <span class="status-pill success">${horariosHoy.length} viajes</span>
                    </div>
                    ${lista}
                </div>

                <div class="unit-card">
                    <h4><i data-lucide="bus"></i> Información de la unidad</h4>
                    <div class="unit-grid">
                        <div class="u-item"><p>Ruta asignada</p><strong>${chofer.ruta}</strong></div>
                        <div class="u-item"><p>Unidad</p><strong>${chofer.unidad}</strong></div>
                        <div class="u-item"><p>Placas</p><strong>${chofer.placas}</strong></div>
                        <div class="u-item"><p>Licencia</p><strong>${chofer.licencia}</strong></div>
                    </div>
                </div>
            </section>
        </div>`;
    }

    function viewTurno() {
        const horaTexto = estado.horaInicioTurno
            ? estado.horaInicioTurno.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })
            : "—";

        return `
        <div class="view active">
            <section class="split-grid">
                <div class="card lift">
                    <div class="shift-status ${estado.turnoActivo ? "on" : "off"}">
                        <div class="dot"></div>
                        <div>
                            <div class="st-title">${estado.turnoActivo ? "Turno activo" : "Turno no iniciado"}</div>
                            <div class="st-sub">${estado.turnoActivo ? "Inicio: " + horaTexto + " · Unidad " + chofer.unidad : "Inicia tu turno para registrar tu jornada"}</div>
                        </div>
                    </div>

                    ${estado.turnoActivo
                        ? `<button class="btn btn-danger" style="width:100%;" data-action="fin-turno"><i data-lucide="power"></i> Finalizar turno</button>`
                        : `<button class="btn btn-success" style="width:100%;" data-action="inicio-turno"><i data-lucide="power"></i> Iniciar turno</button>`}
                </div>

                <div class="card lift">
                    <h3 style="margin-bottom:8px;">Detalles del chofer</h3>
                    <div class="info-row"><span class="k"><i data-lucide="user"></i> Nombre</span><span class="v">${chofer.nombre}</span></div>
                    <div class="info-row"><span class="k"><i data-lucide="route"></i> Ruta</span><span class="v">${chofer.ruta}</span></div>
                    <div class="info-row"><span class="k"><i data-lucide="bus"></i> Unidad</span><span class="v">${chofer.unidad}</span></div>
                    <div class="info-row"><span class="k"><i data-lucide="hash"></i> Placas</span><span class="v">${chofer.placas}</span></div>
                    <div class="info-row"><span class="k"><i data-lucide="id-card"></i> Licencia</span><span class="v">${chofer.licencia}</span></div>
                    <div class="info-row"><span class="k"><i data-lucide="star"></i> Calificación</span><span class="v">${chofer.calificacion} / 5.0</span></div>
                </div>
            </section>

            <section class="card lift">
                <h3 style="margin-bottom:16px;">Estado del sistema</h3>
                <div class="alert-list">
                    <div class="alert-box success-box"><i data-lucide="check-circle-2"></i><div>Combustible y revisión mecánica al corriente.</div></div>
                    <div class="alert-box warning-box"><i data-lucide="clock"></i><div>Tráfico moderado sobre Blvd. Jiquilpan en horas pico.</div></div>
                    <div class="alert-box danger-box"><i data-lucide="alert-circle"></i><div>Desvío temporal en Col. Scally por obra vial.</div></div>
                </div>
            </section>
        </div>`;
    }

    function viewReportar() {
        const tipos = [
            { id: "averia",    txt: "Avería mecánica",        icon: "wrench" },
            { id: "trafico",   txt: "Tráfico / retraso",      icon: "traffic-cone" },
            { id: "incidente", txt: "Incidente con pasajero", icon: "users" },
            { id: "accidente", txt: "Accidente",              icon: "alert-triangle" },
            { id: "otro",      txt: "Otro",                   icon: "more-horizontal" }
        ];

        const chips = tipos.map(t => `
            <button type="button" class="chip" data-tipo="${t.id}">
                <i data-lucide="${t.icon}"></i> ${t.txt}
            </button>`).join("");

        return `
        <div class="view active">
            <section class="card lift" style="max-width:720px;">
                <div class="card-header-container">
                    <h3>Reportar una incidencia</h3>
                    <span class="status-pill warning">En tu ruta</span>
                </div>

                <form id="reporteForm">
                    <div class="form-group">
                        <label><i data-lucide="tag"></i> Tipo de incidencia</label>
                        <div class="chip-row" id="chipRow">${chips}</div>
                    </div>

                    <div class="form-group">
                        <label for="ubicacion"><i data-lucide="map-pin"></i> Ubicación aproximada</label>
                        <input type="text" id="ubicacion" class="form-control" placeholder="Ej. Blvd. Jiquilpan y Plaza Paseo">
                    </div>

                    <div class="form-group">
                        <label for="descripcion"><i data-lucide="file-text"></i> Descripción</label>
                        <textarea id="descripcion" class="form-control" placeholder="Cuéntanos qué está pasando..."></textarea>
                    </div>

                    <button type="submit" class="btn btn-primary"><i data-lucide="send"></i> Enviar reporte</button>
                </form>
            </section>
        </div>`;
    }

    // pinta la pastillita de color según cómo venga el viaje
    function pillClass(estadoTxt) {
        if (estadoTxt === "Retrasado") return "warning";
        if (estadoTxt === "Cancelado") return "danger";
        return "success";
    }

    const PLANTILLAS = {
        inicio: viewInicio,
        ruta: viewRuta,
        horario: viewHorario,
        turno: viewTurno,
        reportar: viewReportar
    };

    // pone la vista en pantalla y vuelve a conectar los botones (porque se regenera el html)
    function render() {
        contentArea.innerHTML = PLANTILLAS[estado.vista]();
        headerTitle.textContent = TITULOS[estado.vista];
        navItems.forEach(n => n.classList.toggle("active", n.dataset.view === estado.vista));
        wireContentActions();
        lucide.createIcons();
    }

    // le ponemos oído a todo lo que se puede picar dentro del contenido
    function wireContentActions() {
        contentArea.querySelectorAll("[data-action]").forEach(btn => {
            btn.addEventListener("click", () => manejarAccion(btn.dataset.action));
        });

        contentArea.querySelectorAll("[data-view]").forEach(el => {
            el.addEventListener("click", (e) => {
                e.preventDefault();
                cambiarVista(el.dataset.view);
            });
        });

        const chipRow = document.getElementById("chipRow");
        if (chipRow) {
            chipRow.querySelectorAll(".chip").forEach(chip => {
                chip.addEventListener("click", () => {
                    chipRow.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
                    chip.classList.add("active");
                    estado.tipoIncidencia = chip.dataset.tipo;
                });
            });
        }

        const reporteForm = document.getElementById("reporteForm");
        if (reporteForm) {
            reporteForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const desc = document.getElementById("descripcion").value.trim();
                if (!estado.tipoIncidencia) { alert("Pícale al tipo de incidencia primero 👀"); return; }
                if (!desc) { alert("Escribe aunque sea un poquito de qué pasó."); return; }
                alert("✅ Reporte enviado al centro de control. ¡Gracias!");
                reporteForm.reset();
                estado.tipoIncidencia = null;
                cambiarVista("inicio");
            });
        }
    }

    // qué hace cada botón cuando le pican
    function manejarAccion(accion) {
        switch (accion) {
            case "ir-ruta":
                cambiarVista("ruta");
                break;
            case "iniciar":
                estado.viajeIniciado = true;
                estado.viajePausado = false;
                estado.paradaActual = 0;
                if (!estado.turnoActivo) { estado.turnoActivo = true; estado.horaInicioTurno = new Date(); }
                render();
                break;
            case "pausar":
                estado.viajePausado = !estado.viajePausado;
                render();
                break;
            case "siguiente":
                if (estado.paradaActual < paradas.length - 1) {
                    estado.paradaActual++;
                    render();
                } else {
                    alert("🏁 ¡Recorrido terminado, buen trabajo!");
                    estado.viajeIniciado = false;
                    estado.viajePausado = false;
                    estado.paradaActual = 0;
                    cambiarVista("inicio");
                }
                break;
            case "inicio-turno":
                estado.turnoActivo = true;
                estado.horaInicioTurno = new Date();
                render();
                break;
            case "fin-turno":
                if (confirm("¿Le damos por terminado el turno de hoy?")) {
                    estado.turnoActivo = false;
                    estado.horaInicioTurno = null;
                    estado.viajeIniciado = false;
                    estado.paradaActual = 0;
                    render();
                }
                break;
        }
    }

    function cambiarVista(vista) {
        if (!PLANTILLAS[vista]) return;
        estado.vista = vista;
        cerrarDropdowns();
        render();
    }

    // los botones del menú de la izquierda
    navItems.forEach(item => {
        item.addEventListener("click", () => cambiarVista(item.dataset.view));
    });

    // modo oscuro pa descansar los ojitos (igualito al resto del sistema)
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    const lightLabel = themeToggleBtn.querySelector(".light-label");
    const darkLabel = themeToggleBtn.querySelector(".dark-label");

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

    if (store.get("theme") === "dark") {
        document.body.classList.add("dark-mode");
        syncThemeToggleUI(true);
    } else {
        syncThemeToggleUI(false);
    }

    themeToggleBtn.addEventListener("click", () => {
        const isDarkNow = document.body.classList.toggle("dark-mode");
        store.set("theme", isDarkNow ? "dark" : "light");
        syncThemeToggleUI(isDarkNow);
    });

    // los menucitos que se abren (campana y perfil)
    const bellBtn = document.getElementById("bellBtn");
    const notificationDropdown = document.getElementById("notificationDropdown");
    const profileBtn = document.getElementById("profileBtn");
    const profileDropdown = document.getElementById("profileDropdown");

    function cerrarDropdowns() {
        notificationDropdown.classList.remove("show");
        profileDropdown.classList.remove("show");
    }

    bellBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        profileDropdown.classList.remove("show");
        notificationDropdown.classList.toggle("show");
    });

    profileBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        notificationDropdown.classList.remove("show");
        profileDropdown.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
        if (!e.target.closest("#notificationMenuWrapper")) notificationDropdown.classList.remove("show");
        if (!e.target.closest("#profileMenuWrapper")) profileDropdown.classList.remove("show");
    });

    profileDropdown.querySelectorAll("[data-view]").forEach(el => {
        el.addEventListener("click", (e) => {
            e.preventDefault();
            cambiarVista(el.dataset.view);
        });
    });

    // chau, nos regresamos al login
    function cerrarSesion(e) {
        if (e) e.preventDefault();
        if (confirm("¿Seguro que quieres cerrar sesión?")) {
            window.location.href = "../LOGIN/Login.html";
        }
    }
    document.getElementById("logoutBtn").addEventListener("click", cerrarSesion);
    document.getElementById("logoutBtn2").addEventListener("click", cerrarSesion);

    // ¡y arrancamos!
    render();
    lucide.createIcons();
});
