import { useState, useEffect } from "react";
import "../css/style.css";

const Todolist = () => {
  const initialTasks = JSON.parse(localStorage.getItem("tasks")) || [];

  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [taskCount, setTaskCount] = useState(initialTasks.length);
  const [taskDone, setTaskDone] = useState(initialTasks.map(() => false));

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
        const priorityInputs = document.getElementsByName("priority");
        let priority = null;
        for (let input of priorityInputs) {
          if (input.checked) {
            priority = input.value;
            break;
          }
        }
        const newTaskObject = {
          task: newTask,
          priority: priority,
        };
        setTasks((t) => [...t, newTaskObject]);
        setTaskDone((prevDone) => [...prevDone, false]);
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
    setTaskDone((prevDone) => prevDone.filter((_, i) => i !== index));
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
      setTaskDone((prevDone) => {
        const newDone = [...prevDone];
        [newDone[index], newDone[index - 1]] = [
          newDone[index - 1],
          newDone[index],
        ];
        return newDone;
      });
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
      setTaskDone((prevDone) => {
        const newDone = [...prevDone];
        [newDone[index], newDone[index + 1]] = [
          newDone[index + 1],
          newDone[index],
        ];
        return newDone;
      });
    }
  };

  const toggleTaskDone = (index) => {
    setTaskDone((prevDone) => {
      const newDone = [...prevDone];
      newDone[index] = !newDone[index];
      return newDone;
    });
  };

  return (
    <div className="to-do-list">
      <h1 className="text-center text-success display-3">To do app</h1>
      <hr></hr>
      <div className="d-flex align-items center justify-content-center">
        <label className="label me-4">Task input-</label>
        <input
          type="text"
          placeholder="Input your task..."
          value={newTask}
          onChange={handleInputChange}
          className="p-3 pt-4 me-3 mb-4"
        />
        <div className="fs-4">
          <span className="me-3">Priority:</span>
          <input type="radio" id="priority-high" name="priority" value="high" />
          <label htmlFor="priority-high" className="me-3">
            High
          </label>
          <input
            type="radio"
            id="priority-medium"
            name="priority"
            value="medium"
          />
          <label htmlFor="priority-medium" className="me-3">
            Medium
          </label>
          <input type="radio" id="priority-low" name="priority" value="low" />
          <label htmlFor="priority-low">Low</label>
        </div>
      </div>
      <button className="btn btn-success p-3 mt-0 mb-2" onClick={addTask}>
        {editingIndex !== null ? "Update" : "Add"} (+)
      </button>
      <p className="fs-3 py-3">Total tasks: {taskCount}</p>
      <ol>
        {tasks.map((taskObject, index) => (
          <li
            key={index}
            style={{
              color: taskDone[index] ? "green" : "inherit",
              textDecoration: taskDone[index] ? "line-through" : "none",
            }}
          >
            {editingIndex === index ? (
              <input type="text" value={newTask} onChange={handleInputChange} />
            ) : (
              <div>
                <span>{taskObject.task}</span>
                <span style={{ marginLeft: "1rem", fontWeight: "bold" }}>
                  ({taskObject.priority})
                </span>
              </div>
            )}

            {editingIndex !== index && (
              <>
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
                <button
                  className="btn btn-success px-4 py-2 me-3"
                  onClick={() => toggleTaskDone(index)}
                >
                  {taskDone[index] ? "Mark Task Undone" : "Mark Task Done"}
                </button>
              </>
            )}
          </li>
        ))}
      </ol>{" "}
    </div>
  );
};

export default Todolist;
