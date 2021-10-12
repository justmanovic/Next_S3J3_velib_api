const container = document.querySelector(".container")

// Le premier exercice peut être un peu long : fais petit à petit, 
// commence par afficher un seul arrêt, puis l'actualiser chaque minute, puis enfin en afficher plusieurs, 
// et afficher la map avec leaflet si vraiment tu as tout réussi !

let stationsVelibArr = []
var mymap = L.map('mapid').setView([48.8651261, 2.3769062], 13);


const showVelibStation = (selector, name, numberClassicalVelibs, numberElectricVelibs) => {
  selector.innerHTML += `
        <div>
            <h2>Station : ${name}</h2>
            <p>${numberClassicalVelibs} classical Velibs</p>
            <p>${numberElectricVelibs} electric Velibs</p>
        </div>
    `
}

const getVelibStations = async () => {
  // container.innerHTML = ''
  const response = await fetch("https://opendata.paris.fr/api/records/1.0/search/?dataset=velib-disponibilite-en-temps-reel&q=&rows=100&facet=name&facet=is_installed&facet=is_renting&facet=is_returning&facet=nom_arrondissement_communes")
  const myJson = await response.json();
  // myJson.records.forEach(station => showVelibStation(container, station.fields.name, station.fields.mechanical, station.fields.ebike))

  myJson.records.forEach(station => {
    coords = [station.fields.coordonnees_geo[0], station.fields.coordonnees_geo[1]]
    let marker = L.marker(coords).addTo(mymap);
    html = `<ul>
              <li><b>Nom de la station : </b>${station.fields.name}</li>
              <li><b>Nombre de vélos mécaniques: </b>${station.fields.mechanical}</li>
              <li><b>Nombre de vélos électriques: </b>${station.fields.ebike}</li>
            </ul>`
    marker.bindPopup(html).openPopup();
  })
}

var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors',
  maxZoom: 19
});

mymap.addLayer(osmLayer);

getVelibStations()

setInterval(getVelibStations, 60000)

