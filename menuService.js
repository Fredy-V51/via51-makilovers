const fs = require('fs');
const path = require('path');
const { getFirestore, isFirebaseAvailable } = require('./firebaseConfig');

/**
 * Servicio de menú para Makilovers
 * Arquitectura escalable para gestión de catálogo dinámico
 */
class MenuService {
    constructor() {
        this.menuPath = path.join(__dirname, 'menu.json');
        this.menuData = null;
        this.useFirestore = process.env.USE_FIRESTORE === 'true';
    }

    /**
     * Carga el menú desde la fuente configurada
     * (archivo JSON o Firestore en modo asíncrono)
     */
    async cargarMenu() {
        if (this.useFirestore) {
            return this._cargarMenuFirestore();
        }
        return this._cargarMenuFile();
    }

    _cargarMenuFile() {
        try {
            if (!this.menuData) {
                const data = fs.readFileSync(this.menuPath, 'utf8');
                this.menuData = JSON.parse(data);
            }
            return this.menuData;
        } catch (error) {
            if (error.code === 'ENOENT') {
                throw new Error(`Archivo de menú no encontrado: ${this.menuPath}`);
            } else if (error instanceof SyntaxError) {
                throw new Error(`Error de sintaxis en el archivo de menú: ${error.message}`);
            } else {
                throw new Error(`Error al cargar el menú: ${error.message}`);
            }
        }
    }

    async _cargarMenuFirestore() {
        if (this.menuData) return this.menuData;
        
        const db = getFirestore();
        if (!db) {
            throw new Error('Firestore no está disponible. Verifica GOOGLE_APPLICATION_CREDENTIALS y USE_FIRESTORE');
        }

        try {
            const snapshot = await db.collection('menu').get();
            const data = {};
            snapshot.forEach(doc => {
                data[doc.id] = doc.data();
            });
            this.menuData = data;
            return data;
        } catch (error) {
            throw new Error(`Error al leer menú desde Firestore: ${error.message}`);
        }
    }

    /**
     * Obtiene los platos de una categoría específica
     * @param {string} categoria - Nombre de la categoría (ej: 'sopas', 'makis')
     * @returns {Array} Array de platos de la categoría
     * @throws {Error} Si la categoría no existe o hay datos inválidos
     */
    async obtenerMenu(categoria) {
        if (typeof categoria !== 'string' || !categoria.trim()) {
            throw new Error('La categoría debe ser una cadena no vacía');
        }

        const categoriaLower = categoria.toLowerCase();
        const menu = await this.cargarMenu();

        if (!menu[categoriaLower]) {
            throw new Error(`Categoría '${categoria}' no encontrada en el menú`);
        }

        const categoriaData = menu[categoriaLower];

        if (!categoriaData.platos || !Array.isArray(categoriaData.platos)) {
            throw new Error(`Estructura inválida para la categoría '${categoria}'`);
        }

        // Validar y filtrar platos con datos completos
        const platosValidos = categoriaData.platos.filter(plato => {
            if (!plato.nombre || !plato.precio) {
                console.warn(`Plato inválido en ${categoria}: ${JSON.stringify(plato)}`);
                return false;
            }

            // Verificar que al menos un precio esté disponible
            const precios = Object.values(plato.precio);
            if (precios.length === 0 || precios.every(p => p === null || p === undefined)) {
                console.warn(`Precios faltantes para ${plato.nombre} en ${categoria}`);
                return false;
            }

            return true;
        });

        return {
            categoria: categoriaData.categoria,
            nombreCategoria: categoriaData.nombreCategoria,
            icono: categoriaData.icono,
            platos: platosValidos
        };
    }

    /**
     * Lista todas las categorías disponibles
     * @returns {Array} Array de nombres de categorías
     */
    async obtenerCategorias() {
        const menu = await this.cargarMenu();
        return Object.keys(menu);
    }

    /**
     * Busca un plato específico por código
     * @param {string} codigo - Código del plato
     * @returns {Object|null} Plato encontrado o null
     */
    async buscarPlatoPorCodigo(codigo) {
        const menu = await this.cargarMenu();

        for (const categoria of Object.values(menu)) {
            const plato = categoria.platos.find(p => p.codigo === codigo);
            if (plato) {
                return {
                    ...plato,
                    categoria: categoria.categoria
                };
            }
        }

        return null;
    }
}

// Instancia singleton del servicio
const menuService = new MenuService();

// Exportar funciones asincrónicas
module.exports = {
    obtenerMenu: (categoria) => menuService.obtenerMenu(categoria),
    obtenerCategorias: () => menuService.obtenerCategorias(),
    buscarPlatoPorCodigo: (codigo) => menuService.buscarPlatoPorCodigo(codigo)
};