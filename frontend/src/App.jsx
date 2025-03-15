import Task from "./components/Task";
import Add from "./components/Add"
import { useEffect, useState } from "react";
import "./App.css";

const titlesList = [
  "Task Manifesto",
  "Communistodo",
  "SociaLIST",
  "Commulist",
  "The Weirdest To Do List"
]


function App() {
  const [todoContents, setToDoContents] = useState([]);
  const [title, setTitle] = useState("The Commulist");

  useEffect(() => {
    fetch("http://127.0.0.1:8080/task/get", {
      method: "GET",
      headers: {},
    })
      .then((response) => {
        console.log("FETCH CALLED");
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setToDoContents(data);
      })
      .catch((error) => console.log(error));
      
      setTitle(titlesList[Math.floor(Math.random() * titlesList.length)]);
  
    }, []);

  return (
    <>
      <div className="m-20 flex flex-col">
        <div id="top-container">
          <h1 className="font-atkinson text-lg">{title}</h1>
        </div>
        <div id="add-container">
          <Add/>
        </div>
        <div id="todo-container">
          {todoContents.map((data) => (
            <Task
              key={data.uuid}
              uuid={data.uuid}
              createDate={data.createDate}
              updateDate={data.updateDate}
              creator={data.creator}
              status={data.status}
              text={data.text}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
