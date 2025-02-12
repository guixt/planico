import React, {useState, useEffect } from "react";
import TaskList from "./tasklist";

const HouseholdPlanner = ( { userId } ) => {

    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");

    useEffect(() => {
      const interval = setInterval(() => {
        
              console.log("Aufgaben werden neu geladen...");
              fetchTasks(); // Aufgaben neu laden
         
      }, 2000); // Alle 2 Sekunden

      return () => clearInterval(interval); // Timer beim Verlassen der Komponente stoppen
  });


  useEffect(() => {
    // API-Aufruf zum Abrufen aller allgemeinen Aufgaben
    fetch("https://api.possiblyfour.com:5001/api/tasks/general")
      .then((res) => res.json())
      .then((data) => {
        console.log("Erhaltene Aufgaben:", data); // Debugging: Überprüfen, welche Daten empfangen wurden
        setTasks(data); // Daten in den State laden
      })
      .catch((err) => console.error("Fehler beim Abrufen der Aufgaben:", err));
  }, []); // Leer, damit es nur beim ersten Rendern ausgeführt wird

  
 // Fetch-Tasks-Funktion zum Abrufen der aktuellen Aufgabenliste
 const fetchTasks = () => {
    fetch("https://api.possiblyfour.com:5001/api/tasks/general")
      .then((res) => res.json())
      .then((data) => {
        console.log("Erhaltene Aufgaben:", data);
        setTasks(data);
      })
      .catch((err) => console.error("Fehler beim Abrufen der Aufgaben:", err));
  };

  useEffect(() => {
    fetchTasks(); // Aufgaben abrufen, wenn die Komponente geladen wird
  }, []);

  

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedTasks = Array.from(tasks);
    const [removed] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, removed);
    setTasks(reorderedTasks);
  };

  const addTask = () => {
    if (newTask.trim() === "") return;
  
    // Aufgabe zur API hinzufügen
    fetch("https://api.possiblyfour.com:5001/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: newTask,
        assigned_to: "",
        due_date: null,
        is_recurring: false,
        recurrence_interval: null,
        status: "open",
        created_by: userId, // Benutzer-ID des aktuellen Benutzers
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Neue Aufgabe hinzugefügt:", data);
       
        // Aktualisierte Liste der Aufgaben abrufen
        fetchTasks(); // fetchTasks ist die Funktion aus `useEffect`, um die aktuellen Aufgaben zu laden
      })
      .catch((err) => console.error("Fehler beim Hinzufügen der Aufgabe:", err));
  
    setNewTask(""); // Eingabefeld zurücksetzen
  };
  

  return (
    <div style={{ padding: "1rem" }} >
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Haushaltsplaner</h1>
     
      <div style={{ display: "flex", marginBottom: "1rem" }}>
        
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Neue Aufgabe hinzufügen"
          style={{ flex: 1, marginRight: "0.5rem", padding: "0.5rem" }}
        />
      
        <button onClick={addTask} style={{ padding: "0.5rem 1rem", backgroundColor: "#007BFF", color: "white", border: "none", borderRadius: "4px" }}>
          Hinzufügen
        </button>
       
      </div>
      <TaskList tasks={tasks} setTasks={setTasks} 
           handleDragEnd={handleDragEnd} fetchTasks={fetchTasks}
           userId={userId}  />
    </div>
  );
};

export default HouseholdPlanner;
