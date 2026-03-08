const request = require('supertest');
const app = require('../server');

describe('API endpoints', () => {
    test('GET /categorias returns array', async () => {
        const res = await request(app).get('/categorias');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toContain('sopas');
    });

    test('GET /menu/sopas returns valid object', async () => {
        const res = await request(app).get('/menu/sopas');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('categoria', 'SOPAS');
        expect(Array.isArray(res.body.platos)).toBe(true);
    });

    test('GET /plato/SO-RAM-C returns plato details', async () => {
        const res = await request(app).get('/plato/SO-RAM-C');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('nombre');
    });

    test('GET /plato/XXXX returns 404', async () => {
        const res = await request(app).get('/plato/XXXX');
        expect(res.statusCode).toBe(404);
    });
});