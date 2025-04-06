import { useState } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { useTaskState } from "../context/ToDoContainer";
import { MdEdit, MdCancel } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
// import {div} as motion-div from "motion/react-client";

function Task({ uuid, createDate, updateDate, creator, status, text }) {
  const [checkedState, setChecked] = useState(status);
  const [updateDateState, setUpdateDate] = useState(updateDate);
  const [isEditing, setIsEditing] = useState(false);
  const [taskValue, setTaskValue] = useState(text);
  const [isInfoVisible, setTaskInfoState] = useState(false);
  const [prevTaskState, setPrevTaskState] = useState(text);

  // eslint-disable-next-line no-unused-vars
  const { tasks, dispatchFunction } = useTaskState();

  const handleInfoVisibility = () => {
    setTaskInfoState(!isInfoVisible);
    if (isInfoVisible && isEditing) {
      setIsEditing(false);
      setTaskValue(prevTaskState);
    }
  };

  const handleEdit = () => {
      setIsEditing(!isEditing);
      if (isEditing) {
        setTaskValue(prevTaskState);
      }

  }
  const handleChange = () => {
    setIsEditing(false);
    setTaskValue(prevTaskState);
    fetch("http://127.0.0.1:8080/task/toggle", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        taskID: uuid,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setChecked(data.taskStatus);
        setUpdateDate(data.updateDate);
      })
      .catch((error) => {
        setChecked(!checkedState);
        console.log(error);
      });
  };

  const handleTaskOnChange = (e) => {
    setTaskValue(e.target.value);
  };

  const handleUpdate = () => {
    fetch("http://127.0.0.1:8080/task/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        taskID: uuid,
        taskString: taskValue,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setChecked(data.taskStatus);
        setUpdateDate(data.updateDate);
        setIsEditing(false);
        setPrevTaskState(data.taskString);
      })
      .catch((error) => {
        setTaskValue(prevTaskState);
        console.log(error);
      });
  };

  const handleDelete = () => {
    deleteTask(uuid).then((status) => {
      if (status) {
        dispatchFunction({
          type: "DELETE",
          taskID: uuid,
        });
      }
    });
  };

  /*
  1) createState -> base == false
  2) in return :
  check to see state of createState -> 
  if false -> show text
  if true -> show inputBox with value in it
  3) on submit edit
  a) call fetch update to backend 
  b) update Local values + statusvalues 
  */

  //https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details

  return (
    <div className="flex pb-5">
      <div className="pr-5">
        <input type="checkbox" checked={checkedState} onChange={handleChange} />
      </div>
      <div>
        <button
          className="mr-2 flex items-center align-middle"
          onClick={handleInfoVisibility}
        >
          <div className="align-middle"> {isInfoVisible ? "(-)" : "(+)"}</div>
        </button>
      </div>
      <div className="flex flex-col">
        <div className="font-lekton">
          {!isEditing && <p className="px-2 py-1">{taskValue}</p>}
          {isEditing && (
            <form onSubmit={handleUpdate} className="flex px-2 py-1 outline-2 mr-2 grow">
              <input
                className="pr-2 flex-auto"
                value={taskValue}
                onChange={handleTaskOnChange}
              />
              <button className="text-purple-600 flex-xs" type="submit">
                UPDATE
              </button>
            </form>
          )}
        </div>
        <div>
          {isInfoVisible ? (
            <div>
              <div id="task-info-container">
                <p className="font-lekton">
                  Last Updated:{" "}
                  {dayjs(updateDateState).format("YYYY-MM-DD HH:mm").toString()}
                </p>
                <p className="font-lekton">
                  Date Created:{" "}
                  {dayjs(createDate).format("YYYY-MM-DD HH:mm").toString()}
                </p>
                <p className="font-lekton">Creator: {creator}</p>
                <div className="flex flex-row gap-3">
                  <div>
                    <button
                      type="edit"
                      onClick={handleEdit}
                    >
                      {" "}
                      { isEditing ? <MdCancel/> : <MdEdit />}
                        {" "}
                    </button>
                  </div>
                  <div>
                    <button type="edit" onClick={handleDelete}>
                      {" "}
                      <FaTrash />{" "}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

Task.propTypes = {
  uuid: PropTypes.string.isRequired,
  createDate: PropTypes.string.isRequired,
  updateDate: PropTypes.string.isRequired,
  creator: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default Task;

const deleteTask = (taskID) => {
  return fetch("http://127.0.0.1:8080/task/delete", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      taskID: taskID,
    }),
  })
    .then(() => {
      return true;
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
};
