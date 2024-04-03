const express = require('express')
const app = express()
const path = require('path')
const axios = require('axios')

// app.set('view engine', 'ejs')
// app.set('views', path.join(__dirname, 'views'))
// app.use(express.static(path.join(__dirname, 'public')))


const handleCompile = (code) => {
    let formData = {
      language_id: 48,
      // encode source code in base64
      source_code: btoa(code),
      stdin: btoa("1"),
    };
    let options = {
      method: "POST",
      url: 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&fields=*',
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        'X-RapidAPI-Key': 'ef617f9a4bmsh2c3fc6f141abf99p14dcfcjsn9346e9656508',
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      },
      data: formData,
    };

    axios
      .request(options)
      .then(function (response) {
        console.log("res.data :-");
        console.log(response.data);
        const token = response.data.token;
        checkStatus(token);
      })
      .catch((err) => {
        let error = err.response ? err.response.data : err;
        console.log(error);
      });
  };

const checkStatus = async (token) => {
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

        // Processed - we have a result
        if (statusId === 1 || statusId === 2) {
            // still processing
            setTimeout(() => {
                checkStatus(token)
            }, 5000)
            return
        } else {
            console.log("");
            console.log("");
            console.log('response.data :-');
            console.log(response.data);
            return
        }
    } catch (err) {
        console.log("ERROR IS :- ");
        console.log(err);
    }
};


app.get('/', (req, res) => {
    let code = `#include <stdio.h>

    int main(void) {
        int t=1, x=2, y=3;
        printf("%d",t+x+y);
        return 0;
    }` ;
    handleCompile(code);
})


app.listen(1000, () => {
    console.log("LISTENING ON PORT 1000 ! ");
});