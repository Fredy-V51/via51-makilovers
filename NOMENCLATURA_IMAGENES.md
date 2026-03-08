# 📋 Nomenclatura de Productos e Imágenes - Makilovers

**Documento de Estandarización | Versión 1.0 | 8 de Marzo de 2026**

---

## 🎯 Objetivo

Establecer convenciones consistentes para:
1. Identificación de productos (códigos, slugs)
2. Nomenclatura de archivos de imagen
3. Estructura de directorios
4. Gestión de versiones y variantes

---

## 1️⃣ NOMENCLATURA DE PRODUCTOS

### 1.1 Sistema de Código SKU (Identificador Único)

**Formato:** `{CATPREF}-{TIPO}-{ESPECIFICO}-{TAMAÑO}`

| Componente | Longitud | Regla | Ejemplo |
|-----------|----------|-------|---------|
| **CATPREF** | 3 caracteres | Prefijo categoría en MAYÚSCULAS | `SOA`, `MAK`, `SAH` |
| **TIPO** | 3-4 caracteres | Clasificación del plato | `RAM`, `MISO`, `PHIL` |
| **ESPECIFICO** | 2-3 caracteres | Diferenciador (proteína/gusto) | `ATL` (Atlántico), `PAC` (Pacífico), `RSE` (Rojo Especial) |
| **TAMAÑO** | 1-2 caracteres | Porción (C=corto, A=amplio, 6=piezas) | `C`, `A`, `6`, `12` |

**Ejemplos:**
```
SOA-RAM-ATL-C     → Ramen de Salmón Atlántico (porción corta)
SOA-RAM-ATL-A     → Ramen de Salmón Atlántico (porción amplia)
MAK-PHIL-RSE-8    → Maki Philadelphia Rojo Especial (8 piezas)
SAH-SALMON-ATL-6  → Sashimi Salmón Atlántico (6 piezas)
```

### 1.2 Prefijos de Categoría

| Categoría | Prefijo | Subcategorías |
|-----------|---------|---|
| SOPAS | `SOA` | Ramén, Miso, Tonkotsu |
| MAKIS | `MAK` | Philadelphia, Tempura, Especial |
| SASHIMI | `SAH` | Salmón, Atún, Mixto |
| ENTRADAS | `ENT` | Gyoza, Edamame, Tabla |
| BEBIDAS | `BEB` | Refrescos, Cervezas, Sake |
| POSTRES | `POS` | Helados, Flan, Mochi |

### 1.3 Slug (URL-Friendly Name)

**Formato:** `{catpref}-{nombre-legible}-{sku-abreviado}`

Convertir a minúsculas, espacios a guiones, sin caracteres especiales.

**Ejemplos:**
```
soA-ramen-salmon-atl        → Para URL/búsqueda
mak-philadelphia-especial-8 → Para URL/búsqueda
sah-sashimi-salmon-6        → Para URL/búsqueda
```

### 1.4 Nombre Comercial

El que ve el cliente en la carta digital:

```
"Ramen de Salmón Atlántico" 
"Maki Philadelphia Rojo Especial - 8 piezas"
"Sashimi Mixto Premium (6 piezas)"
```

---

## 2️⃣ GESTIÓN DE IMÁGENES

### 2.1 Estructura de Directorios

```
/assets/
  ├── images/
  │   ├── productos/
  │   │   ├── sopas/
  │   │   │   ├── SOA-RAM-ATL/
  │   │   │   │   ├── SOA-RAM-ATL-C.jpg     (pequeño/corto)
  │   │   │   │   ├── SOA-RAM-ATL-A.jpg     (amplio)
  │   │   │   │   └── SOA-RAM-ATL-DETAIL.jpg (detalle/ingredientes)
  │   │   │   └── SOA-MISO-STD/
  │   │   │       └── SOA-MISO-STD-C.jpg
  │   │   ├── makis/
  │   │   │   └── MAK-PHIL-RSE/
  │   │   │       ├── MAK-PHIL-RSE-8.jpg
  │   │   │       ├── MAK-PHIL-RSE-12.jpg
  │   │   │       └── MAK-PHIL-RSE-DETAIL.jpg
  │   │   └── sashimi/
  │   │       └── SAH-SALMON-ATL/
  │   │           ├── SAH-SALMON-ATL-6.jpg
  │   │           └── SAH-SALMON-ATL-12.jpg
  │   │
  │   ├── categorias/
  │   │   ├── cat-sopas.svg
  │   │   ├── cat-makis.svg
  │   │   └── cat-sashimi.svg
  │   │
  │   ├── badges/
  │   │   ├── badge-sin-gluten.svg
  │   │   ├── badge-apto-diabetico.svg
  │   │   ├── badge-vegan.svg
  │   │   └── badge-picante.svg
  │   │
  │   └── alergenicos/
  │       ├── icon-gluten.svg
  │       ├── icon-pescado.svg
  │       ├── icon-lacteos.svg
  │       └── icon-soya.svg
```

