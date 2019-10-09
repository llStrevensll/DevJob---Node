const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });

//Conexion a la Base de Datos (DATABASE->variables.env)
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true });

mongoose.connection.on('error', (error) => {
    console.log(error);
});

//Importar modelos
require('../models/Vacantes');
require('../models/Usuarios');