import React, { useState, useEffect } from "react";
import api from "../api";
import "../styles/Export.css";
import BackArrow from "../components/BackArrow";
function ExportPatients({isPatient}) {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [exportFormat, setExportFormat] = useState("pdf");
  const [errorMessage, setErrorMessage] = useState(""); // Add state for error message

  useEffect(() => {
    getPatients();
  }, []);

  const getPatients = async () => {
    try {
      const res = await api.get("/api/patient/");
      setPatients(res.data);
    } catch (err) {
      setErrorMessage("Failed to load patients.");
    }
  };

  const handleExport = async () => {
    if (!selectedPatient) {
      setErrorMessage("Please select a patient to export.");
      return;
    }

    try {
      const endpoint = exportFormat === "pdf" ? "pdf" : "excel";
      const response = await api.get(
        `/api/export/patient/${endpoint}/${selectedPatient}/`,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      if(endpoint === "excel")
      link.setAttribute("download", `Patient_File Number_${selectedPatient}.xlsx`);
      else
      link.setAttribute("download", `Patient_File Number_${selectedPatient}.pdf`);
      
      document.body.appendChild(link);
      link.click();
      setErrorMessage(""); // Clear error message on successful export
    } catch (error) {
      setErrorMessage(
        `Failed to export patients to ${exportFormat.toUpperCase()}`
      );
    }
  };

  return (
    <div className="export-container">
      {isPatient && <BackArrow />}
      <h2>Export Patients</h2>
      <select
        value={selectedPatient}
        onChange={(e) => setSelectedPatient(e.target.value)}
      >
        <option value="">Select a Patient</option>
        {patients.map((patient) => (
          <option key={patient.file_number} value={patient.file_number}>
            {patient.first_name} {patient.last_name}
          </option>
        ))}
      </select>
      <select
        value={exportFormat}
        onChange={(e) => setExportFormat(e.target.value)}
      >
        <option value="pdf">PDF</option>
        <option value="excel">Excel</option>
      </select>
      <button onClick={handleExport}>Export</button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}{" "}
      {/* Display error message */}
    </div>
  );
}

export default ExportPatients;
