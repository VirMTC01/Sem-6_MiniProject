// import React, { useState, useRef, useEffect } from "react";
// import BACKEND_URL from "../config";
// import { Editor } from "@monaco-editor/react";
// import { useLocation } from "react-router-dom";
// import { io } from "socket.io-client";
// import axios from "axios";
// import "./Mainpage.css";

// const languages = [
//   {
//     id: 48,
//     name: "C",
//   },
//   {
//     id: 52,
//     name: "C++",
//   },
//   {
//     id: 51,
//     name: "C#",
//   },
//   {
//     id: 63,
//     name: "JavaScript",
//   },
//   {
//     id: 70,
//     name: "Python",
//   },
//   {
//     id: 72,
//     name: "Ruby",
//   },
//   {
//     id: 73,
//     name: "Rust",
//   },
// ];

// // const themes = ["vs", "vs-dark", "hc-black", "light", "kimbie-dark"];

// const themes = [
//   {"vs":'rgb(255,255,254)'}, 
//   {"vs-dark":'rgb(30,30,30)'},
//   ,{ "hc-black":'rgb(0,0,0)'}, 
//   {"light":'rgb(255,255,255)'},
// ];

// function Mainpage() {
//   const location = useLocation();
//   const { username = "Guest", roomid = "Unknown" } = location.state || {};

//   const [language, setLanguage] = useState();
//   const [theme, setTheme] = useState("vs-dark");
//   const [fontSize, setFontSize] = useState(18);
//   const [editorContent, setEditorContent] = useState("");
//   const [lang, setLang] = useState();
//   const [input, setInput] = useState("");
//   const [output, setOutput] = useState("");
//   const [users, setUsers] = useState([]);

//   const editorRef = useRef(null);
//   const socketRef = useRef(null);

//   useEffect(() => {
//     socketRef.current = io(BACKEND_URL, { query: { username, roomid } });

//     socketRef.current.on("initialEditorContent", (content) => {
//       setEditorContent(content);
//     });
    
// // Listen for the updateUsersList event and update the users state
// socketRef.current.on("updateUsersList", (usersList) => {
//   setUsers(usersList);
// });
   
//     socketRef.current.on("distributeCodeChange", (content) => {
//       setEditorContent(content);
//     });

//     return () => {
//       socketRef.current.disconnect();
//     };
//   }, [username, roomid]);

//   const handleLanguageChange = (event) => {
//     setLang(event.target.value);
//     console.log(event.target.value);
//     console.log(lang);
//   };

//   const handleThemeChange = (event) => {
//     setTheme(event.target.value);
//   };

//   const handleFontSizeChange = (event) => {
//     setFontSize(parseInt(event.target.value));
//   };

//   const handleEditorDidMount = (editor) => {
//     editorRef.current = editor;
//     editorRef.current.layout();
//   };

//   const handleCodeChange = (content) => {
//     setEditorContent(content);
//     socketRef.current.emit("codeChange", content);
//   };


//   const handleInputForCompilationChange = (event) => {
//     setInput(event.target.value);
//   };

//   const handleSubmit = async () => {
//     const response = await axios.post(`${BACKEND_URL}/compile`, {
//       editorContent,
//       lang,
//       input,
//     });

//     try {
//       if (response.data.status) {
//         setOutput(response.data.output);
//       }
//     } catch (error) {
//       if (error.response) {
//         console.error("Server responded with error:", error.response.data);
//       } else if (error.request) {
//         console.error("No response received from server:", error.request);
//       } else {
//         console.error("Error setting up request:", error.message);
//       }
//     }
//   };

