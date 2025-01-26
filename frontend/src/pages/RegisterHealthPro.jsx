import { useState } from "react";
import api from "../api";

function RegisterHealthPro() {
  const [username, setUsername] = useState("defaultUsername");
  const [password, setPassword] = useState("defaultPassword");
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [dateOfBirth, setDateOfBirth] = useState("2000-01-01");
  const [specialty, setSpecialty] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const createHealthPro = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/healthpro/", {
        user: {
          username: username,
          password: password,
        },
        first_name: firstName,
        last_name: lastName,
        dob: dateOfBirth,
        specialty: specialty,
      });
      if (response.status === 201) {
        alert("Healthcare Professional Created Successfully!");
        resetForm();
      } else {
        alert("Failed to create Healthcare Professional. Please try again.");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.user && error.response.data.user.username) {
        setErrorMessage("A user with that username already exists.");
        alert("A user with that username already exists");
      } else {
        setErrorMessage("An error occurred while creating the healthcare professional.");
      }
      console.error("Error creating healthpro:", error.response.data);
    }
  };

  const resetForm = () => {
    setUsername("defaultUsername");
    setPassword("defaultPassword");
    setFirstName("John");
    setLastName("Doe");
    setDateOfBirth("2000-01-01");
    setSpecialty("");
    setErrorMessage("");
  };

  return (
    <div className="write-records-container">
      <h2>Register a Healthcare Professional</h2>

      <form onSubmit={createHealthPro} className="write-records-form">
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <fieldset>
          <legend>User Details</legend>

          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </fieldset>

        <fieldset>
          <legend>Healthcare Professional Details</legend>

          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />

          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />

          <label htmlFor="dateOfBirth">Date of Birth:</label>
          <input
            type="date"
            id="dateOfBirth"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
          />

          <label htmlFor="specialty">Specialty:</label>
          <input
            type="text"
            id="specialty"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            required
          />
        </fieldset>
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
}

export default RegisterHealthPro;