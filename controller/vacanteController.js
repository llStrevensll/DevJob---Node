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

    //Crear arreglo de habilidades(skills) --Es un string seprado por comas, por ello se usa split para dividir y convertir en arreglo
    vacante.skills = req.body.skills.split(',');

    //Almacenar en la BD (usar async-await)
    const nuevaVacante = await vacante.save()

    //Redireccionar
    res.redirect(`/vacantes/${nuevaVacante.url}`);

}