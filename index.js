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
    document.getElementById("resultado").innerHTML = `<p class="notfound">No se encontró el país.</p>`; // Mostrar mensaje de error si no se encuentra el país
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
  `;
  contenedor.appendChild(card);
  
  // Añadir la clase show para activar la animación
  setTimeout(() => {
    card.classList.add("show");
  }, 50); // Añadir un pequeño retraso para que la animación se vea
});
}
