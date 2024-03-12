// import React from "react";
// import './mainpage.css';

// function mainpage(){

//   return (
//       <>
//        {/* <h1>MainPage!</h1> */}
//                <h1>Editor</h1>
//        <div class="main editor">

//            <div id="lft">
//            <div id="lang">
//             <p>Select Code Lang!</p>
//            <select >
//               <option value={10}>C</option>
//               <option value={10}>C++</option>
//               <option value={10}>python</option>
//               <option value={10}>java</option>

//            </select>
//            </div>
//            <textarea cols={100} rows={80}></textarea>
//            </div>
//            <div id="rght">
//             <p>Input</p>
//              <textarea cols={40} rows={10}></textarea>
//             <p>Output</p>
//               <div id="op"></div>
//            </div>
//        </div>
//        </>
    
//   );
// };

// export default mainpage;
import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');

  const handleCodeChange = (event) => {
    setCode(event.target.value);
  };

  const handleSubmit = () => {
    // Make a POST request to your backend to compile the code
    axios.post('http://localhost:8000/compile', { code })
      .then(response => {
        const { data } = response;
        setOutput(data.output);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <div>
      <h1>Compilation</h1>
      <div>
        <label htmlFor="code">Enter your C code:</label>
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