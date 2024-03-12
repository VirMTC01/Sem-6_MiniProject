import "./QuickUse.css";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function QuickUse() {
  const navigation = useNavigate();

  function handleSocketConnection() { 
    let username = document.querySelector("#username").value;
    let roomid = document.querySelector("#roomid").value;

    const socket = io("https://sem-6-miniproject-backend.onrender.com:8000", {
      query: {
        username: username,
        roomid: roomid,
      } 
    });

    socket.on("connect", () => {
      console.log("connected", socket.id);
      navigation(`/QuickUseEditor?roomid=${roomid}`, {state: { username, roomid }});
    });

    return () => {
      socket.disconnect();
    };
  }

  return (
    <>
    <div className="parent_container_quick_use">
      <label htmlFor="username">Name</label> <input type="text" id="username" /><br />
      <label htmlFor="roomid">Room ID</label> <input type="text" id="roomid" /><br />
      <button onClick={() => handleSocketConnection()} id="join-room-button">
        {" "}
        Join Room{" "}
      </button>
      </div>
    </>
  );
}

export default QuickUse;
