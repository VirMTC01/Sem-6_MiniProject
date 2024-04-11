
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
