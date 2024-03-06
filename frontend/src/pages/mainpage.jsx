import React from "react";
import './mainpage.css';

function mainpage(){

  return (
      <>
       {/* <h1>MainPage!</h1> */}
               <h1>Editor</h1>
       <div class="main editor">

           <div id="lft">
           <div id="lang">
            <p>Select Code Lang!</p>
           <select >
              <option value={10}>C</option>
              <option value={10}>C++</option>
              <option value={10}>python</option>
              <option value={10}>java</option>

           </select>
           </div>
           <textarea cols={100} rows={80}></textarea>
           </div>
           <div id="rght">
            <p>Input</p>
             <textarea cols={40} rows={10}></textarea>
            <p>Output</p>
              <div id="op"></div>
           </div>
       </div>
       </>
    
  );
};

export default mainpage;