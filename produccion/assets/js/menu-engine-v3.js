(async function depurarConexion() {
    const urlFija = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRckVsvBz2UeqtT4bzq7_x5bl4RcG55XLTlKq-79jv3Px3qWSK4UX6yRva4F2tU9-Wd8S60_b6O00Sn/pub?output=csv";
    
    console.log("🛠️ [PRO TEST] 1. Arrancando script de depuración...");

    try {
        console.log("🛠️ [PRO TEST] 2. Ejecutando fetch a Google Sheets...");
        const response = await fetch(urlFija);
        
        console.log("🛠️ [PRO TEST] 3. Respuesta recibida. Estado HTTP:", response.status);

        if (!response.ok) {
            console.error("❌ [PRO TEST] ERROR: Google respondió con un error HTTP", response.status);
            return;
        }

        const data = await response.text();
        
        // Verificamos si Google nos engañó enviando una página HTML (página de login) en lugar del CSV
        if (data.trim().startsWith("<!DOCTYPE html>") || data.trim().startsWith("<html")) {
            console.error("❌ [PRO TEST] ERROR DE REDIRECCIÓN: Google está bloqueando el acceso y enviando una página web (posiblemente de inicio de sesión) en lugar del CSV. Revisa si el documento sigue siendo público.");
            return;
        }

        console.log("✅ [PRO TEST] ¡ÉXITO! Data cruda recibida correctamente:");
        console.log(data);

    } catch (error) {
        console.error("❌ [PRO TEST] FALLO CRÍTICO DE RED O CORS:");
        console.error(error.message);
        console.log("⚠️ DIAGNÓSTICO: Si el mensaje de arriba dice 'Failed to fetch' o 'NetworkError', el navegador está bloqueando la conexión. Lee la sección de abajo.");
    }
})();