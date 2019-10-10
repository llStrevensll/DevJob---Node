import axios from 'axios';
import Swal from 'sweetalert2';

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

    //Seleccionar el panel de administracion que las vacantes
    const vacantesListado = document.querySelector('.panel-administracion');

    if (vacantesListado) {
        vacantesListado.addEventListener('click', accionesListado);
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

//Eliminar Listado
const accionesListado = e => {
    //e.preventDefault();
    if (e.target.dataset.eliminar) {
        // eliminar por axios
        Swal.fire({
            title: '¿Confirmar Eliminación?',
            text: "Una vez eliminada, no se puede recuperar",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar',
            cancelButtonText: 'No, Cancelar'
        }).then((result) => {
            if (result.value) {

                // enviar la petición con axios
                const url = `${location.origin}/vacantes/eliminar/${e.target.dataset.eliminar}`;

                // Axios para eliminar el registro
                axios.delete(url, { params: { url } })
                    .then(function(respuesta) {
                        if (respuesta.status === 200) {
                            Swal.fire(
                                'Eliminado',
                                respuesta.data,
                                'success'
                            );
                            //Eliminar del DOM
                            e.target.parentElement.parentElement.parentElement.removeChild(e.target.parentElement.parentElement);
                        }
                    })
                    .catch(() => {
                        Swal.fire({
                            type: 'error',
                            title: 'Hubo un error',
                            text: 'No Se pudo eliminar'
                        })
                    })
            }
        })
    } else if (e.target.tagName === 'A') { //si es un enlace
        window.location.href = e.target.href;
    }

}