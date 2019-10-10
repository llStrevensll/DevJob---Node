const express = require('express');
const router = express.Router();
const homeController = require('../controller/homeController');
const vacantesController = require('../controller/vacanteController');
const usuariosController = require('../controller/usuariosController');
const authController = require('../controller/authController');

module.exports = () => {
    /*router.get('/', (req, res) => {
        res.send('Funciona');
    });*/
    router.get('/', homeController.mostrarTrabajos);

    //crear vacantes
    router.get('/vacantes/nueva',
        authController.verificarUsuario,
        vacantesController.formularioNuevaVacante
    );
    router.post('/vacantes/nueva',
        authController.verificarUsuario,
        vacantesController.agregarVacante
    );

    //Mostrar Vacante(singular)
    router.get('/vacantes/:url', vacantesController.mostrarVacante);

    //Editar Vacante
    router.get('/vacantes/editar/:url',
        authController.verificarUsuario,
        vacantesController.formEditarVacante
    );
    router.post('/vacantes/editar/:url',
        authController.verificarUsuario,
        vacantesController.editarVacante
    ); //guardar cambios de edicion

    //Crear cuentas
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta',
        usuariosController.validarRegistro,
        usuariosController.crearUsuario
    ); //guardar cambios de crear usuario

    //Autentiicar Usuarios
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);

    //Panel de administración
    router.get('/administracion',
        authController.verificarUsuario,
        authController.mostrarPanel);

    return router;
}