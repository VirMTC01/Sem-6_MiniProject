const express = require("express");
const http = require("http");
const Server = require("socket.io") ;
const cors = require( "cors");

const PORT = 8000;

const app = express();
const httpServer = http.createServer(app);

 

const io = require("socket.io")(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });
io.on('connection', (socket) => {
    console.log("New Socket : ", socket.id)
    
    socket.on('code_change', (msg)=>{
        socket.broadcast.emit("distributing_code_change", msg);
    })
     
    
    socket.on('disconnect', ()=>{
        console.log("Disconnected with ", socket.id);
    })
});

app.get('/', (req, res)=> {
    res.json({"Value": 10})
});

app.use(cors( {origin:"*", credentials:true}));
httpServer.listen(PORT, () => console.log(`Server is listening on port number ${PORT}.`));
