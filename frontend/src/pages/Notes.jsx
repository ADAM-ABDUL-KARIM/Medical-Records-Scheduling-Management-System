import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note";
import "../styles/Notes.css";

function Notes() {
    const [notes, setNotes] = useState([]);
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState("");
    const [selectedAppointment, setSelectedAppointment] = useState("");
    const [noteContent, setNoteContent] = useState("");
    const [noteDate, setNoteDate] = useState("");
    const [username, setUsername] = useState("");

    useEffect(() => {
        getNotes();
        getPatients();
        getAppointments();
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

    const getNotes = () => {
        api.get("/api/notes/")
            .then((res) => res.data)
            .then((data) => {
                setNotes(data);
                console.log(data);
            })
            .catch((err) => alert(err + " Refresh your Token - log in again with your credentials"));
    };

    const getPatients = () => {
        api.get("/api/patient/")
            .then((res) => res.data)
            .then((data) => {
                setPatients(data);
                console.log(data);
            })
            .catch((err) => alert(err));
    };

    const getAppointments = () => {
        api.get("/api/appointment/")
            .then((res) => res.data)
            .then((data) => {
                setAppointments(data);
                console.log(data);
            })
            .catch((err) => alert(err));
    };

    const deleteNote = (id) => {
        api.delete(`/api/notes/delete/${id}/`).then((res) => {
            if (res.status === 204) alert("Note Deleted");
            else alert("Failed to delete note");
            getNotes();
        }).catch((error) => alert(error));
    };

    const createNote = (e) => {
        e.preventDefault();
        api.post("/api/notes/", {
            patient: selectedPatient,
            appointment: selectedAppointment,
            note_date: noteDate,
            note_content: noteContent
        })
            .then((res) => {
                if (res.status === 201) alert("Note created");
                else alert("Failed to create note");
                getNotes();
            }).catch((err) => alert(err));
    };

    return (
        <div>
            <div>
                <h2>Notes</h2>
                {notes.map((note) => (
                    <Note note={note} onDelete={deleteNote} key={note.note_id} />
                ))}
            </div>
            <h2>Create a Note</h2>
            <form onSubmit={createNote}>
                <label htmlFor="patient">Patient:</label>
                <br />
                <select
                    id="patient"
                    name="patient"
                    required
                    onChange={(e) => setSelectedPatient(e.target.value)}
                    value={selectedPatient}
                >
                    <option value="">Select a patient</option>
                    {patients.map((patient) => (
                        <option key={patient.file_number} value={patient.file_number}>
                            {patient.first_name} {patient.last_name}
                        </option>
                    ))}
                </select>
                <br />
                <label htmlFor="appointment">Appointment:</label>
                <br />
                <select
                    id="appointment"
                    name="appointment"
                    required
                    onChange={(e) => setSelectedAppointment(e.target.value)}
                    value={selectedAppointment}
                >
                    <option value="">Select an appointment</option>
                    {appointments.map((appointment) => (
                        <option key={appointment.appointment_id} value={appointment.appointment_id}>
                            {appointment.appointment_datetime}
                        </option>
                    ))}
                </select>
                <br />
                <label htmlFor="note_date">Date:</label>
                <br />
                <input
                    type="date"
                    id="note_date"
                    name="note_date"
                    required
                    onChange={(e) => setNoteDate(e.target.value)}
                    value={noteDate}
                />
                <br />
                <label htmlFor="content">Content:</label>
                <br />
                <textarea
                    name="content"
                    id="content"
                    required
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                ></textarea>
                <br />
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
}

export default Notes;