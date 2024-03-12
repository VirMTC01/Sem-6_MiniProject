const express = require("express");
const http = require("http");
const cors = require("cors");

const PORT = 8000;

const app = express();
const httpServer = http.createServer(app);

const io = require("socket.io")(httpServer, {
  cors: {
    origin: "https://sem-6-miniproject.onrender.com", // Frontend URL
    methods: ["GET", "POST"],
  },
});

let connectedSockets = [];
let roomEditorContent = {}; // Store editor content for each room

io.on("connection", (socket) => {
  const { username, roomid } = socket.handshake.query;
  console.log({ username, roomid });
  connectedSockets.push(socket.id);
  console.log("Total Connected Sockets: ", connectedSockets);

  socket.join(roomid);

  if (!roomEditorContent[roomid]) {
    roomEditorContent[roomid] = "// Start coding..." 
  }

  socket.emit("initialEditorContent", roomEditorContent[roomid]);

  socket.on("codeChange", (msg) => {
    roomEditorContent[roomid] = msg;

    io.to(roomid).emit("distributeCodeChange", msg);
  });

  socket.on("disconnect", () => {
    connectedSockets = connectedSockets.filter((item) => item !== socket.id);
    console.log("Total Connected Sockets: ", connectedSockets);
    socket.leave(roomid);
  });
});

app.get("/", (req, res) => {
  res.json({ Value: 10 });
});

app.use(cors({ origin: "*", credentials: true }));
httpServer.listen(PORT, () =>
  console.log(`Server is listening on port number ${PORT}.`)
);
