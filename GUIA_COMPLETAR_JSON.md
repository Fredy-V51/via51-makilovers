# 📋 Guía: Completar menu_makilovers_completo.json

**Estado Actual:** 10 productos de ejemplo incluidos  
**Objetivo:** 40+ productos del PDF

---

## Estructura del JSON Explicada

### Cada producto debe tener:

```javascript
{
  // 🆔 IDENTIFICACIÓN
  "sku": "ENT-ALI-BBQ-01",           // Único, sigue formato CATPREF-TIPO-ESP-NUM
  "nombre": "Alitas BBQ",             // Nombre comercial exacto del PDF
  
  // 📂 CATEGORIZACIÓN
  "categoria_display": "Entradas",    // Para UI
  "categoria_filtro": "entradas",     // Para filtros (minúscula)
  "subcategoria": "Alitas",           // Subgrupo (Sashimi, Ramen, etc)
  
  // 📝 TEXTUAL
  "descripcion_corta": "Alitas crujientes con salsa BBQ",
  "descripcion_larga": "Alitas de pollo empanizadas a la perfección con salsa BBQ artesanal. 6 unidades.",
  "caracteres_desc": 78,             // Longitud para validar max 80 chars
  
  // 📦 PRESENTACIÓN  
  "presentacion": "6 unidades",      // Lo que ve cliente
  
  // 💰 PRECIOS (VARIANTE A: Precio Único)
  "precio": {
    "venta": 20.00,
    "costo_estimado": 8.00,
    "margen_porcentaje": 60,
    "moneda": "PEN"
  },
  
  // 💰 PRECIOS (VARIANTE B: Múltiples - Para Sopas M/L)
  "precios_multiples": {
    "mediano": {
      "peso": "350g",
      "venta": 24.00,
      "costo_estimado": 9.60,
      "margen_porcentaje": 60
    },
    "grande": {
      "peso": "500g", 
      "venta": 32.00,
      "costo_estimado": 12.80,
      "margen_porcentaje": 60
    }
  },
  
  // 🎯 MARCA
  "componentes_marca": {
    "emotional": "Indulgencia crujiente",    // Conexión emocional
    "cualitativo": "Empanizado, sabroso",   // Cualidades
    "cuantitativo": "6 alitas de 50g c/u"   // Medidas
  },
  
  // ⚠️ ALERGENOS
  "alergenos": ["Gluten"],
  "apto_para": ["omnivoros"],
  
  // 🎨 IMAGEN
  "imagen": {
    "existe_en_disco": false,
    "nombre_recomendado": "ENT-ALI-BBQ-01.webp",
    "alt_text": "6 alitas crujientes empanizadas con salsa BBQ..."
  }
}
```

---

## Mapeo de Categorías (del PDF)

### ENTRADAS
```
├── Sashimi (4 cortes)
│   ├── Salmón           → ENT-SAS-SAL-01
│   ├── Atún             → ENT-SAS-ATU-01
│   ├── Pescado blanco   → ENT-SAS-PBL-01
│   ├── Pulpo            → ENT-SAS-PUL-01
│   ├── Langostino       → ENT-SAS-LAN-01
│   └── Sashimi mixto    → ENT-SAS-MIX-01
├── Temaki (1 cono)
│   ├── Emperador        → ENT-TEM-EMP-01
│   ├── California       → ENT-TEM-CAL-01
│   ├── Acevichado       → ENT-TEM-ACE-01
│   ├── Philadelphia     → ENT-TEM-PHI-01
│   └── Spicy kani       → ENT-TEM-SPI-01
├── Nigiri (3 unidades)
│   ├── Salmón           → ENT-NIG-SAL-01
│   ├── Atún             → ENT-NIG-ATU-01
│   ├── Atún tataki      → ENT-NIG-TAT-01
│   ├── Langostino       → ENT-NIG-LAN-01
│   ├── Pulpo            → ENT-NIG-PUL-01
│   ├── Pescado blanco   → ENT-NIG-PBL-01
│   └── Parrillero       → ENT-NIG-PAR-01
├── Gunkan (3 cortes)
│   ├── Salmón           → ENT-GUN-SAL-01
│   ├── Atún             → ENT-GUN-ATU-01
│   ├── Pulpo            → ENT-GUN-PUL-01
│   ├── Conchas abanico  → ENT-GUN-CON-01
│   └── Langostino       → ENT-GUN-LAN-01
├── Alitas (6 unidades)
│   ├── BBQ              → ENT-ALI-BBQ-01
│   ├── Teriyaki         → ENT-ALI-TER-01
│   ├── Buffalo Wings    → ENT-ALI-BUF-01
│   └── Acevichadas      → ENT-ALI-ACE-01
├── Furai
│   ├── Ebi Furai 10     → ENT-FRU-EBI-10
│   ├── Ebi Furai 5      → ENT-FRU-EBI-5
│   ├── Chicken Furai 10 → ENT-FRU-CHK-10
│   ├── Chicken Furai 5  → ENT-FRU-CHK-5
│   ├── Sakana Furai 10  → ENT-FRU-SAK-10
│   ├── Sakana Furai 5   → ENT-FRU-SAK-5
│   ├── Dragon Ball 10   → ENT-FRU-DRA-10
│   └── Dragon Ball 5    → ENT-FRU-DRA-5
└── Tempura
    ├── Sakana Tempura   → ENT-TEM-SAK-01
    ├── Ebi Tempura      → ENT-TEM-EBI-01
    ├── Tempura Verduras → ENT-TEM-VER-01
    └── Tempura Mixta    → ENT-TEM-MIX-01

### SOPAS
```
Ramen (M/L)
├── Ramen           → SOP-RAM-CAS-01
├── Ramen Especial  → SOP-RAM-ESP-01
├── Ramen Especial de la Casa → SOP-RAM-CSA-01
├── Ebi Ramen       → SOP-RAM-EBI-01
├── Tantanmen Ramen → SOP-RAM-TAN-01
├── Miso Ramen      → SOP-RAM-MIS-01
├── Shoyu Ramen     → SOP-RAM-SHO-01
└── Shio Ramen      → SOP-RAM-SHI-01

