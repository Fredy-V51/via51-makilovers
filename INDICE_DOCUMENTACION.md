# 📚 ÍNDICE DE DOCUMENTACIÓN - Makilovers

**Actualizado:** 8 de Marzo 2026  
**Versión del Proyecto:** 1.0

---

## 🎯 EMPEZAR POR AQUÍ

Si es tu primera vez, lee en este orden:

1. **[RESUMEN_SESION.md](RESUMEN_SESION.md)** ← START HERE
   - Visión general de lo que se ha hecho
   - Decisiones arquitectónicas
   - Estado actual

2. **[README.md](README.md)** 
   - Descripción del proyecto Makilovers
   - Stack técnico
   - Cómo iniciar

3. **[FASE2_COMPLETADA.md](FASE2_COMPLETADA.md)**
   - Extracción de PDF completada
   - Frontend mínimo operativo
   - Próximos pasos inmediatos

---

## 📋 DOCUMENTACIÓN TÉCNICA

### Arquitectura & Modelo de Datos

| Documento | Propósito | Léelo si... |
|-----------|-----------|-------------|
| [MODELO_DATOS_ESTRATIFICADO.md](MODELO_DATOS_ESTRATIFICADO.md) | Arquitectura 5 capas de la BD | Te interesa cómo está estructurada la información |
| [NOMENCLATURA_IMAGENES.md](NOMENCLATURA_IMAGENES.md) | Sistema de SKU, naming, storage | Trabajarás con imágenes o SKUs |
| [SECURITY_AUDIT.md](SECURITY_AUDIT.md) | Auditoria de credenciales | Necesitas entender protecciones |
| [FIREBASE_MIGRATION.md](FIREBASE_MIGRATION.md) | Cómo cargar datos a Firestore | Cargará datos a la BD |

### Guías Prácticas

| Documento | Propósito | Léelo si... |
|-----------|-----------|-------------|
| [GUIA_COMPLETAR_JSON.md](GUIA_COMPLETAR_JSON.md) | Cómo completar menu_makilovers_completo.json | Agregarás más productos |
| [MANUAL.md](MANUAL.md) | Manual de uso del sistema | Necesitas instrucciones de operación |
| [UX_GUIDELINES.md](UX_GUIDELINES.md) | Lineamientos de experiencia de usuario | Diseñarás funcionalidades frontend |

### Historiales & Referencias

| Documento | Propósito |
|-----------|-----------|
| [infraestructura.md](infraestructura.md) | Arquitectura de Via51 (organización madre) |
| [via51_qallariy/mikhuna/makilovers/HISTORY.md](via51_qallariy/mikhuna/makilovers/HISTORY.md) | Historial del proyecto |

---

## 💻 ARCHIVOS DE CÓDIGO IMPORTANTE

### Frontend
```
public/
├── menu.html              ← CARTA DIGITAL (abir en navegador)
└── js/
    └── menu-app.js        ← Lógica de filtros, búsqueda
```

### Backend / Scripts
```
scripts/
├── extractPDF.py          ← Extrae PDF a texto
├── parseMenuPDF.py        ← Analiza estructura del menú
├── uploadMenuToFirestore.js ← Carga datos a BD
└── uploadToFirestore.js   ← Upload anterior (mantener)

server.js                  ← Express API
menuService.js             ← Lógica de menú
firebaseConfig.js          ← Configuración Firebase
```

### Datos
```
menu_makilovers_completo.json    ← FUENTE DE VERDAD
menu.json                        ← Menú anterior (legacy)
docs/carta_extracted.txt         ← PDF extraído (referencia)
```

---

## 🚀 ROADMAP (Fases)

### FASE 1: DEFINICIÓN ✅
- [x] Modelo de datos estratificado
- [x] Nomenclatura de productos (SKU)
- [x] Gestión de imágenes
- [x] Documentación de arquitectura
**Referencia:** [MODELO_DATOS_ESTRATIFICADO.md](MODELO_DATOS_ESTRATIFICADO.md)

### FASE 2: EXTRACCIÓN & FRONTEND ✅
- [x] Extraer datos del PDF
- [x] Crear JSON maestro
- [x] Frontend mínimo (HTML/CSS/JS)
- [x] Scripts de automatización
**Referencia:** [FASE2_COMPLETADA.md](FASE2_COMPLETADA.md)

### FASE 3: IMÁGENES & FIRESTORE ⏳
- [ ] Descargar/generar imágenes
- [ ] Completar JSON con todos los productos
- [ ] Ejecutar uploadMenuToFirestore.js
- [ ] Verificar en Firestore Console
**Referencia:** [GUIA_COMPLETAR_JSON.md](GUIA_COMPLETAR_JSON.md)

### FASE 4: INTEGRACIÓN REAL ⏳
- [ ] API conectada a Firestore (no mock)
- [ ] Admin dashboard
- [ ] Testing completo
- [ ] Deploy a Firebase Hosting

### FASE 5: EXPANSIÓN ⏳
- [ ] Carrito de compras
- [ ] Integración WhatsApp API
- [ ] Sistema de pedidos
- [ ] Analytics

---

## 🎨 COMPONENTES CLAVE

### Para Entender la Estructura

