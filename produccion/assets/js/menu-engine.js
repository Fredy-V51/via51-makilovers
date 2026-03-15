// Añadimos almacenamiento local para fricción cero
async function obtenerData() {
    const dataLocal = localStorage.getItem('menu_cache');
    
    // Si tenemos data, la mostramos instantáneamente
    if (dataLocal) {
        renderizarEnPantalla(JSON.parse(dataLocal));
    }
    
    // Mientras, actualizamos en segundo plano
    const response = await fetch(sheetURL);
    const data = await response.text();
    // ... procesar y guardar ...
    localStorage.setItem('menu_cache', JSON.stringify(newData));
}