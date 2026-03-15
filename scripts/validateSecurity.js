#!/usr/bin/env node
/**
 * Script de Validación de Seguridad - Makilovers
 * Verifica que las credenciales estén protegidas correctamente
 * 
 * Uso: node scripts/validateSecurity.js
 */

const fs = require('fs');
const path = require('path');

const COLORS = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m'
};

function log(message, color = 'reset') {
    console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

log('\n🔐 VALIDACIÓN DE SEGURIDAD - MAKILOVERS\n', 'blue');

const checks = [];

// ✓ Check 1: .env existe pero NO se trackea
const envPath = path.join(__dirname, '..', '.env');
const envExists = fs.existsSync(envPath);
checks.push({
    name: '.env existe (archivo local)',
    status: envExists,
    critical: false
});

// ✓ Check 2: .gitignore contiene .env
const gitignorePath = path.join(__dirname, '..', '.gitignore');
const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
const envInGitignore = gitignoreContent.includes('.env');
checks.push({
    name: '.env está en .gitignore',
    status: envInGitignore,
    critical: true,
    message: envInGitignore 
        ? '✓ Credenciales protegidas en git' 
        : '✗ CRÍTICO: .env no está en .gitignore'
});

// ✓ Check 3: .env.example existe (para referencia)
const envExamplePath = path.join(__dirname, '..', '.env.example');
const envExampleExists = fs.existsSync(envExamplePath);
checks.push({
    name: '.env.example existe (sin credenciales)',
    status: envExampleExists,
    critical: true,
    message: envExampleExists 
        ? '✓ Referencia de ejemplo disponible' 
        : '✗ .env.example no encontrado'
});

// ✓ Check 4: firebaseConfig.js existe
const firebaseConfigPath = path.join(__dirname, '..', 'firebaseConfig.js');
const firebaseConfigExists = fs.existsSync(firebaseConfigPath);
checks.push({
    name: 'firebaseConfig.js existe (configuración centralizada)',
    status: firebaseConfigExists,
    critical: true,
    message: firebaseConfigExists 
        ? '✓ Configuración centralizada implementada' 
        : '✗ firebaseConfig.js no encontrado'
});

// ✓ Check 5: menuService.js usa firebaseConfig
const menuServicePath = path.join(__dirname, '..', 'menuService.js');
const menuServiceContent = fs.readFileSync(menuServicePath, 'utf8');
const usesFirebaseConfig = menuServiceContent.includes('firebaseConfig');
checks.push({
    name: 'menuService.js usa firebaseConfig.js',
    status: usesFirebaseConfig,
    critical: true,
    message: usesFirebaseConfig 
        ? '✓ Integración de seguridad confirmada' 
        : '✗ menuService no integra firebaseConfig'
});

// ✓ Check 6: server.js carga dotenv
const serverPath = path.join(__dirname, '..', 'server.js');
const serverContent = fs.readFileSync(serverPath, 'utf8');
const serverLoadsDotenv = serverContent.includes('dotenv');
checks.push({
    name: 'server.js carga dotenv',
    status: serverLoadsDotenv,
    critical: true,
    message: serverLoadsDotenv 
        ? '✓ Variables de entorno cargadas al iniciar' 
        : '✗ server.js no carga dotenv'
});

// ✓ Check 7: No hay credenciales hardcodeadas reales (no ejemplos)
const filesToCheck = ['server.js', 'menuService.js', 'firebaseConfig.js'];
let noHardcodedCredentials = true;
for (const file of filesToCheck) {
    const filePath = path.join(__dirname, '..', file);
    const content = fs.readFileSync(filePath, 'utf8');
    // Detectar credenciales reales (no referencias de ejemplo)
    // Las referencias reales de API keys comienzan con AIzaSy y son muy largas
    const realAPIKeyPattern = /AIzaSy[a-zA-Z0-9_-]{30,}/;
    if (realAPIKeyPattern.test(content)) {
        noHardcodedCredentials = false;
        break;
    }
}
checks.push({
    name: 'Sin credenciales hardcodeadas en código',
    status: noHardcodedCredentials,
    critical: true,
    message: noHardcodedCredentials 
        ? '✓ Credenciales protegidas (NO en código)' 
        : '✗ CRÍTICO: Se encontraron credenciales hardcodeadas'
});

// ✓ Check 8: package.json tiene dotenv
const packagePath = path.join(__dirname, '..', 'package.json');
const packageContent = fs.readFileSync(packagePath, 'utf8');
const hasDotenv = packageContent.includes('dotenv');
checks.push({
    name: 'package.json incluye dotenv',
    status: hasDotenv,
    critical: false,
    message: hasDotenv 
        ? '✓ Dependencia de dotenv configurada' 
        : 'ℹ dotenv no está en package.json'
});

// Mostrar resultados
log('\n' + '─'.repeat(60), 'blue');

let criticalFailed = false;
checks.forEach(check => {
    const icon = check.status ? '✓' : '✗';
    const color = check.status ? 'green' : 'red';
    log(`${icon} ${check.name}`, color);
    if (check.message) {
        log(`  ${check.message}`, check.status ? 'green' : 'red');
    }
    if (!check.status && check.critical) {
        criticalFailed = true;
    }
});

log('─'.repeat(60) + '\n', 'blue');

// Resumen
const passed = checks.filter(c => c.status).length;
const total = checks.length;

if (criticalFailed) {
    log(`⚠️  VALIDACIÓN INCOMPLETA: ${passed}/${total} checks`, 'red');
    log('Hay problemas CRÍTICOS de seguridad que deben resolverse.\n', 'red');
    process.exit(1);
} else {
    log(`✓ VALIDACIÓN EXITOSA: ${passed}/${total} checks`, 'green');
    log('Todas las protecciones de seguridad están en lugar.\n', 'green');
    
    log('📋 PRÓXIMOS PASOS:', 'yellow');
    console.log(`  1. Coloca tu serviceAccountKey.json en un lugar seguro`);
    console.log(`  2. Configura: export GOOGLE_APPLICATION_CREDENTIALS="/ruta/al/archivo.json"`);
    console.log(`  3. Ejecuta: npm install`);
    console.log(`  4. Inicia: node server.js\n`);
    process.exit(0);
}
