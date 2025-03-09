const tablero = document.getElementById("tablero");
const estado = document.getElementById("estado");
const contador = document.getElementById("contador");

let casillas = [];
let jugadorActual = "X";
let puntos = { "X": 0, "O": 0 }; // Puntuaciones iniciales
let jugadoresGuardados = { "X": "", "O": "" }; // Nombres de los jugadores
let tableroJuego = Array(9).fill("");
let juegoIniciado = false;

// 🔄 Función para resetear jugadores y puntos
function resetearJugadores() {
    jugadoresGuardados = { "X": "", "O": "" };
    puntos = { "X": 0, "O": 0 };
    localStorage.removeItem("jugadores");
    localStorage.removeItem("puntos");
    document.getElementById("jugadorX").value = "";
    document.getElementById("jugadorO").value = "";
    actualizarPuntuacion();
}

// 🕹️ Iniciar cuenta regresiva antes del juego
function iniciarCuentaRegresiva() {
    const jugadorX = document.getElementById("jugadorX").value.trim();
    const jugadorO = document.getElementById("jugadorO").value.trim();

    if (jugadorX === "" || jugadorO === "") {
        alert("Por favor, ingresa ambos nombres.");
        return;
    }

    // Si los jugadores han cambiado, reiniciar puntos
    if (jugadorX !== jugadoresGuardados.X || jugadorO !== jugadoresGuardados.O) {
        puntos = { "X": 0, "O": 0 };
    }

    jugadoresGuardados = { "X": jugadorX, "O": jugadorO };
    localStorage.setItem("jugadores", JSON.stringify(jugadoresGuardados));

    let tiempo = 3;
    contador.textContent = `Iniciando en ${tiempo}...`;

    const intervalo = setInterval(() => {
        tiempo--;
        if (tiempo === 0) {
            clearInterval(intervalo);
            contador.textContent = "";
            iniciarJuego();
        } else {
            contador.textContent = `Iniciando en ${tiempo}...`;
        }
    }, 1000);
}

// 🎮 Iniciar el juego
function iniciarJuego() {
    juegoIniciado = true;
    crearTablero();
    estado.textContent = `Turno de ${obtenerNombre(jugadorActual)}`;
}

// 🏗️ Crear el tablero
function crearTablero() {
    tablero.innerHTML = "";
    casillas = [];
    tableroJuego.forEach((valor, indice) => {
        const casilla = document.createElement("div");
        casilla.classList.add("casilla");
        casilla.dataset.indice = indice;
        casilla.textContent = valor;
        if (valor) {
            casilla.classList.add(valor === "X" ? "neon-x" : "neon-o");
        }
        casilla.addEventListener("click", manejarMovimiento);
        tablero.appendChild(casilla);
        casillas.push(casilla);
    });
}

// 🏆 Manejar el movimiento del jugador
function manejarMovimiento(evento) {
    if (!juegoIniciado) return;

    const indice = evento.target.dataset.indice;
    if (tableroJuego[indice] !== "" || verificarGanador()) return;

    tableroJuego[indice] = jugadorActual;
    evento.target.textContent = jugadorActual;
    evento.target.classList.add(jugadorActual === "X" ? "neon-x" : "neon-o");

    if (verificarGanador()) {
        estado.textContent = `¡${obtenerNombre(jugadorActual)} ha ganado!`;
        puntos[jugadorActual]++;
        guardarPuntuacion();
        actualizarPuntuacion();
    } else if (tableroJuego.every(casilla => casilla !== "")) {
        estado.textContent = "¡Empate!";
    } else {
        jugadorActual = jugadorActual === "X" ? "O" : "X";
        estado.textContent = `Turno de ${obtenerNombre(jugadorActual)}`;
    }
}

// 🏅 Verificar ganador
function verificarGanador() {
    const patronesGanadores = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return patronesGanadores.some(patron => {
        const [a, b, c] = patron;
        return tableroJuego[a] && tableroJuego[a] === tableroJuego[b] && tableroJuego[a] === tableroJuego[c];
    });
}

// 🔄 Reiniciar el juego
function reiniciarJuego() {
    tableroJuego = Array(9).fill("");
    jugadorActual = "X";
    juegoIniciado = false;
    estado.textContent = "";
    contador.textContent = "";
    crearTablero();
    resetearJugadores(); // Limpiar nombres y puntuaciones
}

// 🎯 Continuar jugando (reiniciar solo el tablero)
function continuarJugando() {
    tableroJuego = Array(9).fill("");
    jugadorActual = "X";
    juegoIniciado = false;
    estado.textContent = "";
    contador.textContent = "";
    crearTablero();
}

// 📌 Actualizar puntuación en la tabla
function actualizarPuntuacion() {
    document.querySelector(".puntos-x").textContent = puntos["X"];
    document.querySelector(".puntos-o").textContent = puntos["O"];
    document.getElementById("nombreJugadorX").textContent = jugadoresGuardados.X || "Jugador X";
    document.getElementById("nombreJugadorO").textContent = jugadoresGuardados.O || "Jugador O";
}

// 💾 Guardar puntuación en LocalStorage
function guardarPuntuacion() {
    localStorage.setItem("puntos", JSON.stringify(puntos));
}

// 🔍 Obtener el nombre del jugador
function obtenerNombre(jugador) {
    return jugadoresGuardados[jugador] || `Jugador ${jugador}`;
}

// 🏁 Iniciar al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    const jugadoresGuardadosStorage = JSON.parse(localStorage.getItem("jugadores")) || { "X": "", "O": "" };
    const puntosGuardados = JSON.parse(localStorage.getItem("puntos")) || { "X": 0, "O": 0 };

    jugadoresGuardados = jugadoresGuardadosStorage;
    puntos = puntosGuardados;

    actualizarPuntuacion();
    crearTablero();

});