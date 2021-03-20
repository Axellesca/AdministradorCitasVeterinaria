//Campos Form
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');
//UI
const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

let editando;

//Clases
class Citas{
    constructor(){
        this.citas = []
    }

    agregarCita(cita){
        this.citas = [...this.citas,cita];
    }

    eliminarCita(id){
        this.citas = this.citas.filter(cita => cita.id !== id);
    }

    editarCita(citaActualizada){
        this.citas = this.citas.map( cita => cita.id === citaActualizada.id ? citaActualizada : cita);//Si el id es igual, copia el objeto cita a citaActualizada,sino vuelve al normal
    }
}

class UI{

    imprimirAlerta(mensaje,tipo){
        //crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center','alert','d-block','col-12');

        //Agregar clase en base al tipo de error
        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        }else{
            divMensaje.classList.add('alert-success');
        }
        //Msj error
        divMensaje.textContent = mensaje;

        //Agregar al DOM
        document.querySelector('#contenido').insertBefore(divMensaje,document.querySelector('.agregar-cita'));

        setTimeout(()=>{
            divMensaje.remove();
        },3000);
    }

    imprimirCitas({citas}){
        
        this.limpiarHTML();
        
        citas.forEach((cita)=>{
            const { mascota,propietario,telefono,fecha,hora,sintomas,id} = cita;

            const divCita = document.createElement('div');
            divCita.classList.add('cita',('p-3'));
            divCita.dataset.id = id;

            //Scripting de los elemeentos de la cita.
            const mascotaParrafo = document.createElement('h2');
            mascotaParrafo.classList.add('card-title','font-weight-bolder');
            mascotaParrafo.textContent = mascota;

            const propietarioParrafo = document.createElement('p');
            propietarioParrafo.innerHTML = `<span class="font-weight-bolder">Propietario: </span>${propietario}`

            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `<span class="font-weight-bolder">Telefono: </span>${telefono}`

            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `<span class="font-weight-bolder">Fecha: </span>${fecha}`

            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `<span class="font-weight-bolder">Hora: </span>${hora}`

            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.innerHTML = `<span class="font-weight-bolder">Sintomas: </span>${sintomas}`

            //Boton para eliminar citas
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn','btn-danger','mr-2');
            btnEliminar.innerHTML='Eliminar <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';

            btnEliminar.onclick = () =>eliminarCita(id);

            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn','btn-info');
            btnEditar.innerHTML= 'Editar <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>';

            btnEditar.onclick = () => cargarEdicion(cita);


            //Agregar los Parrafos al divCita
            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);

            //Agregar las citas al HTML
            contenedorCitas.appendChild(divCita);
        })
    }

    limpiarHTML(){
        while(contenedorCitas.firstChild){
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }
}


//Instancias de Clases
const ui = new UI();
const administrarCitas = new Citas();
//Registrar eventos
eventListeners();
function eventListeners(){
    mascotaInput.addEventListener('change',datosCita);//Change sirve para tomar lo q escriben o input para tiempo real.
    propietarioInput.addEventListener('change',datosCita);
    telefonoInput.addEventListener('change',datosCita);
    fechaInput.addEventListener('change',datosCita);
    horaInput.addEventListener('change',datosCita);
    sintomasInput.addEventListener('change',datosCita);

    formulario.addEventListener('submit',nuevaCita);
}
//Objeto con la info de la cita
const citaObj = {
    mascota: '',
    propietario: '',
    telefono:'',
    fecha: '',
    hora: '',
    sintomas: '',
}

function datosCita(e){
    // console.log(e.target.value);
    citaObj[e.target.name] = e.target.value;
    // console.log(citaObj);
}

//Valida y agrega una nueva cita a la clase de citas.
function nuevaCita(e){
    e.preventDefault();

    //Extraer info del objeto de cita
    const {mascota,propietario,telefono,fecha,hora,sintomas} = citaObj;

    if(mascota === ''|| propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === ''){
        ui.imprimirAlerta('Todos los campos son obligatorios','error');
        return;
    }

    if(editando){//Editando == True
        ui.imprimirAlerta('Editado Correctamente');
        //Pasar el obj de la cita a edicion
        administrarCitas.editarCita({...citaObj});//Le pasa una copia de CitaOBJ
        //Regresa el texto del boton a el estado original.
        formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';
        editando = false;
    }else{
        //Generar un ID unico
        citaObj.id = Date.now();

        administrarCitas.agregarCita({...citaObj});

        //Mensaje Agregado
        ui.imprimirAlerta('Se agrego correctamente');
    }

    

    formulario.reset();//Reiniciar Form.

    reiniciarObjeto();//Reinicia el Objeto dentro del Form para no volver a llamarlo aunque esté vacio.

    //Mostrar en HTML
    ui.imprimirCitas(administrarCitas);
}

function reiniciarObjeto(){
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';
}

function eliminarCita(id){
    //Eliminar Cita
    administrarCitas.eliminarCita(id);
    //Mostrar mensaje
    ui.imprimirAlerta('La Cita se elimino correctamente');
    //Refrescar citas
    ui.imprimirCitas(administrarCitas);
}

function cargarEdicion(cita){
    const {mascota,propietario,telefono,fecha,hora,sintomas,id} = cita;

    //llenar inputs
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    //llenar el Objeto
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    //Cambiar Texto del boton
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

    editando = true;
}