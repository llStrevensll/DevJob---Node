const mongoose = require('mongoose');
require('./config/db');

const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const router = require('./routes');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session); //pasa la session al paquete de connect-mongo

//Puerto local
require('dotenv').config({ path: 'variables.env' });

//App con express
const app = express();

//Habilitar el template engine (handlebars)
app.engine('handlebars',
    exphbs({
        defaultLayout: 'layout' //Especificar el layout
    })
);
app.set('view engine', 'handlebars');


//Cargar archivos estaticos del proyecto
app.use(express.static(path.join(__dirname, 'public'))); //leer archivos de la carpeta public

app.use(cookieParser());

//Habilitar bodyParser para leer datos del formulario
app.use(session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

//Rutas del aplicativo
app.use('/', router());


//Puerto a escuchar
app.listen(process.env.PUERTO);