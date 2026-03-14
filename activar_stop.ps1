# ACTIVADOR ANTIGRAVITY - VIA51
Write-Host "Sincronizando Espejo de Producción..." -ForegroundColor Cyan

# 1. Asegurar estructura de espejo
if (!(Test-Path "produccion\src")) { New-Item -ItemType Directory -Path "produccion\src" -Force }

# 2. Sincronizar (Copia exacta de las ubicaciones)
Copy-Item -Path ".\desarrollo\src\index.html" -Destination ".\produccion\src\" -Force
Copy-Item -Path ".\desarrollo\estilos.css" -Destination ".\produccion\" -Force

Write-Host "LISTO. Nodo de producción validado y vestido." -ForegroundColor Green