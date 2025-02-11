import logo from './logo.svg';
import React, { useState, useEffect } from "react";
import './App.css';
import './householdplanner'
import HouseholdPlanner from './householdplanner';
import Login from "./Login";

function App() {
  

const [userId, setUserId] = useState(null);

  
// Beim Start prüfen, ob userId im Local Storage gespeichert ist
useEffect(() => {
  const storedUserId = localStorage.getItem("userId");   
  if (storedUserId) {
    setUserId(storedUserId);
  }
}, []);


useEffect(() => {
  console.log("Aktuelle userId:", userId);
}, [userId]);

const handleLogin = (id) => {
  console.log("Benutzer eingeloggt mit ID:", id);
  localStorage.setItem("userId", id);
  setUserId(id);
};


const handleLogout = () => {
  setUserId(null);
  localStorage.removeItem("userId"); // Benutzer ausloggen
};

return (
  <div>
   
    {userId ? (
      <>
        <button onClick={handleLogout}>Logout</button>
       
        <HouseholdPlanner userId={userId} />
      </>
    ) : (
      <Login onLogin={handleLogin} />
    )}
  </div>
);
}

export default App;


