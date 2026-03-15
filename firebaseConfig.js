/**
 * Configuración centralizada de Firebase
 * Carga credenciales desde variables de entorno (.env)
 * Nunca hardcódea secretos - SOLO para desarrollo local
 */

const admin = require('firebase-admin');

let db = null;
let initialized = false;

/**
 * Inicializa Firebase Admin SDK
 * Lee credenciales desde GOOGLE_APPLICATION_CREDENTIALS (variable de entorno)
 */
function initializeFirebase() {
    if (initialized && db) {
        return db;
    }

    try {
        // Si estamos usando el emulador
        if (process.env.FIRESTORE_EMULATOR_HOST) {
            console.log('🔧 Usando Firestore Emulator:', process.env.FIRESTORE_EMULATOR_HOST);
            if (!admin.apps.length) {
                admin.initializeApp({
                    projectId: 'makilovers-dev'
                });
            }
            db = admin.firestore();
            db.settings({
                host: process.env.FIRESTORE_EMULATOR_HOST.split(':')[0],
                port: parseInt(process.env.FIRESTORE_EMULATOR_HOST.split(':')[1]),
                ssl: false
            });
            initialized = true;
            return db;
        }

        // Verificar que la variable de entorno esté configurada
        if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            console.warn(
                '⚠️  GOOGLE_APPLICATION_CREDENTIALS no está configurado.\n' +
                '   Firestore no estará disponible.\n' +
                '   Usar: export GOOGLE_APPLICATION_CREDENTIALS="/ruta/a/serviceAccountKey.json"'
            );
            return null;
        }

        // Inicializar Admin SDK con credenciales del archivo especificado
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.applicationDefault()
            });
            console.log('✅ Firebase Admin SDK inicializado correctamente');
        }

        db = admin.firestore();
        initialized = true;
        return db;

    } catch (error) {
        console.error('❌ Error al inicializar Firebase:', error.message);
        return null;
    }
}

/**
 * Obtiene la instancia de Firestore (singleton)
 */
function getFirestore() {
    if (!db) {
        return initializeFirebase();
    }
    return db;
}

/**
 * Verifica si Firebase está disponible
 */
function isFirebaseAvailable() {
    return process.env.USE_FIRESTORE === 'true' && getFirestore() !== null;
}

/**
 * Verifica si estamos en modo mock (para testing)
 */
function isMockMode() {
    return process.env.USE_FIRESTORE === 'false' || getFirestore() === null;
}

module.exports = {
    initializeFirebase,
    getFirestore,
    isFirebaseAvailable,
    isMockMode
};
