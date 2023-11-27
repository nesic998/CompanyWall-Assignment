export const validateField = (fieldName, value, setErrors, errors) => {
  let errorMessage = "";

  switch (fieldName) {
    case "firstName":
      errorMessage = validateFirstAndLastName(value, "First");
      break;
    case "lastName":
      errorMessage = validateFirstAndLastName(value, "Last");
      break;
    case "emailAddress":
      errorMessage = validateEmailAddress(value);
      break;
    case "roleName":
      console.log(value);
      errorMessage = validateRoleName(value);
      break;
    default:
      break;
  }

  setErrors((prevErrors) => ({
    ...prevErrors,
    [fieldName]: errorMessage,
  }));
};

const validateFirstAndLastName = (value, name) => {
  if (!value) {
    return `${name} name is required.`;
  }
  if (/^[a-zA-Z]$/.test(value)) {
    return `${name} name must be alphabetic, min length of 2, max length of 20 characters.`;
  }

  return "";
};

const validateEmailAddress = (value) => {
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  if (isValid) {
    return "";
  } else {
    return "Email address is not valid!";
  }
};

const validateRoleName = (value) => {
  if (value.length > 0) {
    return "";
  } else {
    return "Role name must be selected!";
  }
};
