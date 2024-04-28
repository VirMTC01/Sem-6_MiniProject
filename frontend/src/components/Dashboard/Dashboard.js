import React from 'react'

function Dashboard(props) {
    
  let username = props.username;




  return (
    <>
    <div>Dashboard</div>
    
    <p id="user">User : <span>{username}</span></p>
    </>
  )
}

export default Dashboard;