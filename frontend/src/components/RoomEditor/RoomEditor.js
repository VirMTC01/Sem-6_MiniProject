import BACKEND_URL from "../config";
import React, { useState, useRef, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "../QuickUseEditor/QuickUseEditor.css";
import "./RoomEditor.css"
import axios from "axios";

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


function RoomEditor(props) {
  const navigation = useNavigate();
  const { state } = useLocation();
  const { username, password, roomid, content } = state || {};

  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("vs-dark");
  const [fontSize, setFontSize] = useState(18);
  const [editorContent, setEditorContent] = useState(content);
  const [lang, setLang] = useState(63);
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

    socketRef.current.on("distributeCodeChange", (content) => {
      setEditorContent(content);
    });

    socketRef.current.on("updateUsersList", (usersList) => {
      setUsers(usersList);
    });

    return () => {
      socketRef.current.disconnect();
      axios.post(`${BACKEND_URL}/roomcontent/${username}/${password}/${roomid}`, {content: editorContent})
      .then((data)=> console.log(data))
    };
  }, [username, roomid]);

  const handleLanguageChange = (event) => {
    setLang(event.target.value); 
  };

  
  const handleThemeChange = (event) => {
    setTheme(event.target.value);
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
      input 
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
      }
    }
  };

  return ( 
    <>
      <div id="container">
        <header>
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

export default RoomEditor;
