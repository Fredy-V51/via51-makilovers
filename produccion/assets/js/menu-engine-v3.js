async function obtenerDataSegura() {
    const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRckVsvBz2UeqtT4bzq7_x5bl4RcG55XLTlKq-79jv3Px3qWSK4UX6yRva4F2tU9-Wd8S60_b6O00Sn/pub?output=csv";

    console.log("🌐 [NÚCLEO] Iniciando conexión con Google Sheets...");

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }

        const textData = await response.text();

        // VALIDACIÓN ESTRICTA: ¿Google nos engañó con una página web?
        const snippet = textData.trim().substring(0, 20).toLowerCase();
        if (snippet.startsWith("<!doctype html>") || snippet.startsWith("<html")) {
            console.error("🚨 [BLOQUEO GOOGLE] El servidor devolvió una página web, no un archivo CSV. Causas comunes: El documento requiere inicio de sesión, el enlace de publicación expiró, o Google muestra una pantalla de 'Aviso de redirección'.");
            return;
        }

        console.log("✅ [ÉXITO] Datos CSV puros interceptados correctamente:");
        console.log(textData.substring(0, 150) + "... [Continúa]");

        // Siguiente paso: procesarCSV(textData);

    } catch (error) {
        console.error("❌ [FALLO DE RED/CORS] La conexión fue abortada por el navegador:", error.message);
    }
}

obtenerDataSegura();