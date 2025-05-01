document.addEventListener("DOMContentLoaded", () => {
    obtenerTodosLosPaises();
  
    const input = document.getElementById("search");
    input.addEventListener("input", () => {
      const nombre = input.value.trim();
  
      if (nombre === "") {
        obtenerTodosLosPaises(); // Mostrar países por defecto
      } else {
        buscarPais(nombre);
      }
    });
});
  
function obtenerTodosLosPaises() {
fetch("https://restcountries.com/v3.1/all")
    .then((res) => res.json())
    .then((data) => {
        mostrarPaises(data.slice(0, 20)); // Solo 6 por defecto
    })
    .catch((error) => console.error("Error:", error));
}
  
function buscarPais(nombre) {
fetch(`https://restcountries.com/v3.1/name/${nombre}`)
    .then((res) => {
    if (!res.ok) throw new Error("No encontrado");
    return res.json();
    })
    .then((data) => {
    mostrarPaises(data);
    })
    .catch(() => {
    document.getElementById("resultado").innerHTML =
        "<p>No se encontró el país.</p>";
    });
}
  
function mostrarPaises(paises) {
    const contenedor = document.getElementById("resultado");
    contenedor.innerHTML = "";
  
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
    });
  }
  