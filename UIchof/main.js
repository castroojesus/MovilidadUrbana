// datos sukulentos
const paradas = ["Plaza Central", "Hospital General", "Centro Comercial", "Terminal Norte", "Aeropuerto Internacional"];
const horariosHoy = [
    { id: 1, hora: "06:00 -> 06:45", estado: "A tiempo" },
    { id: 2, hora: "06:15 -> 07:00", estado: "A tiempo" },
    { id: 3, hora: "06:30 -> 07:15", estado: "Retrasado" },
    { id: 4, hora: "06:45 -> 07:30", estado: "A tiempo" },
    { id: 5, hora: "07:00 -> 07:45", estado: "A tiempo" }
];

// estado
let paradaActualIndex = 0;
let viajeIniciado = false;

// elementos del dom 
const contentArea = document.getElementById('content-area');
const headerTitle = document.getElementById('header-title');
const btnInicio = document.getElementById('btn-inicio');
const btnHorario = document.getElementById('btn-horario');

// inicio
function renderInicio() {
    headerTitle.innerText = "Inicio";
    
    // Si el viaje no ha iniciado mostramos la tarjeta de bienvenida y el botón de inicio
    if (!viajeIniciado) {
        contentArea.innerHTML = `
            <div class="card-green">
                <div><p>Bienvenido, chofer</p><h1>Andrew Minyard</h1><p style="color:#ffd700">★ 0.5</p></div>
                <div style="text-align:right"><p>Viajes hoy</p><h2>3</h2></div>
            </div>
            <div class="card-white">
                <div style="display:flex; gap:15px; align-items:center; margin-bottom:20px;">
                    <div style="background:#3182ce; color:white; width:40px; height:40px; border-radius:10px; display:flex; justify-content:center; align-items:center; font-weight:bold;">L1</div>
                    <div><h3>Centro - Aeropuerto</h3><p style="font-size:12px; color:#666;">Plaza Central -> Aeropuerto Internacional</p></div>
                </div>
                <button class="btn-primary" onclick="iniciarViaje()">Iniciar viaje</button>
            </div>
        `;
    } else {
        // si el viaje ya inició mostramos el progreso
        const progreso = (paradaActualIndex / (paradas.length - 1)) * 100;
        const proxima = paradas[paradaActualIndex + 1] || "Destino Final";

        contentArea.innerHTML = `
            <div class="card-white">
                <h3>Centro - Aeropuerto</h3>
                <div style="display:flex; justify-content:space-around; margin:20px 0; text-align:center;">
                    <div><i class="fa-regular fa-clock"></i><p>45 min</p></div>
                    <div><i class="fa-solid fa-route"></i><p>18.5 km</p></div>
                    <div><i class="fa-solid fa-users"></i><p>7 Paradas</p></div>
                </div>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width:${progreso}%"></div>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:12px; color:#666">
                    <span>${paradas[0]}</span><span>${Math.round(progreso)}%</span><span>${paradas[paradas.length-1]}</span>
                </div>
                <div style="background:#e6fcf5; padding:15px; border-radius:15px; margin:20px 0; display:flex; align-items:center; gap:15px;">
                    <i class="fa-solid fa-location-arrow" style="color:#038057"></i>
                    <div><p style="font-size:11px; color:#038057">Próxima parada</p><strong>${proxima}</strong></div>
                </div>
                <div style="display:flex; gap:10px;">
                    <button class="btn-pause" onclick="alert('Viaje pausado')">Pausar viaje</button>
                    <button class="btn-next" onclick="siguienteParada()">Siguiente</button>
                </div>
            </div>
        `;
    }
}

//horario
function renderHorario() {
    headerTitle.innerText = "Mi Horario";
    

    let listaHTML = horariosHoy.map(h => `
        <div class="schedule-row">
            <span>#${h.id} <i class="fa-regular fa-clock" style="margin-left:10px"></i> ${h.hora}</span>
            <span class="status-tag ${h.estado === 'Retrasado' ? 'status-delayed' : 'status-ontime'}">
                ${h.estado}
            </span>
        </div>
    `).join('');

    contentArea.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:20px;">
            <div class="card-white" style="flex:1; margin-right:10px; text-align:center;"><h2>4</h2><p>A tiempo</p></div>
            <div class="card-white" style="flex:1; margin-right:10px; text-align:center;"><h2>1</h2><p>Retrasado</p></div>
            <div class="card-white" style="flex:1; text-align:center;"><h2>0</h2><p>Cancelado</p></div>
        </div>
        <div class="card-white">
            <h3 style="margin-bottom:15px;">Viajes programados hoy</h3>
            ${listaHTML}
        </div>
        <div class="card-unit">
            <h4>Información de la unidad</h4>
            <div style="display:flex; justify-content:space-between; margin-top:15px; font-size:14px;">
                <div><p>Ruta</p><strong>L1 - Centro - Aeropuerto</strong></div>
                <div><p>Licencia</p><strong>LIC-2019-001</strong></div>
            </div>
        </div>
    `;
}

// funciones sukulentas 

function iniciarViaje() {
    viajeIniciado = true;
    paradaActualIndex = 0;
    renderInicio();
}

function siguienteParada() {
    if (paradaActualIndex < paradas.length - 1) {
        paradaActualIndex++;
        renderInicio();
    } else {
        alert("¡Recorrido finalizado!");
        viajeIniciado = false;
        renderInicio();
    }
}



btnInicio.addEventListener('click', () => {
    btnInicio.classList.add('active');
    btnHorario.classList.remove('active');
    renderInicio();
});

btnHorario.addEventListener('click', () => {
    btnHorario.classList.add('active');
    btnInicio.classList.remove('active');
    renderHorario();
});

// Carga inicial
renderInicio();