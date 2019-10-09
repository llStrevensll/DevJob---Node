document.addEventListener('DOMContentLoaded', () => {
    const skills = document.querySelector('.lista-conocimientos');

    //Limpiar las alertas
    let alertas = document.querySelector('.alertas');
    if (alertas) {
        limpiarAlertas();
    }

    if (skills) {
        skills.addEventListener('click', agregarSkills); //metodo para agregar skills

        //Estando en editar llamar la función
        skillsSeleccionados();
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

    const skillsArray = [...skillsSet]; //convertir en arreglo
    document.querySelector('#skills').value = skillsArray;

}

const skillsSeleccionados = () => {
    const seleccionadas = Array.from(document.querySelectorAll('.lista-conocimientos .activo')); //Convertir en arreglo ya que es un NodeList

    seleccionadas.forEach(seleccionada => {
        skillsSet.add(seleccionada.textContent);
    })

    //Inyectarlo en el hidden
    const skillsArray = [...skillsSet]; //convertir en arreglo
    document.querySelector('#skills').value = skillsArray;
}

const limpiarAlertas = () => {
    const alertas = document.querySelector('.alertas');
    const interval = setInterval(() => { //se ejecuta cada periodo de tiempo
        if (alertas.children.length > 0) {
            alertas.removeChild(alertas.children[0]); //cada que se elimina una alerta en la posicion cero, la otra alerta que no se ha eliminado tomará esa posicion
        } else if (alertas.children.length === 0) {
            alertas.parentElement.removeChild(alertas); //eliminar div
            clearInterval(interval); //eliminar para que no se quede iterando
        }
    }, 2000);
}