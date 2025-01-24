import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register an Admin";

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await api.post(route, { username, password, is_superuser: isSuperuser });
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setErrorMessage("Invalid credentials. Please try again.");
        } else if (error.response.status === 401) {
          setErrorMessage("Unauthorized. Please check your username and password.");
        } else if (error.response.status === 409) {
          setErrorMessage("Username already exists. Please choose a different username.");
        } else {
          setErrorMessage("An error occurred. Please try again later.");
        }
      } else if (error.request) {
        setErrorMessage("No response from server. Please check your network connection.");
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>{name}</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <input
        className="form-input"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        className="form-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {method === "register" && (
        <div>
          <label>
            <input
              type="checkbox"
              checked={isSuperuser}
              onChange={(e) => setIsSuperuser(e.target.checked)}
            />
            Register as Superuser
          </label>
        </div>
      )}
      {loading && <div>Loading...</div>}
      <button className="form-button" type="submit">
        {name}
      </button>
    </form>
  );
}

export default Form;