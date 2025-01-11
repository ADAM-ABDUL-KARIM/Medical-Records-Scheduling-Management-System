import React from "react";
import "../styles/Note.css";

function Note({ note, onDelete }) {
    const formattedDate = new Date(note.note_date).toLocaleDateString("en-US");

    return (
        <div className="note-container">
            <p className="note-title">Patient: {note.patient_name}</p>
            <p className="note-content">Appointment Date: {note.appointment_details.appointment_datetime}</p>
            <p className="note-content">Healthcare Professional: {note.appointment_details.healthcare_professional_name}</p>
            <p className="note-content">Added by: {note.added_by}</p>
            <p className="note-date">Added On: {formattedDate}</p>
            <p className="note-content">Note: {note.note_content}</p>
            <button className="delete-button" onClick={() => onDelete(note.note_id)}>Delete</button>
        </div>
    );
}

export default Note;