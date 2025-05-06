document.addEventListener("DOMContentLoaded", () => {
  obtenerTodosLosPaises(); // Cargar los primeros países cuando la página se carga

  const input = document.getElementById("search");
  input.addEventListener("input", () => {
    const nombre = input.value.trim();

    if (nombre === "") {
      obtenerTodosLosPaises(); // Mostrar países por defecto si el input está vacío
    } else {
      buscarPais(nombre); // Buscar país por nombre
    }
  });
});

// Obtener todos los países (solo los primeros 20)
function obtenerTodosLosPaises() {
fetch("https://restcountries.com/v3.1/all")
  .then((res) => res.json())
  .then((data) => {
      mostrarPaises(data.slice(0, 20)); // Solo los primeros 20 países
  })
  .catch((error) => console.error("Error:", error));
}

// Buscar un país por nombre
function buscarPais(nombre) {
fetch(`https://restcountries.com/v3.1/name/${nombre}`)
  .then((res) => {
    if (!res.ok) throw new Error("No encontrado");
    return res.json();
  })
  .then((data) => {
    mostrarPaises(data); // Mostrar países encontrados
  })
  .catch(() => {
    document.getElementById("resultado").innerHTML = `<p class="notfound">No se encontró el país <strong>"${nombre.toUpperCase()}"</strong>.</p>`; // Mostrar mensaje de error si no se encuentra el país
  });
}

// Mostrar la información de los países en las tarjetas
function mostrarPaises(paises) {
const contenedor = document.getElementById("resultado");
contenedor.innerHTML = ""; // Limpiar el contenedor antes de agregar las nuevas tarjetas

paises.forEach((pais) => {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <img src="${pais.flags.png}" alt="Bandera de ${pais.name.common}">
    <h3>${pais.name.common}</h3>
    <p class="poblacion"><strong>Población:</strong> ${pais.population.toLocaleString()}</p>
    <p class="capital"><strong>Capital:</strong> ${pais.capital}</p>
    <p class="region"><strong>Región:</strong> ${pais.region}</p>
    <p class="idioma"><strong>Idioma(s):</strong> ${pais.languages ? Object.values(pais.languages).join(", ") : 'N/A'}</p>
    <a class="google-maps" href="${pais.maps.googleMaps}" target="_blank">
      <div class="back-img">
        <img src="map.svg" alt="Google Maps">
      </div>
    </a>
  `;
  contenedor.appendChild(card);
  
  // Añadir la clase show para activar la animación
  setTimeout(() => {
    card.classList.add("show");
  }, 50); // Añadir un pequeño retraso para que la animación se vea
});
}

// MODAL
// Elementos del modal
const modal = document.getElementById("modal-juego");
const cerrarModal = document.getElementById("cerrar-modal");
const iconoMenu = document.querySelector('.content img');
const juegoContenedor = document.getElementById("juego-contenido");

// Mostrar modal al hacer clic en el ícono
iconoMenu.addEventListener("click", () => {
  modal.style.display = "block";
  iniciarJuegoBandera(); // Cargar el juego
});

// Cerrar modal al hacer clic en la X
cerrarModal.addEventListener("click", () => {
  modal.style.display = "none";
  juegoContenedor.innerHTML = ""; // Limpiar juego al cerrar
});

// Cerrar modal al hacer clic fuera del contenido
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
    juegoContenedor.innerHTML = "";
  }
});


// JUEGO
let paisesRonda = [];
let paisesDisponibles = [];
let rondaActual = 0;
let totalRondas = 15;
let puntaje = 0;

function iniciarJuegoBandera() {
  fetch("https://restcountries.com/v3.1/all")
    .then(res => res.json())
    .then(data => {
      const paisesPopulares = [
        "Argentina", "Brazil", "Canada", "China", "Colombia", "Spain", "United States",
        "France", "Germany", "India", "Italy", "Japan", "Mexico", "Peru", "United Kingdom",
        "Russia", "South Korea", "Australia", "Chile", "Portugal"
      ];

      const paisesFiltrados = data.filter(p =>
        paisesPopulares.includes(p.name.common)
      );

      // Eliminar duplicados
      const paisesUnicos = [];
      const nombresAgregados = new Set();
      for (const pais of paisesFiltrados) {
        if (!nombresAgregados.has(pais.name.common)) {
          paisesUnicos.push(pais);
          nombresAgregados.add(pais.name.common);
        }
      }

      paisesDisponibles = paisesUnicos; // Guardamos todos los válidos

      paisesRonda = mezclarArray(paisesUnicos).slice(0, 15);
      rondaActual = 0;
      puntaje = 0;
      mostrarRonda();
    });
}

function mostrarRonda() {
  if (rondaActual >= paisesRonda.length || rondaActual >= totalRondas) {
    juegoContenedor.innerHTML = `
      <h3 class="end-game">Juego terminado</h3>
      <p class="score">Puntaje final: <strong>${puntaje} / ${totalRondas}</strong></p>
      <button id="reiniciar-juego">Jugar de nuevo</button>
    `;

    document.getElementById("reiniciar-juego").addEventListener("click", iniciarJuegoBandera);
    return;
  }

  const respuestaCorrecta = paisesRonda[rondaActual];

  // Opciones incorrectas desde paisesDisponibles (excluyendo la correcta)
  const opcionesIncorrectas = mezclarArray(
    paisesDisponibles.filter(p => p.name.common !== respuestaCorrecta.name.common)
  ).slice(0, 3);

  const opciones = mezclarArray([...opcionesIncorrectas, respuestaCorrecta]);

  juegoContenedor.innerHTML = `
    <p>Ronda ${rondaActual + 1} de ${totalRondas}</p>
    <img src="${respuestaCorrecta.flags.png}" alt="Bandera" style="width: 200px; margin: 20px auto;">
    <div class="opciones">
      ${opciones
        .filter(p => p && p.name && p.name.common) // <- prevención extra
        .map(p => `<button class="opcion">${p.translations?.spa?.common || p.name.common}</button>`)
        .join("")}
    </div>
    <p id="resultado-juego"></p>
  `;

  document.querySelectorAll(".opcion").forEach(btn => {
    btn.addEventListener("click", () => {
      const resultado = document.getElementById("resultado-juego");
      if (btn.textContent === (respuestaCorrecta.translations?.spa?.common || respuestaCorrecta.name.common)) {
        resultado.textContent = "¡Correcto! 🎉";
        resultado.style.color = "lightgreen";
        puntaje++;
      } else {
        resultado.textContent = `Incorrecto 😞. Era ${respuestaCorrecta.translations?.spa?.common || respuestaCorrecta.name.common}`;
        resultado.style.color = "tomato";
      }

      document.querySelectorAll(".opcion").forEach(b => b.disabled = true);

      setTimeout(() => {
        rondaActual++;
        mostrarRonda();
      }, 1500);
    });
  });
}


function mezclarArray(array) {
  let copia = [...array];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}



