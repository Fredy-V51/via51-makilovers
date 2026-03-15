#!/usr/bin/env python3
"""
Script para agregar estructura de imagen a todos los productos en menu_makilovers_completo.json
"""

import json
from pathlib import Path

def agregar_imagenes_a_productos():
    # Cargar el JSON
    with open('menu_makilovers_completo.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Mapeo de categorías a directorios
    categoria_dirs = {
        'entradas_sashimi': 'entradas_sashimi',
        'entradas_alitas': 'entradas_alitas',
        'sopas_ramen': 'sopas_ramen',
        'makis_frios': 'makis_frios',
        'bebidas': 'bebidas'
    }

    # Procesar cada categoría
    for categoria_key, productos in data['productos'].items():
        if categoria_key not in categoria_dirs:
            continue

        for producto in productos:
            if 'imagen' not in producto:
                sku = producto['sku']
                nombre = producto['nombre']
                categoria_dir = categoria_dirs[categoria_key]

                # Crear estructura de imagen
                producto['imagen'] = {
                    'existe_en_disco': False,
                    'nombre_recomendado': f'{sku}.webp',
                    'alt_text': f'{nombre} - Plato típico de Makilovers'
                }

                print(f"✅ Agregada estructura imagen a {sku}")

    # Guardar el JSON actualizado
    with open('menu_makilovers_completo.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print("🎉 Estructura de imágenes agregada a todos los productos!")

if __name__ == "__main__":
    agregar_imagenes_a_productos()