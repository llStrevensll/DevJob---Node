const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const router = require('./routes');

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

//Rutas del aplicativo
app.use('/', router());


//Puerto a escuchar
app.listen(5000);