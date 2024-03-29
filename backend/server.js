const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const JUDGE0_API_KEY = "ef617f9a4bmsh2c3fc6f141abf99p14dcfcjsn9346e9656508";

// Route to handle code compilation
app.post("/compile", async (req, res, next) => {
  try {
    const { code, lang } = req.body;
    console.log("data"+ code + lang);

    // Configure the Judge0 API endpoint
    const judge0Url =
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&fields=*";

    // Prepare the data for the submission
    const formData = {
      language_id: lang, // Language ID for Program
      source_code: Buffer.from(code).toString("base64"),
      stdin: Buffer.from("1").toString("base64"), // Example standard input
    };

    // Configure the request headers
    const headers = {
      "Content-Type": "application/json",
      "X-RapidAPI-Key": JUDGE0_API_KEY,
      "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
    };

    // Make a POST request to the Judge0 API using Axios
    const response = await axios.post(judge0Url, formData, { headers });

    // Get the token from the response
    const token = response.data.token;

    // Check the status of the submission
    const output = await checkStatus(token);

    // Send the output back to the client
    res.json({ status: true, output: output });
  } catch (error) {
    console.error("Error:", error);
    next(error);
  }
});

// Function to check the status of the submission
const checkStatus = async (token) => {
  const judge0Url = `https://judge0-ce.p.rapidapi.com/submissions/${token}?fields=*`;

  const headers = {
    "X-RapidAPI-Key": JUDGE0_API_KEY,
    "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
  };

  let statusId;
  do {
    try {
      // Make a GET request to the Judge0 API using Axios
      const response = await axios.get(judge0Url, { headers });
      statusId = response.data.status?.id;

      // Wait for 5 seconds before checking again
      await new Promise((resolve) => setTimeout(resolve, 5000));
    } catch (error) {
      console.error("Error:", error);
      throw new Error("Failed to fetch submission status");
    }
  } while (statusId === 1 || statusId === 2); // 1: Processing, 2: In Queue

  // Once the submission is processed, return the output
  return response.data.stdout;
};

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

