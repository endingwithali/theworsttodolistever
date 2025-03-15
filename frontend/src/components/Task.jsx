import { useEffect, useState } from "react";
import dayjs from "dayjs";

function Task({ uuid, createDate, updateDate, creator, status, text }) {
  const [checkedState, setChecked] = useState(status);
  const [updateDateState, setUpdateDate] = useState(updateDate);

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
      })
      .catch((error) => console.log(error));
  };

  //https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details

  return (
    <div className="flex gap-4 p-4">
      <input className="font-lekton" type="checkbox" checked={checkedState} onChange={handleChange} />
      <details>
        <summary className="font-lekton">{text}</summary>

        <p className="font-lekton">{
          dayjs(updateDateState).format('YYYY-MM-DD HH:mm').toString()
        }</p>
        <p className="font-lekton">{
                  dayjs(createDate).format('YYYY-MM-DD HH:mm').toString()
        }</p>
        <p className="font-lekton">{creator}</p>
      </details>
    </div>
  );
}
export default Task;
