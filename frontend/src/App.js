import { io } from "socket.io-client";
import { useState, useEffect } from "react";
import Editor from '@monaco-editor/react';


function App() {
  const [socketId, setSocketId] = useState(null);

  useEffect(() => {
    const socket = io("http://localhost:8000");

    socket.on("connect", () => {
      console.log("connected", socket.id);
      setSocketId(socket.id);
    });

     
    return () => {
      socket.disconnect();
    };
  }, []); 

  return (
    <div>
      {socketId ? (
        <p>Socket ID: {socketId}</p>
      ) : (
        <p>Connecting to socket...</p>
      )}
     <Editor height="90vh" defaultLanguage="javascript" defaultValue="// some comment" />;
    </div>
  );
}

export default App;
