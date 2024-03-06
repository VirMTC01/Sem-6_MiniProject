import React from "react";
import './dashboard.css';
import { NavLink } from "react-router-dom";

function page(){

  return (
    <> <div class="main">
       <h1>Dashboard!</h1>
       <div>
          <p>Room ID</p>
          <input type="text" />
          <p>User Name</p>
          <input type="text"/>
       </div>
       <button>
        <NavLink to={'/mainpage '}>Enter!</NavLink>
        </button>
       
       </div>
    </>
  );
};

export default page;