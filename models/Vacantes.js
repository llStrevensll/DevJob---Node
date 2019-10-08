const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slug'); //para el url
const shortid = require('shortid'); //para tener un id unico
/**Ejemplo:
 * slug: Si alguien coloca un vacanta como React Developer -> slug lo transforma en react-developer
 * shortid: Pueden a ver varias vacantes con el mismo nombre: shortid coloca un id unico al final de cada una react-developer-673283hjdf
 */

const vacantesSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: 'El nombre de la vacante es obligatorio',
        trim: true //trim quita espacio al incio y final
    },
    empresa: {
        type: String,
        trim: true
    },
    ubicacion: {
        type: String,
        trim: true,
        required: 'la ubicacion es obligatoria'
    },
    salario: {
        type: String,
        default: 0,
        trim: true
    },
    contrato: {
        type: String,
        trim: true
    },
    descripcion: {
        type: String,
        trim: true
    },
    url: {
        type: String,
        lowercase: true
    },
    skills: [String],
    candidatos: [{
        nombre: String,
        email: String,
        cv: String
    }]
});

//Antes de guardar en la BD --> .pre middware de mongoose 
vacantesSchema.pre('save', function(next) {
    //crear url
    const url = slug(this.titulo); //react-developer = url
    this.url = `${url}-${shortid.generate()}`; //react-developer-5276382773 = url-id
    next();
});

module.exports = mongoose.model('Vacante', vacantesSchema); //('Nombre del esquema', 'esquema')