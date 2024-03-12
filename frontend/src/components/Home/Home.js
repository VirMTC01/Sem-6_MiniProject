import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="parent_container">

        <div className='container'>
            <p className='heading'>What would you like to do ?</p>
            <Link to="/Login" className='link'>Login</Link><br />
            <Link to="/QuickUse" className='link'>Quick Use</Link>
        </div>
        
        </div>
    );
}

export default Home;
