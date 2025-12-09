import { useEffect, useState } from "react";
import "./App.css";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [dark, setDark] = useState(false);

  const fetchTasks = () => {
    setLoading(true);
    fetch("http://127.0.0.1:5000/tasks")
      .then(res => res.json())
      .then(data => {
        setTasks(data);
        setLoading(false);
      })
      .catch(() => setError("Erro ao carregar tarefas"));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = () => {
    if (!title.trim()) return;

    fetch("http://127.0.0.1:5000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title })
    })
      .then(res => res.json())
      .then(newTask => {
        setTasks([...tasks, newTask]);
        setTitle("");
      });
  };

  const toggleTask = (task) => {
    fetch(`http://127.0.0.1:5000/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !task.done })
    })
      .then(res => res.json())
      .then(updatedTask => {
        setTasks(tasks.map(t => (t.id === updatedTask.id ? updatedTask : t)));
      });
  };

  const deleteTask = (id) => {
    fetch(`http://127.0.0.1:5000/tasks/${id}`, { method: "DELETE" })
      .then(() => setTasks(tasks.filter(t => t.id !== id)));
  };

  const editTask = (task) => {
    const newTitle = prompt("Editar tarefa", task.title);
    if (!newTitle) return;

    fetch(`http://127.0.0.1:5000/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle })
    })
      .then(res => res.json())
      .then(updatedTask => {
        setTasks(tasks.map(t => (t.id === updatedTask.id ? updatedTask : t)));
      });
  };

  const filteredTasks = tasks.filter(t =>
    filter === "done" ? t.done :
    filter === "todo" ? !t.done :
    true
  );

  return (
    <div className={dark ? "container dark" : "container"}>
      <div className="header">
        <h1>Tarefas Diaria</h1>
        <button className="theme-btn" onClick={() => setDark(!dark)}>
          {dark ? <LightModeIcon /> : <DarkModeIcon />}
        </button>
      </div>

      <div className="input-area">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Digite uma nova tarefa..."
        />
        <button onClick={addTask}>Adicionar</button>
      </div>

      <div className="filters">
        <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>Todas</button>
        <button className={filter === "todo" ? "active" : ""} onClick={() => setFilter("todo")}>Pendentes</button>
        <button className={filter === "done" ? "active" : ""} onClick={() => setFilter("done")}>Concluídas</button>
      </div>

      {loading ? (
        <p>Carregando tarefas...</p>
      ) : (
        <ul className="task-list">
          {filteredTasks.map(t => (
            <li key={t.id} className={t.done ? "task done" : "task"}>
              <span className="check-icon" onClick={() => toggleTask(t)}>
                {t.done ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
              </span>

              <span className="title" onClick={() => toggleTask(t)}>
                {t.title}
              </span>

              <div className="actions">
                <button className="edit" onClick={() => editTask(t)}><EditIcon /></button>
                <button className="delete" onClick={() => deleteTask(t.id)}><DeleteIcon /></button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
