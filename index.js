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
const createError = require('http-errors');
const passport = require('./config/passport');


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

//Inicializar passport
app.use(passport.initialize());
app.use(passport.session());

//Alertar y flash messages
app.use(flash());

//Crear middleware
app.use((req, res, next) => {
    res.locals.mensajes = req.flash(); //siempre que haya un flash que enviar se llenaran variables locales
    next();
});

//Rutas del aplicativo
app.use('/', router());

//404 pagina no existente
app.use((req, res, next) => {
    next(createError(404, 'No Encontrado')); //(tipo de error, mensaje)
});

//Administración de los errores
app.use((error, req, res) => {
    res.locals.mensaje = error.message;
    const status = error.status || 500; //sino hay error, entonces usa 500
    res.locals.status = status;
    res.status(status);
    res.render('error');
});

//Dejar que heroku asigne el puerto
const host = '0.0.0.0';
const port = process.env.PORT;

//Puerto a escuchar
app.listen(port, host, () => {
    console.log('El servidor esta funcionando');
});