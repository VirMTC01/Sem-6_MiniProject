import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom'; 


function Home() {
    return (
        <div className="parent_container">

        <div className='container'>
            <p className='heading'>What would you like to do ?</p>
            <Link to="/login" className='link'>Login</Link> / 
            <Link to="/signUp" className='link'>Sign Up</Link><br />
            <Link to="/quickUse" className='link'>Quick Use</Link>
        </div>
        
        </div>
    );
}

export default Home;
