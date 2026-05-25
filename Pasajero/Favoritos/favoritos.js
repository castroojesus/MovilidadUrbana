document.addEventListener("DOMContentLoaded", () => {
    // 1. ARREGLO MAESTRO COPIADO EXACTAMENTE DE RUTAS.JS
    const rutasMaster = [
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

    let favoritos = ['L1', 'L2']; // Ejemplo de rutas ya seleccionadas como favoritas
    const designClasses = ["event-purple", "event-lime", "event-slate"];

    // 2. REFERENCIAS GENERALES DEL DOM
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    const lightLabel = themeToggleBtn.querySelector(".light-label");
    const darkLabel = themeToggleBtn.querySelector(".dark-label");
    const bellBtn = document.getElementById("bellBtn");
    const notificationDropdown = document.getElementById("notificationDropdown");
    const logoutBtn = document.getElementById("logoutBtn");

    const favList = document.getElementById('favList');
    const availableList = document.getElementById('availableList');

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

    // 4. RENDERIZADO REACTIVO DE LISTAS TIPO BLOQUES DE EVENTO DEL PLANIFICADOR
    function renderLists() {
        favList.innerHTML = "";
        availableList.innerHTML = "";

        rutasMaster.forEach((ruta, index) => {
            const isFav = favoritos.includes(ruta.id);
            const cardDesign = designClasses[index % designClasses.length];
            
            const html = `
                <div class="schedule-card-item ${cardDesign}">
                    <div class="schedule-card-badge">${ruta.id}</div>
                    <div class="schedule-card-body">
                        <strong>${ruta.name}</strong>
                        <p class="trayecto-text"><i data-lucide=\"map-pin\"></i> ${ruta.trayecto}</p>
                        <div class="meta-row">
                            <span><i data-lucide=\"navigation\"></i> Distancia: ${ruta.km} km</span>
                            <span><i data-lucide=\"clock\"></i> Duración: ${ruta.time} min</span>
                        </div>
                    </div>
                    ${isFav 
                        ? `<button class="fav-action fill-star" onclick="toggleFav(event, '${ruta.id}')" title="Quitar de favoritos"><i data-lucide="star"></i></button>`
                        : `<button class="fav-action" onclick="toggleFav(event, '${ruta.id}')" title="Agregar a favoritos"><i data-lucide="star"></i></button>`
                    }
                </div>
            `;

            if (isFav) {
                favList.innerHTML += html;
            } else {
                availableList.innerHTML += html;
            }
        });

        // Estado vacío por si quitas todas de tus favoritos
        if (favoritos.length === 0) {
            favList.innerHTML = `
                <div class="empty-state-message">
                    <i data-lucide="star-off" style="color: var(--text-muted);"></i>
                    <p>No tienes rutas guardadas como favoritas actualmente.</p>
                </div>`;
        }

        document.getElementById('favCountText').innerText = `Mis Favoritas (${favoritos.length}/10)`;
        lucide.createIcons();
    }

    // Función global controladora para agregar y quitar de favoritos
    window.toggleFav = (event, id) => {
        event.stopPropagation();
        if (favoritos.includes(id)) {
            favoritos = favoritos.filter(fav => fav !== id);
        } else if (favoritos.length < 10) {
            favoritos.push(id);
        }
        renderLists();
    };

    // 5. NOTIFICACIONES Y LOGOUT CONTROLS
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

    // Inicializar renders primarios
    renderLists();
});