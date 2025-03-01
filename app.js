const exp = require('constants');
const express = require('express');
const app = express();
const path = require('path');

const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

io.on("connection", function (socket) {
    socket.on('sendLocation', function (data) {
        console.log(data);
        io.emit("receiveLocation", {id: socket.id, ...data});
    });

    socket.on('disconnect', function () {
        io.emit("userDisconnected", socket.id);
    }
    );
  console.log('Connected');
});

app.get('/', (req, res) => {
  res.render('index');
}  );

server.listen(3000);