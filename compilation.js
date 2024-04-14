
import React, { useState } from "react";
import axios from "axios";

function App() {
  const [code, setCode] = useState("Program Code");
  const [output, setOutput] = useState("Output");
  const [lang , setLang] = useState('lang id');
  const [input , setInput]=useState('');
  // let id = "";
  const handleCodeChange = (event) => {
    setCode(event.target.value);
        console.log(code);

  };
  const handleLangChange = (event) => {
    setLang(event.target.value);
    console.log(lang);
  };
  const handleInputChange = (event) => {
    setInput(event.target.value);
    console.log(input);
  };
  const handleSubmit = async () => {
    // Make a POST request to your backend to compile the code
    const response = await axios.post("http://localhost:5000/compile", {
      code,
      lang,
      input,
    });

    try {
      if (response.data.status) {
        setOutput(response.data.output);
      }
    } catch (error) {
if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Server responded with error:", error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received from server:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error setting up request:", error.message);
    }    }
  };

  return (
    <div>
      <h1>Compilation</h1>
      <div>
        <label>Enter Lang id:</label>
        <input
          type={"number"}
          value={lang}
          onChange={handleLangChange}
          placeholder={"enter lang code eg 48-c 71-python"}
        />
        <label htmlFor="code">Enter your code:</label>
        <textarea
          id="code"
          value={code}
          onChange={handleCodeChange}
          rows={10}
          cols={50}
          placeholder="Enter your C code here..."
        />
      </div>
      <div>
        <textarea
          rows={10}
          cols={25}
          value={input}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <button onClick={handleSubmit}>Compile</button>
      </div>
      <div>
        <h2>Output:</h2>
        <pre>{output}</pre>
      </div>
    </div>
  );
}

export default App;























const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const JUDGE0_API_KEY = "ef617f9a4bmsh2c3fc6f141abf99p14dcfcjsn9346e9656508";

// Route to handle code compilation
app.post("/compile", async (req, res) => {
  try {
    const { code, lang ,input } = req.body; 

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

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
