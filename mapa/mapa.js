// CONFIGURACIÓN DE RUTAS Y COORDENADAS
const LOS_MOCHIS_COORD = [25.7911, -108.9867];

const ROUTES_DATA = [
    {
        id: 'L1',
        name: 'Centro - Aeropuerto',
        color: '#7c6fcd',
        stops: 7,
        time: '45 min',
        status: 'En ruta',
        path: [
            [25.7911, -108.9867], // Centro
            [25.7890, -108.9920], // Mercado Independencia
            [25.7750, -108.9780], // Hospital General
            [25.7541, -109.0502]  // Aeropuerto
        ],
        driver: 'Juan Pérez'
    },
    {
        id: 'L2',
        name: 'Sur - Universidad (UAS)',
        color: '#4ade80',
        stops: 5,
        time: '30 min',
        status: '',
        path: [
            [25.7911, -108.9867],
            [25.7820, -108.9650], // Zona Rosa
            [25.8043, -108.9812]  // UAS
        ],
        driver: 'Pedro Soto'
    },
    {
        id: 'L3',
        name: 'Este - Zona Rosa',
        color: '#f59e0b',
        stops: 5,
        time: '25 min',
        status: 'En ruta',
        path: [
            [25.7911, -108.9867],
            [25.7890, -108.9920],
            [25.7820, -108.9650]
        ],
        driver: 'Luis Romero'
    },
    {
        id: 'L4',
        name: 'Norte - Costa',
        color: '#60a5fa',
        stops: 6,
        time: '55 min',
        status: '',
        path: [
            [25.7911, -108.9867],
            [25.8050, -108.9950],
            [25.8150, -108.9900] // Norte Universitarios
        ],
        driver: 'Carlos Ruíz'
    }
];

// INICIALIZACIÓN DEL MAPA
let map = L.map('map', { zoomControl: false }).setView(LOS_MOCHIS_COORD, 14);

// CAPAS DE MAPA (TILES)
const lightTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
});

const darkTiles = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
    attribution: '© Stadia Maps'
});

lightTiles.addTo(map);

// GRUPOS DE CAPAS
let routeLayers = L.layerGroup().addTo(map);
let busMarkersGroup = L.layerGroup().addTo(map);
let stopsGroup = L.layerGroup().addTo(map);

// FUNCIÓN PARA DIBUJAR RUTAS
function drawRoutes() {
    const listContainer = document.getElementById('routesList');
    if (!listContainer) return;
    listContainer.innerHTML = ""; // Limpiar contenedor
    
    ROUTES_DATA.forEach(route => {
        // 1. Dibujar Polyline
        let polyline = L.polyline(route.path, {
            color: route.color,
            weight: 5,
            opacity: 0.7,
            dashArray: '10, 10'
        }).addTo(routeLayers);

        // 2. Dibujar Paradas (Círculos)
        route.path.forEach(coord => {
            L.circleMarker(coord, {
                radius: 6,
                fillColor: 'white',
                color: route.color,
                weight: 2,
                opacity: 1,
                fillOpacity: 1
            }).addTo(stopsGroup).bindPopup(`Parada de la ruta: ${route.name}`);
        });

        // 3. Crear Item en el Panel Derecho
        const routeItem = document.createElement('div');
        routeItem.className = 'route-item';
        routeItem.innerHTML = `
            <div class="route-badge" style="background: ${route.color}">${route.id}</div>
            <div class="route-info">
                <span class="route-name">${route.name}</span>
                <div class="route-meta">
                    <span>📍 ${route.stops} paradas</span>
                    <span>${route.time}</span>
                </div>
            </div>
            ${route.status ? `<span class="status-badge">${route.status}</span>` : ''}
        `;
        
        routeItem.onclick = () => {
            map.flyTo(route.path[0], 15);
            polyline.setStyle({ opacity: 1, weight: 8 });
            setTimeout(() => polyline.setStyle({ opacity: 0.7, weight: 5 }), 2000);
        };
        
        listContainer.appendChild(routeItem);
    });
}

// SIMULACIÓN DE MOVIMIENTO DE AUTOBUSES
function initBusSimulation() {
    busMarkersGroup.clearLayers(); // Limpiar marcadores previos
    const buses = [
        { routeId: 'L1', driver: 'Juan Pérez', index: 0 },
        { routeId: 'L3', driver: 'Luis Romero', index: 0 }
    ];

    buses.forEach(busInfo => {
        const route = ROUTES_DATA.find(r => r.id === busInfo.routeId);
        const icon = L.divIcon({
            html: '🚌',
            className: 'bus-marker',
            iconSize: [30, 30]
        });

        let marker = L.marker(route.path[0], { icon: icon }).addTo(busMarkersGroup);
        marker.bindPopup(`
            <strong>Chofer:</strong> ${busInfo.driver}<br>
            <strong>Ruta:</strong> ${route.name}<br>
            <strong>Estado:</strong> <span style="color:green">En movimiento</span>
        `);

        let step = 0;
        setInterval(() => {
            step = (step + 1) % route.path.length;
            marker.setLatLng(route.path[step]);
        }, 5000);
    });
}

