const express = require('express');
const router = express.Router();
const homeController = require('../controller/homeController');

module.exports = () => {
    /*router.get('/', (req, res) => {
        res.send('Funciona');
    });*/
    router.get('/', homeController.mostrarTrabajos);

    return router;
}