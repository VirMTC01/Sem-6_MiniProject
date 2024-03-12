import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Home from "./components/Home/Home";
import QuickUse from "./components/QuickUse/QuickUse";
import QuickUseEditor from "./components/QuickUseEditor/QuickUseEditor";


function App() {
  

  return (
    <>

    <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/QuickUse" element={<QuickUse />} />
        <Route exact path="/QuickUseEditor" element={<QuickUseEditor />} />
    </Routes>
    </>
  );
}

export default App;