```javascript
// PRODUCTO (identidad)
{
  skuId: "ENT-SAS-SAL-01",
  nombre: "Sashimi de Salmón",
  categoria: "entradas"
}

// SKU (variante física + precio)
{
  skuId: "ENT-SAS-SAL-01",
  presentacion: { cantidad: 4, unidad: "cortes" },
  precios: { venta: 18.00, margen: 60% }
}

// NUTRICIÓN (para diabéticos)
{
  skuId: "ENT-SAS-SAL-01",
  glucosaEquivalente: 0,
  sodio: 120mg,
  restricciones: { diabetes: true }
}

// ALERGENOS (legal compliance)
{
  skuId: "ENT-SAS-SAL-01",
  declarados: ["Pescado"],
  componentes: [{ nombre: "Salmón", alergenoCategoria: "PESCADO" }]
}
```

---

## 🔑 VARIABLES DE ENTORNO

```bash
# .env (NO COMMITEAR)
USE_FIRESTORE=true
PORT=3000
GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccountKey.json

# .env.example (COMMITEAR)
USE_FIRESTORE=true
PORT=3000
GOOGLE_APPLICATION_CREDENTIALS=/path/to/key
```

---

## 📊 DATOS EN JSON

Localización de ejemplos:
```
menu_makilovers_completo.json
└── productos
    ├── entradas_sashimi/      [10 productos]
    ├── entradas_alitas/       [2 productos]
    ├── sopas_ramen/           [2 productos]
    └── makis_frios/           [2 productos]
    
Total: 16 productos de ejemplo (40+ por llegar)
```

---

## 🎯 COMANDOS ÚTILES

```bash
# Validar JSON
node -e "require('./menu_makilovers_completo.json')"

# Extraer PDF de nuevo
python3 scripts/extractPDF.py

# Cargar a Firestore
export USE_FIRESTORE=true
export GOOGLE_APPLICATION_CREDENTIALS="$HOME/.config/firebase/serviceAccountKey.json"
node scripts/uploadMenuToFirestore.js

# Iniciar servidor
npm run dev    # o: node server.js

# Testear tests
npm test

# Deploy a Firebase
npm run deploy
```

---

## 🎓 CONCEPTOS CLAVE

### SKU = Stock Keeping Unit
Identificador único de producto. Formato: `CAT-TIPO-ESP-NUM`
- `ENT` = Categoría (Entradas)
- `SAS` = Tipo (Sashimi)
- `SAL` = Específico (Salmón)
- `01` = Número secuencial

### M/L = Mediano/Grande
Para sopas: dos tamaños, dos precios
- M (Mediano): 350g, S/ 24
- L (Grande): 500g, S/ 32

### Margen = Utilidad
Diferencia entre precio venta y costo
- Costo: S/ 9.60
- Venta: S/ 24.00
- Margen: S/ 14.40 (60%)

### Alérgenos = Declaración Legal
Hay que listar: pescado, soya, gluten, lacteos, etc.

---

## 📞 INTEGRACIÓN CON SEDES

Cada documento incluye:
```javascript
ubicaciones: [
  { nombre: "Carabayllo S.D.", whatsapp: "+51 966 876 906" },
  { nombre: "Los Olivos", whatsapp: "+51 979 963 724" },
  { nombre: "Comas", whatsapp: "+51 902 442 383" }
]
```

---

## ✅ CHECKLIST: Antes de Firestore

- [ ] JSON con todos los productos completados
- [ ] Imágenes en `/public/assets/images/productos/`
- [ ] Firebase CLI instalado
- [ ] Credenciales configuradas
- [ ] Variables de entorno correctas
- [ ] Tests pasando
- [ ] Revisión de precios con negocio

---

## 🆘 TROUBLESHOOTING

### "Firebase no está configurado"
→ Verifica `GOOGLE_APPLICATION_CREDENTIALS` y `.env`

### "Imágenes no se cargan en frontend"
→ Check: rutas en JSON coinciden con `/public/assets/`

### "JSON inválido"
→ Usa: `node -e "require('./menu_makilovers_completo.json')"`

### "Precios no sincronizan"
→ Verifica que Firestore está habilitada en proyecto

---

## 🔗 Enlaces Externos

- Firebase Console: https://console.firebase.google.com
- Unsplash (imágenes): https://unsplash.com
- Pexels (imágenes): https://pexels.com
- Makilovers sitio: https://makilovers.pe

---

## 👤 Responsables

| Rol | Responsable | Contacto |
|-----|-------------|----------|
| Arquitectura | GitHub Copilot | Sistema |
| Desarrollo | (Por asignar) | TBD |
| Datos/Contenido | (Por asignar) | TBD |
| Imágenes | (Por asignar) | TBD |
| Firestore | (Por asignar) | TBD |

---

## 📅 Timeline

| Hito | Fecha | Estado |
|------|-------|--------|
| FASE 1: Definición | 08/03/2026 | ✅ |
| FASE 2: Extracción | 08/03/2026 | ✅ |
| FASE 3: Imágenes | 09-10/03/2026 | ⏳ |
| FASE 4: Integración | 11-15/03/2026 | ⏳ |
| FASE 5: Deploy | 16-20/03/2026 | ⏳ |

---

## 📝 Revisión de Documentos

| Doc | Revisado | Próxima revisión |
|-----|----------|------------------|
| RESUMEN_SESION.md | 08/03 | Cuando FASE3 complete |
| MODELO_DATOS.md | 08/03 | Cuando cambios arquitectura |
| GUIA_COMPLETAR_JSON.md | 08/03 | Cuando todos productos listos |

---

## 🎉 Conclusión

Todo lo necesario está documentado, estructurado y listo para ejecutar.

**Próximo paso**: Completar JSON + generar imágenes → Upload a Firestore

**Documento vivo**: Se actualiza conforme avanzan las fases.

---

*Generado automáticamente | Última actualización: 08/03/2026 | Copilot AI*