### 2.2 Convención de Nombres de Archivo

**Formato:** `{SKU}-{VARIANTE}.{FORMATO}`

| Campo | Opciones | Notas |
|-------|----------|-------|
| **SKU** | `SOA-RAM-ATL`, `MAK-PHIL-RSE` | SKU completo sin tamaño |
| **VARIANTE** | `C`, `A`, `6`, `12`, `DETAIL`, `HERO` | C=corto, A=amplio, DETAIL=ingredientes, HERO=full-width |
| **FORMATO** | `jpg`, `webp`, `png` | JPG: fotos, WebP: optimizado, PNG: transparencia |

**Ejemplos:**
```
SOA-RAM-ATL-C.jpg
SOA-RAM-ATL-A.webp
SOA-RAM-ATL-DETAIL.jpg
MAK-PHIL-RSE-8.webp
MAK-PHIL-RSE-HERO.jpg
SAH-SALMON-ATL-6.jpg
```

### 2.3 Especificaciones Técnicas de Imagen

#### Fotos de Producto (menu listing)
- **Dimensión:** 400x400px (cuadrado, estandarizado)
- **Formato:** WebP (optimizado) + JPG (fallback)
- **Tamaño archivo:** < 150KB (WebP), < 250KB (JPG)
- **Compresión:** 80-85% calidad
- **DPI:** 72px (web)

