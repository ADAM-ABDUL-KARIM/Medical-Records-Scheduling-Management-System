import { useState, useEffect } from "react";
import api from "../api";
import ViewRecord from "../components/ViewRecord";

function ViewPatientRecords() {
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        getPatients();
    }, []);

    const getPatients = () => {
        api.get("/api/patient/")
            .then((res) => res.data)
            .then((data) => {
                setPatients(data);
                console.log(data);
            })
            .catch((err) => alert(err));
    };

    const deletePatient = (id) => {
        api.delete(`/api/patient/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) alert("Patient Deleted");
                else alert("Failed to delete Patient");
                getPatients();
            })
            .catch((error) => alert(error));
    };

    const savePatient = (updatedPatient) => {
        api.put(`/api/patient/${updatedPatient.file_number}/`, updatedPatient)
            .then((res) => {
                if (res.status === 200) {
                    alert("Patient Updated");
                    getPatients();
                } else {
                    alert("Failed to update Patient");
                }
            })
            .catch((error) => alert(error));
    };

    return (
        <div>
            <h2>View Patient Records</h2>
            <div className="records-container">
                {patients.map((patient) => (
                    <ViewRecord
                        key={patient.file_number}
                        Record={patient}
                        onDelete={deletePatient}
                        onSave={savePatient}
                    />
                ))}
            </div>
        </div>
    );
}

export default ViewPatientRecords;