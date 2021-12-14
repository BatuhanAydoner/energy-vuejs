const validation = (fields) => {
  let error = "";
  const format = {
    text: /[a-zA-Z0-9]+/,
    email: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
    phone: /[0-9]{10}/,
    password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
  };

  fields.forEach((field, index) => {
    if (!field.value.match(format[field.condition])) {
      error += field.name;
      error += index < fields.length - 1 ? "," : "";
    }
  });

  console.log(error + " alanlarını beklenilen formda doldurunuz.");

  return {
    error: error.length > 0,
    message: error + " alanlarını beklenilen formda doldurunuz.",
  };
};

/* {
      name: "",
      value: "",
      condition: "",
  } */

export default validation;
