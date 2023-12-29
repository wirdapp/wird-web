import { useState } from "react";

export const useHandleErorr = (err, color = "green") => {
  const [classColor, setClassColor] = useState(color);
  const [messages, setMessages] = useState([]);

  const handleError = (err) => {
    let errMessages = [];
    errMessages.push(["the process was not completed successfully"]);
    if (err?.response?.data) {
      let obj = err.response.data;
      Object.keys(obj).forEach((e, index) => {
        errMessages.push(`${index + 1} - ${obj[e]}`);
      });
    }

    setMessages([...errMessages]);
    setClassColor("red");
  };

  const createSpecificMessage = (messages) => setMessages([messages]);
  const changeColor = (color = "green") => setClassColor(color);

  return {
    messages,
    classColor,
    handleError,
    changeColor,
    createSpecificMessage,
  };
};
