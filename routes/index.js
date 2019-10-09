const express = require('express');
const router = express.Router();
const homeController = require('../controller/homeController');
const vacantesController = require('../controller/vacanteController');
const usuariosController = require('../controller/usuariosController');

module.exports = () => {
    /*router.get('/', (req, res) => {
        res.send('Funciona');
    });*/
    router.get('/', homeController.mostrarTrabajos);

    //crear vacantes
    router.get('/vacantes/nueva', vacantesController.formularioNuevaVacante);
    router.post('/vacantes/nueva', vacantesController.agregarVacante);

    //mostrar Vacante(singular)
    router.get('/vacantes/:url', vacantesController.mostrarVacante);

    //editar Vacante
    router.get('/vacantes/editar/:url', vacantesController.formEditarVacante);
    router.post('/vacantes/editar/:url', vacantesController.editarVacante); //guardar cambios de edicion

    //crear cuentas
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta',
        usuariosController.validarRegistro,
        usuariosController.crearUsuario
    ); //guardar cambios de crear usuario
    return router;
}