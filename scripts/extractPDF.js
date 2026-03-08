const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

/**
 * Script de Extracción: PDF → JSON estructurado para Firestore
 * Objetivo: Extraer datos de la carta digital del PDF
 */

async function extraerPDF() {
  const pdfPath = path.join(__dirname, '../docs/Digital_Carta_Makilovers_v01.12.pdf');
  
  try {
    console.log('📄 Iniciando extracción de PDF...');
    console.log(`📍 Archivo: ${pdfPath}`);
    
    const pdfBuffer = fs.readFileSync(pdfPath);
    const data = await pdfParse(pdfBuffer);
    
    console.log(`\n✅ PDF procesado exitosamente`);
    console.log(`📊 Páginas: ${data.numpages}`);
    console.log(`📝 Caracteres totales: ${data.text.length}`);
    
    // Guardar texto crudo para inspección
    const textPath = path.join(__dirname, '../docs/carta_extracted.txt');
    fs.writeFileSync(textPath, data.text);
    console.log(`\n✅ Texto crudo guardado en: docs/carta_extracted.txt`);
    
    // Mostrar preview
    console.log('\n' + '='.repeat(80));
    console.log('PREVIEW - Primeros 2000 caracteres:');
    console.log('='.repeat(80));
    console.log(data.text.substring(0, 2000));
    console.log('...\n');
    
    return data.text;
    
  } catch (error) {
    console.error('❌ Error al procesar PDF:', error.message);
    process.exit(1);
  }
}

// Ejecutar
extraerPDF().catch(console.error);
