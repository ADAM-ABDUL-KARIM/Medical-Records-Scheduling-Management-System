import { useState, useEffect } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import patientList from "../assets/patient_list.png";
import NotesPng from "../assets/NotesPng.png";
import writeRecord from "../assets/writeRecord.png";
import appointmentIcon from "../assets/appointmentIcon.png";
import availability from "../assets/availability.png";

import Export from "../assets/Export.png";

function Home() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    getUserName();
  }, []);

  const getUserName = () => {
    api
      .get("/api/username/")
      .then((res) => res.data)
      .then((data) => {
        setUsername(data.username); // Ensure only the username is set
        console.log(data);
      })
      .catch((error) => alert(error + " Failed to get username"));
  };

  return (
    <>
      <h1 className="usernameWelcome">
        Welcome, <span className="steelbluespan">{username}</span>
      </h1>

      <div className="Home-ul">
        <div>
          <Link to="/writerecords">
            <img
              src={writeRecord}
              alt="Write Records"
              width={150}
              height={150}
            />
            <span className="hiddenContainer">Write Records</span>
          </Link>
        </div>
        <div>
          <Link to="/viewrecords">
            <img
              src={patientList}
              alt="View Records"
              width={150}
              height={150}
            />
            <span className="hiddenContainer">View Records</span>
          </Link>
        </div>

        <div>
          <Link to="/notes">
            <img src={NotesPng} alt="PatientList" width={150} height={150} />
            <span className="hiddenContainer">Notes</span>
          </Link>
        </div>
        <div>
          <Link to="/appointments">
            <img
              src={appointmentIcon}
              alt="appointmentLogo"
              width={150}
              height={150}
            />
            <span className="hiddenContainer">Appointments</span>
          </Link>
        </div>
        <div>
          <Link to="/availability">
            <img
              src={availability}
              alt="availability"
              width={150}
              height={150}
            />
            <span className="hiddenContainer">Availability</span>
          </Link>
        </div>

        <div>
          <Link to="/export">
            <img src={Export} alt="Export" width={150} height={150} />
            <span className="hiddenContainer">Export Patients</span>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Home;
