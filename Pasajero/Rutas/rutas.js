

const urlParams = new URLSearchParams(window.location.search);
const rutaId = urlParams.get('id');

if (rutaId) {
    console.log("Cargando detalles para la ruta: " + rutaId);
    
}
    
    const tabs = document.querySelectorAll('.tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            
            tabs.forEach(t => t.classList.remove('active'));
            
            
            tab.classList.add('active');
            
            
            
        });
    });
