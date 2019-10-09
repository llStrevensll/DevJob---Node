module.exports = {
    seleccionarSkills: (seleccionadas = [], opciones) => { //seleccionadas-> son las hablidades seleccionadas por el usuario
        const skills = ['HTML5', 'CSS3', 'CSSGrid', 'Flexbox', 'JavaScript', 'jQuery', 'Node', 'Angular', 'VueJS', 'ReactJS', 'React Hooks', 'Redux', 'Apollo', 'GraphQL', 'TypeScript', 'PHP', 'Laravel', 'Symfony', 'Python', 'Django', 'ORM', 'Sequelize', 'Mongoose', 'SQL', 'MVC', 'SASS', 'WordPress'];

        let html = '';
        skills.forEach(skill => { //crear hml de las skills --//includes retorna true o false si el elemento se encuentra
            html += `
                <li ${seleccionadas.includes(skill) ? 'class="activo"' : ''}>${skill}</li>
            `;
        });

        return opciones.fn().html = html;
    },
    tipoContrato: (seleccionado, opciones) => { //Seleccionado esta en la vista por medio de vacante.contrato
        return opciones.fn(this).replace( // $& insertar string -> tipo de contrato que ya estaba seleccionado
            new RegExp(`value="${seleccionado}"`), '$& selected="selected"'
        );
    }
}