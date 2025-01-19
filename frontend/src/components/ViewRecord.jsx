import { useState, useRef, useEffect } from "react";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import "../styles/Record.css";

function ViewRecord({ Record, onDelete, onSave }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedRecord, setEditedRecord] = useState({ ...Record });
    const [isExpanded, setIsExpanded] = useState(false);
    const detailsRef = useRef(null);

    useEffect(() => {
        if (isExpanded) {
            detailsRef.current.style.height = `${detailsRef.current.scrollHeight}px`;
        } else {
            detailsRef.current.style.height = "0px";
        }
    }, [isExpanded]);

    const handleDeleteClick = () => {
        confirmDelete(Record.file_number);
    };

    const confirmDelete = (id) => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure you want to delete this record?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => onDelete(id)
                },
                {
                    label: 'No',
                    onClick: () => {}
                }
            ]
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedRecord((prev) => ({ ...prev, [name]: value }));
    };

    const handleDiagnosisChange = (index, value) => {
        const updatedDiagnosis = editedRecord.diagnosis.map((d, i) =>
            i === index ? { ...d, diagnosis: value } : d
        );
        setEditedRecord((prev) => ({ ...prev, diagnosis: updatedDiagnosis }));
    };

    const handleMedicationChange = (index, value) => {
        const updatedMedication = editedRecord.medication.map((m, i) =>
            i === index ? { ...m, medication_name: value } : m
        );
        setEditedRecord((prev) => ({ ...prev, medication: updatedMedication }));
    };

    const addDiagnosisField = () => {
        setEditedRecord((prev) => ({
            ...prev,
            diagnosis: [...prev.diagnosis, { diagnosis: "" }],
        }));
    };

    const removeDiagnosisField = (index) => {
        setEditedRecord((prev) => ({
            ...prev,
            diagnosis: prev.diagnosis.filter((_, i) => i !== index),
        }));
    };

    const addMedicationField = () => {
        setEditedRecord((prev) => ({
            ...prev,
            medication: [...prev.medication, { medication_name: "" }],
        }));
    };

    const removeMedicationField = (index) => {
        setEditedRecord((prev) => ({
            ...prev,
            medication: prev.medication.filter((_, i) => i !== index),
        }));
    };

    const handleCancel = () => {
        setEditedRecord({ ...Record });
        setIsEditing(false);
    };

    const handleSave = () => {
        const updatedRecord = {
            ...editedRecord,
            diagnosis: editedRecord.diagnosis.map((d) => ({ diagnosis: d.diagnosis })),
            medication: editedRecord.medication.map((m) => ({ medication_name: m.medication_name })),
        };
        onSave(updatedRecord);
        setIsEditing(false);
    };

    return (
        <div className="rec-container">
            <div className="rec-header" onClick={() => setIsExpanded(!isExpanded)}>
                
                <p className="rec-title">
                    {Record.first_name} {Record.last_name} 
                </p>
               
                <span className="arrow">{isExpanded ? "▲" : "▼"}</span>
            </div>
            <div className={`rec-details ${isExpanded ? "expanded" : ""}`} ref={detailsRef}>
                {isEditing ? (
                    <>
                        <input
                            className="rec-content"
                            name="first_name"
                            value={editedRecord.first_name}
                            onChange={handleChange}
                        />
                        <input
                            className="rec-content"
                            name="last_name"
                            value={editedRecord.last_name}
                            onChange={handleChange}
                        />
                        <input
                            className="rec-content"
                            name="dob"
                            type="date"
                            value={editedRecord.dob}
                            onChange={handleChange}
                        />
                        <input
                            className="rec-content"
                            name="nationality"
                            value={editedRecord.nationality}
                            onChange={handleChange}
                        />
                        <input
                            className="rec-content"
                            name="marital_status"
                            value={editedRecord.marital_status}
                            onChange={handleChange}
                        />
                        <input
                            className="rec-content"
                            name="phone_number"
                            value={editedRecord.phone_number}
                            onChange={handleChange}
                            />
                            <input
                                className="rec-content"
                                name="gender"
                                value={editedRecord.gender}
                                onChange={handleChange}
                            />
                            <input
                                className="rec-content"
                                name="height"
                                type="number"
                                value={editedRecord.height}
                                onChange={handleChange}
                            />
                            <input
                                className="rec-content"
                                name="educational_level"
                                value={editedRecord.educational_level}
                                onChange={handleChange}
                            />
                            <input
                                className="rec-content"
                                name="employment_status"
                                value={editedRecord.employment_status}
                                onChange={handleChange}
                            />
                            <input
                                className="rec-content"
                                name="dominant_hand"
                                value={editedRecord.dominant_hand}
                                onChange={handleChange}
                            />
                            <input
                                className="rec-content"
                                name="start_date"
                                type="date"
                                value={editedRecord.start_date}
                                onChange={handleChange}
                            />
                            <input
                                className="rec-content"
                                name="activity_level"
                                value={editedRecord.activity_level}
                                onChange={handleChange}
                            />
                            <label>
                                Recovered:
                                <input
                                    type="checkbox"
                                    name="is_recovered"
                                    checked={editedRecord.is_recovered}
                                    onChange={(e) =>
                                        setEditedRecord((prev) => ({
                                            ...prev,
                                            is_recovered: e.target.checked,
                                        }))
                                    }
                                />
                            </label>
                            <fieldset>
                                <legend>Diagnosis</legend>
                                {editedRecord.diagnosis.map((d, index) => (
                                    <div key={index} className="dynamic-field">
                                        <input
                                            type="text"
                                            value={d.diagnosis}
                                            onChange={(e) =>
                                                handleDiagnosisChange(index, e.target.value)
                                            }
                                            placeholder={`Diagnosis ${index + 1}`}
                                            required
                                        />
                                        {editedRecord.diagnosis.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeDiagnosisField(index)}
                                                className="remove-button"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={addDiagnosisField} className="add-button">
                                    Add Diagnosis
                                </button>
                            </fieldset>
                            <fieldset>
                                <legend>Medication</legend>
                                {editedRecord.medication.map((m, index) => (
                                    <div key={index} className="dynamic-field">
                                        <input
                                            type="text"
                                            value={m.medication_name}
                                            onChange={(e) =>
                                                handleMedicationChange(index, e.target.value)
                                            }
                                            placeholder={`Medication ${index + 1}`}
                                            required
                                        />
                                        {editedRecord.medication.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeMedicationField(index)}
                                                className="remove-button"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={addMedicationField} className="add-button">
                                    Add Medication
                                </button>
                            </fieldset>
                            <button className="save-button" onClick={handleSave}>
                                Save
                            </button>
                            <button className="save-button" onClick={handleCancel}>
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <p className="rec-content">
                                <b>First Name:</b> {Record.first_name}
                            </p>
                            <p className="rec-content">
                                <b>Last Name: </b>
                                {Record.last_name}
                            </p>
                            <p className="rec-content">
                                <b>Date Of Birth: </b>
                                {Record.dob}
                            </p>
                            <p className="rec-content">
                                <b>Nationality: </b>
                                {Record.nationality}
                            </p>
                            <p className="rec-content">
                                <b>Marital Status:</b> {Record.marital_status}
                            </p>
                            <p className="rec-content">
                                <b>Phone Number:</b> {Record.phone_number}
                            </p>
                            <p className="rec-content">
                                <b>Gender: </b>
                                {Record.gender}
                            </p>
                            <p className="rec-content">
                                <b>Height:</b> {Record.height} cm
                            </p>
                            <p className="rec-content">
                                <b>Educational Level: </b>
                                {Record.educational_level}
                            </p>
                            <p className="rec-content">
                                <b>Employment Status: </b>
                                {Record.employment_status}
                            </p>
                            <p className="rec-content">
                                <b>Dominant Hand: </b>
                                {Record.dominant_hand}
                            </p>
                            <p className="rec-content">
                                <b>Start Date: </b>
                                {Record.start_date}
                            </p>
                            <p className="rec-content">
                                <b>Activity Level:</b> {Record.activity_level}
                            </p>
                            <p className="rec-content">
                                <b>Recovered:</b>
                                {Record.is_recovered ? "Yes" : "No"}
                            </p>
                            <p className="rec-content">
                                <b>Diagnosis:</b> {Record.diagnosis.map((d) => d.diagnosis).join(", ")}
                            </p>
                            <p className="rec-content">
                                <b>Medication:</b> {Record.medication.map((m) => m.medication_name).join(", ")}
                            </p>
                            <button
                                className="edit-button"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit
                            </button>
                        </>
                    )}
                    <button
                        className="delete-button"
                        onClick={handleDeleteClick}
                    >
                        Delete
                    </button>
                </div>
            </div>
        );
        }
        
        export default ViewRecord;