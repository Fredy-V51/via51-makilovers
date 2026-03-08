const express = require('express');
const menuService = require('./menuService');

const app = express();
app.use(express.json());

app.get('/categorias', async (req, res) => {
    try {
        const cats = await menuService.obtenerCategorias();
        res.json(cats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/menu/:categoria', async (req, res) => {
    try {
        const data = await menuService.obtenerMenu(req.params.categoria);
        res.json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/plato/:codigo', async (req, res) => {
    try {
        const plato = await menuService.buscarPlatoPorCodigo(req.params.codigo);
        if (plato) res.json(plato);
        else res.status(404).json({ error: 'Plato no encontrado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const port = process.env.PORT || 3000;

if (require.main === module) {
    app.listen(port, () => {
        console.log(`API server listening on port ${port}`);
    });
}

module.exports = app;