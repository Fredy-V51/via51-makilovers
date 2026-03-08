/**
 * Menu App - Makilovers Frontend
 * Carga y visualiza productos desde API/Firestore
 */

class MenuApp {
    constructor() {
        this.productos = [];
        this.productosFiltrados = [];
        this.filtroActual = 'todos';
        this.init();
    }

    async init() {
        console.log('🚀 Inicializando Menu App...');
        
        try {
            // Intentar cargar desde API
            await this.cargarProductos();
            this.renderizarProductos();
            this.configurarEventos();
            document.getElementById('loader').style.display = 'none';
            document.getElementById('productosGrid').style.display = 'grid';
        } catch (error) {
            console.error('❌ Error al cargar:', error);
            this.mostrarError('Error al cargar el menú. Por favor, intenta más tarde.');
        }
    }

    async cargarProductos() {
        console.log('📥 Cargando productos...');
        
        try {
            // Intentar desde API
            const response = await fetch('/categorias');
            if (response.ok) {
                const categorias = await response.json();
                await this.procesarDesdeCategorias(categorias);
                return;
            }
        } catch (e) {
            console.warn('API no disponible, usando datos locales...');
        }

        // Fallback: datos locales hardcodeados
        this.cargarDatosLocales();
    }

    async procesarDesdeCategorias(categorias) {
        console.log('🔄 Procesando desde categorías...');
        this.productos = [];

        for (const cat of categorias) {
            try {
                const response = await fetch(`/menu/${cat}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.platos) {
                        this.productos.push(
                            ...data.platos.map(p => ({
                                ...p,
                                categoria_original: cat,
                                categoria_display: this.normalizarCategoria(cat)
                            }))
                        );
                    }
                }
            } catch (e) {
                console.warn(`No se pudo cargar categoría ${cat}`);
            }
        }

        console.log(`✅ ${this.productos.length} productos cargados`);
    }

    cargarDatosLocales() {
        /**
         * Datos de ejemplo mientras Firestore está siendo actualizada
         * Estos datos provienen del PDF de Makilovers
         */
        this.productos = [
            // ENTRADAS - SASHIMI
            {
                sku: 'ENT-SAS-SAL-01',
                nombre: 'Sashimi de Salmón',
                categoria_display: 'Entradas',
                categoria_filtro: 'entradas',
                subcategoria: 'Sashimi',
                descripcion: 'Sashimi de Salmón fresco del Atlántico, 4 cortes',
                presentacion: '4 cortes',
                precio: 18.00,
                moneda: 'PEN',
                alergenos: ['Pescado'],
                emoji: '🐟'
            },
            {
                sku: 'ENT-SAS-ATU-01',
                nombre: 'Sashimi de Atún',
                categoria_display: 'Entradas',
                categoria_filtro: 'entradas',
                subcategoria: 'Sashimi',
                descripcion: 'Atún rojo de excelente textura. 4 cortes frescos',
                presentacion: '4 cortes',
                precio: 15.00,
                moneda: 'PEN',
                alergenos: ['Pescado'],
                emoji: '🐟'
            },
            {
                sku: 'ENT-ALI-BBQ-01',
                nombre: 'Alitas BBQ',
                categoria_display: 'Entradas',
                categoria_filtro: 'entradas',
                subcategoria: 'Alitas',
                descripcion: 'Alitas crujientes con salsa BBQ artesanal. 6 piezas',
                presentacion: '6 unidades',
                precio: 20.00,
                moneda: 'PEN',
                alergenos: ['Gluten'],
                emoji: '🍗'
            },
            {
                sku: 'ENT-ALI-TER-01',
                nombre: 'Alitas Teriyaki',
                categoria_display: 'Entradas',
                categoria_filtro: 'entradas',
                subcategoria: 'Alitas',
                descripcion: 'Alitas glazeadas con salsa teriyaki oriental. 6 piezas',
                presentacion: '6 unidades',
                precio: 20.00,
                moneda: 'PEN',
                alergenos: ['Soya', 'Gluten'],
                emoji: '🍗'
            },
            // SOPAS
            {
                sku: 'SOP-RAM-CAS-01',
                nombre: 'Ramen',
                categoria_display: 'Sopas',
                categoria_filtro: 'sopas',
                subcategoria: 'Ramen',
                descripcion: 'Caldo intenso con fideos ramen y vegetales frescos',
                presentacion: 'M: S/ 24 | L: S/ 32',
                precio_mediano: 24.00,
                precio_grande: 32.00,
                moneda: 'PEN',
                alergenos: ['Gluten', 'Soya'],
                emoji: '🍜'
            },
            {
                sku: 'SOP-RAM-ESP-01',
                nombre: 'Ramen Especial',
                categoria_display: 'Sopas',
                categoria_filtro: 'sopas',
                subcategoria: 'Ramen',
                descripcion: 'Ramen con champiñones, cerdo, langostino y más',
                presentacion: 'M: S/ 26 | L: S/ 34',
                precio_mediano: 26.00,
                precio_grande: 34.00,
                moneda: 'PEN',
                alergenos: ['Gluten', 'Soya', 'Pescado', 'Mariscos'],
                emoji: '🍜'
            },
            {
                sku: 'SOP-MIS-TRA-01',
                nombre: 'Misoshiru',
                categoria_display: 'Sopas',
                categoria_filtro: 'sopas',
                subcategoria: 'Sopas',
                descripcion: 'Tradicional, simple y deliciosa. Miso, nori y tofu',
                presentacion: 'M: S/ 15 | L: S/ 20',
                precio_mediano: 15.00,
                precio_grande: 20.00,
                moneda: 'PEN',
                alergenos: ['Soya', 'Gluten'],
                emoji: '🍜'
            },
            // MAKIS
            {
                sku: 'MAK-FRI-ACE-01',
                nombre: 'Maki Acevichado',
                categoria_display: 'Makis',
                categoria_filtro: 'makis',
                subcategoria: 'Makis Fríos',
                descripcion: 'Langostino empanizado con pescado y salsa acevichada',
                presentacion: '8 piezas',
                precio: 28.00,
                moneda: 'PEN',
                alergenos: ['Pescado', 'Mariscos', 'Gluten'],
                emoji: '🍣'
            },
            {
                sku: 'MAK-FRI-PHI-01',
                nombre: 'Philadelphia Roll',
                categoria_display: 'Makis',
                categoria_filtro: 'makis',
                subcategoria: 'Makis Fríos',
                descripcion: 'Queso crema y salmón cubiertos con ajonjolí blanco',
                presentacion: '8 piezas',
                precio: 25.00,
                moneda: 'PEN',
                alergenos: ['Pescado', 'Lácteos', 'Sésamo'],
                emoji: '🍣'
            },
            {
                sku: 'MAK-FRI-CAL-01',
                nombre: 'California Roll',
                categoria_display: 'Makis',
                categoria_filtro: 'makis',
                subcategoria: 'Makis Fríos',
                descripcion: 'Langostino, queso crema y palta con ajonjolí blanco',
                presentacion: '8 piezas',
                precio: 24.00,
                moneda: 'PEN',
                alergenos: ['Mariscos', 'Gluten', 'Sésamo'],
                emoji: '🍣'
            }
        ];

        console.log(`✅ ${this.productos.length} productos cargados localmente`);
    }

    normalizarCategoria(cat) {
        const mapa = {
            'sopas': 'Sopas',
            'makis': 'Makis',
            'sashimi': 'Entradas',
            'entradas': 'Entradas'
        };
        return mapa[cat.toLowerCase()] || cat;
    }

    configurarEventos() {
        // Filtros
        document.querySelectorAll('.filtro-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.filtrar(e.target.dataset.filtro, e.target));
        });

        // Búsqueda
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.buscar(e.target.value);
        });

        // Cargar ubicaciones
        this.cargarUbicaciones();
    }

    filtrar(filtro, btn) {
        this.filtroActual = filtro;
        document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (filtro === 'todos') {
            this.productosFiltrados = [...this.productos];
        } else {
            this.productosFiltrados = this.productos.filter(p => 
                p.categoria_filtro === filtro
            );
        }

        this.renderizarProductos();
    }

    buscar(termino) {
        termino = termino.toLowerCase().trim();
        
        if (!termino) {
            this.filtrar(this.filtroActual, document.querySelector(`.filtro-btn[data-filtro="${this.filtroActual}"]`));
            return;
        }

        this.productosFiltrados = this.productos.filter(p =>
            p.nombre.toLowerCase().includes(termino) ||
            p.descripcion.toLowerCase().includes(termino) ||
            p.sku.toLowerCase().includes(termino)
        );

        this.renderizarProductos();
    }

    renderizarProductos() {
        const grid = document.getElementById('productosGrid');
        grid.innerHTML = '';

        if (this.productosFiltrados.length === 0) {
            grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-light);">No hay productos que coincidan con tu búsqueda.</div>';
            return;
        }

        this.productosFiltrados.forEach(p => {
            const card = this.crearTarjetaProducto(p);
            grid.appendChild(card);
        });
    }

    crearTarjetaProducto(producto) {
        const card = document.createElement('div');
        card.className = 'producto-card';

        // Imagen
        const imagenDiv = document.createElement('div');
        imagenDiv.className = 'producto-imagen';
        imagenDiv.textContent = producto.emoji || '🍱';
        card.appendChild(imagenDiv);

        // Contenido
        const content = document.createElement('div');
        content.className = 'producto-content';

        // Categoría
        const catP = document.createElement('div');
        catP.className = 'producto-categoria';
        catP.textContent = producto.subcategoria || producto.categoria_display;
        content.appendChild(catP);

        //Nombre
        const nombre = document.createElement('div');
        nombre.className = 'producto-nombre';
        nombre.textContent = producto.nombre;
        content.appendChild(nombre);

        // SKU
        const sku = document.createElement('div');
        sku.className = 'producto-sku';
        sku.textContent = `Código: ${producto.sku}`;
        content.appendChild(sku);

        // Descripción
        const desc = document.createElement('div');
        desc.className = 'producto-descripcion';
        const descTruncada = producto.descripcion.length > 80 
            ? producto.descripcion.substring(0, 77) + '...'
            : producto.descripcion;
        desc.textContent = descTruncada;
        content.appendChild(desc);

        // Presentación
        const pres = document.createElement('div');
        pres.className = 'producto-presentacion';
        pres.textContent = producto.presentacion;
        content.appendChild(pres);

        // Precios
        const preciosDiv = document.createElement('div');
        preciosDiv.className = 'producto-precios';

        if (producto.precio_mediano && producto.precio_grande) {
            // Dos precios
            const precioM = document.createElement('div');
            precioM.className = 'precio';
            precioM.innerHTML = `
                <span class="precio-label">Mediano</span>
                <span class="precio-valor">S/ <span class="precio-moneda">${producto.precio_mediano.toFixed(2)}</span></span>
            `;
            preciosDiv.appendChild(precioM);

            const precioL = document.createElement('div');
            precioL.className = 'precio';
            precioL.innerHTML = `
                <span class="precio-label">Grande</span>
                <span class="precio-valor">S/ <span class="precio-moneda">${producto.precio_grande.toFixed(2)}</span></span>
            `;
            preciosDiv.appendChild(precioL);
        } else {
            // Precio único
            const precioU = document.createElement('div');
            precioU.className = 'precio';
            precioU.innerHTML = `
                <span class="precio-label">Precio</span>
                <span class="precio-valor">S/ <span class="precio-moneda">${producto.precio.toFixed(2)}</span></span>
            `;
            preciosDiv.appendChild(precioU);
        }

        content.appendChild(preciosDiv);

        // Alergenos
        if (producto.alergenos && producto.alergenos.length > 0) {
            const alergenosDiv = document.createElement('div');
            alergenosDiv.className = 'producto-alergenos';
            alergenosDiv.innerHTML = '<strong>⚠️ Alérgenos:</strong><br>' +
                producto.alergenos.map(a => `<span class="alergeno-tag">${a}</span>`).join('');
            content.appendChild(alergenosDiv);
        }

        card.appendChild(content);
        return card;
    }

    cargarUbicaciones() {
        const ubicaciones = [
            {
                nombre: 'Carabayllo S.D.',
                direccion: 'Av. Condorcanqui Mz(s)lote 26',
                whatsapp: '+51 966 876 906'
            },
            {
                nombre: 'Los Olivos',
                direccion: 'Av. los Próceres de Huandoy 7718',
                whatsapp: '+51 979 963 724'
            },
            {
                nombre: 'Comas',
                direccion: 'Av. Micaela Bastidas 822',
                whatsapp: '+51 902 442 383'
            }
        ];

        const container = document.getElementById('ubicaciones');
        ubicaciones.forEach(ub => {
            const div = document.createElement('div');
            div.className = 'ubicacion';
            div.innerHTML = `
                <h3>📍 ${ub.nombre}</h3>
                <p>${ub.direccion}</p>
                <a href="https://wa.me/${ub.whatsapp.replace(/\D/g, '')}" target="_blank" class="ubicacion-whatsapp">
                    💬 ${ub.whatsapp}
                </a>
            `;
            container.appendChild(div);
        });
    }

    mostrarError(mensaje) {
        const loader = document.getElementById('loader');
        loader.innerHTML = `<p style="color: #C0392B;">❌ ${mensaje}</p>`;
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new MenuApp();
});
