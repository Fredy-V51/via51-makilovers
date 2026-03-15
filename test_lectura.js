const fs = require('fs');

// Ruta absoluta correcta al archivo sopas.json
const sopasPath = '/workspaces/makilovers/via51_qallariy/mikhuna/makilovers/sopas.json';

try {
    const data = fs.readFileSync(sopasPath, 'utf8');
    const sopas = JSON.parse(data);
    console.log('=== Menú de sopas ===\n');
    sopas.forEach(sopa => {
        console.log(`Código: ${sopa.codigo}`);
        console.log(`Nombre: ${sopa.nombre}`);
        console.log(`Precio corto: $${sopa.precio.corto}`);
        console.log(`Precio amplio: $${sopa.precio.amplio}`);
        console.log(`Tipo: ${sopa.perfil.tipo}`);
        console.log(`Picante: ${sopa.perfil.picante ? 'Sí' : 'No'}`);
        console.log('---');
    });
} catch (error) {
    console.error('Error al leer el archivo:', error.message);
}
