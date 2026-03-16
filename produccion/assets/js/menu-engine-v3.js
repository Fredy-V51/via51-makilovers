async function cargarYMostrarMenu() {
    const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRckVsvBz2UeqtT4bzq7_x5bl4RcG55XLTlKq-79jv3Px3qWSK4UX6yRva4F2tU9-Wd8S60_b6O00Sn/pub?gid=9975600&single=true&output=csv";

    console.log("🌐 [NÚCLEO] Conectando...");

    try {
        const response = await fetch(url);
        const csvText = await response.text();
        
        // Separar en filas y limpiar vacías
        const lineas = csvText.split('\n').filter(l => l.trim() !== "");
        const encabezados = lineas[0].split(',').map(h => h.trim());
        
        const productos = lineas.slice(1).map(linea => {
            const valores = linea.split(',');
            let obj = {};
            encabezados.forEach((h, i) => {
                obj[h] = valores[i] ? valores[i].trim() : "";
            });
            return obj;
        });

        console.log("✅ Data lista:", productos);
        renderizarEnHTML(productos);

    } catch (error) {
        console.error("❌ Fallo:", error);
    }
}

function renderizarEnHTML(productos) {
    const contenedor = document.getElementById('menu-container');
    if (!contenedor) {
        console.error("⚠️ No se encontró el div id='menu-container'");
        return;
    }

    contenedor.innerHTML = productos.map(p => `
        <div style="border: 1px solid #ccc; margin: 10px; padding: 10px;">
            <h3>${p.Productos || 'Sin nombre'}</h3>
            <p>${p.Descripción || ''}</p>
            <strong>${p.Precios || 'Consultar precio'}</strong>
        </div>
    `).join('');
}

// Para uso externo
window.obtenerData = cargarYMostrarMenu;