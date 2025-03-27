import { useTaskState } from "../context/ToDoContainer";
import Task from "./Task";

function TaskList() {
  // eslint-disable-next-line no-unused-vars
  const { tasks: todoContents, dispatchFunction } = useTaskState();

  return (
    <div id="todo-container">
       {todoContents && todoContents.map((data) => (
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
  );
}
export default TaskList;
