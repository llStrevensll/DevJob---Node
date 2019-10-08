document.addEventListener('DOMContentLoaded', () => {
    const skills = document.querySelector('.lista-conocimientos');

    if (skills) {
        skills.addEventListener('click', agregarSkills); //metodo para agregar skills
    }
});

const skillsSet = new Set(); //usar un Set para adicionar habilidades

const agregarSkills = e => {
    if (e.target.tagName === 'LI') { //Si es selecionado un elemento de la lista de hablidades
        if (e.target.classList.contains('activo')) { //Si tiene la clase activo-> ya esta selecionado
            skillsSet.delete(e.target.textContent);
            e.target.classList.remove('activo');
        } else {
            skillsSet.add(e.target.textContent); //agregar el texto al Set
            e.target.classList.add('activo'); //agrega la clase activo para marcarlo
        }
    }
    //console.log(skillsSet);

    const skillsArray = [...skillsSet]
    document.querySelector('#skills').value = skillsArray;

}