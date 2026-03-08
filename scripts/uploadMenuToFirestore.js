/**
 * Script: Cargar Menú a Firestore
 * 
 * Transforma menu_makilovers_completo.json → Colecciones Firestore
 * 
 * Uso:
 *   export USE_FIRESTORE=true
 *   export GOOGLE_APPLICATION_CREDENTIALS="$HOME/.config/firebase/serviceAccountKey.json"
 *   node scripts/uploadMenuToFirestore.js
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { getFirestore, isFirebaseAvailable } = require('../firebaseConfig');

class MenuUploader {
    constructor() {
        this.db = getFirestore();
        if (!this.db) {
            console.error('❌ Firestore no disponible. Verifica las credenciales.');
            process.exit(1);
        }
        this.stats = {
            productos: 0,
            skus: 0,
            nutricion: 0,
            alergenos: 0,
            errores: 0
        };
    }

    async cargarMenu() {
        const menuPath = path.join(__dirname, '../menu_makilovers_completo.json');
        
        if (!fs.existsSync(menuPath)) {
            console.error(`❌ Archivo no encontrado: ${menuPath}`);
            process.exit(1);
        }

        console.log('📖 Leyendo menu_makilovers_completo.json...');
        const menuJSON = JSON.parse(fs.readFileSync(menuPath, 'utf8'));
        
        console.log('\n🚀 Iniciando carga a Firestore...\n');

        await this.cargarMetadatos(menuJSON.metadata);
        await this.cargarProductos(menuJSON.productos);

        this.mostrarResumen();
    }

    async cargarMetadatos(metadata) {
        try {
            console.log('📝 Cargando metadatos de marca...');
            
            const brandRef = this.db.collection('metadata').doc('brand');
            await brandRef.set({
                nombre: metadata.nombre || 'Makilovers',
                tagline: metadata.tagline,
                descripcion: metadata.descripcion_marca,
                eslogan: metadata.eslogan,
                sitio_web: metadata.sitio_web,
                horarios: metadata.horarios,
                ubicaciones: metadata.ubicaciones.map(ub => ({
                    nombre: ub.nombre,
                    direccion: ub.direccion,
                    whatsapp: ub.whatsapp
                })),
                ultimaActualizacion: new Date()
            });

            console.log('✅ Metadatos de marca guardados');
        } catch (error) {
            console.error('❌ Error cargando metadatos:', error.message);
            this.stats.errores++;
        }
    }

    async cargarProductos(productos) {
        for (const [categoria, items] of Object.entries(productos)) {
            try {
                for (const producto of items) {
                    await this.cargarProducto(producto, categoria);
                }
            } catch (error) {
                console.error(`❌ Error en categoría ${categoria}:`, error.message);
                this.stats.errores++;
            }
        }
    }

    async cargarProducto(producto, categoriaKey) {
        try {
            const { sku, nombre, subcategoria, descripcion_larga, presentacion } = producto;

            if (!sku) {
                console.warn(`⚠️  Producto sin SKU: ${nombre}`);
                return;
            }

            // Extraer categoría
            const prefixCat = sku.split('-')[0];
            const categoriaMap = {
                'ENT': 'entradas',
                'SOP': 'sopas',
                'MAK': 'makis',
                'BEB': 'bebidas',
                'PRO': 'promos'
            };
            const categoria = categoriaMap[prefixCat] || 'otros';

            // 1️⃣ Guardar Producto Base
            const productoRef = this.db.collection('productos').doc(sku);
            await productoRef.set({
                skuId: sku,
                nombre: nombre,
                slug: this.generarSlug(nombre),
                categoria: categoria,
                subcategoria: subcategoria,
                descripcion_corta: this.truncarDescripcion(descripcion_larga),
                descripcion_completa: descripcion_larga,
                presentacion: presentacion,
                disponibilidad: true,
                creado: new Date(),
                actualizado: new Date()
            });

            this.stats.productos++;

            // 2️⃣ Guardar SKU con Precios
            if (producto.precios_multiples) {
                await this.cargarSKUsMultiples(sku, producto.precios_multiples);
            } else if (producto.precio) {
                await this.cargarSKUUnico(sku, producto.precio);
            }

            // 3️⃣ Guardar Nutrición
            if (producto.nutricion) {
                await this.cargarNutricion(sku, producto.nutricion);
            }

            // 4️⃣ Guardar Alergenos
            if (producto.alergenos || producto.componentes_marca) {
                await this.cargarAlergenos(sku, producto);
            }

            console.log(`✅ ${sku} - ${nombre}`);

        } catch (error) {
            console.error(`❌ Error guardando ${producto.nombre}:`, error.message);
            this.stats.errores++;
        }
    }

    async cargarSKUsMultiples(skuBase, presentaciones) {
        for (const [tipo, datos] of Object.entries(presentaciones)) {
            try {
                const skuId = `${skuBase}-${tipo.toUpperCase()}`;
                
                const skuRef = this.db.collection('skus').doc(skuId);
                await skuRef.set({
                    skuId: skuId,
                    productoId: skuBase,
                    presentacion: {
                        tipo: tipo,
                        peso: datos.peso,
                        cantidad: 1,
                        unidad: 'plato'
                    },
                    precios: {
                        precioVenta: datos.venta,
                        costoEstimado: datos.costo_estimado,
                        margenPorcentaje: datos.margen_porcentaje,
                        moneda: 'PEN',
                        historialPrecios: [{
                            precio: datos.venta,
                            desde: new Date(),
                            razon: 'Carga inicial'
                        }]
                    },
                    disponibilidad: true,
                    creado: new Date()
                });

                this.stats.skus++;
            } catch (error) {
                console.error(`  ❌ Error en SKU múltiple:`, error.message);
                this.stats.errores++;
            }
        }
    }

    async cargarSKUUnico(skuBase, precio) {
        try {
            const skuRef = this.db.collection('skus').doc(skuBase);
            await skuRef.set({
                skuId: skuBase,
                productoId: skuBase,
                presentacion: {
                    cantidad: 1,
                    unidad: 'unidad'
                },
                precios: {
                    precioVenta: precio.venta,
                    costoEstimado: precio.costo_estimado || precio.venta * 0.4,
                    margenPorcentaje: precio.margen_porcentaje || 60,
                    moneda: precio.moneda || 'PEN',
                    historialPrecios: [{
                        precio: precio.venta,
                        desde: new Date(),
                        razon: 'Carga inicial'
                    }]
                },
                disponibilidad: true,
                creado: new Date()
            });

            this.stats.skus++;
        } catch (error) {
            console.error(`  ❌ Error en SKU único:`, error.message);
            this.stats.errores++;
        }
    }

    async cargarNutricion(skuId, nutricion) {
        try {
            const nutRef = this.db.collection('nutricion').doc(skuId);
            await nutRef.set({
                skuId: skuId,
                ...nutricion,
                ultimaActualizacion: new Date()
            });

            this.stats.nutricion++;
        } catch (error) {
            console.error(`  ❌ Error guardando nutrición:`, error.message);
            this.stats.errores++;
        }
    }

    async cargarAlergenos(skuId, producto) {
        try {
            const alerRef = this.db.collection('alergenos').doc(skuId);
            await alerRef.set({
                skuId: skuId,
                declarados: producto.alergenos || [],
                componentes_marca: producto.componentes_marca || {},
                avisoLegal: 'Este producto puede contener trazas de alérgenos.',
                ultimaActualizacion: new Date(),
                auditadoPor: 'Sistema'
            });

            this.stats.alergenos++;
        } catch (error) {
            console.error(`  ❌ Error guardando alergenos:`, error.message);
            this.stats.errores++;
        }
    }

    generarSlug(nombre) {
        return nombre
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }

    truncarDescripcion(desc) {
        if (!desc) return '';
        return desc.length > 80 ? desc.substring(0, 77) + '...' : desc;
    }

    mostrarResumen() {
        console.log('\n' + '='.repeat(60));
        console.log('✅ CARGA COMPLETADA');
        console.log('='.repeat(60));
        console.log(`📦 Productos: ${this.stats.productos}`);
        console.log(`💰 SKUs: ${this.stats.skus}`);
        console.log(`🥗 Registros nutrición: ${this.stats.nutricion}`);
        console.log(`⚠️  Registros alergenos: ${this.stats.alergenos}`);
        console.log(`❌ Errores: ${this.stats.errores}`);
        console.log('='.repeat(60));
    }
}

// Ejecutar
async function main() {
    if (!isFirebaseAvailable()) {
        console.error('❌ Firebase no está configurado correctamente.');
        console.error('Verifica GOOGLE_APPLICATION_CREDENTIALS y USE_FIRESTORE');
        process.exit(1);
    }

    const uploader = new MenuUploader();
    try {
        await uploader.cargarMenu();
    } catch (error) {
        console.error('❌ Error fatal:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { MenuUploader };
