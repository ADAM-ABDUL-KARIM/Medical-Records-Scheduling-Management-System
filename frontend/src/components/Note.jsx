import React from "react";
import "../styles/Note.css"
function Note({note,onDelete}) { 

    const formattedData = new Date(note.note_date).toLocaleDateString("en-UK")

    return <div className="note-container">
            <p className="note-title">{note.patient}</p>
            <p className="note-content">{note.appointment}</p>
            <p className="note-content">{note.added_by}</p>
            <p className="note-date">{formattedData}</p>
            <p className="note-content">{note.note_content}</p>

            <button className="delete-button" onClick={()=> onDelete(note.note_id)}>Delete</button>

    </div>
}
export default Note