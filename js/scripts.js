// Mapa Leaflet
var mapa = L.map('mapid').setView([9.5, -84.10], 8);


// Definición de capas base
var capa_osm = L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?', 
  {
    maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
).addTo(mapa);

var capa_Esri = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' , 
    {
      maxZoom: 19,
      atribución : 'Tiles & copy; Esri & mdash; Fuente: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP y la comunidad de usuarios de GIS '
    }
).addTo(mapa);

 
// Conjunto de capas base
var capas_base = {
  "OSM": capa_osm,
  "Esri": capa_Esri
};	    


// Ícono personalizado para Sitios Obras Hidráulicas
const iconoSitio = L.divIcon({
  html: '<i class="fas fa-tint"></i>',
  className: 'estiloIconos'
});


// Control de capas
control_capas = L.control.layers(capas_base).addTo(mapa);	


// Control de escala
L.control.scale().addTo(mapa);
   

// Capa vectorial de registros agrupados de Sitios Arqueológicos
$.getJSON("https://marce27.github.io/Dtarea2/sitios_OH5.geojson", function(geodata) {
  // Capa de registros individuales
  var capa_Sit = L.geoJson(geodata, {
    style: function(feature) {
	  return {'color': "red", 'weight': 5}
    },
    onEachFeature: function(feature, layer) {
      var popupText = "<strong>Nombre</strong>: " + feature.properties.Nombre + "<br>";
      layer.bindPopup(popupText);
    },
    pointToLayer: function(getJsonPoint, latlng) {
        return L.marker(latlng, {icon: iconoSitio});
    }
  });

  // Capa de calor (heatmap)
  coordenadas = geodata.features.map(feat => feat.geometry.coordinates.reverse());
  var capa_Sit_calor = L.heatLayer(coordenadas, {radius: 80, blur: 1});

  // Capa de puntos agrupados
  var capa_Sit_agrupados = L.markerClusterGroup({spiderfyOnMaxZoom: true});
  capa_Sit_agrupados.addLayer(capa_Sit);

  // Se añaden las capas al mapa y al control de capas
  capa_Sit_calor.addTo(mapa);
  control_capas.addOverlay(capa_Sit_calor, 'Mapa de calor');
  // capa_Sit_agrupados.addTo(mapa);
  control_capas.addOverlay(capa_Sit_agrupados, 'Registros agrupados');
  // capa_Sit.addTo(mapa);
  control_capas.addOverlay(capa_Sit, 'Sitios Arqueológicos');
});