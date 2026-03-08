#!/usr/bin/env python3
"""
Script para descargar imágenes de productos desde Unsplash
Usa la API gratuita de Unsplash para obtener imágenes relacionadas con comida
"""

import requests
import json
import os
from pathlib import Path

# Cargar configuración de productos
with open('menu_makilovers_completo.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Mapeo de categorías a términos de búsqueda en inglés
SEARCH_TERMS = {
    'entradas_sashimi': 'sashimi fresh fish',
    'entradas_alitas': 'chicken wings asian',
    'sopas_ramen': 'ramen soup japanese',
    'makis_frios': 'sushi rolls cold',
    'bebidas': 'drink beverage'
}

def download_image(url, filepath):
    """Descarga una imagen desde URL"""
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()

        with open(filepath, 'wb') as f:
            f.write(response.content)
        print(f"✅ Descargada: {filepath}")
        return True
    except Exception as e:
        print(f"❌ Error descargando {filepath}: {e}")
        return False

def get_unsplash_image(search_term):
    """Obtiene URL de imagen desde Lorem Picsum (gratuito, sin API key)"""
    # Usando Lorem Picsum para imágenes aleatorias 600x600 webp
    # https://picsum.photos/600/600.webp
    return f"https://picsum.photos/600/600.webp?random={hash(search_term) % 1000}"

def main():
    base_dir = Path('public/assets/images/productos')

    for categoria, productos in data['productos'].items():
        if categoria not in SEARCH_TERMS:
            continue

        categoria_dir = base_dir / categoria
        categoria_dir.mkdir(exist_ok=True)

        search_term = SEARCH_TERMS[categoria]

        for producto in productos:
            sku = producto['sku']
            filename = f"{sku}.webp"
            filepath = categoria_dir / filename

            if filepath.exists():
                print(f"⏭️  Ya existe: {filepath}")
                continue

            # Obtener URL de imagen
            image_url = get_unsplash_image(search_term)

            # Descargar
            success = download_image(image_url, filepath)
            if success:
                # Actualizar el JSON indicando que existe
                producto['imagen']['existe_en_disco'] = True

    # Guardar JSON actualizado
    with open('menu_makilovers_completo.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print("🎉 Proceso completado!")

if __name__ == "__main__":
    main()