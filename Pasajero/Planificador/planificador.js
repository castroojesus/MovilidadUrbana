
const rutas = [
    {
        id: 'L1',
        nombre: 'Centro - Aeropuerto',
        paradas: ['Plaza Central', 'Av. Libertad', 'Hospital General', 'Centro Comercial Norte', 'Estadio Municipal', 'Zona Industrial', 'Aeropuerto Internacional'],
        color: '#3b82f6'
    },
    {
        id: 'L7',
        nombre: 'Universidad - Aeropuerto',
        paradas: ['Universidad', 'Hospital General', 'Centro Comercial Norte', 'Estadio Municipal', 'Zona Industrial', 'Aeropuerto Internacional'],
        color: '#05cd99'
    }
];

document.getElementById('btnBuscar').addEventListener('click', function() {
    const origen = document.getElementById('origen').value;
    const destino = document.getElementById('destino').value;
    const resultadosDiv = document.getElementById('resultados');
    const detalleDiv = document.getElementById('opcionesDetalle');

    if (!origen || !destino) return alert("Por favor selecciona origen y destino");

    resultadosDiv.innerHTML = "";
    detalleDiv.innerHTML = "";

    
    let rutasEncontradas = rutas.filter(r => r.paradas.includes(origen) && r.paradas.includes(destino));

    if (rutasEncontradas.length > 0) {
        mostrarRutasDirectas(rutasEncontradas, origen, destino);
    } else {
        
        buscarTrasbordos(origen, destino);
    }
});

function mostrarRutasDirectas(lista, ori, des) {
    const resDiv = document.getElementById('resultados');
    const detDiv = document.getElementById('opcionesDetalle');

    resDiv.innerHTML = `<div class="planner-card"><h3>${lista.length} rutas encontradas</h3><p>De ${ori} a ${des}</p></div>`;

    lista.forEach((r, index) => {
        let html = `
            <div class="route-option-card">
                <div class="route-header">
                    <span>Opción ${index + 1} <span class="tag-status success">Ruta Directa</span></span>
                </div>
                <div class="timeline">
                    ${r.paradas.map(p => `
                        <div class="stop ${p === ori ? 'origin' : ''}">
                            <strong>${p}</strong>
                            ${p === ori ? '<span class="badge-action green">Aborda aquí</span>' : ''}
                            ${p === des ? '<span class="badge-action blue">Bájate aquí</span>' : ''}
                        </div>
                    `).join('')}
                </div>
            </div>`;
        detDiv.innerHTML += html;
    });
}

function buscarTrasbordos(ori, des) {
    const detDiv = document.getElementById('opcionesDetalle');
    const resDiv = document.getElementById('resultados');

    
    let ruta1 = rutas.find(r => r.paradas.includes(ori));
    let ruta2 = rutas.find(r => r.paradas.includes(des));

    if (ruta1 && ruta2 && ruta1.paradas.includes('Hospital General') && ruta2.paradas.includes('Hospital General')) {
        resDiv.innerHTML = `<div class="planner-card"><h3>1 ruta con trasbordo encontrada</h3></div>`;
        detDiv.innerHTML = `
            <div class="route-option-card">
                <div class="route-header">Opción 1 <span class="tag-status warning">Con Trasbordo</span></div>
                <p>Trasbordo requerido en Hospital General</p>
                <!-- Aquí iría el dibujo de ambas rutas unidas -->
                <div class="timeline">
                    <div class="stop origin"><strong>${ori}</strong></div>
                    <div class="stop"><strong>Hospital General</strong> <span class="badge-action warning">Bájate y cambia de ruta</span></div>
                    <div class="stop"><strong>${des}</strong> <span class="badge-action blue">Destino Final</span></div>
                </div>
            </div>`;
    } else {
        resDiv.innerHTML = `<div class="no-results"><h3>No hay rutas disponibles</h3><p>Intenta con otros puntos de origen o destino.</p></div>`;
    }
}