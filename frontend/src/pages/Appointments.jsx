import { useEffect, useState } from "react";
import api from "../api";
import AppointmentsCalendar from "../components/Calendar";
import "../styles/InputForms.css"; // Import the updated CSS
import Availability from "../components/Availability";

function Appointments() {
    const [patients, setPatients] = useState([]);
    const [healthcareprofessional, setHealthcareprofessional] = useState([]);
    const [selectedHealthcareProfessional, setSelectedHealthcareProfessional] = useState("");
    const [selectedPatient, setSelectedPatient] = useState("");
    const [selectedAppointmentDateTime, setAppointmentDateTime] = useState("");
    const [availabilities, setAvailabilities] = useState([]);

    useEffect(() => {
        getPatients();
        getHealthPro();
    }, []);

    const getPatients = () => {
        api.get("api/patient/")
            .then((res) => res.data)
            .then((data) => { setPatients(data); console.log(data) })
            .catch((err) => alert(err));
    };

    const getHealthPro = () => {
        api.get("api/healthpro/")
            .then((res) => res.data)
            .then((data) => {
                setHealthcareprofessional(data);
                console.log(data);
            })
            .catch((err) => alert(err));
    };

    const getAvailabilities = () => {
        api.get(`/api/availability/`)
            .then((res) => res.data)
            .then((data) => { setAvailabilities(data); console.log(data); })
            .catch((err) => alert(err));
    };

    const createAppointment = (e) => {
        e.preventDefault();

        // Validate the selected appointment time against the availability times
        const selectedDateTime = new Date(selectedAppointmentDateTime);
        const isWithinAvailability = availabilities.some((availability) => {
            const availabilityStart = new Date(availability.availability_date);
            const availabilityEnd = new Date(availability.availability_date);
            availabilityEnd.setHours(availability.end_time.split(":")[0], availability.end_time.split(":")[1]);
            console.log("availabilityStart" + availabilityStart);
            console.log("availabilityEnd" + availabilityEnd);
            
            return selectedDateTime >= availabilityStart && selectedDateTime <= availabilityEnd;
        });

        if (!isWithinAvailability) {
            alert("The selected appointment time is not within the availability range of the healthcare professional. "+ selectedDateTime);
            return;
        }

        api.post("/api/appointment/", {
            healthcare_professional: selectedHealthcareProfessional,
            patient: selectedPatient,
            appointment_datetime: selectedAppointmentDateTime
        }).then((res) => {
            if (res.status === 201) alert("Appointment Created");
            else alert("Failed to create the appointment");
         
        }).catch((err) => {
            if (err.response && err.response.data && err.response.data.detail) {
                alert(err.response.data.detail);
            } else {
                alert("An error occurred while creating the appointment.");
            }
        });
    };

    return (
        <div className="appointments-container">
            <AppointmentsCalendar />
            <div className="form-and-availability">
                <div className="form-container">
                    <h2>Set an Appointment</h2>
                    <form onSubmit={createAppointment}>
                        <label htmlFor="patient">Patient</label>
                        <select
                            id="patient"
                            name="patient"
                            required
                            onChange={(e) => setSelectedPatient(e.target.value)}
                            value={selectedPatient}
                        >
                            <option value="">Select a Patient</option>
                            {patients.map((patient) => (
                                <option key={patient.file_number} value={patient.file_number}>
                                    {patient.first_name} {patient.last_name}
                                </option>
                            ))}
                        </select>

                        <label htmlFor="healthcareprofessional">Healthcare Professionals</label>
                        <select
                            id="healthcareprofessional"
                            name="healthcareprofessional"
                            required
                            onChange={(e) => {
                                setSelectedHealthcareProfessional(e.target.value);
                                getAvailabilities(e.target.value);
                            }}
                            value={selectedHealthcareProfessional}
                        >
                            <option value="">Select a Healthcare Professional</option>
                            {healthcareprofessional.map((healthpro) => (
                                <option key={healthpro.id} value={healthpro.id}>
                                    {healthpro.first_name} {healthpro.last_name}
                                </option>
                            ))}
                        </select>

                        <label htmlFor="appointment_datetime">Date</label>
                        <input
                            type="datetime-local"
                            id="appointment_datetime"
                            name="appointment_datetime"
                            required
                            onChange={(e) => setAppointmentDateTime(e.target.value)}
                            value={selectedAppointmentDateTime}
                        />

                        <button type="submit">Submit</button>
                    </form>
                </div>

                <div className="availabilities-container">
                    <h2>Availabilities</h2>
                    {availabilities.length > 0 ? (
                        availabilities.map((availability) => (
                            <Availability availability={availability} key={availability.availability_id} showDeleteButton={false} />
                        ))
                    ) : (
                        <p>Select a Healthcare Professional</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Appointments;