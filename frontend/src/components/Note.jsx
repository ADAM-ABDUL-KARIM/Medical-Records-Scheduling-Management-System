import React from "react";
import "../styles/Note.css"
function Note({note,onDelete}) { 

    const formattedData = new Date(note.created_at).toLocaleDateString("en-US")

    return <div className="note-container">
            <p className="note-title">{note.title}</p>
            <p className="note-content">{note.content}</p>
            <p className="note-date">{formattedData}</p>
            
            <button className="delete-button" onClick={()=> onDelete(note.id)}>Delete</button>

    </div>
}
export default Note