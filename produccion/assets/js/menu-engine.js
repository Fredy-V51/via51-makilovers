const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRckVsvBz2UeqtT4bzq7_x5bl4RcG55XLTlKq-79jv3Px3qWSK4UX6yRva4F2tU9-Wd8S60_b6O00Sn/pub?output=csv";

async function obtenerData() {
    const dataLocal = localStorage.getItem('menu_cache');
    
    // 1. Mostrar lo que ya tenemos
    if (dataLocal) {
        renderizarEnPantalla(JSON.parse(dataLocal));
    }
    
    try {
        // 2. Traer la data nueva
        const response = await fetch(sheetURL);
        if (!response.ok) throw new Error("Error de conexión");
        const csvText = await response.text();
        
        // 3. ¡CORRECCIÓN! Transformamos CSV a algo que podamos guardar
        const newData = procesarCSV(csvText); 
        
        // 4. Guardar y actualizar
        localStorage.setItem('menu_cache', JSON.stringify(newData));
        renderizarEnPantalla(newData);
        
    } catch (error) {
        console.error("Error en el motor:", error);
    }
}

// Función auxiliar para que el motor entienda el CSV
function procesarCSV(csv) {
    const lines = csv.split('\n');
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
        const values = line.split(',');
        let obj = {};
        headers.forEach((header, i) => obj[header.trim()] = values[i]?.trim());
        return obj;
    });
}