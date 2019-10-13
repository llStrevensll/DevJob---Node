const mongoose = require('mongoose');
const Usuarios = mongoose.model('Usuarios');
const multer = require('multer');
const shortid = require('shortid');

//Subir imagen
exports.subirImagen = (req, res, next) => {
    upload(req, res, function(error) {
        if (error) {
            if (error instanceof multer.MulterError) {
                if (error.code === 'LIMIT_FILE_SIZE') {
                    req.flash('error', 'El archivo es muy grande: Máximo 100kb');
                } else {
                    req.flash('error', error.message);
                }
            } else {
                req.flash('error', error.message);
            }
            res.redirect('/administracion');
            return;
        } else {
            return next();
        }

    });

}

// Opciones de Multer
const configuracionMulter = {
    limits: { fileSize: 100000 }, //limite de tamaño en la imagen(100kb)
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname + '../../public/uploads/perfiles'); //callback(cb) toma el error y el destino
        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1]; //la posicion 1 es la extension
            cb(null, `${shortid.generate()}.${extension}`); //genera id diferente para cada imagen
        }
    }),
    fileFilter(req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            // el callback se ejecuta como true o false : true cuando la imagen se acepta
            cb(null, true);
        } else {
            cb(new Error('Formato No Válido'));
        }
    }
}


const upload = multer(configuracionMulter).single('imagen'); //nombre del campo-> imagen



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
        imagen: req.user.imagen
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

    if (req.file) {
        usuario.imagen = req.file.filename; //req.file.filename -> ya tiene el nombre de la imagen con el id unico
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
            imagen: req.user.imagen,
            mensajes: req.flash()
        });
    }

    next(); //todo bien, siguiente middleware!
}