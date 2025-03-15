import { useState } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { useTaskState } from "../context/ToDoContainer";
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";

function Task({ uuid, createDate, updateDate, creator, status, text }) {
  const [checkedState, setChecked] = useState(status);
  const [updateDateState, setUpdateDate] = useState(updateDate);
  const [isEditing, setIsEditing] = useState(false);
  const [taskValue, setTaskValue] = useState(text);

  // eslint-disable-next-line no-unused-vars
  const { tasks, dispatchFunction } = useTaskState();

  const handleChange = () => {
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
        // setOldTaskValue("")
      })
      .catch((error) => {
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
      })
      .catch((error) => {
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
    <div className="flex gap-4 p-4">
      <input
        className="font-lekton"
        type="checkbox"
        checked={checkedState}
        onChange={handleChange}
      />
      <summary className="font-lekton">
        {!isEditing && <p>{taskValue}</p>}
        {isEditing && (
          <form onSubmit={handleUpdate}>
            <input value={taskValue} onChange={handleTaskOnChange} />
            <button type="submit">update</button>
          </form>
        )}
      </summary>

      <p className="font-lekton">
        {dayjs(updateDateState).format("YYYY-MM-DD HH:mm").toString()}
      </p>
      <p className="font-lekton">
        {dayjs(createDate).format("YYYY-MM-DD HH:mm").toString()}
      </p>
      <p className="font-lekton">{creator}</p>
      <button
        type="edit"
        onClick={() => {
          setIsEditing(true);
        }}
      >
        {" "}
        <MdEdit />{" "}
      </button>
      <button type="edit" onClick={handleDelete}>
        {" "}
        <FaTrash />{" "}
      </button>
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
