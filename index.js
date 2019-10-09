const mongoose = require('mongoose');
require('./config/db');

const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const router = require('./routes');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session); //pasa la session al paquete de connect-mongo
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');

//Puerto local
require('dotenv').config({ path: 'variables.env' });

//App con express
const app = express();

//Habilitar bodyParser para leer datos del formulario
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

//Validacion de campos
app.use(expressValidator());



//Habilitar el template engine (handlebars)
app.engine('handlebars',
    exphbs({
        defaultLayout: 'layout', //Especificar el layout
        helpers: require('./helpers/handlebars'), //scripts que se enlazaran con handlebars para su posterior visualizacion
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

//Alertar y flash messages
app.use(flash());

//Crear middleware
app.use((req, res, next) => {
    res.locals.mensajes = req.flash(); //siempre que haya un flash que enviar se llenaran variables locales
    next();
});

//Rutas del aplicativo
app.use('/', router());


//Puerto a escuchar
app.listen(process.env.PUERTO);