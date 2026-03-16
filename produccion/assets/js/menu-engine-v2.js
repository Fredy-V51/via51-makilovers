// La dirección inamovible
const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRckVsvBz2UeqtT4bzq7_x5bl4RcG55XLTlKq-79jv3Px3qWSK4UX6yRva4F2tU9-Wd8S60_b6O00Sn/pub?output=csv";

async function obtenerData() {
    console.log("Fredy: Motor iniciado...");
    try {
        const response = await fetch(sheetURL);
        const csvText = await response.text();
        
        // ¡ESTO ES LO QUE NECESITO QUE ME DIGAS!
        console.log("DATA CRUDA RECIBIDA:", csvText); 
        
        const newData = procesarCSV(csvText);
        console.log("DATA PROCESADA:", newData);
        
        localStorage.setItem('menu_cache', JSON.stringify(newData));
        renderizarEnPantalla(newData);
        
    } catch (error) {
        console.error("ERROR EN EL MOTOR:", error);
    }
}

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

// ARRANCAMOS AUTOMÁTICO PARA NO TENER QUE ESCRIBIR
obtenerData();