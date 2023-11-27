export const validateField = (fieldName, value, setErrors, errors) => {
  let errorMessage = "";

  switch (fieldName) {
    case "roleName":
      errorMessage = validateRoleName(value);
      break;
    case "roleDescription":
      errorMessage = validateRoleDescription(value);
      break;
    default:
      break;
  }

  setErrors((prevErrors) => ({
    ...prevErrors,
    [fieldName]: errorMessage,
  }));
};

const validateRoleName = (value) => {
  if (!value) {
    return "Role name is required.";
  }
  if (!/^[a-zA-Z0-9_]{2,16}$/.test(value)) {
    return "Role name must be alphanumeric and can contain underscores (_), min length of 2, max length of 16 characters.";
  }

  return "";
};

const validateRoleDescription = (value) => {
  if (value.length > 50) {
    return "Role description must be at most 50 characters.";
  }
  return "";
};
