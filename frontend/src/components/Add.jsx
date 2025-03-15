import { useEffect, useState } from "react";
import dayjs from "dayjs";

function Add() {
  const [taskState, setTaskState] = useState("");

  const handleChange = () => {
    fetch("http://127.0.0.1:8080/task/create", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        task: taskState,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="flex gap-4 p-4">
        <form >
            <input type="text" name="query" className="outline-solid"/>
            <button type="submit">Create</button>
        </form>
    </div>
  );
}
export default Add;
