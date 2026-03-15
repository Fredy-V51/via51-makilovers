#!/usr/bin/env python3
"""
Parser avanzado: Texto extraído del PDF → JSON Firestore Schema
Extrae: productos, precios, descripciones, categorías
"""

import re
import json
from pathlib import Path
from datetime import datetime

# Mapeo de categorías y subcategorías
CATEGORIA_MAP = {
    'ENTRADAS': {
        'Sashimi': 'SASHIMI',
        'Temaki': 'TEMAKI',
        'Nigiri': 'NIGIRI',
        'Gunkan': 'GUNKAN',
        'Alitas': 'ALITAS'
    },
    'PLATOS_FUERTES': {
        'Ebi Furai': 'FURAI',
        'Chicken Furai': 'FURAI',
        'Sakana Furai': 'FURAI',
        'Dragon Ball': 'FURAI',
        'Sakana Tempura': 'TEMPURA',
        'Ebi Tempura': 'TEMPURA',
        'Tempura Verduras': 'TEMPURA',
        'Tempura Mixta': 'TEMPURA',
        'Yakitori': 'YAKITORI',
        'Ebi Philadelphia': 'ESPECIALES',
        'Tiradito Nikkei': 'ESPECIALES',
        'Ceviche Frito Nikkei': 'ESPECIALES'
    },
    'SOPAS': {
        'Ramen': 'RAMEN',
        'Misoshiru': 'SOPAS',
        'Soba': 'SOPAS',
        'Ebi Ramen': 'RAMEN',
        'Tantanmen Ramen': 'RAMEN',
        'Miso Ramen': 'RAMEN',
        'Shoyu Ramen': 'RAMEN',
        'Shio Ramen': 'RAMEN'
    }
}

def clean_text(text):
    """Limpia espacios y caracteres especiales"""
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'/f_', '', text)  # Limpia artefactos PDF
    return text.strip()

def extract_price(price_str):
    """Extrae precio en formato S/ XX.00"""
    match = re.search(r'S/\s*(\d+)\s*\.\s*(\d+)', price_str)
    if match:
        soles = int(match.group(1))
        centimos = int(match.group(2))
        return float(f"{soles}.{centimos:02d}")
    return None

def parse_productos_simples(text):
    """
    Parsea productos con precio simple: Nombre → S/ XX.00
    Para: Sashimi, Temaki, Nigiri, Gunkan, Alitas
    """
    productos = []
    
    # Patrón: Línea con nombre + eventual asterisco/notas + precio S/ XX.00
    lines = text.split('\n')
    
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        
        # Si la línea tiene un precio S/
        if 'S/' in line and re.search(r'\d+\s*\.\s*\d+', line):
            # Extraer precio al final
            precio_match = re.search(r'S/\s*(\d+)\s*\.\s*(\d+)', line)
            if precio_match:
                precio = extract_price(line)
                
                # El nombre está antes del precio
                nombre = re.sub(r'\s*S/.*', '', line).strip()
                nombre = nombre.replace('*', '').strip()
                
                if nombre and precio:
                    # Buscar descripción en línea anterior si existe
                    descripcion = ""
                    if i > 0:
                        prev = lines[i-1].strip()
                        if prev and not 'S/' in prev and len(prev) > 10:
                            descripcion = clean_text(prev)
                    
                    productos.append({
                        'nombre': clean_text(nombre),
                        'precio_simple': precio,
                        'descripcion': descripcion,
                        'linea': i
                    })
        
        i += 1
    
    return productos

def parse_productos_dobles(text):
    """
    Parsea productos con dos precios: M: S/ XX | L: S/ XX
    Para: Sopas principalmente
    """
    productos = []
    
    # Patrón: M: S/ XX.00  |  L: S/ XX.00
    pattern = r'M:\s*S/\s*(\d+\.\d+)\s*\|\s*L:\s*S/\s*(\d+\.\d+)'
    lines = text.split('\n')
    
    for i, line in enumerate(lines):
        if re.search(pattern, line):
            match = re.search(pattern, line)
            if match:
                precio_m = float(match.group(1))
                precio_l = float(match.group(2))
                
                # El nombre está antes de los precios
                nombre = re.sub(r'\s*M:.*', '', line).strip()
                
                # Buscar descripción en líneas anteriores
                descripcion = ""
                for j in range(max(0, i-3), i):
                    prev = lines[j].strip()
                    if prev and not re.search(r'S/|M:|L:', prev) and len(prev) > 15:
                        descripcion = clean_text(prev)
                        break
                
                if nombre:
                    productos.append({
                        'nombre': clean_text(nombre),
                        'precio_mediano': precio_m,
                        'precio_grande': precio_l,
                        'descripcion': descripcion,
                        'presentacion': 'M/L',
                        'linea': i
                    })
    
    return productos

