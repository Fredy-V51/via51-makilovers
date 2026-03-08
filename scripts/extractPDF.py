#!/usr/bin/env python3
"""
Script de Extracción: PDF → JSON para Firestore
Extrae todos los datos de la carta digital Makilovers
"""

import PyPDF2
import json
import re
from pathlib import Path

def extract_pdf_text(pdf_path):
    """Extrae texto del PDF"""
    print(f"📄 Leyendo PDF: {pdf_path}")
    
    text = ""
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            num_pages = len(pdf_reader.pages)
            print(f"📊 Total de páginas: {num_pages}")
            
            for page_num, page in enumerate(pdf_reader.pages, 1):
                print(f"  📝 Procesando página {page_num}/{num_pages}...", end='\r')
                text += page.extract_text()
        
        print(f"  ✅ Extracción completada                    ")
        return text
    
    except Exception as e:
        print(f"❌ Error al leer PDF: {e}")
        return None

def save_extracted_text(text, output_path):
    """Guarda el texto extraído"""
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(text)
    print(f"✅ Texto guardado en: {output_path}")

def parse_menu_structure(text):
    """
    Intenta parsear la estructura del menú desde el texto
    Busca patrones comunes en cartas: títulos, precios, descripciones
    """
    print("\n🔍 Analizando estructura del menú...")
    
    lines = text.split('\n')
    
    # Buscar patrones
    categories = []
    current_category = None
    products = []
    
    for i, line in enumerate(lines):
        line = line.strip()
        if not line:
            continue
        
        # Heurística: líneas en mayúscula frecuentemente son títulos
        if line.isupper() and len(line) > 3 and len(line) < 50:
            if current_category and current_category not in categories:
                categories.append(current_category)
            current_category = line
            print(f"  📂 Categoría encontrada: {current_category}")
        
        # Heurística: números con decimales son precios
        if re.search(r'\d+\.\d{2}', line):
            products.append({
                'linea': i,
                'texto': line,
                'categoria': current_category
            })
    
    return {
        'categorias': categories,
        'lineas_precio': len(products),
        'preview_productos': products[:5]
    }

def main():
    pdf_path = Path('/workspaces/makilovers/docs/Digital_Carta_Makilovers_v01.12.pdf')
    output_txt = Path('/workspaces/makilovers/docs/carta_extracted.txt')
    
    if not pdf_path.exists():
        print(f"❌ PDF no encontrado: {pdf_path}")
        return
    
    # Extrae texto
    text = extract_pdf_text(str(pdf_path))
    if not text:
        return
    
    # Guarda texto
    save_extracted_text(text, str(output_txt))
    
    # Analiza estructura
    structure = parse_menu_structure(text)
    
    # Muestra resumen
    print("\n" + "=" * 80)
    print("ANÁLISIS DE ESTRUCTURA")
    print("=" * 80)
    print(f"\n📂 Categorías encontradas: {len(structure['categorias'])}")
    for cat in structure['categorias'][:10]:
        print(f"  • {cat}")
    
    print(f"\n💰 Líneas con precios detectadas: {structure['lineas_precio']}")
    
    print("\n" + "=" * 80)
    print("PREVIEW - Primeros 1500 caracteres del PDF:")
    print("=" * 80)
    print(text[:1500])
    print("\n..." if len(text) > 1500 else "")
    
    print("\n" + "=" * 80)
    print(f"✅ Extracción completada. Revisa: {output_txt}")
    print("=" * 80)

if __name__ == '__main__':
    main()
