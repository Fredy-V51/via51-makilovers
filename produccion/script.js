// La URL de tu hoja publicada (el túnel)
const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRckVsvBz2UeqtT4bzq7_x5bl4RcG55XLTlKq-79jv3Px3qWSK4UX6yRva4F2tU9-Wd8S60_b6O00Sn/pub?output=csv";

async function cargarMenuDesdeNetwork() {
    try {
        const response = await fetch(sheetURL);
        const data = await response.text();
        
        // Convertimos el CSV en objetos de JavaScript
        const filas = data.split('\n').slice(1); // Ignoramos el encabezado
        const productos = filas.map(fila => {
            const [id, categoria, subcat, nombre, desc, precioM, precioL, notas] = fila.split(',');
            return { id, categoria, nombre, desc, precioM, precioL, notas };
        });

        renderizarEnPantalla(productos);
    } catch (error) {
        console.error("Error en la network:", error);
    }
}

function renderizarEnPantalla(productos) {
    const contenedor = document.getElementById('menu-container');
    contenedor.innerHTML = productos.map(p => `
        <div class="producto-card">
            <h3>${p.nombre}</h3>
            <p>${p.desc}</p>
            <span class="precio">M: S/ ${p.precioM} | L: S/ ${p.precioL}</span>
            <small class="alerta">${p.notas}</small>
        </div>
    `).join('');
}

// Arrancamos el circuito
cargarMenuDesdeNetwork();