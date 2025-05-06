const urlParams = new URLSearchParams(window.location.search);
const nombrePais = urlParams.get('nombre');

fetch(`https://restcountries.com/v3.1/name/${nombrePais}`)
  .then(res => res.json())
  .then(data => {
    const pais = data[0];

    // Mostrar nombre y bandera
    document.getElementById("nombre-pais").textContent = pais.name.official;
    document.getElementById("bandera-pais").src = pais.flags.svg || pais.flags.png;
    document.getElementById("bandera-pais").alt = `Bandera de ${pais.name.common}`;

    // Obtener detalles adicionales
    const idiomaTexto = pais.languages ? Object.values(pais.languages).join(", ") : 'N/A';
    const monedaObj = pais.currencies ? Object.values(pais.currencies)[0] : null;
    const monedaTexto = monedaObj ? `${monedaObj.name} (${monedaObj.symbol})` : 'N/A';
    const gentilicio = pais.demonyms?.spa?.m || 'N/A';
    const fronteras = pais.borders ? pais.borders.join(", ") : 'Ninguna';
    const codLlamada = pais.idd?.root && pais.idd?.suffixes ? pais.idd.root + pais.idd.suffixes[0] : 'N/A';

    document.getElementById("informacion-pais").innerHTML = `
      <p><strong>Nombre común:</strong> ${pais.name.common}</p>
      <p><strong>Gentilicio:</strong> ${gentilicio}</p>
      <p><strong>Población:</strong> ${pais.population.toLocaleString()}</p>
      <p><strong>Capital:</strong> ${pais.capital}</p>
      <p><strong>Región:</strong> ${pais.region}</p>
      <p><strong>Subregión:</strong> ${pais.subregion}</p>
      <p><strong>Idioma(s):</strong> ${idiomaTexto}</p>
      <p><strong>Área:</strong> ${pais.area.toLocaleString()} km²</p>
      <p><strong>Moneda:</strong> ${monedaTexto}</p>
      <p><strong>Código telefónico:</strong> ${codLlamada}</p>
      <p><strong>Dominio:</strong> ${pais.tld ? pais.tld.join(', ') : 'N/A'}</p>
      <p><strong>Zonas horarias:</strong> ${pais.timezones.join(", ")}</p>
      <p><strong>Fronteras:</strong> ${fronteras}</p>
    `;

    // Mostrar mapa
    const mapaImg = document.getElementById("mapa");
    const mapaLink = document.getElementById("link-mapa");
    mapaImg.src = pais.coatOfArms?.svg || "https://via.placeholder.com/200x120?text=Sin+Mapa";
    mapaImg.className = 'field'
    mapaImg.alt = "Mapa o escudo del país";
    mapaLink.href = pais.maps.googleMaps;
  })
  .catch(error => {
    console.error("Error al cargar los detalles del país:", error);
  });

document.getElementById("volver").addEventListener("click", () => {
  window.history.back();
});