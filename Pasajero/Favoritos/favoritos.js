// Datos maestros de tus rutas registradas
const rutasMaster = [
    { id: 'L1', nombre: 'Centro - Aeropuerto', km: '18.5 km', tiempo: '45 min', trayecto: 'Plaza Central → Aeropuerto Internacional', color: '#3b82f6' },
    { id: 'L2', nombre: 'Sur - Universidad', km: '12.3 km', tiempo: '30 min', trayecto: 'Terminal Sur → Ciudad Universitaria', color: '#10b981' },
    { id: 'L3', nombre: 'Este - Zona Rosa', km: '9.7 km', tiempo: '25 min', trayecto: 'Terminal Este → Zona Rosa', color: '#f59e0b' },
    { id: 'L5', nombre: 'Norte - Costa', km: '22.1 km', tiempo: '55 min', trayecto: 'Terminal Norte → Playa del Sur', color: '#8b5cf6' },
    { id: 'L6', nombre: 'Hospital - Terminal Sur', km: '8.2 km', tiempo: '22 min', trayecto: 'Hospital General → Terminal Sur', color: '#ec4899' }
];

let favoritos = ['L1', 'L2']; // Ejemplo de rutas ya en favoritos

function renderLists() {
    const favList = document.getElementById('favList');
    const availableList = document.getElementById('availableList');
    
    favList.innerHTML = "";
    availableList.innerHTML = "";

    rutasMaster.forEach(ruta => {
        const isFav = favoritos.includes(ruta.id);
        
        const html = `
            <div class="fav-item" onclick="goToRoute('${ruta.id}')">
                <div class="fav-info-top">
                    <div class="route-badge" style="background:${ruta.color}">${ruta.id}</div>
                    <strong>${ruta.nombre}</strong>
                </div>
                <div class="fav-meta">
                    <span><i data-lucide="map-pin"></i> ${ruta.km}</span>
                    <span><i data-lucide="clock"></i> ${ruta.tiempo}</span>
                </div>
                <div class="fav-path">${ruta.trayecto}</div>
                ${isFav 
                    ? `<button class="fav-action" onclick="toggleFav(event, '${ruta.id}')"><i data-lucide="star"></i> Quitar de favoritos</button>`
                    : `<button class="add-btn" onclick="toggleFav(event, '${ruta.id}')"><i data-lucide="star"></i></button>`
                }
            </div>
        `;

        if (isFav) {
            favList.innerHTML += html;
        } else {
            availableList.innerHTML += html;
        }
    });

    document.getElementById('favCountText').innerText = `Mis Favoritas (${favoritos.length}/10)`;
    lucide.createIcons();
}

// Función para agregar/quitar (usa event.stopPropagation para que no se dispare el click del cuadro)
window.toggleFav = (event, id) => {
    event.stopPropagation();
    if (favoritos.includes(id)) {
        favoritos = favoritos.filter(fav => fav !== id);
    } else if (favoritos.length < 10) {
        favoritos.push(id);
    }
    renderLists();
};

// Redirección a la pestaña de rutas con el ID
window.goToRoute = (id) => {
    window.location.href = `../Rutas/rutas.html?id=${id}`;
};

document.addEventListener('DOMContentLoaded', renderLists);