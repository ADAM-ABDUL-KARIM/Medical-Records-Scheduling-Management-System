import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProfileIcon.css";
import profileIconImage from "../assets/profileIcon.png"; // Import the image as a default export

function ProfileIcon({ isPatient }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleRegister = () => {
    localStorage.clear();
    navigate("/register");
  };

  return (
    <div className="profile-icon-container">
      <img
        src={profileIconImage} // Use the default export
        alt="Profile"
        className="profile-icon"
        onClick={toggleDropdown}
      />
      {dropdownOpen && (
        <div className="dropdown-menu">
          <button onClick={handleLogout}>Logout</button>
          {!isPatient && <button onClick={handleRegister}>Register</button>}
        </div>
      )}
    </div>
  );
}

export default ProfileIcon;