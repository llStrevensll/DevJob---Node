const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');

exports.formularioNuevaVacante = (req, res) => {
    res.render('nueva-vacante', {
        nombrePagina: 'Nueva Vacante',
        tagline: 'Llena el formulario y publica tu vacante'
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
    const vacante = await Vacante.findOne({ url: req.params.url }); //url por que en vacantes dice vacantes/:url
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
        nombrePagina: `Editar - ${vacante.titulo}`
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