//   return (
//     <>
//       {/* <div id="container">
//         <div className="quick-use-editor-container">
//           <h2 className="editor-title">Welcome to the Editor</h2>
//           <div className="editor-options">
//             <div className="editor-option">
//               <label htmlFor="language">Language:</label>
//               <select
//                 id="language"
//                 value={lang}
//               >
//                 {languages.map((lang) => (
//                   <option key={lang.id} value={lang.id}
//                   onChange={handleLanguageChange}
//                   >
//                     {lang.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="editor-option">
//               <label htmlFor="theme">Theme:</label>
//               <select
//                 id="theme"
//                 value={theme}
//                 onChange={handleThemeChange}
//               >
//                 {themes.map((theme, index) => (
//                   <option key={index} value={theme}>
//                     {theme}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="editor-option">
//               <label htmlFor="fontSize">Font Size:</label>
//               <input
//                 type="number"
//                 id="fontSize"
//                 value={fontSize}
//                 onChange={handleFontSizeChange}
//                 min="8"
//                 max="24"
//               />
//             </div>
//           </div>
//           <div className="custom-editor">
//             <Editor
//               language={language}
//               theme={theme}
//               onMount={handleEditorDidMount}
//               value={editorContent}
//               options={{
//                 fontSize: fontSize,
//                 lineHeight: fontSize * 1.5,
//               }}
//               onChange={handleCodeChange}
//             />
//           </div>
//         </div>

//         <div id="compilation_section">
//           <div>
//             <h2>Input:</h2>
//             <textarea
//               rows={10}
//               cols={75}
//               value={input}
//               onChange={handleInputForCompilationChange}
//             />
//           </div>
//           <div>
//             <button onClick={handleSubmit}>Compile</button>
//           </div>
//           <div>
//             <h2>Output:</h2>
//             <div id="output_box">{output}</div>
//           </div>
//         </div>
//       </div>
//       */}

//       {/* ------ */}

//       <div id="container">
//         <header>
//             <div className="nav" id="h1">Mainpage!</div>
//             <div className="nav" id="h2"><span>Users Connected:</span> <div id="users">
//             {users.map((user, index) => (
//               <div key={index}>{user}</div>
//             ))}</div></div>
//             <div className="nav" id="h3">Functions : <div id="functions">
//                <div id="f1">Language:
//                <select
//                 id="language"
//                 value={lang}
//                 onChange={handleLanguageChange}
//               >
//                 {languages.map((lang) => (
//                   <option key={lang.id} value={lang.id}>
//                     {lang.name}
//                   </option>
//                 ))}
//               </select></div>
//                <div id="f2">Theme: <select
//                 id="theme"
//                 value={theme}
//                 onChange={handleThemeChange}
//               >
//                  {themes.map((theme, index) => (
//                 <option key={index} value={theme}>
//                   {theme}
//                 </option>
//               ))}
//               </select></div>
//                <div id="f3">Font Size: <input
//                 type="number"
//                 id="fontSize"
//                 value={fontSize}
//                 onChange={handleFontSizeChange}
//                 min="8"
//                 max="24"
//               /></div>
//               </div></div>
//         </header>
//         <div id="main">

//           <div id="Left">
//             Program:
//           <Editor
//               language={language}
//               theme={theme}
//               onMount={handleEditorDidMount}
//               value={editorContent}
//               options={{
//                 fontSize: fontSize,
//                 lineHeight: fontSize * 1.5,
//               }}
//               onChange={handleCodeChange}
//             />
//           </div>
//           <div id="Right">
//             <div>Input:
//             <textarea              rows={8}
//               cols={75}
//               value={input}
//               className={`input-output ${theme}`}
              
//               onChange={handleInputForCompilationChange}
//               >
//             </textarea>
//             </div>
//             <div id="Output_box" className={theme}> 
//             Output:
//             {output} 
            

//             </div>
//             <div id="SET">
//             <button onClick={handleSubmit} id="Compile_btn">Compile</button>

//               <p> Visibilty<button>ALL</button></p>
//               <p><label></label></p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   ); 
// }

// export default Mainpage;

import React, { useState, useRef, useEffect } from "react";
import BACKEND_URL from "../config";
import { Editor } from "@monaco-editor/react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import "./Mainpage.css";

const languages = [
  {
    id: 48,
    name: "C",
  },
  {
    id: 52,
    name: "C++",
  },
  {
    id: 51,
    name: "C#",
  },
  {
    id: 63,
    name: "JavaScript",
  },
  {
    id: 70,
    name: "Python",
  },
  {
    id: 72,
    name: "Ruby",
  },
  {
    id: 73,
    name: "Rust",
  },
];

