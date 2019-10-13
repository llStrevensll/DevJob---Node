const mongoose = require('mongoose'); //mongoose solo tiene una instancia (singleton) 
mongoose.Promise = global.Promise;
const bcrypt = require('bcrypt'); //encriptar password

const usuariosSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    nombre: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    token: String,
    expira: Date,
    imagen: String //nose guarda la imagen como tal, sino una referencia
});

//Método para hashear los passwords
usuariosSchema.pre('save', async function(next) {
    //Si el psw ya esta hashedo
    if (!this.isModified('password')) { //Modified metodo de mongoose
        return next();
    }
    //Si no esta hasheado
    const hash = await bcrypt.hash(this.password, 12);
    this.password = hash; //asignar nuevo psw hasheado
    next();
});

//Informar con alerta que el correo ya existe
usuariosSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next('Ese correo ya esta registrado');
    } else {
        next(error);
    }
});


// Autenticar Usuarios
usuariosSchema.methods = {
    compararPassword: function(password) {
        return bcrypt.compareSync(password, this.password); //comparar password ingresado con passwors de BD, retorna true, false
    }
}

module.exports = mongoose.model('Usuarios', usuariosSchema);