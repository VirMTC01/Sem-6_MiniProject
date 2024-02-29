import { useState, useEffect } from "react";
import "./components/Home/Home";
import "./components/Editor/Editor";
import "./components/QuickUse/QuickUse";


function App() {
  

  return (
    <>

    <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/QuickUse" element={<QuickUse />} />
        <Route exact path="/Editor" element={<Editor />} />
      </Routes>
    </>
  );
}

export default App;
