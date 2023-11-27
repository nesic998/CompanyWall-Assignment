import Input from "@/components/ui/Input";
import { validateField } from "@/components/ui/UserValidator";
import { Autocomplete, Button, TextField } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function UpdateForm() {
  const router = useRouter();
  const { userId } = router.query;

  const [inputValues, setInputValues] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    roleName: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    roleName: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [name]: value,
    }));

    validateField(name, value, setErrors);
  };

  const [value, setValue] = useState("");
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    // Fetch existing role data based on userId
    const fetchRoleData = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();

        console.log(data);
        if (response.ok) {
          setInputValues({
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            emailAddress: data.user.emailAddress,
            roleName: data.user.roleName,
          });

          setValue(data.user.roleName);
        } else {
          console.error("Error fetching role data:", data.error);
        }
      } catch (error) {
        console.error("Error fetching role data:", error);
      }
    };

    if (userId) {
      fetchRoleData();
    }
  }, [userId]);

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/roles");
        const data = await response.json();
        setData(data.roles);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchData();
  }, []);

  const roleNames = data.map((item) => item.roleName);

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
        const response = await fetch(`/api/users/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(inputValues),
        });

        const data = await response.json();

        if (response.ok) {
          router.push("/users");
        } else {
          //   alert("Role name must be unique!");
          //   setErrors((prevErrors) => ({
          //     ...prevErrors,
          //     roleName: "Role name must be unique!",
          //   }));
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
      <h1>Update User Form</h1>

      <div className="inputs">
        <Input
          sx={{ m: "20px 0px 20px 30px" }}
          onChange={handleInputChange}
          name="firstName"
          value={inputValues.firstName}
          required
          size="small"
          label="First name"
          error={Boolean(errors.firstName)}
          helperText={errors.firstName}
        />

        <Input
          sx={{ m: "20px 0px 20px 30px" }}
          onChange={handleInputChange}
          name="lastName"
          value={inputValues.lastName}
          size="small"
          label="Last name"
          error={Boolean(errors.lastName)}
          helperText={errors.lastName}
        />

        <Input
          sx={{ m: "20px 0px 20px 30px" }}
          onChange={handleInputChange}
          name="emailAddress"
          value={inputValues.emailAddress}
          size="small"
          label="Email address"
          error={Boolean(errors.emailAddress)}
          helperText={errors.emailAddress}
        />

        <Autocomplete
          sx={{ m: "20px 0px 20px 30px" }}
          value={value || null}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
            validateField("roleName", newInputValue, setErrors);
            setInputValues((prevInputValues) => ({
              ...prevInputValues,
              roleName: newInputValue,
            }));
          }}
          options={roleNames}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Role name"
              error={Boolean(errors.roleName)}
              helperText={errors.roleName}
              required
            />
          )}
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
          onClick={() => router.push("/users")}
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
