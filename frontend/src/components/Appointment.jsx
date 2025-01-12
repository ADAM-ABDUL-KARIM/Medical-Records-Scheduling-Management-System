import React from "react";
import "../styles/Note.css"
import "../styles/Record.css"

function Appointment({appointment,onDelete}) { 

 
    return <div className="rec-container">
            <p className="rec-title"> {appointment.healthpro_details.healthcare_professional_name}</p>
            <p className="note-title">{appointment.healthpro_details.healthcare_professional_specialty}</p>
    
            <p className="note-content">{appointment.patient_name}</p>
            <p className="note-content">{appointment.appointment_datetime}</p>
           

            <button className="delete-button" onClick={()=> onDelete(appointment.appointment_id)}>Delete</button>

    </div>
}
export default Appointment;