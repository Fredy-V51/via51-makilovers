# 🔄 Migración de Datos a Cloud Firestore

Guía paso a paso para cargar el menú desde `menu.json` a **Cloud Firestore**.

## 📋 Requisitos

- ✅ Proyecto Firebase creado en [console.firebase.google.com](https://console.firebase.google.com)
- ✅ Firestore habilitado en el proyecto
- ✅ Credenciales de servicio generadas

## 🔑 Paso 1: Generar Credenciales de Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto **makilovers**
3. Ve a **⚙️ Configuración del Proyecto** (esquina superior derecha)
4. En la pestaña **Cuentas de Servicio**, haz clic en **Generar nueva clave privada**
5. Se descargará un archivo JSON. Guárdalo como:
   ```
   ~/.config/firebase/serviceAccountKey.json
   ```

## 📤 Paso 2: Cargar Datos a Firestore

### En la terminal del Codespace:

```bash
# Instalar dependencias actualizadas
npm install

# Configurar variable de entorno con la ubicación de las credenciales
export GOOGLE_APPLICATION_CREDENTIALS="$HOME/.config/firebase/serviceAccountKey.json"

# Ejecutar script de migración
node scripts/uploadToFirestore.js
```

### Salida esperada:
```
📤 Iniciando carga de datos a Firestore...

📝 Cargando categoría: Sopas y Caldos Nikkei...
   ✅ Sopas y Caldos Nikkei: 2 platos

📝 Cargando categoría: Rollos Especiales...
   ✅ Rollos Especiales: 1 plato

==================================================
✅ Carga completada exitosamente
   • Categorías cargadas: 3
   • Platos totales: 6
==================================================
```

## 🚀 Paso 3: Activar Firestore en el Servidor

```bash
# Exportar variables de entorno
export USE_FIRESTORE=true
export GOOGLE_APPLICATION_CREDENTIALS="$HOME/.config/firebase/serviceAccountKey.json"

# Iniciar servidor
npm run dev  # o node server.js
```

## ✅ Verificación

Para confirmar que los datos se subieron correctamente:

### 1. **En la consola de Firestore:**
   - Ve a [Firebase Console](https://console.firebase.google.com)
   - Selecciona tu proyecto
   - En el menú lateral, haz clic en **Firestore Database**
   - Deberías ver la colección `menu` con documentos: `sopas`, `makis`, `sashimi`, etc.

### 2. **Desde la API local:**
   ```bash
   curl http://localhost:3000/categorias
   ```
   Deberías ver las categorías en JSON.

### 3. **Desde el navegador:**
   - Abre http://localhost:3000
   - Si ves datos cargados sin errores, ¡está funcionando! ✨

## 📊 Estructura de Datos en Firestore

Cada categoría se almacena como un documento con esta estructura:

```json
{
  "categoria": "SOPAS",
  "nombreCategoria": "Sopas y Caldos Nikkei",
  "icono": "🍜",
  "platos": [
    {
      "codigo": "SO-RAM-C",
      "nombre": "Ramen de la Casa",
      "descripcion": "Caldo umami con fideos artesanales...",
      "precio": { "corto": 25.00, "amplio": 35.00 },
      "perfil": { "tipo": "umami", "picante": false },
      "alergenosPrincipales": ["gluten"],
      "disponibilidad": true
    }
  ],
  "timestamp": "2026-03-08T12:00:00Z"
}
```

## 🔄 Actualizar Datos

Para actualizar datos en Firestore:

1. **Modificar datos locales:**
   - Edita `menu.json` con los cambios
   
2. **Subir nuevamente:**
   ```bash
   node scripts/uploadToFirestore.js
   ```
   Esto sobrescribirá los documentos con los datos nuevos.

## ❌ Troubleshooting

### Error: "GOOGLE_APPLICATION_CREDENTIALS no está configurada"
```bash
export GOOGLE_APPLICATION_CREDENTIALS="/ruta/al/serviceAccountKey.json"
```

### Error: "Permission denied reading from Firestore"
- Verifica que las credenciales sean válidas
- En Firebase Console, asegúrate de que Firestore tenga reglas de seguridad permisivas (solo para desarrollo):
  ```
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
  ```

### La API aún lee de `menu.json`
Asegúrate de que:
```bash
echo $USE_FIRESTORE  # debe mostrar "true"
```

---

**📌 Nota:** En producción, usa autenticación como Workload Identity o Firebase Deployment.
