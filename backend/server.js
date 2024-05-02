const express = require("express");
const app = express();
const http = require("http");
const httpServer = http.createServer(app);
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
const user = require("./models/user");
const UserRooms = require("./models/users_rooms");
const PORT = 8000;

const JUDGE0_API_KEY = "ef617f9a4bmsh2c3fc6f141abf99p14dcfcjsn9346e9656508";

const io = require("socket.io")(httpServer, {
  cors: {
    // origin: "https://sem-6-miniproject.onrender.com", // Frontend URL
    origin: "http://localhost:3000", // Frontend URL
    methods: ["GET", "POST"],
  },
});

mongoose
  .connect(
    "mongodb+srv://yashlodhi1703:Ya%40171003@cluster0.iacbiar.mongodb.net/codeAlong"
  )
  .then(() => {
    console.log(" ");
    console.log("|| MongoDB CONNECTION OPEN ||");
    console.log(" ");
  })
  .catch((err) => {
    console.log("OH NO ! ERROR !");
    console.log(err);
  });

app.use(express.json({ limit: "150mb" }));
app.use(express.urlencoded({ extended: true, limit: "150mb" }));
app.use(cors({ origin: "*", credentials: true }));

let connectedSockets = [];
let roomEditorContent = {}; // Store editor content for each room

io.on("connection", (socket) => {
  const { username, roomid } = socket.handshake.query;
  console.log({ username, roomid });
  connectedSockets.push(socket.id);
  console.log("Total Connected Sockets: ", connectedSockets);

  socket.join(roomid);

  if (!roomEditorContent[roomid]) {
    roomEditorContent[roomid] = `console.log("Let's code together");\n`;
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

app.post("/login", async (req, res) => {
  console.log("Login");
  console.log(req.body);
  let { username, password } = req.body;

  try {
    user
      .find({ name: username })
      .then(async (data) => {
        if (data.length) {
          if (data[0].password === password) {
            res.json({ msg: "User Found", isError: false, username: username });
          } else {
            res.json({ msg: "Incorrect Password !", isError: true });
          }
        } else {
          res.json({ msg: "No user found !", isError: true });
        }
      })
      .catch((e) => {
        console.log(e);
        res.json({ msg: "Error! Please try again !", isError: true });
      });
  } catch (e) {
    console.log(e);
    res.json({
      msg: "Server couldn't connect to database! Please try again later !",
      isError: true,
    });
  }
});

app.post("/signup", async (req, res) => {
  console.log("SignUp");
  console.log(req.body);
  let { username, password } = req.body;

  try {
    user
      .find({ name: username })
      .then(async (data) => {
        if (data.length) {
          console.log("USERNAME ALREADY TAKEN: ", data);
          res.json({ msg: "Username already taken !", isError: true });
        } else {
          const newUser = new user({ name: username, password: password });
          await newUser
            .save()
            .then((a) => {
              console.log(a);
              res.json({
                msg: "User successfully registered! Please login!",
                isError: false,
              });
            })
            .catch((e) => {
              res.json({
                msg: "Registration unsuccesfull! Please try again!",
                isError: true,
              });
              console.log(e);
            });
        }
      })
      .catch((e) => {
        res.json({
          msg: "Registration unsuccesfull! Please try again!",
          isError: true,
        });
        console.log(e);
      });
  } catch (e) {
    res.json({
      msg: "Server couldn't connect to database! Please try again later!",
      isError: true,
    });
    console.log(e);
  }
});

// Route to handle code compilation
app.post("/compile", async (req, res) => {
  try {
    console.log(req.body);
    const { editorContent, lang, input } = req.body;
    let code = editorContent;
    let formData = {
      language_id: lang,
      source_code: Buffer.from(code).toString("base64"),
      stdin: Buffer.from(input).toString("base64"),
    };

    let options = {
      method: "POST",
      url: "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&fields=*",
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Key": "ef617f9a4bmsh2c3fc6f141abf99p14dcfcjsn9346e9656508",
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        base64_encoded: "true",
      },
      data: formData,
    };

    axios
      .request(options)
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
    url: "https://judge0-ce.p.rapidapi.com/submissions/" + token + "?fields=*",
    headers: {
      "X-RapidAPI-Key": "ef617f9a4bmsh2c3fc6f141abf99p14dcfcjsn9346e9656508",
      "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
    },
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

app.post("/roomslist", async (req, res) => {
  let { username, password } = req.body;
 
  try {
    const userData = await UserRooms.findOne({ username, password });

    if (userData) {
      const rooms = userData.rooms;
      console.log(rooms)
      res.status(200).json(rooms);
    } else {
      res.status(404).json({ msg: "User not found", isError: true });
    }
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ msg: "Error! Please try again later!", isError: true });
  }
});

app.delete('/room/:username/:roomId', async (req, res) => {
  const username = req.params.username;
  const roomId = req.params.roomId;

  try { 
      const user = await UserRooms.findOne({ username });

      if (!user) {
          return res.status(404).json('User not found');
      }
 
      const roomIndex = user.rooms.findIndex(room => room._id.toString() === roomId);

      if (roomIndex === -1) {
          return res.status(404).json('Room not found for this user');
      }
 
      user.rooms.splice(roomIndex, 1);
 
      await user.save();

      res.status(200).json('Room deleted successfully');
  } catch (error) {
      console.error('Error deleting room:', error);
      res.status(500).json('Error deleting room');
  }
});

 
 
app.post('/roomslist/newroom', async (req, res) => {
  try { 
    const { username, password, name, description } = req.body;
    console.log("here")
     if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

     const newRoom = {
      name,
      description,
      content: `console.log("Let's code together");\n`  
    };

     let userRooms = await UserRooms.findOne({ username, password });

     if (!userRooms) {
      userRooms = new UserRooms({
        username,
        password,
        rooms: [newRoom]
      });
    } else {
       userRooms.rooms.push(newRoom);
    }

     await userRooms.save();

     return res.status(201).json({ message: 'Room created successfully.', room: newRoom });
  } catch (error) {
     console.error('Error creating room:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});





httpServer.listen(PORT, () =>
  console.log(`Server is listening on port number ${PORT}.`)
);