const themes = [
  { name: "vs", value: 'rgb(255,255,254)' },
  { name: "vs-dark", value: 'rgb(30,30,30)' },
  { name: "hc-black", value: 'rgb(0,0,0)' },
  { name: "light", value: 'rgb(255,255,255)' },
];

function Mainpage() {
  const location = useLocation();
  const { username = "Guest", roomid = "Unknown" } = location.state || {};

  const [language, setLanguage] = useState();
  const [theme, setTheme] = useState("vs-dark");
  const [fontSize, setFontSize] = useState(18);
  const [editorContent, setEditorContent] = useState("");
  const [lang, setLang] = useState();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [users, setUsers] = useState([]);

  const editorRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(BACKEND_URL, { query: { username, roomid } });

    socketRef.current.on("initialEditorContent", (content) => {
      setEditorContent(content);
    });
    
    // Listen for the updateUsersList event and update the users state
    socketRef.current.on("updateUsersList", (usersList) => {
      setUsers(usersList);
    });
   
    socketRef.current.on("distributeCodeChange", (content) => {
      setEditorContent(content);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [username, roomid]);

  const handleLanguageChange = (event) => {
    setLang(event.target.value);
    console.log(event.target.value);
  };

  const handleThemeChange = (event) => {
    const selectedTheme = event.target.value;
    setTheme(selectedTheme);

    // Apply theme color to input and output boxes
    document.documentElement.style.setProperty(
      "--input-output-color",
      themes.find((t) => t.name === selectedTheme)?.value || ""
    );
  };

  const handleFontSizeChange = (event) => {
    setFontSize(parseInt(event.target.value));
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    editorRef.current.layout();
  };

  const handleCodeChange = (content) => {
    setEditorContent(content);
    socketRef.current.emit("codeChange", content);
  };

  const handleInputForCompilationChange = (event) => {
    setInput(event.target.value);
  };

  const handleSubmit = async () => {
    const response = await axios.post(`${BACKEND_URL}/compile`, {
      editorContent,
      lang,
      input,
    });

    try {
      if (response.data.status) {
        setOutput(response.data.output);
      }
    } catch (error) {
      if (error.response) {
        console.error("Server responded with error:", error.response.data);
      } else if (error.request) {
        console.error("No response received from server:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
    }
  };

  return (
    <>
      <div id="container">
        <header>
          <div className="nav" id="h1">Mainpage!</div>
          <div className="nav" id="h2">
            <span>Users Connected:</span> 
            <div id="users">
              {users.map((user, index) => (
                <div key={index}>{user}</div>
              ))}
            </div>
          </div>
          <div className="nav" id="h3">Functions :
            <div id="functions">
              <div id="f1">Language:
                <select
                  id="language"
                  value={lang}
                  onChange={handleLanguageChange}
                >
                  {languages.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
              <div id="f2">Theme:
                <select
                  id="theme"
                  value={theme}
                  onChange={handleThemeChange}
                >
                  {themes.map((theme, index) => (
                    <option key={index} value={theme.name}>
                      {theme.name}
                    </option>
                  ))}
                </select>
              </div>
              <div id="f3">Font Size:
                <input
                  type="number"
                  id="fontSize"
                  value={fontSize}
                  onChange={handleFontSizeChange}
                  min="8"
                  max="24"
                />
              </div>
            </div>
          </div>
        </header>
        <div id="main">
          <div id="Left">
            Program:
            <Editor
              language={language}
              theme={theme}
              onMount={handleEditorDidMount}
              value={editorContent}
              options={{
                fontSize: fontSize,
                lineHeight: fontSize * 1.5,
              }}
              onChange={handleCodeChange}
            />
          </div>
          <div id="Right">
            <div>Input:
              <textarea
                rows={8}
                cols={75}
                value={input}
                id="input_box"
                className="input-output"
                onChange={handleInputForCompilationChange}
              />
            </div>
            Output:
            <div id="output_box" className="input-output">
               {output}
            </div>
            <div id="SET">
              <button onClick={handleSubmit} id="Compile_btn">Compile</button>
              <p>Visibilty<button>ALL</button></p>
              <p><label></label></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Mainpage;

