// Variables
let puntaje = 0;
let velocidad = 5;
let dificultad ="";
let posicionNota;
let cantidadNotas;
let segundosT = 0;
let intervalo;
let simuladorEjecutado = false;
let notasMoviendo = true;
//Ajustar datos dificultades
function ajustarDificultadFacil(){
    velocidad=5;
    let dificultad="facil";
    ajustarDatos(dificultad);
}
function ajustarDificultadIntermedia(){
    velocidad=10;
    let dificultad="intermedio";
    ajustarDatos(dificultad);
}
function ajustarDificultadDificil(){
    velocidad=15;
    let dificultad="dificil";
    ajustarDatos(dificultad);
}
function ajustarDatos(dificultad){
   console.log("funciona"+dificultad) 
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
//Crear notas
function crearNota() {
    var cantidadNotas = getRandomInt(1, 5);
    var tiempoEntreNotas = 1500; // Tiempo en milisegundos entre la creación de cada nota

    for (var i = 1; i <= cantidadNotas; i++) {
        setTimeout(function () {
            var nota = document.createElement("div");
            var tipoNota = getRandomInt(1, 4); // 1: roja, 2: verde, 3: amarilla
            var idNota = "";
            switch (tipoNota) {
                case 1:
                    idNota = "nota-roja-i";
                    break;
                case 2:
                    idNota = "nota-verde-i";
                    break;
                case 3:
                    idNota = "nota-amarilla-i";
                    break;
                default:
                    break;
            }
            nota.setAttribute("id", idNota);
            document.body.appendChild(nota);
            moveNota("#" + nota.id);
        }, i * tiempoEntreNotas); // Multiplica el índice de la nota por el tiempo entre notas para crear el retraso
    }
}
// }
//Funcion para la creacion de Notas de forma secuencial

function comenzarJuego() {
    // Restaurar el estado del HTML antes de iniciar el juego
    reiniciar();

    // Lógica para iniciar el juego
    actualizarPuntuacion(puntaje);
    intervalo = setInterval(function () {
        crearNota();
        console.log("funciona")
        segundosT++;

        if (segundosT >= 15) {
            clearInterval(intervalo)
        }
    }, 1000);
    // Mover las notas continuamente durante los 15 segundos
    setInterval(function () {
        moveNotas(); // Llama a la función para mover todas las notas
    }, 100);
}
//Funcion mover notas
function moveNotas() {
    if (!notasMoviendo) return; // Si las notas ya no están en movimiento, salir
    var notas = document.querySelectorAll("#nota-amarilla-i, #nota-verde-i, #nota-roja-i");
    notas.forEach(function (nota) {
        moveNota("#" + nota.id);
    });
}
function moveNota(selector) {
    var div = document.querySelector(selector);
    var currentLeft = parseInt(div.style.left) || parseInt(getComputedStyle(div).left) || 0;
    var targetLeft = currentLeft + velocidad;
    var containerWidth = document.body.clientWidth; // Ancho del contenedor

    if (targetLeft >= containerWidth) {
        // Si la nota llega al límite, detiene su movimiento pero las demás notas con el mismo ID pueden continuar moviéndose
        div.classList.add("nota-fuera-de-limite"); // Agrega una clase para identificar notas fuera de límite
        return;
    }

    var finalLeft = Math.min(targetLeft, containerWidth - div.offsetWidth); // Limitar al ancho del contenedor

    div.style.left = finalLeft + 'px';
}
//Funcion reiniciar 
function reiniciar() {
    // Eliminar todas las notas existentes
    var notas = document.querySelectorAll("#nota-amarilla-i, #nota-verde-i, #nota-roja-i");
    notas.forEach(function (nota) {
        nota.remove();
    });

    // Restaurar el puntaje y el tiempo
    puntaje = 0;
    segundosT = 0;

    // Actualizar la puntuación en pantalla
    actualizarPuntuacion(puntaje);
}

//Funcion detectar colision
function obtenerPosicionNota(notaId) {
    var nota = document.getElementById(notaId);
    if (!nota) return null; // Si la nota no existe, retornar null

    var rect = nota.getBoundingClientRect(); // Obtener el rectángulo que delimita la nota
    return rect.left; // Retornar la posición left de la nota
}
function detectarTeclaYEvaluar(tecla) {
    var posicionNota = null;
    var notaId = "";

    switch (tecla) {
        case "a":
            posicionNota = obtenerPosicionNota("nota-verde-i");
            notaId = "nota-verde-i";
            break;
        case "s":
            posicionNota = obtenerPosicionNota("nota-amarilla-i");
            notaId = "nota-amarilla-i";
            break;
        case "d":
            posicionNota = obtenerPosicionNota("nota-roja-i");
            notaId = "nota-roja-i";
            break;
        default:
            break;
    }

    if (posicionNota !== null) {
        // Obtener la posición de la tecla
        var posicionTecla = document.getElementById(tecla).getBoundingClientRect().left;

        // Calcular una distancia de tolerancia (en píxeles) para considerar la tecla como "cercana" a la nota
        var distanciaTolerancia = 100; // Puedes ajustar este valor según sea necesario

        // Verificar si la posición de la tecla está cerca de la posición de la nota
        if (Math.abs(posicionTecla - posicionNota) <= distanciaTolerancia) {
            // Aumentar el puntaje
            aumentarPuntaje();
            document.getElementById(notaId).remove();
        } else {
            // Eliminar la nota si no está en la posición esperada
            var nota = document.getElementById(notaId);
            if (nota) {
                nota.remove();
            }
        }
    }
}

//Listerner de las teclas
document.addEventListener("keyup", function (evt){
    detectarTeclaYEvaluar(evt.key);
})
//Funciones de puntaje
function aumentarPuntaje() {
        puntaje+=5; // Aumenta el puntaje
    actualizarPuntuacion(puntaje); // Actualiza el puntaje en la pantalla
}
function actualizarPuntuacion(puntaje) {
    var puntajeDiv = document.getElementById("puntuacion").querySelector("h2");
    puntajeDiv.textContent = "Puntaje: " + puntaje;
}
