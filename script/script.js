document.addEventListener("DOMContentLoaded", function() {
 
    const tareas = document.getElementById("tareas");
    const button = document.getElementById("crear");
    const tituloTarea = document.getElementById("titulo");
    const descripcionTarea = document.getElementById("descripcion");
    const fechaTarea = document.getElementById("date");
    const prioridadTarea = document.getElementById("prioridad");
    const botonAñadir = document.getElementById("botonAñadir");
    const forTarea = document.querySelector('form');

    let isDragging = false;
    let offsetX, offsetY;

    button.addEventListener("click", (e) => {
        e.preventDefault();
        tareas.style.display = "block";
    });

    tareas.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - tareas.offsetLeft;
        offsetY = e.clientY - tareas.offsetTop;
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            tareas.style.left = `${e.clientX - offsetX}px`;
            tareas.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
    });

    if (localStorage.getItem('tareas')) {
        console.log('ya existe el array de tareas');
        const arrayTareas = JSON.parse(localStorage.getItem("tareas"));
        console.log(arrayTareas);
        pintarTareas(arrayTareas);
    }

    function pintarTareas(arrayTareas) {
        console.log('esta son las', arrayTareas);
        let html = "";
        arrayTareas.forEach((tarea, index) => {
            html += `<div class="item-tarea">`;
            if (tarea.prioridad === 'Importante') {
                html += `<i class="fa-solid fa-circle-exclamation"></i>`;
            }  
            html += `
                <h3 class="titulo-tarea">${tarea.titulo}</h3>
                <p class="descripcion-tarea">${tarea.descripcion}</p>
                <p class="fecha-tarea">${tarea.fecha}</p> 
                <p class="fecha-tarea">${tarea.prioridad}</p>
                <div class="boton-tarea">
                    <button class="bton btn-editar" data-index="${index}"><i class="fa-regular fa-pen-to-square"></i></button> 
                    <button class="bton btn-eliminar" data-index="${index}"><i class="fa-regular fa-trash-can"></i></button> 
                </div>
            </div>`;
        });
        document.querySelector(".panel-tareas").innerHTML = html;

 // Añadir los event listeners para los botones de eliminar después de pintar las tareas
        document.querySelectorAll('.btn-eliminar').forEach(btn => {

            btn.addEventListener('click', eliminarTarea);
        });

        
    }

    if (botonAñadir) {
        botonAñadir.addEventListener("click", (e) => {
            e.preventDefault();
            
            if (tituloTarea.value.trim() === '' || fechaTarea.value.trim() === '' || prioridadTarea.value.trim() === '') {
                showToast('error', 'Debe ingresar todos los campos de la tarea.');
            } else {
                guardarTarea();
            }
        });
    } else {
        console.error('El botón "Añadir" no se encontró en el DOM.');
    }
    

    function eliminarTarea(e) {
        const index = e.currentTarget.getAttribute('data-index'); // Cambiar e.target por e.currentTarget
        console.log(index);
        const arrayTareasRecuperado = JSON.parse(localStorage.getItem('tareas'));
        arrayTareasRecuperado.splice(index, 1);
        localStorage.setItem('tareas', JSON.stringify(arrayTareasRecuperado));

        pintarTareas(arrayTareasRecuperado);
        showToast('confirmacion', 'Tarea eliminada con éxito.');
    }

    function guardarTarea() {
        console.log('entro en guardar tarea');
        const tarea = {
            titulo: tituloTarea.value,
            descripcion: descripcionTarea.value,
            fecha: fechaTarea.value,
            prioridad: prioridadTarea.value
        };
        let arrayTareasRecuperado = [];
        let mensaje = '';

        console.log(tituloTarea.value);

        if (localStorage.getItem('tareas')) {
          
            arrayTareasRecuperado = JSON.parse(localStorage.getItem('tareas'));
        }
        // Añadir nueva tarea al array
        arrayTareasRecuperado.push(tarea);
        localStorage.setItem('tareas', JSON.stringify(arrayTareasRecuperado));

        console.log(arrayTareasRecuperado);
        pintarTareas(arrayTareasRecuperado); // Pintar las tareas después de guardar

        forTarea.reset();
        showToast('confirmacion', 'Tarea añadida con éxito.');
    }
    function showToast(tipo, mensaje) {
        const toast = document.querySelector('.toast');
        toast.textContent = mensaje;
        toast.classList.remove('toast-error');
        toast.classList.remove('toast-confirmacion');
        toast.classList.add(`toast-${tipo}`);
        console.log(toast);
        toast.classList.add('toast-active');
        setTimeout(() => {
            toast.classList.remove('toast-active');
        }, 3000);
    }
    
});
