// La dirección inamovible
const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRckVsvBz2UeqtT4bzq7_x5bl4RcG55XLTlKq-79jv3Px3qWSK4UX6yRva4F2tU9-Wd8S60_b6O00Sn/pub?output=csv";

async function obtenerData() {
// ... dentro de tu función obtenerData ...
const response = await fetch(sheetURL);
const csvText = await response.text();

// ¡AQUÍ ESTÁ EL SECRETO!
console.log("Fredy, esto es lo que recibí del Google Sheet:");
console.log(csvText); // Esto imprimirá el texto crudo en la consola

const newData = procesarCSV(csvText);
console.log("Y así lo transformé en objetos:");
console.log(newData);

localStorage.setItem('menu_cache', JSON.stringify(newData));
renderizarEnPantalla(newData); // Si esto falla, aquí está el culpable}

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