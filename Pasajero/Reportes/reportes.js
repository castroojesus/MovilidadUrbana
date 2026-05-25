// Base de datos de rutas (compartida con la página de rutas)
const rutasDisponibles = [
    { id: 'L1', nombre: 'Centro - Aeropuerto' },
    { id: 'L2', nombre: 'Sur - Universidad' },
    { id: 'L3', nombre: 'Este - Zona Rosa' },
    { id: 'L7', nombre: 'Universidad - Aeropuerto' }
];

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    
    const selectRuta = document.getElementById('ruta-select');
    const options = document.querySelectorAll('.incident-option');
    const btnEnviar = document.getElementById('btnEnviar');
    const container = document.getElementById('main-report-container');

    let selectedIncident = null;

    
    rutasDisponibles.forEach(ruta => {
        const opt = document.createElement('option');
        opt.value = ruta.id;
        opt.textContent = `${ruta.id} - ${ruta.nombre}`;
        selectRuta.appendChild(opt);
    });

    
    options.forEach(opt => {
        opt.addEventListener('click', () => {
            options.forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            selectedIncident = opt.dataset.type;
            validarFormulario();
        });
    });

    
    selectRuta.addEventListener('change', validarFormulario);

    function validarFormulario() {
        if (selectedIncident && selectRuta.value !== "") {
            btnEnviar.disabled = false;
        } else {
            btnEnviar.disabled = true;
        }
    }

    
    btnEnviar.addEventListener('click', () => {
        container.innerHTML = `
            <div class="report-card success-container">
                <div class="success-icon">
                    <i data-lucide="check" style="width: 45px; height: 45px;"></i>
                </div>
                <h2>¡Reporte enviado!</h2>
                <p style="color: #64748b; margin-top: 15px;">
                    Gracias por tu reporte. Tu solicitud ha sido enviada con éxito y será revisada pronto.
                </p>
                <button onclick="location.reload()" class="btn-submit" style="margin-top: 40px; background: #1e293b;">
                    Volver a reportar
                </button>
            </div>
        `;
        lucide.createIcons(); 
    });
});