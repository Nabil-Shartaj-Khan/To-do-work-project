import React, { useState, useEffect } from "react";
import "../css/style.css";

const Todolist = () => {
  const initialTasks = JSON.parse(localStorage.getItem("tasks")) || [];

  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [taskCount, setTaskCount] = useState(initialTasks.length);
  const [taskDone, setTaskDone] = useState(initialTasks.map(() => false));
  const [priority, setPriority] = useState(null);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleInputChange = (e) => {
    setNewTask(e.target.value);
  };

  const handlePriorityChange = (e) => {
    setPriority(e.target.value);
  };

  const addTask = () => {
    if (newTask.trim() === "" || !priority) {
      alert("Please enter a task and select a priority level.");
      return;
    }
    if (editingIndex !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[editingIndex] = {
        ...updatedTasks[editingIndex],
        task: newTask,
        priority: priority,
      };
      setTasks(updatedTasks);
      setEditingIndex(null);
    } else {
      const newTaskObject = {
        task: newTask,
        priority: priority,
      };
      setTasks((t) => [...t, newTaskObject]);
      setTaskDone((prevDone) => [...prevDone, false]);
      setTaskCount((prevCount) => prevCount + 1);
    }
    setNewTask("");
    setPriority(null);
    const priorityInputs = document.querySelectorAll("input[name='priority']");
    priorityInputs.forEach((input) => (input.checked = false));
  };

  const editTask = (index) => {
    setEditingIndex(index);
    const taskToEdit = tasks[index];
    setNewTask(taskToEdit.task);
    setPriority(taskToEdit.priority);
    const priorityInputs = document.querySelectorAll("input[name='priority']");
    priorityInputs.forEach((input) => {
      input.checked = input.value === taskToEdit.priority;
    });
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

  const completedTaskCount = taskDone.filter((done) => done).length;

  return (
    <div className="to-do-list">
      <h1 className="text-center text-success display-3">To do app</h1>
      <span className="fs-4">
        Input your task, select priority and then Add
      </span>
      <hr></hr>
      <div className="d-flex align-items-center justify-content-center pt-4">
        <label className="label me-4">Task input-</label>
        <input
          type="text"
          placeholder="Input your task..."
          value={newTask}
          onChange={handleInputChange}
          className="p-3 pt-4 me-3 mb-4"
        />
        <div className="fs-4">
          <span className="me-3 fw-bold ps-5">Priority:</span>
          <input
            type="radio"
            id="priority-high"
            name="priority"
            value="high"
            onChange={handlePriorityChange}
            required
          />
          <label htmlFor="priority-high" className="me-3">
            High
          </label>
          <input
            type="radio"
            id="priority-medium"
            name="priority"
            value="medium"
            onChange={handlePriorityChange}
            required
          />
          <label htmlFor="priority-medium" className="me-3">
            Medium
          </label>
          <input
            type="radio"
            id="priority-low"
            name="priority"
            value="low"
            onChange={handlePriorityChange}
            required
          />
          <label htmlFor="priority-low">Low</label>
        </div>
      </div>
      <button className="btn btn-success p-3 mt-0 mb-2" onClick={addTask}>
        {editingIndex !== null ? "Update" : "Add"} (+)
      </button>

      <div className="output-container d-flex justify-content-evenly mt-5">
        <div className="left-side">
          <p className="fs-3 py-4 fw-bold">Total tasks: {taskCount}</p>

          <ol>
            {tasks.map((taskObject, index) => (
              <li
                key={index}
                style={{
                  color:
                    taskObject.priority === "high"
                      ? "blue"
                      : taskObject.priority === "medium"
                        ? "skyblue"
                        : "red",
                  textDecoration: taskDone[index] ? "line-through" : "none",
                }}
              >
                {editingIndex === index ? (
                  <div>
                    <input
                      type="text"
                      value={newTask}
                      onChange={handleInputChange}
                    />
                    <div className="fs-4 mt-3">
                      <span className="me-3">Priority:</span>
                      <span>{tasks[index].priority}</span>{" "}
                    </div>
                  </div>
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
          </ol>
        </div>

        <div className="completed-tasks pt-4">
          <p className="fs-3 pt-3 fw-bold">
            Total Completed tasks: {completedTaskCount}
          </p>
          <ul>
            {tasks.map((taskObject, index) => {
              if (taskDone[index]) {
                return (
                  <li key={index}>
                    <span>{taskObject.task}</span>
                    <span className="ps-3">({taskObject.priority})</span>
                  </li>
                );
              }
              return null;
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Todolist;
