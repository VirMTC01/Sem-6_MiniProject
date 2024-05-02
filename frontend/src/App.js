import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/Login_And_Signup/Login";
import Signup from "./components/Login_And_Signup/Signup";
import Dashboard from "./components/Dashboard/Dashboard";
import QuickUse from "./components/QuickUse/QuickUse";
import QuickUseEditor from "./components/QuickUseEditor/QuickUseEditor";
import RoomEditor from "./components/RoomEditor/RoomEditor";

function App() {
  const [loggedStatus, setLoggedStatus] = useState(false)
  const [username, setUsername] = useState('');




  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login setLoggedStatus={setLoggedStatus} setUsername={setUsername}/>} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/dashboard" element={<Dashboard username={username} />} />
          <Route exact path="/quickUse" element={<QuickUse />} />
          <Route exact path="/quickUseEditor" element={<QuickUseEditor />} />
          <Route exact path="/editor" component={RoomEditor} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
