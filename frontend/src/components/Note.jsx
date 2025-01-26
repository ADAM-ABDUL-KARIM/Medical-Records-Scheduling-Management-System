import React, { useState, useRef, useEffect } from "react";
import "../styles/Note.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

function Note({ note, onDelete, isPatient }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const detailsRef = useRef(null);

  useEffect(() => {
    if (isExpanded) {
      detailsRef.current.style.height = `${detailsRef.current.scrollHeight}px`;
    } else {
      detailsRef.current.style.height = "0px";
    }
  }, [isExpanded]);

  const formattedDate = new Date(note.note_date).toLocaleDateString("en-US", {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = new Date(note.note_date).toLocaleTimeString("en-US", {
    hour: '2-digit',
    minute: '2-digit',

  });
  const formatAPP = new Date(note.appointment_details.appointment_datetime).toLocaleDateString("en-US", {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
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
      
      <div className="note-header" onClick={() => setIsExpanded(!isExpanded)}>
        <p className="note-title">
          {note.patient_name} - {formatAPP} with {note.appointment_details.healthcare_professional_name}
        </p>
        <span className="arrow">{isExpanded ? "▲" : "▼"}</span>
      </div>
      <div className={`note-details ${isExpanded ? "expanded" : ""}`} ref={detailsRef}>
        <p className="note-content">
          <span>Appointment Time:</span> {formatAPP} {formattedTime}
        </p>
        <p className="note-content">
          <span>Healthcare Professional:</span> {note.appointment_details.healthcare_professional_name}
        </p>
        <p className="note-content">
          <span>Added by:</span> {note.added_by}
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
    </div>
  );
}

export default Note;