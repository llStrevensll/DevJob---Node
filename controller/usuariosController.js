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

//formulario para iniciar sesion
exports.formIniciarSesion = (req, res) => {

    res.render('iniciar-sesion', {
        nombrePagina: 'Iniciar Sesión devJobs'
    });
}

//Form editar el Perfil
exports.formEditarPerfil = (req, res) => {
    res.render('editar-perfil', {
        nombrePagina: 'Edita tu perfil en devJobs',
        usuario: req.user,
        cerrarSesion: true,
        nombre: req.user.nombre,
    });
}

// Guardar cambios editar perfil
exports.editarPerfil = async(req, res) => {

    const usuario = await Usuarios.findById(req.user._id);

    usuario.nombre = req.body.nombre;
    usuario.email = req.body.email;
    if (req.body.password) {
        usuario.password = req.body.password
    }

    await usuario.save();

    req.flash('correcto', 'Cambios Guardados Correctamente');
    // redirect
    res.redirect('/administracion');
}

//Sanitizar y validar el formulario de editar perfiles
exports.validarPerfil = (req, res, next) => {
    //sanitizar
    req.sanitizeBody('nombre').escape();
    req.sanitizeBody('email').escape();
    if (req.body.password) {
        req.sanitizeBody('password').escape();
    }
    //validar
    req.checkBody('nombre', 'El nombre no puede ir vacio').notEmpty();
    req.checkBody('email', 'El correo no puede ir vacio').notEmpty();

    const errores = req.validationErrors();
    if (errores) {
        req.flash('error', errores.map(error => error.msg));
        res.render('editar-perfil', {
            nombrePagina: 'Edita tu perfil en devJobs',
            usuario: req.user,
            cerrarSesion: true,
            nombre: req.user.nombre,
            mensajes: req.flash()
        });
    }

    next(); //todo bien, siguiente middleware!
}