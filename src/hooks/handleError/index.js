import { useState } from "react";

export const useHandleError = (err, color = "green") => {
  const [classColor, setClassColor] = useState(color);
  const [messages, setMessages] = useState([]);

  const handleError = (err) => {
    let errMessages = [];
    if (err?.response?.data) {
      let obj = err.response.data;
      Object.keys(obj).forEach((e, index) => {
        errMessages.push(obj[e]);
      });
    } else {
      errMessages.push(["the process was not completed successfully"]);
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
