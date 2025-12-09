const map = L.map('map').setView([40.785091, -73.968285], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Підтягнемо місця з backend
fetch("http://localhost:5000/api/places")
  .then(res => res.json())
  .then(data => {
    data.forEach(place => {
      L.marker([place.location.lat, place.location.lng])
        .addTo(map)
        .bindPopup(`<b>${place.name}</b><br>${place.description}`);
    });
  });
