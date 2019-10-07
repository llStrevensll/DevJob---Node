exports.mostrarTrabajos = (req, res) => {
    res.render('home', {
        nombrePagina: 'devJobs',
        tagline: 'Encuentra y Publica Trabajos para Desarrolladores Web', //descripcion
        barra: true, //variable para barra
        boton: true //variable para boton
    })
}