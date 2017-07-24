// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

require("component-responsive-frame/child");
require("component-leaflet-map");
require("leaflet.markercluster");

var $ = require("./lib/qsa");

var mapElement = $.one("leaflet-map");
var map = mapElement.map;
var leaflet = mapElement.leaflet;

var iconCreateFunction = function(cluster) {
  var count = cluster.getChildCount();
  var type = cluster.getAllChildMarkers()[0].data.species.toLowerCase();
  var size = count < 10 ? "20" : count < 50 ? "32" : "64";
  return leaflet.divIcon({
    html: count,
    className: `kill-marker cluster ${type}`,
    iconSize: [size, size]
  });
};

var elkLayer = leaflet.markerClusterGroup({ iconCreateFunction, showCoverageOnHover: false });
var deerLayer = leaflet.markerClusterGroup({ iconCreateFunction, showCoverageOnHover: false });

window.roadkillData.forEach(function(r) {
  if (!r.lat) return;
  var marker = leaflet.marker([r.lat, r.lng], {
    icon: leaflet.divIcon({
      className: `kill-marker leaflet-marker ${r.species.toLowerCase()}`
    })
  });
  marker.data = r;
  marker.bindPopup(`
<div class="kill-details">
  <h2>Permit #${r.permit}</h2>
  <p> ${r.sex == "F" ? "Female" : "Male"} ${r.species.toLowerCase()}, ${r.antlers} antler points
  <p> Salvaged on ${r.date.replace(/\s.+$/, "")}
  <p>Description: ${ r.details ? '"' + r.details + '"' : "None given"}
</div>
  `)
  marker.addTo(r.species == "ELK" ? elkLayer : deerLayer);
});

elkLayer.addTo(map);
deerLayer.addTo(map);

map.fitBounds(deerLayer.getBounds());