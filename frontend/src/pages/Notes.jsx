import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api";
import Note from "../components/Note";
import "../styles/Notes.css";
import Pagination from "../components/Pagination";
import BackArrow from "../components/BackArrow";

function Notes({ isPatient }) {
  const [notes, setNotes] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteDate, setNoteDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5; // Number of records to display per page
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const page = parseInt(searchParams.get("page")) || 1;
    setCurrentPage(page);
    getNotes(page);
    if (!isPatient) {
      getPatients();
    }
  }, [location.search, isPatient]);

  useEffect(() => {
    if (selectedPatient) {
      getAppointments(selectedPatient);
    }
  }, [selectedPatient]);

  const getNotes = async (page) => {
    try {
      const res = await api.get(`/api/notes/?page=${page}`);
      setNotes(res.data);
      console.log(res.data);
    } catch (err) {
      alert(err);
    }
  };

  const getPatients = () => {
    api
      .get("/api/patient/")
      .then((res) => res.data)
      .then((data) => {
        setPatients(data);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  const getAppointments = (patientId) => {
// select app based on the patient file number ->pk 
    api
      .get(`/api/appointment/?file_number=${patientId}`)
      .then((res) => res.data)
      .then((data) => {
        setAppointments(data);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  const deleteNote = async (id) => {
    try {
      const res = await api.delete(`/api/notes/delete/${id}/`);
      if (res.status === 204) {
        alert("Note Deleted");
        getNotes(currentPage);
      } else {
        alert("Failed to delete note");
      }
    } catch (error) {
      alert(error);
    }
  };

  const createNote = (e) => {
    e.preventDefault();
    api
      .post("/api/notes/", {
        patient: selectedPatient,
        appointment: selectedAppointment,
        note_date: noteDate,
        note_content: noteContent,
      })
      .then((res) => {
        if (res.status === 201) alert("Note created");
        else alert("Failed to create note");
        getNotes(currentPage);
      })
      .catch((err) => alert(err));
  };

  const filteredNotes = notes.filter((note) =>
    note.patient_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredNotes.slice(indexOfFirstRecord, indexOfLastRecord);

  const paginate = (pageNumber) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page", pageNumber);
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  return (
    <div className="view-notes">
      {isPatient && <BackArrow />}
      <h1>Notes</h1>
      {!isPatient && (
        <input
          type="text"
          placeholder="Search by patient name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      )}
      <div className="notes-container">
        {currentRecords.length > 0 ? (
          currentRecords.map((note) => (
            <Note
              isPatient={isPatient}
              key={note.note_id}
              note={note}
              onDelete={deleteNote}
            />
          ))
        ) : (
          <p className="no-results">No notes found</p>
        )}
      </div>
      <Pagination
        recordsPerPage={recordsPerPage}
        totalRecords={filteredNotes.length}
        currentPage={currentPage}
        paginate={paginate}
      />
      {!isPatient && (
        <>
          <h2>Create a Note</h2>
          <form onSubmit={createNote} className="noteForm">
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
              disabled={!selectedPatient}
            >
              <option value="">Select an appointment</option>
              {appointments.map((appointment) => (
                <option
                  key={appointment.appointment_id}
                  value={appointment.appointment_id}
                >
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
        </>
      )}
    </div>
  );
}

export default Notes;