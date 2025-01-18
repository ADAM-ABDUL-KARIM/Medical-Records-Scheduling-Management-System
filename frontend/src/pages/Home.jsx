import { useState, useEffect } from "react";
import api from "../api";
import {Link} from 'react-router-dom'
import "../styles/Home.css";

function Home() {
    const [username, setUsername] = useState("");
    

    
    useEffect(() => {
  
        getUserName();
    }, []);


    const getUserName = () => {
        api.get("/api/username/")
            .then((res) => res.data)
            .then((data) => {
                setUsername(data.username); // Ensure only the username is set
                console.log(data);
            })
            .catch((error) => alert(error + " Failed to get username"));
    };

   return (
    <>
    <h1 className= "usernameWelcome">Welcome, <span className="steelbluespan">{username}</span> </h1>
   
    <h1>Home page </h1>
    <div className="Home-ul">

    <div><Link to="/notes">Notes</Link></div>
    <div><Link to="/viewrecords">View Records</Link></div>
    <div><Link to="/writerecords">Write Records</Link></div>
    <div><Link to="/appointments">Appointments</Link></div>
    <div><Link to="/availability">Availability</Link></div>
    
    <div><Link to="/export/patient/excel">Export (Excel)</Link></div>
    <div><Link to="/export/patient/pdf">Export (PDF)</Link></div>
</div>
  
    </>
   )
   
}

export default Home;

