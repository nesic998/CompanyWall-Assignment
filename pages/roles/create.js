import Input from "@/components/ui/Input";
import { validateField } from "@/components/ui/RoleValidator";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";

export default function CreateForm() {
  const router = useRouter();
  const { action } = router.query;

  const [inputValues, setInputValues] = useState({
    roleName: "",
    roleDescription: "",
  });

  const [errors, setErrors] = useState({
    roleName: "",
    roleDescription: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [name]: value,
    }));

    validateField(name, value, setErrors);
  };

  const submitFormHandler = (e) => {
    e.preventDefault();

    Object.keys(inputValues).forEach((fieldName) => {
      validateField(fieldName, inputValues[fieldName], setErrors);
    });

    if (
      Object.values(errors).every((error) => !error) &&
      inputValues.roleName !== ""
    ) {
      const reqBody = {
        roleName: inputValues.roleName,
        roleDescription: inputValues.roleDescription,
      };

      fetch("/api/roles", {
        method: "POST",
        body: JSON.stringify(reqBody),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to create role");
          }
          return response.json();
        })

        .then((data) => {
          console.log("Role created successfully:", data);
          router.push("/roles");
        })
        .catch((error) => {
          alert("Role name must be unique!");
          setErrors((prevErrors) => ({
            ...prevErrors,
            roleName: "Role name must be unique!",
          }));
          console.error("Error creating role:", error);
        });
    } else {
      console.log("Form contains errors. Please fix them.");
      alert("Form contains errors. Please fix them.");
    }
  };

  return (
    <div>
      <h1>Create Role Form</h1>

      <div className="inputs">
        <Input
          sx={{ m: "20px 0px 20px 30px" }}
          onChange={handleInputChange}
          name="roleName"
          value={inputValues.roleName}
          required
          size="small"
          label="Role name"
          error={Boolean(errors.roleName)}
          helperText={errors.roleName}
        />

        <Input
          sx={{ m: "20px 0px 20px 30px" }}
          onChange={handleInputChange}
          name="roleDescription"
          value={inputValues.roleDescription}
          size="small"
          label="Role description"
          error={Boolean(errors.roleDescription)}
          helperText={errors.roleDescription}
        />
      </div>

      <div className="buttons">
        <Button
          sx={{ m: "20px 0px 20px 30px" }}
          color="success"
          variant="contained"
          onClick={submitFormHandler}
        >
          Create
        </Button>

        <Button
          onClick={() => router.push("/roles")}
          sx={{ m: "20px 0px 20px 30px" }}
          color="error"
          variant="contained"
        >
          Quit
        </Button>
      </div>
    </div>
  );
}
