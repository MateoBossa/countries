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
let rondaActual = 1;
let totalRondas = 15;
let puntaje = 0;
const paisesPopulares = [
  "Argentina", "Brasil", "Canadá", "China", "Colombia", "España", "Estados Unidos",
  "Francia", "Alemania", "India", "Italia", "Japón", "México", "Perú", "Reino Unido",
  "Rusia", "Corea del Sur", "Australia", "Chile", "Portugal"
];


function iniciarJuegoBandera() {
  rondaActual = 1;
  puntaje = 0;

  fetch("https://restcountries.com/v3.1/all")
  .then(res => res.json())
  .then(data => {
    // Filtrar solo los países populares
    paisesGlobales = data.filter(p =>
      paisesPopulares.includes(p.name.common)
    );
    mostrarRonda();
  })
}

function mostrarRonda() {
  if (rondaActual > totalRondas) {
    juegoContenedor.innerHTML = `
      <h3 class="end-game">Juego terminado</h3>
      <p>Puntaje final: <strong>${puntaje} / ${totalRondas}</strong></p>
      <button id="reiniciar-juego">Jugar de nuevo</button>
    `;

    document.getElementById("reiniciar-juego").addEventListener("click", () => {
      iniciarJuegoBandera();
    });

    return;
  }

  const opciones = paisesGlobales.sort(() => 0.5 - Math.random()).slice(0, 4);
  const respuestaCorrecta = opciones[Math.floor(Math.random() * opciones.length)];

  juegoContenedor.innerHTML = `
    <p>Ronda ${rondaActual} de ${totalRondas}</p>
    <img src="${respuestaCorrecta.flags.png}" alt="Bandera" style="width: 200px; margin: 20px auto;">
    <div class="opciones">
      ${opciones.map(p => `<button class="opcion">${p.name.common}</button>`).join('')}
    </div>
    <p id="resultado-juego"></p>
  `;

  document.querySelectorAll(".opcion").forEach(btn => {
    btn.addEventListener("click", () => {
      const resultado = document.getElementById("resultado-juego");
      if (btn.textContent === respuestaCorrecta.name.common) {
        resultado.textContent = "¡Correcto! 🎉";
        resultado.style.color = "lightgreen";
        puntaje++;
      } else {
        resultado.textContent = `Incorrecto 😞. Era ${respuestaCorrecta.name.common}`;
        resultado.style.color = "tomato";
      }

      // Desactivar botones
      document.querySelectorAll(".opcion").forEach(b => b.disabled = true);

      // Esperar 1.5 segundos y cargar la siguiente ronda
      setTimeout(() => {
        rondaActual++;
        mostrarRonda();
      }, 1500);
    });
  });
}

