import Input from "@/components/ui/Input";
import { validateField } from "@/components/ui/UserValidator";
import { Autocomplete, Button, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function CreateForm() {
  const router = useRouter();
  const { action } = router.query;

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

  const [value, setValue] = useState(roleNames[0]);
  const [inputValue, setInputValue] = useState("");

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
        firstName: inputValues.firstName,
        lastName: inputValues.lastName,
        emailAddress: inputValues.emailAddress,
        roleName: inputValues.roleName,
      };

      fetch("/api/users", {
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
          router.push("/users");
        })
        .catch((error) => {
          console.error("Error creating role:", error);
        });
    } else {
      console.log("Form contains errors. Please fix them.");
      alert("Form contains errors. Please fix them.");
    }
  };

  return (
    <div>
      <h1>Create User Form</h1>

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
          Create
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
