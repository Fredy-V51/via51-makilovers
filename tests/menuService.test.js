const path = require('path');
const fs = require('fs');

// force the service to use local path relative to test
const menuService = require('../menuService');

describe('MenuService', () => {
    test('obtenerCategorias returns array with "sopas"', async () => {
        const categories = await menuService.obtenerCategorias();
        expect(Array.isArray(categories)).toBe(true);
        expect(categories).toContain('sopas');
    });

    test('obtenerMenu returns valid structure for sopas', async () => {
        const resultado = await menuService.obtenerMenu('sopas');
        expect(resultado).toHaveProperty('categoria', 'SOPAS');
        expect(resultado).toHaveProperty('platos');
        expect(Array.isArray(resultado.platos)).toBe(true);
        expect(resultado.platos.length).toBeGreaterThan(0);
        const plato = resultado.platos[0];
        expect(plato).toHaveProperty('nombre');
        expect(plato).toHaveProperty('precio');
    });

    test('buscarPlatoPorCodigo finds a known item', async () => {
        const ramen = await menuService.buscarPlatoPorCodigo('SO-RAM-C');
        expect(ramen).not.toBeNull();
        expect(ramen.nombre).toMatch(/Ramen/);
    });

    test('buscarPlatoPorCodigo returns null for missing code', async () => {
        const nada = await menuService.buscarPlatoPorCodigo('XXX');
        expect(nada).toBeNull();
    });
});