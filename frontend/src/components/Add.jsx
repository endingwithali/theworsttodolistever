import { useState } from "react";
import { useTaskState } from "../context/ToDoContainer";

export function Add() {
  // eslint-disable-next-line no-unused-vars
  const { tasks: todoContents, dispatchFunction } = useTaskState();
  const [taskState, setTaskState] = useState("")


  const handleSubmit = () => {
    if (taskState===""){
      return
    }
    addNewTask(taskState).then( (taskData) => {
      dispatchFunction({
        "type": "ADD", 
        "newTask": taskData
      })
      
    })
  };
  const handleInputChange = (e) => {  
    setTaskState(e.target.value)
  }

  return (
    <div className="flex gap-4">
        <form onSubmit={handleSubmit}>
            <input type="text" className="outline-solid" value={taskState} onChange={handleInputChange}/>
            <button type="submit" className="pl-2">Create</button>
        </form>
    </div>
  );
}



const addNewTask = (taskText) => {
  return fetch("http://127.0.0.1:8080/task/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      "task": taskText,
    }),
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.log(error);
      return [];
    });
}