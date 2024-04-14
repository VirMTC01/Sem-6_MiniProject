const express = require("express");
const http = require("http");
const cors = require("cors"); 
const axios = require("axios");
const PORT = 8000;
const app = express();
const httpServer = http.createServer(app);

const JUDGE0_API_KEY = "ef617f9a4bmsh2c3fc6f141abf99p14dcfcjsn9346e9656508";                                                                                              

const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:3000", // Frontend URL
    methods: ["GET", "POST"],
  },
});


app.use(cors({ origin: "*", credentials: true }));  
app.use(express.json());


let connectedSockets = [];
let roomEditorContent = {}; // Store editor content for each room




io.on("connection", (socket) => {
  const { username, roomid } = socket.handshake.query;
  console.log({ username, roomid });
  connectedSockets.push(socket.id);
  console.log("Total Connected Sockets: ", connectedSockets);

  socket.join(roomid);

  if (!roomEditorContent[roomid]) {
    roomEditorContent[roomid] = `console.log("Let's code together");\n` ; 
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





// Route to handle code compilation
app.post("/compile", async (req, res) => {
  try {
    console.log(req.body)
    const { editorContent, lang ,input } = req.body; 
    let code = editorContent ; 
    let formData = {
      language_id: lang,
      source_code: Buffer.from(code).toString("base64"),
      stdin: Buffer.from(input).toString("base64"),
    };

    let options = {
      method: "POST",
      url: 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&fields=*',
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        'X-RapidAPI-Key': 'ef617f9a4bmsh2c3fc6f141abf99p14dcfcjsn9346e9656508',
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        'base64_encoded': 'true'
       },
      data: formData,
    };

    axios.request(options)
      .then(function (response) {
        const token = response.data.token;
        checkStatus(token, res); // Pass res to checkStatus function
      })
      .catch((error) => {
        let err = error.response ? error.response.data : error;
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Function to check the status of the submission
const checkStatus = async (token, res) => {
  const options = {
    method: "GET",
    url: 'https://judge0-ce.p.rapidapi.com/submissions/' + token + '?fields=*',
    headers: {
      'X-RapidAPI-Key': 'ef617f9a4bmsh2c3fc6f141abf99p14dcfcjsn9346e9656508',
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
    }
  };

  try {
    let response = await axios.request(options);
    let statusId = response.data.status?.id;

    if (statusId === 1 || statusId === 2) {
      // Still processing
      setTimeout(() => {
        checkStatus(token, res);
      }, 5000);
    } else {
      res.json({ status: true, output: response.data.stdout });
    }
  } catch (err) {
    console.log("ERROR IS :- ");
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};





httpServer.listen(PORT, () =>
  console.log(`Server is listening on port number ${PORT}.`)
);
