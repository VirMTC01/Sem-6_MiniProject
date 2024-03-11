// const express = require('express')
// const app = express()
// const path = require('path')
// const axios = require('axios')

// // app.set('view engine', 'ejs')
// // app.set('views', path.join(__dirname, 'views'))
// // app.use(express.static(path.join(__dirname, 'public')))


// const handleCompile = (code) => {
//     let formData = {
//       language_id: 48,
//       // encode source code in base64
//       source_code: btoa(code),
//       stdin: btoa("1"),
//     };
//     let options = {
//       method: "POST",
//       url: 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&fields=*',
//       headers: {
//         "content-type": "application/json",
//         "Content-Type": "application/json",
//         'X-RapidAPI-Key': 'ef617f9a4bmsh2c3fc6f141abf99p14dcfcjsn9346e9656508',
//         'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
//       },
//       data: formData,
//     };

//     axios
//       .request(options)
//       .then(function (response) {
//         console.log("res.data :-");
//         console.log(response.data);
//         const token = response.data.token;
//         checkStatus(token);
//       })
//       .catch((err) => {
//         let error = err.response ? err.response.data : err;
//         console.log(error);
//       });
//   };

// const checkStatus = async (token) => {
//     const options = {
//         method: "GET",
//         url: 'https://judge0-ce.p.rapidapi.com/submissions/' + token + '?fields=*',
//         headers: {
//             'X-RapidAPI-Key': 'ef617f9a4bmsh2c3fc6f141abf99p14dcfcjsn9346e9656508',
//             'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
//         }
//     };
//     try {
//         let response = await axios.request(options);
//         let statusId = response.data.status?.id;

//         // Processed - we have a result
//         if (statusId === 1 || statusId === 2) {
//             // still processing
//             setTimeout(() => {
//                 checkStatus(token)
//             }, 5000)
//             return
//         } else {
//             console.log("");
//             console.log("");
//             console.log('response.data :-');
//             console.log(response.data);
//             return
//         }
//     } catch (err) {
//         console.log("ERROR IS :- ");
//         console.log(err);
//     }
// };


// app.get('/', (req, res) => {
//     let code = `#include <stdio.h>

//     int main(void) {
//         int t=1, x=2, y=3;
//         printf("%d",t+x+y);
//         return 0;
//     }` ;
//     handleCompile(code);
// })

// app.listen(1000, () => {
//     console.log("LISTENING ON PORT 1000 ! ");
// });
const express = require('express');
const app = express();
const axios = require('axios');

app.use(express.json());

const JUDGE0_API_KEY = 'ef617f9a4bmsh2c3fc6f141abf99p14dcfcjsn9346e9656508';

// Route to handle code compilation
app.post('/compile', async (req, res) => {
  try {
    const { code } = req.body;

    // Configure the Judge0 API endpoint
    const judge0Url = 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&fields=*';

    // Prepare the data for the submission
    const formData = {
      language_id: 48, // Language ID for C
      source_code: Buffer.from(code).toString('base64'),
      stdin: Buffer.from('1').toString('base64') // Example standard input
    };

    // Configure the request headers
    const headers = {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': JUDGE0_API_KEY,
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
    };

    // Make a POST request to the Judge0 API
    const response = await axios.post(judge0Url, formData, { headers });

    // Get the token from the response
    const token = response.data.token;

    // Check the status of the submission
    const output = await checkStatus(token);

    // Send the output back to the client
    res.json({ output });
  } catch (error) {
    console.error('Error:', error);
    document.write(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Function to check the status of the submission
const checkStatus = async (token) => {
  const judge0Url = `https://judge0-ce.p.rapidapi.com/submissions/${token}?fields=*`;

  const headers = {
    'X-RapidAPI-Key': JUDGE0_API_KEY,
    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
  };

  let statusId;
  do {
    // Make a GET request to the Judge0 API
    const response = await axios.get(judge0Url, { headers });
    statusId = response.data.status?.id;

    // Wait for 5 seconds before checking again
    await new Promise(resolve => setTimeout(resolve, 5000));
  } while (statusId === 1 || statusId === 2); // 1: Processing, 2: In Queue

  // Once the submission is processed, return the output
  return response.data.stdout;
};

app.get('/', (req, res) => {
  res.send('Hello World');
});

// Start the server
const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
