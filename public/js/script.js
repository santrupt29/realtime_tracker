const socket = io();

const username = prompt("Enter your Username");

// User Location History
const userPath = [];
// Check if browser supports geolocation
if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit('sendLocation', {username, latitude, longitude });
        userPath.push([latitude, longitude]); 
        if (userPath.length > 1) {
            const polyline = L.polyline(userPath, { color: 'red' }).addTo(map); // Route
        }
    }, (error) => {
        console.log(error);
    }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    });
}

const map = L.map("map").setView([0, 0], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
}).addTo(map);

const markers = {};

socket.on("userDisconnected", (id) => { 
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
socket.on("receiveLocation", (data) => {
    const { id, username, latitude, longitude } = data;
    map.setView([latitude, longitude]);
    if (!markers[id]) {
        markers[id] = L.marker([latitude, longitude])
        .bindPopup(username)
        .addTo(map)
        .openPopup();
    } else {
        markers[id].setLatLng([latitude, longitude]).bindPopup(username).openPopup();
    }
});

// Mock coordinates
const polygonCoords = [
    [19.0208754, 72.856137], 
    [19.0208754, 72.853137],
    [19.0188754, 72.853137],
    [19.0188754, 72.856137]
];
   

// Draw the polygon on the map
L.polygon(polygonCoords, { color: 'red' }).addTo(map)
    .bindPopup("Test Polygon Area")
    .openPopup();