def generate_sku(nombre, categoria, subcategoria, idx):
    """Genera SKU único basado en el producto"""
    cat_code = categoria[:3].upper()
    subcat_code = subcategoria[:3].upper()
    
    # Tomar primeros 3 caracteres del nombre
    name_code = re.sub(r'[^a-z0-9]', '', nombre.lower())[:3].upper()
    
    return f"{cat_code}-{subcat_code}-{name_code}-{idx:02d}"

def create_producto_firestore(nombre, sku, categoria, subcategoria, 
                              precios, descripcion, unidad="unidades"):
    """
    Crea documento de producto para Firestore
    Sigue el schema estratificado propuesto
    """
    
    producto = {
        "skuId": sku,
        "nombre": nombre,
        "slug": re.sub(r'[^a-z0-9]', '-', nombre.lower()),
        "categoria": categoria,
        "subcategoria": subcategoria,
        "descripcion": descripcion[:80] + ('...' if len(descripcion) > 80 else ''),
        "descripcion_completa": descripcion,
        "unidad": unidad,
        "disponibilidad": True,
        "timestamps": {
            "creado": datetime.now().isoformat(),
            "actualizado": datetime.now().isoformat()
        },
        "imagenes": {
            "principal": None,  # Se completará manualmente
            "detalle": None
        }
    }
    
    # Agregar precios según estructura
    if isinstance(precios, dict):
        if "simple" in precios:
            producto["precio"] = {
                "presentacion": "simple",
                "venta": precios["simple"],
                "costo": precios["simple"] * 0.4,  # Estimación
                "moneda": "PEN"
            }
        elif "presntaciones" in precios:
            producto["precios_multiples"] = precios["presentaciones"]
    
    return producto

def main():
    txt_path = Path('/workspaces/makilovers/docs/carta_extracted.txt')
    json_output = Path('/workspaces/makilovers/docs/menu_estructurado.json')
    
    if not txt_path.exists():
        print("❌ Archivo de texto no encontrado")
        return
    
    print("📖 Leyendo archivo de texto...")
    with open(txt_path, 'r', encoding='utf-8') as f:
        text = f.read()
    
    print("\n🔍 Parseando productos...")
    
    # Parsear diferentes tipos de productos
    productos_simples = parse_productos_simples(text)
    productos_dobles = parse_productos_dobles(text)
    
    print(f"\n✅ Productos simples encontrados: {len(productos_simples)}")
    print(f"✅ Productos con doble presentación (M/L): {len(productos_dobles)}")
    
    # Mostrar algunos ejemplos
    print("\n📋 EJEMPLOS DE PRODUCTOS SIMPLES:")
    for p in productos_simples[:5]:
        print(f"  • {p['nombre']}: S/ {p['precio_simple']:.2f}")
        if p['descripcion']:
            print(f"    └─ {p['descripcion'][:60]}...")
    
    print("\n📋 EJEMPLOS DE SOPAS (M/L):")
    for p in productos_dobles[:5]:
        print(f"  • {p['nombre']}: M S/ {p['precio_mediano']:.2f} | L S/ {p['precio_grande']:.2f}")
        if p['descripcion']:
            print(f"    └─ {p['descripcion'][:60]}...")
    
    # Crear estructura JSON
    menu_json = {
        "generado": datetime.now().isoformat(),
        "version": "1.0",
        "total_productos": len(productos_simples) + len(productos_dobles),
        "productos_simples": productos_simples,
        "productos_dobles": productos_dobles
    }
    
    # Guardar JSON
    with open(json_output, 'w', encoding='utf-8') as f:
        json.dump(menu_json, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ Estructura JSON guardada en: {json_output}")
    print(f"📊 Tamaño: {json_output.stat().st_size} bytes")

if __name__ == '__main__':
    main()
