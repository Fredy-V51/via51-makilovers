# 🍣 Makilovers: Ecosistema Gastronómico Digital

**Makilovers** es una plataforma de interacción de alta fidelidad que redefine la experiencia entre el restaurante y el cliente mediante una arquitectura **Serverless Cloud**. Diseñada bajo los principios de innovación de **Via51**.

---

## 💎 ADN del Proyecto: Antigravity & Skills

### 🚀 Antigravity (Rendimiento Sin Peso)

Nuestra metodología elimina la fricción técnica para lograr una fluidez extrema:

- **Infraestructura:** Ejecución 100% en la nube mediante **GitHub Codespaces**, eliminando la dependencia de hardware físico.
- **Frontend:** Código optimizado que vuela sobre la red global de **Firebase Hosting**, garantizando cargas instantáneas en dispositivos móviles.

### 🧠 Skills (Capacidades Inteligentes)

El sistema evoluciona mediante módulos funcionales conectados a **Cloud Firestore**:

- **Skill de Catálogo:** Gestión de platos y precios en tiempo real.
- **Skill de Sedes:** Control de geolocalización y contacto (WhatsApp Business API).
- **Skill de Reservas:** Módulo proyectado para la gestión de aforo dinámico.

---

## 🏗️ Arquitectura Técnica 2026

- **Stack:** HTML5 / CSS3 / JavaScript Vanilla.
- **Cloud Provider:** Google Cloud & Firebase.
- **Database:** Cloud Firestore (NoSQL).
- **Deployment:** `firebase deploy --only hosting` (or `npm run deploy` once the Firebase CLI is installed).

## 📦 Automatización de despliegues

Un flujo de GitHub Actions (`.github/workflows/deploy.yml`) se encarga de ejecutar el deploy cada vez que se hace push a la rama `master`.

1. Configurar el secreto `FIREBASE_TOKEN` en el repositorio con un token de login generado por `firebase login:ci`.
2. El pipeline instala `firebase-tools` y ejecuta `firebase deploy --only hosting` automáticamente.

Con esto, cada merge a `master` publica la versión actualizada del sitio sin intervención manual.

## 🧪 Pruebas unitarias

Se utiliza **Jest** para validar la lógica de `menuService.js`.

1. Instala dependencias (si no lo has hecho):
   ```bash
   npm install
   ```
2. Ejecuta el comando de pruebas:
   ```bash
   npm test
   ```

Los resultados incluyen cobertura en `coverage/`.

## 🧩 API local

Se provee un pequeño servidor Express para exponer el catálogo como JSON:

- `GET /categorias` → lista de categorías
- `GET /menu/:categoria` → datos de una categoría específica
- `GET /plato/:codigo` → detalles de un plato por código

Para iniciar el servidor:

```bash
npm install # si no está hecho
node server.js
```

La variable `PORT` controla el puerto (por defecto 3000). Esto es útil para integrar un frontend dinámico o para probar la migración a Firestore sin tocar `index.html`.

### 🔄 Migración a Firestore

Si prefieres que el catálogo salga de una base de datos en lugar de un archivo, establece las variables de entorno:

```bash
export USE_FIRESTORE=true                  # activa la carga remota
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/key.json"  # clave de servicio
```

El `menuService` buscará documentos en la colección `menu` (cada documento representa una categoría con la misma estructura que `menu.json`).

Ejemplo de documento Firestore para `sopas`:

```json
{
  "categoria": "SOPAS",
  "nombreCategoria": "Sopas y Caldos Nikkei",
  "icono": "🍜",
  "platos": [
    /* ...igual a menu.json... */
  ]
}
```

Cuando `USE_FIRESTORE` está en `true` el server y los tests también intentan leer de Firestore (asegúrate de tener las credenciales correctas o desactivar la variable durante pruebas locales).

---

> **Documentación integrada y actualizada al 2026 - Propiedad de Via51.**
