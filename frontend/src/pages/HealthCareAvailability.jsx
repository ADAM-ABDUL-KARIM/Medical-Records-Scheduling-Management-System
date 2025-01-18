import { useState, useEffect } from "react";
import api from "../api";
import Availability from "../components/Availability"
function HealthCareAvailability() {
    const [selectedHealthCareProfessional, setSelectedHealthCareProfessional] = useState("");
    const [selectedStartTime, setStartTime] = useState("");
    const [selectedEndTime, setEndTime] = useState("");
    const [healthCareProfessionals, setHealthCareProfessionals] = useState([]);
    const [availabilities, setAvailabilities] = useState([]);

    useEffect(() => {
        getHealthPro();
        getAvailabilies();
    }, []);

    const getAvailabilies = () => {

        api.get("/api/availability/")
        .then((res) => res.data)
        .then((data) => {
            setAvailabilities(data); 
            console.log(data);
        })

    }
    const getHealthPro = () => {
        api.get("/api/healthpro/")
            .then((res) => res.data)
            .then((data) => {
                setHealthCareProfessionals(data);
                console.log(data);
            })
            .catch((error) => alert(error + "Failed to get HPros"));
    };
    const deleteAvailability = (id) =>{
        api.delete(`/api/availability/delete/${id}/`)
        .then((res) => {
            if (res.status == 204 ) alert("Availability Deleted");
            else alert("Failed to Delete Availability");
            getAvailabilies();

        }).catch((error) => alert(error));
    }
    const createAvailability = (e) => {
        e.preventDefault();
        api.post("/api/availability/", {
            healthcare_professional: selectedHealthCareProfessional,
            availability_date: selectedStartTime,
            end_time: selectedEndTime
        })
            .then((res) => {
                if (res.status === 201) alert("Availability Created");
                
                else alert("Failed to create availability");
                getAvailabilies();
            })
            .catch((error) => alert(error));
    };

    return (
        <div>
            <h2>Set Healthcare Professional Availability</h2>

            {
                availabilities.map((availability) => (
                    <Availability availability = {availability} key = {availability.availability_id} onDelete={deleteAvailability} />
                ))
            }


            <form onSubmit={createAvailability}>
                <label htmlFor="healthcareprofessional">Healthcare Professional</label>
                <br />
                <select
                    id="healthcareprofessional"
                    name="healthcareprofessional"
                    required
                    onChange={(e) => setSelectedHealthCareProfessional(e.target.value)}
                    value={selectedHealthCareProfessional}
                >
                    <option value="">Select a Healthcare Professional</option>
                    {healthCareProfessionals.map((healthpro) => (
                        <option key={healthpro.id} value={healthpro.id}>
                            {healthpro.first_name} {healthpro.last_name}
                        </option>
                    ))}
                </select>
                <br />
                <label htmlFor="start_time">Start Time</label>
                <br />
                <input
                    type="datetime-local"
                    id="start_time"
                    name="start_time"
                    required
                    onChange={(e) => setStartTime(e.target.value)}
                    value={selectedStartTime}
                />
                <br />
                <label htmlFor="end_time">End Time</label>
                <br />
                <input
                    type="time"
                    id="end_time"
                    name="end_time"
                    required
                    onChange={(e) => setEndTime(e.target.value)}
                    value={selectedEndTime}
                />
                <br />
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
}

export default HealthCareAvailability;