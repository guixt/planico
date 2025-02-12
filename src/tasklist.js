import React, { useState } from "react";
import { Input, Button, Card, CardHeader, CheckBox, DatePicker } from "@ui5/webcomponents-react";

const TaskList = ({ tasks, setTasks, fetchTasks, userId }) => {

    const [editingTask, setEditingTask] = useState(null);
    const [editText, setEditText] = useState("");
    const [editDueDate, setEditDueDate] = useState(null);
    const [editRecurring, setEditRecurring] = useState(false);
    const [editCompleted, setEditCompleted] = useState(false);
    const [editRecurrenceInterval, setEditRecurrenceInterval] = useState(false);


    const startEditing = (task) => {

        setEditingTask(task);
        setEditText(task.text);
        setEditDueDate(task.due_date);
        setEditRecurring(task.is_recurring);
        setEditCompleted(task.is_completed);
    };
    const saveEdit = () => {
        if (!editingTask) return;

        // Kombinieren von bestehenden Werten mit den neuen
        const updatedTask = {
            ...editingTask,
            text: editText,
            due_date: editDueDate ? new Date(editDueDate).toISOString().split('T')[0] : null,  // Nur speichern, wenn `editDueDate` vorhanden ist
            is_recurring: editRecurring ? 1 : 0,
            recurrence_interval: editRecurrenceInterval || null,
            last_completed_date: editCompleted ? new Date().toISOString().split('T')[0] : editingTask.last_completed_date,
            is_completed: editCompleted ? 1 : 0,  // Speichern als 1 oder 0
          };

        // API-Aufruf zum Aktualisieren der Aufgabe
        fetch(`https://api.possiblyfour.com:5001/api/tasks/${editingTask.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedTask),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("Aufgabe erfolgreich aktualisiert:", data);
                fetchTasks(); // Aktualisierte Liste der Aufgaben abrufen
            })
            .catch((err) => console.error("Fehler beim Aktualisieren der Aufgabe:", err));

        setEditingTask(null);
        setEditText("");
        setEditDueDate(null);
        setEditRecurring(false);
        setEditCompleted(false);
    };

    const deleteEdit = () => {
        if (!editingTask) return;

        console.log("Zu löschende Aufgaben ID:", editingTask.id);

        // Bestätigung vor dem Löschen
        if (!window.confirm("Möchtest du diese Aufgabe wirklich löschen?")) return;

        // API-Aufruf zum Löschen der Aufgabe
        fetch(`https://api.possiblyfour.com:5001/api/tasks/${editingTask.id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("Aufgabe erfolgreich gelöscht:", data);
                fetchTasks(); // Aktualisierte Liste der Aufgaben abrufen
            })
            .catch((err) => console.error("Fehler beim Löschen der Aufgabe:", err));
    };


    const assignToMe = (task) => {
        const updatedTask = {
            ...task,
            user_id: userId,  // Benutzer zuweisen
        };
        console.log("TaskList Component - userId:", userId); // Test, ob userId verfügbar ist


        fetch(`https://api.possiblyfour.com:5001/api/tasks/${updatedTask.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedTask),
        })
            .then((res) => res.json())
            .then(() => {
                console.log("Aufgabe erfolgreich zugewiesen.");
                fetchTasks(); // Aktualisierte Liste der Aufgaben abrufen
            })
            .catch((err) => console.error("Fehler beim Zuweisen der Aufgabe:", err));
    };

    const cancelEdit = () => {
        setEditingTask(null);
        setEditText("");
        setEditDueDate(null);
        setEditRecurring(false);
        setEditCompleted(false);
    };

    return (
        <div style={{ padding: "1rem", display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>

            {tasks.map((task) => (
                <Card key={task.id}>
                    <CardHeader titleText={task.text} subtitleText={`Zugewiesen an: ${task.assigned_to || "Niemand"}`} />
                    <div style={{ padding: "1rem" }}>
                        {editingTask && editingTask.id === task.id ? (
                            <div>
                                <Input
                                    value={editText}
                                    onInput={(e) => setEditText(e.target.value)}
                                    placeholder="Aufgabe bearbeiten"
                                    style={{ marginBottom: "1rem" }}
                                />                               
                                <div style={{ marginBottom: "1rem" }}>
                                    <CheckBox
                                        checked={editRecurring}
                                        text="Wiederkehrend"
                                        onChange={(e) => setEditRecurring(e.target.checked)}
                                    />
                                </div>
                                <Input
                                    type="number"
                                    placeholder="Wiederholungsintervall (Tage)"
                                    value={editRecurrenceInterval}
                                    onInput={(e) => setEditRecurrenceInterval(e.target.value)}
                                />
                                <div style={{ marginBottom: "1rem" }}>
                                    <CheckBox
                                        checked={editCompleted}
                                        text="Erledigt"
                                        onChange={(e) => setEditCompleted(e.target.checked)}
                                    />
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <Button design="Emphasized" onClick={saveEdit}>Speichern</Button>
                                    <Button design="Negative" onClick={deleteEdit}>Löschen</Button>
                                    <Button design="Transparent" onClick={cancelEdit}>Abbrechen</Button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p style={{ color: task.is_completed ? "green" : "red" }}>Status: {task.is_completed ? "Erledigt" : "Offen"}</p>
                                <Button design="Transparent" onClick={() => startEditing(task)} style={{ marginTop: "1rem" }}>Bearbeiten</Button>
                                {task.user_id === null && (
                                    <Button
                                        design="Emphasized"
                                        onClick={() => assignToMe(task)}
                                        style={{ marginTop: "1rem" }}>
                                        Mir zuweisen
                                    </Button>
                                )}

                            </div>
                        )}
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default TaskList;
