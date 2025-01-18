import { useEffect, useState } from "react";
import api from "../api";
import Appointment from "../components/Appointment";
import Availability from "../components/Availability";

function Appointments() {
    const [patients, setPatients] = useState([]);
    const [healthcareprofessional, setHealthcareprofessional] = useState([]);
    const [selectedHealthcareProfessional, setSelectedHealthcareProfessional] = useState("");
    const [selectedPatient, setSelectedPatient] = useState("");
    const [selectedAppointmentDateTime, setAppointmentDateTime] = useState("");
    const [appointments, setAppointments] = useState([]);
    const [availabilities, setAvailabilities] = useState([]);

    useEffect(() => {
        getPatients();
        getHealthPro();
        getAppointments();
        getAvailabilities();
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

    const getAvailabilities = (healthcareProfessionalId) => {
        api.get(`/api/availability/?healthcare_professional=${healthcareProfessionalId}`)
            .then((res) => res.data)
            .then((data) => {
                setAvailabilities(data);
                console.log(data);
            })
            .catch((err) => alert(err));
    };

    const getAppointments = () => {
        api.get("/api/appointment/")
            .then((res) => res.data)
            .then((data) => { setAppointments(data); console.log(data) })
            .catch((err) => alert(err));
    };

    const deleteAppointment = (id) => {
        api.delete(`/api/appointment/delete/${id}/`).then((res) => {
            if (res.status === 204) alert("Appointment Deleted");
            else alert("Failed to delete Appointment");
            getAppointments();
        }).catch((error) => alert(error));
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
            getAppointments();
        }).catch((err) => {
            if (err.response && err.response.data && err.response.data.detail) {
                alert(err.response.data.detail);
            } else {
                alert("An error occurred while creating the appointment.");
            }
        });
    };

    return (
        <div>
            <div>
            {
                availabilities.map((availability) => (
                    <Availability availability = {availability} key = {availability.availability_id}   />
                ))
            }
            </div>

            <div>
                <h2>Appointments</h2>
                {
                    appointments.map((appointment) => (
                        <Appointment appointment={appointment} onDelete={deleteAppointment} key={appointment.appointment_id} />
                    ))
                }
            </div>

            <h2>Set an Appointment</h2>
            <form onSubmit={createAppointment}>
                <label htmlFor="patient">Patient</label>
                <br />
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
                <br />
                <label htmlFor="healthcareprofessional">Healthcare Professionals</label>
                <br />
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
                <br />
                <label htmlFor="appointment_datetime">Date:</label>
                <br />
                <input
                    type="datetime-local"
                    id="appointment_datetime"
                    name="appointment_datetime"
                    required
                    onChange={(e) => setAppointmentDateTime(e.target.value)}
                    value={selectedAppointmentDateTime}
                />
                <br />
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
}

export default Appointments;