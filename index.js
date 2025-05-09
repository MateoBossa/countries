const puntajesPorContinente = {};  // Ej: { Asia: 12, Europe: 9 }
let continenteActual = "";

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
  fetch("https://restcountries.com/v3.1/all")
    .then(res => res.json())
    .then(data => {
      // Convertir el texto de búsqueda a minúsculas para comparación
      const nombreBusqueda = nombre.toLowerCase();

      // Filtrar países cuyo nombre en español coincida con la búsqueda
      const resultados = data.filter(pais => {
        const nombreEspanol = pais.translations?.spa?.common?.toLowerCase();
        return nombreEspanol?.includes(nombreBusqueda);
      });

      if (resultados.length > 0) {
        mostrarPaises(resultados);
      } else {
        document.getElementById("resultado").innerHTML = `<p class="notfound">No se encontró el país <strong>"${nombre.toUpperCase()}"</strong>.</p>`;
      }
    })
    .catch(error => {
      console.error("Error:", error);
      document.getElementById("resultado").innerHTML = `<p class="notfound">Ocurrió un error al buscar el país.</p>`;
    });
}

// Mostrar la información de los países en las tarjetas
function mostrarPaises(paises) {
  const contenedor = document.getElementById("resultado");
  contenedor.innerHTML = ""; // Limpiar el contenedor antes de agregar las nuevas tarjetas

  paises.forEach((pais) => {
    const card = document.createElement("div");
    card.className = "card";

    // Obtener el nombre del país en español o el nombre común como respaldo
    const nombreEspanol = pais.translations?.spa?.common || pais.name.common;

    // Envolver la tarjeta en un enlace para redirigir al detalle del país
    const enlace = document.createElement("a");
    enlace.href = `detalles.html?nombre=${encodeURIComponent(pais.name.common)}`;
    enlace.classList.add("pais-enlace");

    // Obtener idiomas como texto (mantienen su nombre nativo generalmente)
    const idiomas = pais.languages ? Object.values(pais.languages).join(", ") : 'N/A';

    card.innerHTML = `
      <img src="${pais.flags.png}" alt="Bandera de ${nombreEspanol}">
      <h3>${nombreEspanol}</h3>
      <p class="poblacion"><strong>Población:</strong> ${pais.population.toLocaleString()}</p>
      <p class="capital"><strong>Capital:</strong> ${pais.capital || 'N/A'}</p>
      <p class="region"><strong>Región:</strong> ${pais.region}</p>
      <p class="idioma"><strong>Idioma(s):</strong> ${idiomas}</p>
      <a class="google-maps" href="${pais.maps.googleMaps}" target="_blank">
        <div class="back-img">
          <img src="map.svg" alt="Google Maps">
        </div>
      </a>
    `;

    enlace.appendChild(card);
    contenedor.appendChild(enlace);

    // Añadir la clase show para activar la animación
    setTimeout(() => {
      card.classList.add("show");
    }, 50);
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
  juegoContenedor.innerHTML = `
    <h3 class="text-cont">Selecciona un continente</h3>
    <div class="continente-opciones">
      <button data-cont="Africa">África</button>
      <button data-cont="Americas">América</button>
      <button data-cont="Asia">Asia</button>
      <button data-cont="Europe">Europa</button>
      <button data-cont="Oceania">Oceanía</button>
    </div>
  `;

  // Escuchar los clics en los botones de continente
  document.querySelectorAll(".continente-opciones button").forEach(btn => {
    btn.addEventListener("click", () => {
      const continenteSeleccionado = btn.getAttribute("data-cont");
      iniciarJuegoBandera(continenteSeleccionado);
    });
  });
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
let totalRondas = 5;
let puntaje = 0;

function iniciarJuegoBandera(continente) {
  continenteActual = continente; // Guardar el continente actual


  fetch("https://restcountries.com/v3.1/all")
    .then(res => res.json())
    .then(data => {
      const paisesDelContinente = data.filter(p => p.region === continente);

      // Eliminar duplicados por nombre común
      const nombresAgregados = new Set();
      const paisesUnicos = paisesDelContinente.filter(p => {
        if (!nombresAgregados.has(p.name.common)) {
          nombresAgregados.add(p.name.common);
          return true;
        }
        return false;
      });

      paisesDisponibles = paisesUnicos;
      paisesRonda = mezclarArray(paisesUnicos).slice(0, 15);
      rondaActual = 0;
      puntaje = 0;
      mostrarRonda();
    });
}

function mostrarRonda() {
  if (rondaActual >= paisesRonda.length || rondaActual >= totalRondas) {
    // Guardar puntaje
    puntajesPorContinente[continenteActual] = puntaje;
  
    // Mostrar fin del juego y opciones
    juegoContenedor.innerHTML = `
      <h3 class="end-game">Juego terminado - ${continenteActual}</h3>
      <p class="score">Puntaje final: <strong>${puntaje} / ${totalRondas}</strong></p>
      <div class="botones-final">
        <button id="jugar-nuevo">Elegir otro continente</button>
        <button id="ver-estadisticas">Ver estadísticas</button>
      </div>
    `;
  
    // Volver a mostrar selector de continente
    document.getElementById("jugar-nuevo").addEventListener("click", () => {
      juegoContenedor.innerHTML = `
        <h3 class="text-cont">Selecciona un continente</h3>
        <div class="continente-opciones">
          <button data-cont="Africa">África</button>
          <button data-cont="Americas">América</button>
          <button data-cont="Asia">Asia</button>
          <button data-cont="Europe">Europa</button>
          <button data-cont="Oceania">Oceanía</button>
        </div>
      `;
      document.querySelectorAll(".continente-opciones button").forEach(btn => {
        btn.addEventListener("click", () => {
          const nuevoCont = btn.getAttribute("data-cont");
          iniciarJuegoBandera(nuevoCont);
        });
      });
    });
  
    // Ver estadísticas
    document.getElementById("ver-estadisticas").addEventListener("click", () => {
      mostrarEstadisticas();
    });
  
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
        
        // Añadir animación de respuesta correcta
        btn.classList.add("correcto");
        puntaje++;
      } else {
        resultado.textContent = `Incorrecto 😞. Era ${respuestaCorrecta.translations?.spa?.common || respuestaCorrecta.name.common}`;
        resultado.style.color = "tomato";

         // Añadir animación de respuesta incorrecta
        btn.classList.add("incorrecto");
      }

      document.querySelectorAll(".opcion").forEach(b => b.disabled = true);

      setTimeout(() => {
        rondaActual++;
        mostrarRonda();
      }, 1500);
    });
  });
}

