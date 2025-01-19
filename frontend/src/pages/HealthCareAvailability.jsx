import { useState, useEffect } from "react";
import api from "../api";
import Availability from "../components/Availability";
import "../styles/InputForms.css"; 

function HealthCareAvailability() {
    const [selectedHealthCareProfessional, setSelectedHealthCareProfessional] = useState("");
    const [selectedStartTime, setStartTime] = useState("");
    const [selectedEndTime, setEndTime] = useState("");
    const [healthCareProfessionals, setHealthCareProfessionals] = useState([]);
    const [availabilities, setAvailabilities] = useState([]);

    useEffect(() => {
        getHealthPro();
        getAvailabilities();
    }, []);

    const getAvailabilities = () => {
        api.get("/api/availability/")
            .then((res) => res.data)
            .then((data) => {
                setAvailabilities(data);
                console.log(data);
            });
    };

    const getHealthPro = () => {
        api.get("/api/healthpro/")
            .then((res) => res.data)
            .then((data) => {
                setHealthCareProfessionals(data);
                console.log(data);
            })
            .catch((error) => alert(error + "Failed to get HPros"));
    };

    const deleteAvailability = (id) => {
        api.delete(`/api/availability/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) alert("Availability Deleted");
                else alert("Failed to Delete Availability");
                getAvailabilities();
            })
            .catch((error) => alert(error));
    };

    const createAvailability = (e) => {
        e.preventDefault();
        api.post("/api/availability/", {
            healthcare_professional: selectedHealthCareProfessional,
            availability_date: selectedStartTime,
            end_time: selectedEndTime,
        })
            .then((res) => {
                if (res.status === 201) alert("Availability Created");
                else alert("Failed to create availability");
                getAvailabilities();
            })
            .catch((error) => alert(error));
    };

    return (
        <div className="healthcare-availability-container">
            <div className="form-container">
                <h2>Set Healthcare Professional Availability</h2>
                <form onSubmit={createAvailability}>
                    <label htmlFor="healthcareprofessional">Healthcare Professional</label>
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
                    <label htmlFor="start_time">Start Time</label>
                    <input
                        type="datetime-local"
                        id="start_time"
                        name="start_time"
                        required
                        onChange={(e) => setStartTime(e.target.value)}
                        value={selectedStartTime}
                    />
                    <label htmlFor="end_time">End Time</label>
                    <input
                        type="time"
                        id="end_time"
                        name="end_time"
                        required
                        onChange={(e) => setEndTime(e.target.value)}
                        value={selectedEndTime}
                    />
                    <button type="submit">Submit</button>
                </form>
            </div>
            <div className="availabilities-container">
                <h2>Availabilities</h2>
                {availabilities.map((availability) => (
                    <Availability
                        availability={availability}
                        key={availability.availability_id}
                        onDelete={deleteAvailability}
                    />
                ))}
            </div>
        </div>
    );
}

export default HealthCareAvailability;