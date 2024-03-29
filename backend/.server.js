const express = require('express');
const app=express();
const port=4000;


app.get('/',(req,res)=>{

     res.end("<H1> Welcome , Server is Running Excellenly!");
});


app.listen(port,()=>{

    console.log("Server is Running at http://Localhost:4000 Excellently!")
})