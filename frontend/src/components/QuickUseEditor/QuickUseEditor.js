import BACKEND_URL from "../config";
import React, { useState, useRef, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import "./QuickUseEditor.css";
import axios from "axios";

const languages = [
  "javascript",
  "typescript",
  "python",
  "html",
  "css",
  "java",
  "c",
  "cpp",
  "json",
  "markdown",
];

const themes = ["vs", "vs-dark", "hc-black", "light", "kimbie-dark"];

function QuickUseEditor() {
  const location = useLocation(); 
  const { username = "Guest", roomid = "Unknown" } = location.state || {};

  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("vs-dark");
  const [fontSize, setFontSize] = useState(18);
  const [editorContent, setEditorContent] = useState("");
  const [lang, setLang] = useState(63);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

 
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

    return () => {
      socketRef.current.disconnect();
    };
  }, [username, roomid]);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
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
        <div className="quick-use-editor-container">
          <h2 className="editor-title">Welcome to the Editor</h2>
          <div className="editor-options">
            <div className="editor-option">
              <label htmlFor="language">Language:</label>
              <select
                id="language"
                value={language}
                onChange={handleLanguageChange}
              >
                {languages.map((lang, index) => (
                  <option key={index} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
            <div className="editor-option">
              <label htmlFor="theme">Theme:</label>
              <select id="theme" value={theme} onChange={handleThemeChange}>
                {themes.map((theme, index) => (
                  <option key={index} value={theme}>
                    {theme}
                  </option>
                ))}
              </select>
            </div>
            <div className="editor-option">
              <label htmlFor="fontSize">Font Size:</label>
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
          <div className="custom-editor">
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
 
        </div>

        <div id="compilation_section"> 
          <div><h2>Input :-</h2> <textarea rows={10} cols={75} value={input} onChange={handleInputForCompilationChange} /> </div>
          <div> <button onClick={handleSubmit}>Compile</button> </div>
          <div> <h2>Output :-</h2> <div id="output_box">{output}</div> </div> 
        </div>
      </div>
    </>
  );
}

export default QuickUseEditor;
