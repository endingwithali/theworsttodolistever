import { useTaskState } from "../context/ToDoContainer";
import {useState, useEffect} from 'react';
import Task from "./Task";
import notasks from '../assets/notasks.jpeg'; // notasks
import tfwtasks from '../assets/howtotasks.png';



function TaskList() {
  // eslint-disable-next-line no-unused-vars
  const { tasks: todoContents, dispatchFunction } = useTaskState();
  const [taskImage, setTaskImage] = useState(tfwtasks);

  useEffect(() => {
    if (Math.random() > 0.5){
      setTaskImage(notasks);
    } else {
      setTaskImage(tfwtasks)
    }
  }, []);

  return (
    <div id="todo-container" className="pt-5">
      {todoContents && (todoContents.length>0) ?
        todoContents.map((data) => (
          <Task
            key={data.uuid}
            uuid={data.uuid}
            createDate={data.createDate}
            updateDate={data.updateDate}
            creator={data.creator}
            status={data.status}
            text={data.text}
          />
        )) : <img className="size-69" src={taskImage}/> }
    </div>
  );
}
export default TaskList;
