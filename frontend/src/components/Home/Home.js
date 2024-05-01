import React from "react";
import './Home.css';
import { NavLink } from "react-router-dom";

function Home() {

  return (
    <>
    {/* <h1>Homepage!!!!</h1> */}
     <div>
       


       <div class="hmain">
         <div class="navbar">
           <div class="icon">
             <h2 class="logo">Project WorkPlace</h2>
           </div>

           <div class="menu">
             <ul>
               <li><a href="#">HOME</a></li>
               <li><a href="#">ABOUT</a></li>
               <li><a href="#">HELP</a></li>
               <li><a href="#">GUIDE</a></li>
               <li><a href="#">CONTACT</a></li>
             </ul>
           </div>

           {/* <div class="search">
            <input class="srch" type="search" name="" placeholder="Type To text" />
             <a href="#"> <button class="btn">Search</button></a>
           </div> */}

         </div>
         <div class="content">
           <h1 >Online Project <br/><span>Workplace</span> <br />For Students</h1>
         <p class="par">this is online workplace project,
           for students who learn <br />where more than one person work on project
           <br /> at a same time from different places.</p>

         <button class="cn"><a href="#">JOIN US</a></button>

         <div class="form">
           <h2>Login Here</h2>
           <input type="email" name="email" placeholder="Enter Email Here" />
           <input type="password" name="" placeholder="Enter Password Here" />
           <button class="btnn">
              <NavLink to={'/login'}>Login</NavLink>
           </button>

           <p class="link">Don't have an account<br /></p>
           <NavLink to={'/signup'}>Sign UP</NavLink>
           <p class="liw">Log in with</p>

           <div class="icons">
             <a href="#"><ion-icon name="logo-facebook"></ion-icon></a>
             <a href="#"><ion-icon name="logo-instagram"></ion-icon></a>
             <a href="#"><ion-icon name="logo-twitter"></ion-icon></a>
             <a href="#"><ion-icon name="logo-google"></ion-icon></a>
             <a href="#"><ion-icon name="logo-skype"></ion-icon></a>
           </div>

         </div>
       </div>
    
     </div>
     </div>
    </>
  )
};

export default Home;