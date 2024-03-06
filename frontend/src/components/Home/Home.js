import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div>
            <p>Links For login/signup and <Link to="/QuickUse">quick use</Link></p>
        </div>
    );
}

export default Home;
