import React from "react";
import "../styles/Appointment.css";

function Appointment({ appointment, onDelete }) {
    return (
        <div className="appointment-container">
            <p className="">{appointment.healthpro_details.healthcare_professional_name}</p>
            <p className="">{appointment.healthpro_details.healthcare_professional_specialty}</p>
            <p className="">{appointment.patient_name}</p>
            <p className="">{appointment.appointment_datetime}</p>
            <button className="delete-button" onClick={() => onDelete(appointment.appointment_id)}>Delete</button>
        </div>
    );
}

export default Appointment;