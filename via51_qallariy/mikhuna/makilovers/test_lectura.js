// Este código lee nuestro archivo de sopas
const fs = require('fs');

try {
    // 1. Leemos el archivo
    const data = fs.readFileSync('sopas.json', 'utf8');
    
    // 2. Convertimos el texto en un objeto de JavaScript
    const sopas = JSON.parse(data);

    console.log("¡Conexión exitosa! Listando el menú de sopas:");
    console.log("-------------------------------------------");

    // 3. Recorremos las sopas y mostramos sus precios
    sopas.forEach(sopa => {
        console.log(`🍲 Plato: ${sopa.nombre}`);
        console.log(`   💰 Precio Corto: S/ ${sopa.precio.corto}`);
        console.log(`   💰 Precio Amplio: S/ ${sopa.precio.amplio}`);
        console.log(`   🧬 Perfil: ${sopa.perfil.tipo}`);
        console.log("-------------------------------------------");
    });

} catch (err) {
    console.error("❌ Error al leer el archivo:", err.message);
}