#### Imágenes Detalle/Ingredientes
- **Dimensión:** 600x400px o 800x600px
- **Formato:** WebP + JPG
- **Tamaño archivo:** < 300KB
- **Fondo:** Blanco (#FFFFFF) o transparente PNG

#### Imágenes Hero (full-width)
- **Dimensión:** 1920x600px (16:5) o responsive
- **Formato:** WebP + JPG
- **Tamaño archivo:** < 400KB

#### Iconos/Badges (alergenos, categorías)
- **Dimensión:** 64x64px, 128x128px, 256x256px
- **Formato:** SVG (vectorial) preferido, PNG para raster
- **Tamaño archivo:** < 50KB (SVG)

### 2.4 Metadatos en Variable de Entorno

Almacenar path de imágenes en Firestore:

```javascript
{
  skuId: "MAK-PHIL-RSE-8",
  imagenes: {
    principal: {
      url: "/assets/images/productos/makis/MAK-PHIL-RSE/MAK-PHIL-RSE-8.webp",
      fallback: "/assets/images/productos/makis/MAK-PHIL-RSE/MAK-PHIL-RSE-8.jpg",
      alt: "Maki Philadelphia Rojo Especial - 8 piezas, presentación elegante sobre plato blanco"
    },
    detalle: {
      url: "/assets/images/productos/makis/MAK-PHIL-RSE/MAK-PHIL-RSE-DETAIL.webp",
      alt: "Ingredientes: salmón fresco, queso crema, pepino, aguacate"
    },
    thumbnail: {
      url: "/assets/images/productos/makis/MAK-PHIL-RSE/MAK-PHIL-RSE-THUMB.webp"
    }
  },
  badges: ["badge-popular", "badge-recomendado"],
  alergenoIcons: ["icon-pescado", "icon-lacteos"]
}
```

### 2.5 Storage (Local vs. Cloud)

#### OPCIÓN A: Almacenamiento Local
```
✅ Ventajas: Control total, sin latencia adicional
❌ Desventajas: Límite de almacenamiento, respaldo manual
   
Ubicación: /public/assets/images/
Deploy: Junto con código via Firebase Hosting
```

#### OPCIÓN B: Firebase Cloud Storage (RECOMENDADO)
```
✅ Ventajas: CDN global, escalablidad, respaldo automático
❌ Desventajas: Costo por almacenamiento y transferencia

Bucket: gs://makilovers-media/
Estructura: gs://makilovers-media/productos/{categoria}/{sku}/
```

#### OPCIÓN C: Proveedor Externo (Cloudinary/Imgix)
```
✅ Ventajas: Transformaciones dinámicas, optimización automática
❌ Desventajas: Dependencia externa, costo variable

Útil para: resize dinámico, webp automático, crop inteligente
```

---

## 3️⃣ VERSIONADO DE IMÁGENES

**Escenario:** Mismo producto, foto nueva (cambio de emplate, mejora)

### Estrategia: Timestamp Implícito

```javascript
imagenes: {
  principal: {
    // v1.0 - foto original 2026-03-08
    url: "/assets/images/productos/.../MAK-PHIL-RSE-8_v1.webp?cache=2026-03",
    
    // v2.0 - foto mejorada 2026-06-15
    url: "/assets/images/productos/.../MAK-PHIL-RSE-8_v2.webp?cache=2026-06",
  }
}
```

O bien usar fecha en URL:
```
/assets/images/productos/.../MAK-PHIL-RSE-8.webp?updated=1709875200
```

---

## 4️⃣ ALT TEXT Y ACCESIBILIDAD

**Patrón:** `{Nombre Comercial} - {Descripción Visual Clave}`

```
❌ Mal: "imagen-1.jpg", "producto.webp"

✅ Bien: "Ramen de Salmón Atlántico - cuenco blanco con fideos y caldo umami"
✅ Bien: "Maki Philadelphia Especial - 8 piezas sobre plato blanco con wasabi y jengibre"
✅ Bien: "Sashimi de Salmón Premium - 6 rodajas frescas del Atlántico, presentación minimalista"
```

Incluir: 
- Nombre producto
- Cantidad/porción
- Color/presentación visual
- Acompañamientos visibles

---

## 5️⃣ INTEGRACIÓN CON FIRESTORE

### Documento SKU con Imágenes

```javascript
{
  skuId: "MAK-PHIL-RSE-8",
  productoId: "maki-philadelphia",
  nombre: "Maki Philadelphia Rojo Especial - 8 piezas",
  slug: "mak-philadelphia-especial-8",
  
  presentacion: {
    cantidad: 8,
    unidad: "piezas"
  },
  
  imagenes: {
    principal: {
      webp: "/assets/images/productos/makis/MAK-PHIL-RSE/MAK-PHIL-RSE-8.webp",
      jpg: "/assets/images/productos/makis/MAK-PHIL-RSE/MAK-PHIL-RSE-8.jpg",
      alt: "Maki Philadelphia Rojo Especial - 8 piezas, cubierto de salmón rojo y hueva de trucha",
      width: 400,
      height: 400
    },
    detalle: {
      webp: "/assets/images/productos/makis/MAK-PHIL-RSE/MAK-PHIL-RSE-DETAIL.webp",
      jpg: "/assets/images/productos/makis/MAK-PHIL-RSE/MAK-PHIL-RSE-DETAIL.jpg",
      alt: "Detalle de ingredientes: salmón fresco, queso crema, pepino, aguacate, cúrcuma",
      width: 600,
      height: 400
    }
  },
  
  badges: {
    popular: true,
    nuevoEnCarta: false,
    premium: true
  },
  
  metadata: {
    fotografia: {
      fotografo: "Chef Visual Makilovers",
      fecha: "2026-03-08",
      equipoUsado: "Canon EOS 5D Mark IV + Lente 50mm"
    },
    seo: {
      title: "Maki Philadelphia Rojo Especial | Makilovers",
      description: "Exquisito maki de salmón fresco del Atlántico con queso crema y hueva de trucha. 8 piezas",
      keywords: ["maki", "philadelphia", "salmón", "rojo especial"]
    }
  }
}
```

---

## 6️⃣ CHECKLIST DE IMPLEMENTACIÓN

- [ ] Definir prefijos categóricos finales (con cliente)
- [ ] Crear estructura de directorios `/assets/images/`
- [ ] Fotografiar todos los SKUs (estándar visual)
- [ ] Optimizar imágenes (WebP + JPG)
- [ ] Generar ALT text descriptivos
- [ ] Cargar a Firebase Cloud Storage o almacenamiento local
- [ ] Actualizar schema Firestore con URLs
- [ ] Probar en múltiples dispositivos (móvil/tablet/desktop)
- [ ] Verficiar velocidad de carga (Lighthouse)

---

## 7️⃣ PREGUNTAS PENDIENTES

1. **¿Dónde se toman las fotos?** ¿Studio fotográfico o in-situ en restaurante?
2. **¿Quién gestiona actualizaciones de imágenes?** ¿Admin dashboard futura?
3. **¿Multi-idioma en ALT text?** ¿Solo español o también inglés?
4. **¿Variantes de color/presentación por temporada?** (Ej: menú estival diferente)
5. **¿Sistema de rating con fotos de usuarios?** (galería de clientes)

---

> **Documento vivo | Próxima revisión: Mayo 2026**
