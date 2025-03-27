import { createContext, useReducer, useContext, useEffect } from "react";
import PropTypes from "prop-types";

const TaskStateContext = createContext(null);

export function ToDoContainer({ children }) {
  const [taskList, dispatch] = useReducer(tasksDispatch, []);

  useEffect(() => {
    getAllTasks().then(
      (data) => {
        if (data ==  null || data.length === 0) { // (data?.length===0)
          dispatch({});
        }
        dispatch({
          type: "LOAD",
          tasks: data,
        });
      }
    );
  }, []);

  return (
    <TaskStateContext.Provider
      value={{ tasks: taskList, dispatchFunction: dispatch }}
    >
      {children}
    </TaskStateContext.Provider>
  );
}

export function useTaskState() {
  return useContext(TaskStateContext);
}

const tasksDispatch = (tasks, action) => {
  switch (action.type) {
    case "ADD": {
      return [action.newTask, ...tasks]
    }
    case "DELETE": {
      console.log("delete dispatcher")
      return tasks.filter(t => t.uuid !== action.taskID);
    }
    case "LOAD": {
      return action.tasks;
    }
    default: {
      console.log("HERHEURHEURHEHRUERHUEHUEHRUEH");
      break;
    }
  }
};

// eslint-disable-next-line no-unused-vars
const getTask = (taskID) => {
  return fetch("http://127.0.0.1:8080/task/get?taskID=" + taskID, {
    method: "GET",
    headers: {},
  })
    .then((response) => {
      console.log("Getting New Task info");
      return response.json();
    })
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((error) => {
      console.log(error);
      return [];
    });
};

const getAllTasks = () => {
  return fetch("http://127.0.0.1:8080/task/get", {
    method: "GET",
    headers: {},
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.log(error);
      return [];
    });
};

ToDoContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

