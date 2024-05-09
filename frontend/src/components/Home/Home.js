import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom'; 


function Home() {
    return (
        <div class="parent_container">
        <div class='container'>
            <p class='heading'>Welcome </p>
            <div class="links-container">
                <div class="link-item">
                    <p>Click here to <Link to="/login" class='link'>Login</Link></p>
                </div>
    
                <div class="link-item signup-container">
                    <p>Create an Account</p>
                    <Link to="/signUp" class='link'>Sign Up</Link><br />
                </div>
                <div class="link-item quickuse-container">
                    <p>Click here for <Link to="/quickUse" class='link'>Quick Use</Link></p>
                </div>
            </div>
        </div>
    </div>
    );
    
}

export default Home;