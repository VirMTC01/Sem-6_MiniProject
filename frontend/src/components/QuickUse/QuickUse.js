import "./QuickUse.css";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"; 



function handleSocketConnection(socketId, setSocketId, navigation) { 
  const socket = io("http://localhost:8000");

  socket.on("connect", () => {
    console.log("connected", socket.id);
    setSocketId(socket.id);
    console.log("1", socket.id)
    console.log("2", socketId)
    navigation("/QuickUseEditor", {state: {socketId } });
  });

  return () => {
    socket.disconnect();
  }; 
}


function QuickUse() {
  const navigation = useNavigate();
  const [socketId, setSocketId] = useState(null); 

  return (
    <>
      <label htmlFor="username">Name</label>
      <input type="text" id="username" />
      <label htmlFor="roomid">Room ID</label>
      <input type="text" id="roomid" />
      <button onClick={() => handleSocketConnection(socketId, setSocketId, navigation)}>Join Room</button>
    </>
  );
}

export default QuickUse;
