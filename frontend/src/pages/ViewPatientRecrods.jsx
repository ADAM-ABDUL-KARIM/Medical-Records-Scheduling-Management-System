import { useState, useEffect } from "react";
import api from "../api";
import ViewRecord from "../components/ViewRecord";

function ViewPatientRecords() {
    const [patients, setPatients] = useState([]);

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