// INTERACTIVIDAD DE LA INTERFAZ
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar iconos de Lucide cargados en el HTML
    if (window.lucide) lucide.createIcons();
    drawRoutes();
    initBusSimulation();

    // ELEMENTOS SELECCIONADOS DE LA CABECERA (Declarados una sola vez)
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const lightLabel = themeToggleBtn ? themeToggleBtn.querySelector('.light-label') : null;
    const darkLabel = themeToggleBtn ? themeToggleBtn.querySelector('.dark-label') : null;
    
    const bellBtn = document.getElementById('bellBtn');
    const notificationDropdown = document.getElementById('notificationDropdown');
    
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    const logoutButtons = document.querySelectorAll('.logout-btn');

    // Restablecer tema preferido guardado de la sesión anterior
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        updateThemeToggleUI(true);
        map.removeLayer(lightTiles);
        darkTiles.addTo(map);
    }

    // INTERRUPTOR DE MODO OSCURO / CLARO DEL MAPA Y CABECERA
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            const isDarkNow = document.body.classList.toggle('dark-mode');
            localStorage.setItem("theme", isDarkNow ? "dark" : "light");
            updateThemeToggleUI(isDarkNow);
            
            if (isDarkNow) {
                map.removeLayer(lightTiles);
                darkTiles.addTo(map);
            } else {
                map.removeLayer(darkTiles);
                lightTiles.addTo(map);
            }
        });
    }

    function updateThemeToggleUI(isDark) {
        if (!lightLabel || !darkLabel) return;
        if (isDark) {
            lightLabel.classList.remove('active');
            lightLabel.innerHTML = '<i data-lucide="sun"></i>';
            darkLabel.classList.add('active');
            darkLabel.innerHTML = '<i data-lucide="moon"></i> Dark';
        } else {
            darkLabel.classList.remove('active');
            darkLabel.innerHTML = '<i data-lucide="moon"></i>';
            lightLabel.classList.add('active');
            lightLabel.innerHTML = '<i data-lucide="sun"></i> Light';
        }
        if (window.lucide) lucide.createIcons(); 
    }

    // CONTROL DESPLEGABLE DE NOTIFICACIONES
    if (bellBtn && notificationDropdown) {
        bellBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (profileDropdown) profileDropdown.classList.remove('show');
            notificationDropdown.classList.toggle('show');
        });
    }

    // CONTROL DESPLEGABLE DE PERFIL
    if (profileBtn && profileDropdown) {
        profileBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (notificationDropdown) notificationDropdown.classList.remove('show');
            profileDropdown.classList.toggle('show');
        });
    }

    // CERRAR DROPDOWNS AUTOMÁTICAMENTE AL HACER CLIC FUERA
    document.addEventListener('click', (e) => {
        if (notificationDropdown && !document.getElementById('notificationMenuWrapper')?.contains(e.target)) {
            notificationDropdown.classList.remove('show');
        }
        if (profileDropdown && !document.getElementById('profileMenuWrapper')?.contains(e.target)) {
            profileDropdown.classList.remove('show');
        }
    });

    // Ocultar/Mostrar autobuses en Leaflet
    const toggleBusesBtn = document.getElementById('toggleBusesBtn');
    if (toggleBusesBtn) {
        toggleBusesBtn.onclick = function() {
            if (map.hasLayer(busMarkersGroup)) {
                map.removeLayer(busMarkersGroup);
                this.style.opacity = '0.5';
            } else {
                busMarkersGroup.addTo(map);
                this.style.opacity = '1';
            }
        };
    }

    // Confirmación segura de salida común
    logoutButtons.forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            if (confirm('¿Está seguro de que desea cerrar la sesión de encargado de movilidad?')) {
                window.location.href = '../login/login.html';
            }
        };
    });
    
    // Simulación nativa de pantalla completa en contenedor card del mapa
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (fullscreenBtn) {
        fullscreenBtn.onclick = () => {
            const mapCard = document.querySelector('.map-card');
            if (mapCard) mapCard.classList.toggle('fullscreen-sim');
            map.invalidateSize();
        };
    }
});