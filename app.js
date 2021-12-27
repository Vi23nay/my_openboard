const express = require('express');//access
const socket = require('socket.io');

const app = express();//initialize and server ready

app.use(express.static("public"));//frondend data-> main work

let port = process.env.PORT || 5000;//deployment
let server = app.listen(port, () => {
    console.log('Listening to port ' + port);
});

let io = socket(server);
//on -> eventListener
io.on("connection", (socket) => {
    console.log("socket.io is running");

    //received date
    socket.on("startPath", (data) => {
        // data from frontend
        //now transfer data to all connected computers
        io.sockets.emit("startPath", data);
    })
    
    socket.on("drawStroke", (data) => {
        io.sockets.emit("drawStroke", data);
    })

    socket.on("createImage", (data) => {
        io.sockets.emit("createImage", data);
    })
    socket.on("drawLine", (data) => {
        io.sockets.emit("drawLine", data);
    })
    socket.on("drawRect", (data) => {
        io.sockets.emit("drawRect", data);
    })

});
