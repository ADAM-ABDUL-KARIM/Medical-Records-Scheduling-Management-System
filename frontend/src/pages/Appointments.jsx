import { useEffect, useState } from "react";
import api from "../api";
import AppointmentsCalendar from "../components/Calendar";
import "../styles/InputForms.css"; // Import the updated CSS
import Availability from "../components/Availability";
import BackArrow from "../components/BackArrow";

function Appointments({ isPatient }) {
  const [patients, setPatients] = useState([]);
  const [healthcareprofessional, setHealthcareprofessional] = useState([]);
  const [selectedHealthcareProfessional, setSelectedHealthcareProfessional] =
    useState("");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedAppointmentDateTime, setAppointmentDateTime] = useState("");
  const [availabilities, setAvailabilities] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  useEffect(() => {
    getPatients();
    getHealthPro();
  }, []);

  const getPatients = () => {
    api
      .get("api/patient/")
      .then((res) => res.data)
      .then((data) => {
        setPatients(data);
        console.log(data);
      })
      .catch((err) => setMessage(`Error: ${err.message}`));
  };

  const getHealthPro = () => {
    api
      .get("api/healthpro/")
      .then((res) => res.data)
      .then((data) => {
        setHealthcareprofessional(data);
        console.log(data);
      })
      .catch((err) => setMessage(`Error: ${err.message}`));
  };

  const getAvailabilities = (healthproId) => {
    api
      .get(`/api/availability/?healthpro=${healthproId}`)
      .then((res) => res.data)
      .then((data) => {
        setAvailabilities(data);
        console.log(data);
      })
      .catch((err) => setMessage(`Error: ${err.message}`));
  };

  const getAppointments = () => {
    api
      .get(`/api/appointment/`)
      .then((res) => res.data)
      .then((data) => {
        setAppointments(data);
        console.log(data);
      })
      .catch((err) => setMessage(`Error: ${err.message}`));
  };

  const createAppointment = (e) => {
    e.preventDefault();

    const selectedDateTime = new Date(selectedAppointmentDateTime);
    const selectedTime = selectedDateTime.getHours() * 60 + selectedDateTime.getMinutes();

    // Validate the selected appointment date against the availability dates
    const isAfterStartDate = availabilities.some((availability) => {
      const availabilityStartDate = new Date(availability.availability_date);
      return selectedDateTime >= availabilityStartDate;
    });

    if (!isAfterStartDate) {
      setMessageType("error");
      setMessage(
        "The selected appointment date is before the start date of the healthcare professional's availability."
      );
      return;
    }

    // Validate the selected appointment time against the availability times
    const isWithinAvailability = availabilities.some((availability) => {
      const availabilityStart = new Date(availability.availability_date);
      const availabilityEnd = new Date(availability.availability_date);
      availabilityEnd.setHours(
        availability.end_time.split(":")[0],
        availability.end_time.split(":")[1]
      );

      const availabilityStartTime = availabilityStart.getHours() * 60 + availabilityStart.getMinutes();
      const availabilityEndTime = availabilityEnd.getHours() * 60 + availabilityEnd.getMinutes();

      return (
        selectedTime >= availabilityStartTime &&
        selectedTime <= availabilityEndTime
      );
    });

    if (!isWithinAvailability) {
      setMessageType("error");
      setMessage(
        "The selected appointment time is not within the availability range of the healthcare professional."
      );
      return;
    }

    // Check for conflicts with existing appointments on the same day
    const hasConflict = appointments.some((appointment) => {
      const appointmentStart = new Date(appointment.appointment_datetime);
      const appointmentEnd = new Date(appointment.appointment_datetime);
      appointmentEnd.setMinutes(appointmentEnd.getMinutes() + 45);

      const appointmentStartTime = appointmentStart.getHours() * 60 + appointmentStart.getMinutes();
      const appointmentEndTime = appointmentEnd.getHours() * 60 + appointmentEnd.getMinutes();

      return (
        selectedDateTime.toDateString() === appointmentStart.toDateString() &&
        selectedTime >= appointmentStartTime &&
        selectedTime < appointmentEndTime
      );
    });

    if (hasConflict) {
      setMessageType("error");
      setMessage(
        "The selected appointment time conflicts with an existing appointment. Please pick a time at least 45 minutes after the conflicting appointment."
      );
      return;
    }

    api
      .post("/api/appointment/", {
        healthcare_professional: selectedHealthcareProfessional,
        patient: selectedPatient,
        appointment_datetime: selectedAppointmentDateTime,
      })
      .then((res) => {
        if (res.status === 201) {
        alert("Success")
          window.location.reload();

        } else {
          setMessageType("error");
          setMessage("Failed to create the appointment.");
        }
      })
      .catch((err) => {
        setMessageType("error");
        if (err.response && err.response.data && err.response.data.detail) {
          setMessage(err.response.data.detail);
        } else {
          setMessage("An error occurred while creating the appointment.");
        }
      });
  };

  return (
    <div className="appointments-container">
      { <BackArrow />}
      <AppointmentsCalendar isPatient={isPatient} />
      {!isPatient && (
        <div className="form-and-availability">
          <div className="form-container">
            <h2>Set an Appointment</h2>
            {message && (
              <p className={`message ${messageType}`}>{message}</p>
            )}
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

              <label htmlFor="healthcareprofessional">
                Healthcare Professionals
              </label>
              <select
                id="healthcareprofessional"
                name="healthcareprofessional"
                required
                onChange={(e) => {
                  setSelectedHealthcareProfessional(e.target.value);
                  getAvailabilities(e.target.value);
                  getAppointments(e.target.value);
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
                <Availability
                  availability={availability}
                  key={availability.availability_id}
                  showDeleteButton={false}
                />
              ))
            ) : (
              <p>Select a Healthcare Professional</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Appointments;