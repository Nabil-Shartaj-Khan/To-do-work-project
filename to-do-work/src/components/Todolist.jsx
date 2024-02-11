import { useState, useEffect } from "react";
import "../css/style.css";

const Todolist = () => {
  const initialTasks = JSON.parse(localStorage.getItem("tasks")) || [];

  const [tasks, setTasks] = useState(initialTasks);

  const [newTask, setNewTask] = useState("");

  const [editingIndex, setEditingIndex] = useState(null);

  const [taskCount, setTaskCount] = useState(initialTasks.length);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleInputChange = (e) => {
    setNewTask(e.target.value);
  };
  const addTask = () => {
    if (newTask.trim() !== "") {
      if (editingIndex !== null) {
        const updatedTasks = [...tasks];
        updatedTasks[editingIndex] = newTask;
        setTasks(updatedTasks);
        setEditingIndex(null);
      } else {
        setTasks((t) => [...t, newTask]);
        setTaskCount((prevCount) => prevCount + 1);
      }
      setNewTask("");
    }
  };

  const editTask = (index) => {
    setEditingIndex(index);
    setNewTask(tasks[index]);
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    setTaskCount((prevCount) => prevCount - 1);
  };

  const moveTaskUp = (index) => {
    if (index > 0) {
      const updatedTasks = [...tasks];
      [updatedTasks[index], updatedTasks[index - 1]] = [
        updatedTasks[index - 1],
        updatedTasks[index],
      ];
      setTasks(updatedTasks);
    }
  };

  const moveTaskDown = (index) => {
    if (index < tasks.length - 1) {
      const updatedTasks = [...tasks];
      [updatedTasks[index], updatedTasks[index + 1]] = [
        updatedTasks[index + 1],
        updatedTasks[index],
      ];
      setTasks(updatedTasks);
    }
  };

  return (
    <div className="to-do-list">
      <h1 className="text-center text-success display-3">To do app</h1>
      <hr></hr>
      <p className="fs-4">Total tasks: {taskCount}</p>
      <label className="label me-4">Task input-</label>
      <input
        type="text"
        placeholder="Input your task..."
        value={newTask}
        onChange={handleInputChange}
        className="p-3 pt-4 me-3 mb-4"
      />
      <button className="btn btn-success p-3 mt-0 mb-2" onClick={addTask}>
        {editingIndex !== null ? "Update" : "Add"} (+)
      </button>
      <ol>
        {tasks.map((task, index) => (
          <li key={index}>
            {editingIndex === index ? (
              <input type="text" value={newTask} onChange={handleInputChange} />
            ) : (
              <span>{task}</span>
            )}
            <button
              className="btn btn-danger ms-4 px-4 py-2 me-3"
              onClick={() => deleteTask(index)}
            >
              Delete
            </button>
            <button
              className="btn btn-warning px-4 py-2 me-3"
              onClick={() => editTask(index)}
            >
              Edit
            </button>
            <button
              className="btn btn-primary px-4 py-2 me-3"
              onClick={() => moveTaskUp(index)}
            >
              Move up
            </button>
            <button
              className="btn btn-primary px-4 py-2 me-3"
              onClick={() => moveTaskDown(index)}
            >
              Move Down
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Todolist;
