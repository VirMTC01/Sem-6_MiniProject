import React, { useState, useRef, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import "./QuickUseEditor.css";  

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
  "markdown" 
];

const themes = [
  "vs",
  "vs-dark",
  "hc-black",
  "light",
  "kimbie-dark"  
];

function QuickUseEditor() {
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("vs-dark");
  const [fontSize, setFontSize] = useState(14); 
  const [editorContent, setEditorContent] = useState("// Start coding...");
  const location = useLocation();
  const { username = "Guest", roomid = "Unknown" } = location.state || {};
  const editorRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("https://sem-6-miniproject-backend.onrender.com", { query: { username, roomid } });

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

  return (
    <div className="quick-use-editor-container">
      <h2 className="editor-title">Welcome to QuickUseEditor</h2>
      <div className="editor-options">
        <div className="editor-option">
          <label htmlFor="language">Language:</label>
          <select id="language" value={language} onChange={handleLanguageChange}>
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
  );
}

export default QuickUseEditor;
