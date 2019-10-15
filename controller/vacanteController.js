const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');

const multer = require('multer');
const shortid = require('shortid');

exports.formularioNuevaVacante = (req, res) => {
    res.render('nueva-vacante', {
        nombrePagina: 'Nueva Vacante',
        tagline: 'Llena el formulario y publica tu vacante',
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen
    })
}

//Agrega las vacantes a la base de datos
exports.agregarVacante = async(req, res) => {
    const vacante = new Vacante(req.body);

    //Usuario autor de la vacante
    vacante.autor = req.user._id;

    //Crear arreglo de habilidades(skills) --Es un string seprado por comas, por ello se usa split para dividir y convertir en arreglo
    vacante.skills = req.body.skills.split(',');

    //Almacenar en la BD (usar async-await)
    const nuevaVacante = await vacante.save()

    //Redireccionar
    res.redirect(`/vacantes/${nuevaVacante.url}`);
}

//Muestra una Vacante
exports.mostrarVacante = async(req, res, next) => {
    const vacante = await Vacante.findOne({ url: req.params.url }).populate('autor'); //url por que en vacantes dice vacantes/:url
    console.log(vacante);

    //si no hay resultados
    if (!vacante) return next();

    res.render('vacante', {
        vacante,
        nombrePagina: vacante.titulo,
        barra: true
    });
}

exports.formEditarVacante = async(req, res, next) => {
    const vacante = await Vacante.findOne({ url: req.params.url });

    if (!vacante) return next();

    res.render('editar-vacante', {
        vacante,
        nombrePagina: `Editar - ${vacante.titulo}`,
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen
    })
}

exports.editarVacante = async(req, res) => {
    const vacanteActualizada = req.body; //vacanteActualizada

    vacanteActualizada.skills = req.body.skills.split(','); //converir skills en arreglo

    const vacante = await Vacante.findOneAndUpdate({ url: req.params.url }, vacanteActualizada, {
        new: true, //nuevo doc
        runValidators: true
    }); //actualizar vacante

    res.redirect(`/vacantes/${vacante.url}`);
}

//Validar y Sanitizar los campos de nuevas vacantes
exports.validarVacante = (req, res, next) => {
    //sanitizar los campos
    req.sanitizeBody('titulo').escape();
    req.sanitizeBody('empresa').escape();
    req.sanitizeBody('ubicacion').escape();
    req.sanitizeBody('salario').escape();
    req.sanitizeBody('contrato').escape();
    req.sanitizeBody('skills').escape();

    //validar
    req.checkBody('titulo', 'Agrega un Titulo a la Vacante').notEmpty();
    req.checkBody('empresa', 'Agrega una Empresa').notEmpty();
    req.checkBody('ubicacion', 'Agrega una Ubicación');
    req.checkBody('contrato', 'Selecciona el Tipo de Contrato').notEmpty();
    req.checkBody('skills', 'Agrega al menos una habilidad').notEmpty();

    const errores = req.validationErrors();

    if (errores) {
        //Recarga la vista de los errores
        req.flash('error', errores.map(error => error.msg));

        res.render('nueva-vacante', {
            nombrePagina: 'Nueva Vacante',
            tagline: 'Llena el formulario y publica tu vacante',
            cerrarSesion: true,
            nombre: req.user.nombre,
            mensajes: req.flash()
        });
    }

    next(); // siguiente middleware
}
exports.eliminarVacante = async(req, res) => {
    const { id } = req.params;

    const vacante = await Vacante.findById(id);

    if (verificarAutor(vacante, req.user)) {
        //Todo bien, si es el usuario, eliminar
        vacante.remove();
        res.status(200).send('Vacante Eliminada Correctamente');
    } else {
        //no permitido
        res.status(403).send('Erroe');
    }


}
const verificarAutor = (vacante = {}, usuario = {}) => {
    if (!vacante.autor.equals(usuario._id)) { //revisar si el usuario es el igual a quien lo creo
        return false;
    }
    return true;
}

exports.subirCV = (req, res, next) => {
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
            res.redirect('back'); //en caso de error, regresa al usuario
            return;
        } else {
            return next();
        }

    });

}

// Opciones de Multer
const configuracionMulter = {
    limits: { fileSize: 300000 }, //limite de tamaño en la imagen(300kb)
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname + '../../public/uploads/cv'); //callback(cb) toma el error y el destino
        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1]; //la posicion 1 es la extension
            cb(null, `${shortid.generate()}.${extension}`); //genera id diferente para cada imagen
        }
    }),
    fileFilter(req, file, cb) {
        if (file.mimetype === 'application/pdf') { //mimetype
            // el callback se ejecuta como true o false : true cuando la imagen se acepta
            cb(null, true);
        } else {
            cb(new Error('Formato No Válido'));
        }
    }
}

const upload = multer(configuracionMulter).single('cv'); //nombre del campo-> cv

//Almacenar los candidatos en la BD
exports.contactar = async(req, res, next) => {
    const vacante = await Vacante.findOne({ url: req.params.url });

    //Sino existe la vacante
    if (!vacante) return next();

    //bien, construir nuevo objeto
    const nuevoCandidato = {
        nombre: req.body.nombre,
        email: req.body.email,
        cv: req.file.filename
    }

    //almacenar la vacante
    vacante.candidatos.push(nuevoCandidato);
    await vacante.save();

    //mensaje flash y redireccion
    req.flash('correcto', 'Se envió tu Curriculum Correctamente');
    res.redirect('/');

}

//Visualizar candidatos
exports.mostrarCandidatos = async(req, res, next) => {
    const vacante = await Vacante.findById(req.params.id);

    //validacion para que solo quien creo la vacante pueda ver a los candidatos
    if (vacante.autor != req.user._id.toString()) {
        return next();
    }

    if (!vacante) return next();

    //paso validacion, visualizar candidatos
    res.render('candidatos', {
        nombrePagina: `Candidatos Vacante - ${vacante.titulo}`,
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen,
        candidatos: vacante.candidatos
    });
}

// Buscador de Vacantes
exports.buscarVacantes = async(req, res) => {
    const vacantes = await Vacante.find({
        $text: {
            $search: req.body.q
        }
    });

    // mostrar las vacantes
    res.render('home', {
        nombrePagina: `Resultados para la búsqueda : ${req.body.q}`,
        barra: true,
        vacantes
    })
}