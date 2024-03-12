import React from "react";
import { Routes , Route }  from 'react-router-dom';
import homepage from './pages/landingpage' ;
import dashboard from './pages/dashboard';
import mainpage from  './pages/mainpage';

function App(){

  return (
    <>
       <Routes>
          <Route path='/' Component={homepage}/>
          <Route path='/dashboard'  Component={dashboard}/>
          <Route path='/mainpage' Component={mainpage}/>
       </Routes>
    </>
  );
}

export default App;
