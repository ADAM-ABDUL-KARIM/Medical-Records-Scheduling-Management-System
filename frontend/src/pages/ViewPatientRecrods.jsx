import { useState, useEffect } from "react";
import api from "../api";
import ViewRecord from "../components/ViewRecord";
import "../styles/Record.css"; // Updated import
import Pagination from "../components/Pagination";

function ViewPatientRecords() {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10; // Number of records to display per page

    useEffect(() => {
        getPatients();
    }, []);

    const getPatients = async () => {
        try {
            const res = await api.get("/api/patient/");
            setPatients(res.data);
            console.log(res.data);
        } catch (err) {
            alert(err);
        }
    };

    const deletePatient = async (id) => {
        try {
            const res = await api.delete(`/api/patient/delete/${id}/`);
            if (res.status === 204) {
                alert("Patient Deleted");
                getPatients();
            } else {
                alert("Failed to delete Patient");
            }
        } catch (error) {
            alert(error);
        }
    };

    const savePatient = async (updatedPatient) => {
        try {
            // Exclude the user field from the update request
            const { user, ...patientData } = updatedPatient;
            
            const res = await api.put(`/api/patient/${updatedPatient.file_number}/`, patientData);
            if (res.status === 200) {
                alert("Patient Updated");
                getPatients();
            } else {
                alert("Failed to update Patient");
            }
        } catch (error) {
            alert(error);
        }
    };

    const filteredPatients = patients.filter(patient =>
        `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredPatients.slice(indexOfFirstRecord, indexOfLastRecord);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="view-patient-records">   
        
        <h1>View Patient Records</h1>
            <input
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
            />
            <div className="records-container">
                {currentRecords.length > 0 ? (
                    currentRecords.map((patient) => (
                        <ViewRecord
                            key={patient.file_number}
                            Record={patient}
                            onDelete={deletePatient}
                            onSave={savePatient}
                        />
                    ))
                ) : (
                    <p className="no-results">No records found</p>
                )}
            </div>
            <Pagination
                recordsPerPage={recordsPerPage}
                totalRecords={filteredPatients.length}
                paginate={paginate}
                currentPage={currentPage}
            />
        </div>
    );
}

export default ViewPatientRecords;