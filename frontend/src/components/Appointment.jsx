import React from "react";
import "../styles/Note.css"
function Appointment({appointment,onDelete}) { 

 
    return <div className="note-container">
            <p className="note-title">{appointment.healthcare_professional}</p>
            <p className="note-content">{appointment.patient}</p>
            <p className="note-content">{appointment.appointment_datetime}</p>
           

            <button className="delete-button" onClick={()=> onDelete(appointment.appointment_id)}>Delete</button>

    </div>
}
export default Appointment;