const mongoose = require('mongoose');
const Usuarios = mongoose.model('Usuarios');

exports.formCrearCuenta = (req, res) => {
    res.render('crear-cuenta', {
        nombrePagina: 'Crea tu cuenta en devJobs',
        tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta',
    });
}
exports.validarRegistro = (req, res, next) => {

    // Sanitizar
    req.sanitizeBody('nombre').escape();
    req.sanitizeBody('email').escape();
    req.sanitizeBody('password').escape();
    req.sanitizeBody('confirmar').escape(); //Repetir Contraseña


    // Validar
    req.checkBody('nombre', 'El Nombre es Obligatorio').notEmpty();
    req.checkBody('email', 'El email debe ser valido').isEmail();
    req.checkBody('password', 'El password no puede ir vacio').notEmpty();
    req.checkBody('confirmar', 'Confirmar password no puede ir vacio').notEmpty();
    req.checkBody('confirmar', 'El password es diferente').equals(req.body.password);

    const errores = req.validationErrors();
    //console.log('error here ', errores);

    if (errores) {
        // si hay errores
        req.flash('error', errores.map(error => error.msg)); //Se asignan los mensajes de error en flash-error

        res.render('crear-cuenta', {
            nombrePagina: 'Crea tu cuenta en devJobs',
            tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta',
            mensajes: req.flash() //mensajes del Middleware en index.js -> res.locals.mensajes 
        });
        return;
    }

    // Si toda la validación es correcta
    next();
}

exports.crearUsuario = async(req, res, next) => {
    //crear el usuario
    const usuario = new Usuarios(req.body);

    try {
        await usuario.save(); //guardar nuevo usuario
        res.redirect('iniciar-sesion');
    } catch (error) {
        req.flash('error', error); //toma el error del modelo-> no existe email
        res.redirect('crear-cuenta');
    }

}