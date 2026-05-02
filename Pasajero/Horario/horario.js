document.addEventListener('DOMContentLoaded', () => {
    

    const pills = document.querySelectorAll('.pill');
    const rows = document.querySelectorAll('.table-row');

    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            // Cambiar estado activo de los botones
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const filterValue = pill.getAttribute('data-filter');

            rows.forEach(row => {
                const rowRuta = row.getAttribute('data-ruta');
                
                
                if (filterValue === 'all' || filterValue === rowRuta) {
                    row.style.display = 'grid'; 
                } else {
                    row.style.display = 'none';
                }
            });
        });
    });
});