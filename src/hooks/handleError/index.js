export const handleErorr = (err) => {
  let errMessages = [];
  errMessages.push(["the process was not completed successfully"]);
  if (err.response.data) {
    let obj = err.response.data;
    Object.keys(obj).forEach((e) => {
      errMessages.push(`${obj[e]}`);
    });
  }
  return { errMessages };
};