Otras Sopas (M/L)
├── Misoshiru       → SOP-OTR-MIS-01
└── Soba            → SOP-OTR-SOB-01

### MAKIS (8 piezas por defecto)
```
Makis Fríos
├── Acevichado       → MAK-FRI-ACE-01
├── Huancaína Roll   → MAK-FRI-HUA-01
├── Bechamel Roll    → MAK-FRI-BEC-01
├── Spicy Maguro     → MAK-FRI-SPI-01
├── Emperador        → MAK-FRI-EMP-01
├── Philadelphia Roll → MAK-FRI-PHI-01
├── California Roll   → MAK-FRI-CAL-01
├── Maki Olivo       → MAK-FRI-OLI-01
├── Maki Vegetariano → MAK-FRI-VEG-01
├── Guacamole Roll   → MAK-FRI-GUA-01
├── Mixturita del Mar → MAK-FRI-MIX-01
├── Pulpo Acevichado → MAK-FRI-PUL-01
├── Tiradito Roll    → MAK-FRI-TIR-01
├── Katana Roll      → MAK-FRI-KAT-01
├── Kani Acevichado  → MAK-FRI-KAN-01
├── Harajuku Roll    → MAK-FRI-HAR-01
├── Shiang-Gu        → MAK-FRI-SHI-01
├── Kiuri Tataki     → MAK-FRI-KIU-01
└── Maki Brasa       → MAK-FRI-BRA-01

### ESPECIALES
```
├── Tabla 5 unidades  → ESP-TAB-5UN-01
├── Tabla 10 unidades → ESP-TAB-10U-01
├── Tiradito Nikkei   → ESP-TIR-NIK-01
├── Ceviche Frito Nikkei → ESP-CEV-NIK-01
└── Ebi Philadelphia  → ESP-EBI-PHI-01
```

---

## Ejemplo: Agregar Producto Completo

### Paso 1: Copiar Template
```javascript
{
  "sku": "ENT-SAS-ATU-02",
  "nombre": "Sashimi de Atún Gran Corte",
  "categoria_display": "Entradas",
  "categoria_filtro": "entradas",
  "subcategoria": "Sashimi",
  // ... resto de campos
}
```

### Paso 2: Llenar desde PDF
El PDF dice: **"Atún rojo de excelente textura. 4 cortes"**

```javascript
{
  "sku": "ENT-SAS-ATU-01",
  "nombre": "Sashimi de Atún",
  "descripcion_corta": "Atún rojo de excelente textura",
  "descripcion_larga": "Atún rojo de excelente textura, cada corte una joya del mar. 4 cortes de calidad premium.",
  "caracteres_desc": 75,
  "presentacion": "4 cortes",
  "precio": {
    "venta": 15.00,      // Del PDF
    "costo_estimado": 6.00,  // 15 * 0.4
    "margen_porcentaje": 60,
    "moneda": "PEN"
  }
}
```

### Paso 3: Agregar al JSON
En `menu_makilovers_completo.json`, buscar:

```javascript
"productos": {
  "entradas_sashimi": [
    // ... otros sashimi ...
    {
      // Tu nuevo producto aquí
    }
  ]
}
```

---

## Precios del PDF (Referencia Rápida)

| Producto | Precio |
|----------|--------|
| Sashimi Salmón | S/ 18 |
| Sashimi Atún | S/ 15 |
| Sashimi Pescado Blanco | S/ 20 |
| Sashimi Pulpo | S/ 16 |
| Sashimi Langostino | S/ 38 |
| Sashimi Mixto | S/ 26 |
| Temaki | S/ 20 |
| Nigiri | S/ 15-20 |
| Gunkan | S/ 15-20 |
| Alitas | S/ 20-22 |
| Ebi Furai 10 | S/ 27 |
| Ramen (M) | S/ 24-28 |
| Ramen (L) | S/ 32-36 |
| Makis Fríos | S/ 20-30 |
| Tablas | S/ 20-33 |
| Tiradito/Ceviche | S/ 25-30 |

---

## Script para Completar JSON Automáticamente

Opción: Usar Python para rellenar desde el PDF extraído

```bash
python3 scripts/completarJSON.py
```

(Script a crear con patrones de regex para los precios)

---

## Validación del JSON

```bash
# Validar sintaxis
node -e "require('./menu_makilovers_completo.json')" && echo "✅ JSON válido"

# Contar productos
jq '.productos | to_entries | map(.value | length) | add' menu_makilovers_completo.json

# Ver estructura
jq '.productos | keys' menu_makilovers_completo.json
```

---

## Próximos Pasos

1. **Completar JSON** con 40+ productos del PDF
2. **Validar en navegador** que se cargan todos
3. **Generar/descargar imágenes** 
4. **Ejecutar uploadMenuToFirestore.js**
5. **Testear en Firebase Console**

---

> Documento guía para asistentes o futuros desarrolladores
