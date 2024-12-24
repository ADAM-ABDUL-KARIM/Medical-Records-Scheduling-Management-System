import { useState, useEffect } from "react";
import api from "../api"
import Note from "../components/Note"
import "../styles/Home.css"
function Home() {

    // keep track of notes as when we open the page we will get of the notes from the server
    const [notes, setNotes] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");

    useEffect(() => {
        getNotes();
    }, [])
    // get all notes
    const getNotes = () => {
        api.get("/api/notes/")
            .then((res) => res.data)
            .then((data) => { setNotes(data); console.log(data) })
            .catch((err) => alert(err));
    };

    const deleteNote = (id) => {
        api.delete(`/api/notes/delete/${id}/`).then((res) => {
            if (res.status === 204) alert("Note Deleted")
            else alert("Failed to delete note")
            getNotes()
        }).catch((error) => alert(error))
        // update the screen 
        // can be optimized
        
    };

    const createNote = (e) => {
        e.preventDefault();
        
        api.post("/api/notes/", { content, title })
        .then((res) => {

            if (res.status === 201) alert("note created")
            else alert("failed to make note")
            getNotes();

        }).catch((err) => alert(err))
            };
    return <div>

        <div>
            <h2>Notes</h2>
            {/* rendering notes */}
            
            {notes.map((note)=> (
                <Note note = {note} onDelete={deleteNote} key={note.id} />))}


        </div>
        <h2>Create a Note</h2>
        <form onSubmit={createNote}>
            <label htmlFor="title">Title:</label>
            <br />
            <input type="text" id="title" name="title" required onChange={(e) => setTitle(e.target.value)} value={title} />
            <label htmlFor="content">Content:</label>
            <br />
           <textarea name="content" id="content" required value={content} onChange={(e)=>setContent(e.target.value)}></textarea>
           <br />
           <input type="submit" value="submit"></input>
        </form>

    </div>

}

export default Home