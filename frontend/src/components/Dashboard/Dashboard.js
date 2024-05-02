import BACKEND_URL from "../config";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import plus_image from "./plus_icon.png";
import axios from "axios";
import "./Dashboard.css";

function Dashboard(props) {
  const navigation = useNavigate();
  const { state } = useLocation();
  const { username, password } = state || {};

  const [roomsData, setRoomsData] = useState([]);
  const [showForm, setShowForm] = useState(false); // State to control form visibility
  const [roomName, setRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");

  const getUsersData = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/roomslist`, {
        username,
        password,
      });
      if (response.status === 200) {
        setRoomsData(response.data);
        console.log(response.data);
      }
    } catch (error) {
      console.error("Error fetching user's rooms:", error.message);
    }
  };

  useEffect(() => {
    getUsersData();
  }, []);

  const handleRoomDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${BACKEND_URL}/room/${username}/${id}`
      );
      if (response.status === 200) {
        console.log("Deleted:", response.data);
        getUsersData(); // Refresh room list after deletion
      }
    } catch (error) {
      console.error("Error deleting room:", error.message);
    }
  };
  const handleRoomDisplay = async (roomid) => {
    navigation('/editor', {state: {username, password, roomid}} );
  }
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try { 
      const response = await axios.post(`${BACKEND_URL}/roomslist/newroom`, {
        username,
        password,
        name: roomName,
        description: roomDescription,
      });
      if (response.status === 201) {
        console.log("Room created:", response.data);
        getUsersData(); 
        setRoomName("");
        setRoomDescription(""); 
        setShowForm(false); 
      }
    } catch (error) {
      console.error("Error creating room:", error.message);
    }
  };

  return (
    <>
      <div id="dashboard_container">
        <p id="heading">Dashboard</p>
        <p id="info">
          You can create permanent rooms, delete them or manage access here.
        </p>
        <p id="user">
          User : <span>{username}</span>
        </p>

        <p id="roomsListHeading">Your Rooms</p>
        <div id="roomsList">
          {roomsData.length > 0 ? (
            roomsData.map((room, index) => (
              <div className="rooms" key={index} onClick={() => handleRoomDisplay(room._id)}>
                <p>{room.name}</p>
                <p>{room.description}</p>
                <button onClick={() => handleRoomDelete(room._id)}>
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p style={{ display: "block", margin: "0.5em" }}>
              Looks like you are new. Create your first room.
            </p>
          )}
          <img
            src={plus_image}
            alt="Plus"
            id="plus-icon"
            onClick={() => {setShowForm(!showForm)}}
          />
        </div>

        {showForm && (
          <form className="form-container" onSubmit={handleFormSubmit}>
            <input
              type="text"
              placeholder="Room Name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Room Description"
              value={roomDescription}
              onChange={(e) => setRoomDescription(e.target.value)}
            />
            <button type="submit">Create Room</button>
          </form>
        )}
      </div>
    </>
  );
}

export default Dashboard;
