import TaskList from "./components/TaskList";
import { Add } from "./components/Add";
import { useEffect, useState } from "react";
import "./App.css";
import { ToDoContainer } from "./context/ToDoContainer";

const titlesList = [
  "Task Manifesto",
  "Communistodo",
  "SociaLIST",
  "Commulist",
  "The Weirdest To Do List",
];

function App() {
  const [title, setTitle] = useState("The Commulist");

  useEffect(() => {
    setTitle(titlesList[Math.floor(Math.random() * titlesList.length)]);
  }, []);

  return (
    <ToDoContainer>
      <div className="m-20 flex flex-col">
        <div id="top-container">
          <h1 className="font-atkinson text-lg">{title}</h1>
        </div>
        <div id="add-container">
        <Add />
        </div>
        <TaskList />
      </div>
    </ToDoContainer>
  );
}

export default App;
