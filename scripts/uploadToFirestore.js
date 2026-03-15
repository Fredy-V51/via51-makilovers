#!/usr/bin/env node
/**
 * Script para subir datos del menú desde menu.json a Cloud Firestore
 * Uso: node scripts/uploadToFirestore.js
 * 
 * Variables de entorno requeridas (en .env o exportadas):
 * - GOOGLE_APPLICATION_CREDENTIALS: ruta a archivo JSON de credenciales de Firebase
 */

// Cargar variables de entorno desde .env
require('dotenv').config();

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Verificar si las credenciales están configuradas
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.error('❌ Error: GOOGLE_APPLICATION_CREDENTIALS no está configurada');
    console.error('Usa: export GOOGLE_APPLICATION_CREDENTIALS="/ruta/a/serviceAccountKey.json"');
    process.exit(1);
}

// Inicializar Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault()
    });
}

const db = admin.firestore();

// Cargar datos del menú local
const menuPath = path.join(__dirname, '..', 'menu.json');
const menuData = JSON.parse(fs.readFileSync(menuPath, 'utf8'));

async function uploadMenu() {
    try {
        console.log('📤 Iniciando carga de datos a Firestore...\n');
        
        let totalPlatos = 0;
        let categoriasCargadas = 0;

        for (const [key, categoria] of Object.entries(menuData)) {
            console.log(`📝 Cargando categoría: ${categoria.nombreCategoria}...`);
            
            // Crear documento con la estructura completa de la categoría
            await db.collection('menu').doc(key).set({
                categoria: categoria.categoria,
                nombreCategoria: categoria.nombreCategoria,
                icono: categoria.icono,
                platos: categoria.platos || [],
                timestamp: new Date()
            });
            
            categoriasCargadas++;
            totalPlatos += (categoria.platos || []).length;
            console.log(`   ✅ ${categoria.nombreCategoria}: ${categoria.platos?.length || 0} platos\n`);
        }

        console.log('\n' + '='.repeat(50));
        console.log('✅ Carga completada exitosamente');
        console.log(`   • Categorías cargadas: ${categoriasCargadas}`);
        console.log(`   • Platos totales: ${totalPlatos}`);
        console.log('='.repeat(50) + '\n');

        // Mostrar instrucciones para activar Firestore
        console.log('📌 Próximos pasos:');
        console.log('   1. En el contenedor, ejecuta:');
        console.log('      export USE_FIRESTORE=true');
        console.log('      export GOOGLE_APPLICATION_CREDENTIALS="/ruta/a/serviceAccountKey.json"');
        console.log('   2. Reinicia el servidor: node server.js');
        console.log('   3. Verifica en http://localhost:3000/categorias\n');

    } catch (error) {
        console.error('❌ Error durante la carga:', error.message);
        process.exit(1);
    } finally {
        await admin.app().delete();
    }
}

uploadMenu();
