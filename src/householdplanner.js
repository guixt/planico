import React, { useState, useEffect } from "react";
import TaskList from "./tasklist";
import { Input, Button, Title, Panel, FlexBox, FlexBoxJustifyContent } from "@ui5/webcomponents-react";
import { CheckBox } from "@ui5/webcomponents-react";


const HouseholdPlanner = ({ userId }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const [showOnlyOpenTasks, setShowOnlyOpenTasks] = useState(false);

  useEffect(() => {
    fetchTasks(showOnlyOpenTasks);  // Aufgaben basierend auf dem Filter abrufen
  }, [showOnlyOpenTasks]);

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setShowOnlyOpenTasks(isChecked);
    fetchTasks();  // API-Aufruf direkt beim Umschalten
  };
  
  
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Aufgaben werden neu geladen...");
      fetchTasks(showOnlyOpenTasks);  // Aktuellen Filterwert übergeben
    }, 2000);
  
    return () => clearInterval(interval);
  }, [showOnlyOpenTasks]);  // `showOnlyOpenTasks` als Abhängigkeit hinzufügen

const fetchTasks = (filterOpenTasks = false) => {
  fetch("https://api.possiblyfour.com:5001/api/tasks/general")
    .then((res) => res.json())
    .then((data) => {
      const filteredTasks = filterOpenTasks ? data.filter(task => task.is_completed === 0) : data;
      console.log("Gefilterte Aufgaben:", filteredTasks);
      setTasks(filteredTasks);
    })
    .catch((err) => console.error("Fehler beim Abrufen der Aufgaben:", err));
};


  useEffect(() => {
    fetchTasks(showOnlyOpenTasks);
  }, [showOnlyOpenTasks]);  // `showOnlyOpenTasks` als Abhängigkeit hinzufügen

  
  const calculateNextDueDate = (task) => {
    if (!task.is_recurring || !task.last_completed_date || !task.recurrence_interval) {
        return null;  // Kein nächstes Fälligkeitsdatum, wenn Bedingungen nicht erfüllt sind
    }

    const lastCompleted = new Date(task.last_completed_date);
    const nextDue = new Date(lastCompleted);
    nextDue.setDate(lastCompleted.getDate() + parseInt(task.recurrence_interval, 10));

    return nextDue.toLocaleDateString();  // Datum im lesbaren Format zurückgeben
};

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedTasks = Array.from(tasks);
    const [removed] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, removed);
    setTasks(reorderedTasks);
  };

  const addTask = () => {
    if (newTask.trim() === "") return;

    fetch("https://api.possiblyfour.com:5001/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: newTask,
        assigned_to: "",
        due_date: null,
        is_recurring: false,
        recurrence_interval: null,
        is_completed: 0,
        created_by: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Neue Aufgabe hinzugefügt:", data);
        fetchTasks();
      })
      .catch((err) => console.error("Fehler beim Hinzufügen der Aufgabe:", err));

    setNewTask("");
  };

  return (
    <div style={{ padding: "1rem" }}>
      <Title level="H1">Planico – Haushaltsplaner</Title>
      
      <CheckBox
        text="Nur offene Aufgaben anzeigen"
        checked={showOnlyOpenTasks}
        onChange={handleCheckboxChange}
        style={{ marginBottom: "1rem" }}
      />


      <Panel headerText="Neue Aufgabe hinzufügen">
        <FlexBox justifyContent={FlexBoxJustifyContent.SpaceBetween} style={{ gap: "1rem" }}>
          <Input
            value={newTask}
            onInput={(e) => setNewTask(e.target.value)}
            placeholder="Aufgabenbeschreibung"
            style={{ width: "70%" }}
          />
          <Button design="Emphasized" onClick={addTask}>
            Hinzufügen
          </Button>
        </FlexBox>
      </Panel>

      {tasks.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "2rem", color: "#888" }}>
          <h2>Keine Aufgaben gefunden</h2>
          <p>Du hast alle Aufgaben erledigt oder es sind noch keine Aufgaben vorhanden.</p>
        </div>
      ) : (

      <TaskList tasks={tasks} setTasks={setTasks} handleDragEnd={handleDragEnd} 
      fetchTasks={fetchTasks} userId={userId}  showOnlyOpenTasks={showOnlyOpenTasks} />
      )}

    </div>
  );
};

export default HouseholdPlanner;
