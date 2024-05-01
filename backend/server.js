const express=require('express')  //V
const app = express();
const http = require("http");
const httpServer = http.createServer(app);  
const cors = require("cors"); 
const axios = require("axios");
const mongoose = require("mongoose");
const user = require("./models/user");
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



app.use(express.json({limit:"150mb"}));
app.use(express.urlencoded({ extended: true, limit:"150mb"}));
app.use(cors({ origin: "*", credentials: true }));  


let connectedSockets = [];
let roomEditorContent = {}; // Store editor content for each room


// Inside the connection event handler
io.on("connection", (socket) => {
  const { username, roomid } = socket.handshake.query;
  console.log({ username, roomid });
  connectedSockets.push({ id: socket.id, username }); // Store the socket ID and username
  console.log("Total Connected Sockets: ", connectedSockets);

  socket.join(roomid);

  if (!roomEditorContent[roomid]) {
    roomEditorContent[roomid] = `console.log("Let's code together");\n`;
  }

  socket.emit("initialEditorContent", roomEditorContent[roomid]);

  // Emit event to update users list whenever a new user joins
  io.to(roomid).emit("updateUsersList", connectedSockets.map(socket => socket.username));

  socket.on("codeChange", (msg) => {
    roomEditorContent[roomid] = msg;
    io.to(roomid).emit("distributeCodeChange", msg);
  });

  socket.on("disconnect", () => {
    connectedSockets = connectedSockets.filter((item) => item.id !== socket.id);
    console.log("Total Connected Sockets: ", connectedSockets);
    io.to(roomid).emit("updateUsersList", connectedSockets.map(socket => socket.username)); // Update users list on disconnect
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
    user.find({ name: username })
      .then(async (data) => {
        if (data.length) {
            if(data[0].password===password){

                res.json({msg: "User Found", isError: false, username: username});
            }
            else{
                res.json({msg: "Incorrect Password !", isError: true});
            }
        }
        else{
            res.json({msg: "No user found !", isError: true});
          }
        })
        .catch((e)=>{
          console.log(e)
          res.json({msg: "Error! Please try again !", isError: true});
        })
      }

  catch(e){
    console.log(e);
    res.json({msg: "Server couldn't connect to database! Please try again later !", isError: true});
  }

});



app.post("/signup", async (req, res) => {

  console.log("SignUp");
  console.log(req.body);
  let { username, password } = req.body;

  try {
    user.find({ name: username })
      .then(async (data) => {
        if (data.length) {
          console.log("USERNAME ALREADY TAKEN: ", data);
          res.json({ msg: "Username already taken !" , isError: true});
        }
        else {
          const newUser = new user({ name: username, password: password });
          await newUser.save()
          .then((a) => {
            console.log(a);
            res.json({ msg: "User successfully registered! Please login!" , isError: false});
          })
          .catch((e) => {
              res.json({ msg: "Registration unsuccesfull! Please try again!" , isError: true});
              console.log(e);
            });
          }
        })
        .catch((e) => {
        res.json({ msg: "Registration unsuccesfull! Please try again!" , isError: true});
        console.log(e);
      });

    } 
    
  catch(e) {
    res.json({ msg: "Server couldn't connect to database! Please try again later!" , isError: true});
    console.log(e);
  }

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