function mostrarEstadisticas() {
  let html = `<h3 class="text-chart">Estadísticas por continente</h3><ul class="list-countries">`;
  for (const cont in puntajesPorContinente) {
    html += `<li class="name-country"><strong>${cont}:</strong> ${puntajesPorContinente[cont]} / ${totalRondas}</li>`;
  }
  html += `</ul><canvas id="graficoPuntajes" width="400" height="200"></canvas>
           <button id="volver-inicio">Volver a jugar</button>`;

  juegoContenedor.innerHTML = html;

  document.getElementById("volver-inicio").addEventListener("click", () => {
    iconoMenu.click(); // Simula volver a abrir el menú
  });

  dibujarGrafico();
}

function dibujarGrafico() {
  const ctx = document.getElementById('graficoPuntajes').getContext('2d');
  const labels = Object.keys(puntajesPorContinente);
  const data = Object.values(puntajesPorContinente);

  const colores = [
    'rgba(255, 99, 132, 0.7)',   // África
    'rgba(54, 162, 235, 0.7)',   // América
    'rgba(255, 206, 86, 0.7)',   // Asia
    'rgba(75, 192, 192, 0.7)',   // Europa
    'rgba(153, 102, 255, 0.7)'   // Oceanía
  ];

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Puntaje por continente',
        data: data,
        backgroundColor: colores,
        borderColor: colores.map(color => color.replace('0.7', '1')), // Borde más opaco
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: totalRondas
        }
      }
    }
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



