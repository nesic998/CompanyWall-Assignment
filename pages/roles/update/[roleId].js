import Input from "@/components/ui/Input";
import { validateField } from "@/components/ui/RoleValidator";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function UpdateForm() {
  const router = useRouter();
  const { roleId } = router.query;

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

  useEffect(() => {
    // Fetch existing role data based on roleId
    const fetchRoleData = async () => {
      try {
        const response = await fetch(`/api/roles/${roleId}`);
        const data = await response.json();

        if (response.ok) {
          setInputValues({
            roleName: data.role.roleName,
            roleDescription: data.role.roleDescription,
          });
        } else {
          console.error("Error fetching role data:", data.error);
        }
      } catch (error) {
        console.error("Error fetching role data:", error);
      }
    };

    if (roleId) {
      fetchRoleData();
    }
  }, [roleId]);

  const submitFormHandler = async (e) => {
    e.preventDefault();

    Object.keys(inputValues).forEach((fieldName) => {
      validateField(fieldName, inputValues[fieldName], setErrors);
    });

    if (
      Object.values(errors).every((error) => !error) &&
      inputValues.roleName !== ""
    ) {
      try {
        const response = await fetch(`/api/roles/${roleId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(inputValues),
        });

        const data = await response.json();

        if (response.ok) {
          router.push("/roles");
        } else {
          alert("Role name must be unique!");
          setErrors((prevErrors) => ({
            ...prevErrors,
            roleName: "Role name must be unique!",
          }));
          console.log(response);
          console.error("Error updating role:", data.error);
        }
      } catch (error) {
        console.log(response);
        console.error("Error updating role:", error);
      }
    } else {
      console.log("Form contains errors. Please fix them.");
      alert("Form contains errors. Please fix them.");
    }
  };

  return (
    <div>
      <h1>Update Role Form</h1>

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
          Update
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
