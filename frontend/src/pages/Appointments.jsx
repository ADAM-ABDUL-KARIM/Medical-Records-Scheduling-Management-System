import {useEffect, useState} from "react";
import api from "../api";
import Appointment from "../components/Appointment"
function Appointments () { 
    const [patients, setPatients] = useState([]);
    const [healthcareprofessional, setHealthcareprofessional] = useState([]);
    const [Selectedhealthcareprofessional, setSelectedHealthcareprofessional] = useState("");
    
    const [selectedPatient, setSelectedPatient] = useState("");
    const [selectedAppointmentDateTime, setAppointmentDateTime] = useState([]);
   const [appointments, setAppointments] = useState([]);
    

    useEffect(()=>{
        getPatients();
        getHealthPro();
      
        getAppointments();
    },[]);

    const getPatients = () => {

        api.get("api/patient/")
        .then((res)=>res.data)
        .then((data)=> {setPatients(data); console.log(data)})
        .catch((err)=> alert(err));

    };

    const getHealthPro = () => {

        api.get("api/healthpro/")
        .then((res)=>res.data)
        .then((data)=> {setHealthcareprofessional(data); console.log(data)})
        .catch((err)=> alert(err));

    };
    const getAppointments = () => {
        api.get("/api/appointment/")
            .then((res) => res.data)
            .then((data) => { setAppointments(data); console.log(data) })
            .catch((err) => alert(err));
    };
    const deleteAppointment = (id) =>{

        api.delete(`/api/appointment/delete/${id}/`).then((res)=>{
            if (res.status === 204) alert("Appointment Deleted");
            else alert("Failed to delete Appointment");
            getAppointments();
        }).catch((error)=>alert(error));
    };

    const createAppointment = (e) => {

        e.preventDefault();

        api.post("/api/appointment/", {
            healthcare_professional: Selectedhealthcareprofessional,
            patient : selectedPatient,
            appointment_datetime: selectedAppointmentDateTime

        }).then ((res)=> {
            if (res.status ===201) alert("Appointment Created");
            else alert("Failed to create the note");
            getAppointments();
        }).catch((err)=>alert(err));
    };

    return (
        <>
        <div>
        <h2>Appointments</h2>
        {
        appointments.map((appointment) =>(
            <Appointment appointment={appointment} onDelete={deleteAppointment} key={appointment.appointment_id}/>
        ))

        }
        </div>
        <h2>Set an Appointment</h2>
        <form onSubmit={createAppointment}>
            <label htmlFor="patient">Patient</label>
            <br/>
            <select
            id="patient"
            name="patient"
            required
            onChange={(e)=> setSelectedPatient(e.target.value)}
            value={selectedPatient}
            >
                <option value="">Select a Patient</option>
                {patients.map((patient) => (
                    <option key={patient.file_number} value={patient.file_number}>
                        {patient.first_name} {patient.last_name}

                    </option>
                ))}
            </select>
                <br/>
            <label htmlFor="healthcareprofessional">Healthcare Professionals</label>
            <br/>
            <select
            id="healthcareprofessional"
            name="healthcareprofessional"
            required
            onChange={(e)=> setSelectedHealthcareprofessional(e.target.value)}
            value={Selectedhealthcareprofessional}
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

              <input type="submit" value="Submit"/>

        </form>
        </>
    )
}

export default Appointments;