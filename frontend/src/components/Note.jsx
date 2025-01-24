import React from "react";
import "../styles/Note.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

function Note({ note, onDelete, isPatient }) {
  const formattedDate = new Date(note.note_date).toLocaleDateString("en-US");

  const handleDeleteClick = () => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure you want to delete this note?",
      buttons: [
        {
          label: "Yes",
          onClick: () => onDelete(note.note_id),
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  return (
    <div className="note-container">
      <p className="note-content">
        <span>Patient:</span> {note.patient_name}
      </p>
      <p className="note-content">
        <span>Appointment Date:</span>{" "}
        {note.appointment_details.appointment_datetime}
      </p>
      <p className="note-content">
        <span>Healthcare Professional:</span>{" "}
        {note.appointment_details.healthcare_professional_name}
      </p>
      <p className="note-content">
        <span>Added by:</span> {note.added_by}
      </p>
      <p className="note-content">
        <span>Added On:</span> {formattedDate}
      </p>
      <p className="note-content">
        <span>Note:</span> {note.note_content}
      </p>
      {!isPatient && (
        <button className="delete-button" onClick={handleDeleteClick}>
          Delete
        </button>
      )}
    </div>
  );
}

export default Note;