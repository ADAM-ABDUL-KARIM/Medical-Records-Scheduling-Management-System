import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../styles/Calendar.css";
import api from "../api";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const localizer = momentLocalizer(moment);

function Event({ event }) {
    const startTime = moment(event.start).format("HH:mm");
    return (
        <span data-tip data-for={`tooltip-${event.id}`}>
            <strong>{startTime} - {event.title}</strong>
            <br />
            <span>{event.healthpro_name}</span>
            <ReactTooltip id={`tooltip-${event.id}`} place="top" effect="solid">
                Right-click to delete this appointment
            </ReactTooltip>
        </span>
    );
}

function AppointmentsCalendar() {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        getAppointments();
    }, []);

    const getAppointments = async () => {
        try {
            const res = await api.get("/api/appointment/");
            const data = res.data.map((appointment) => ({
                title: `${appointment.patient_name}`,
                healthpro_name: `${appointment.healthpro_details.healthcare_professional_name}`,
                start: new Date(appointment.appointment_datetime),
                end: new Date(moment(appointment.appointment_datetime).add(1, "hour")),
                id: appointment.appointment_id,
            }));
            setAppointments(data);
        } catch (err) {
            alert(err);
        }
    };

    const handleSelectEvent = (event) => {
        confirmDelete(event.id, event.title);
    };

    const deleteAppointment = async (id) => {
        try {
            const res = await api.delete(`/api/appointment/delete/${id}/`);
            if (res.status === 204) {
                getAppointments();
            } else {
                alert("Failed to delete Appointment");
            }
        } catch (error) {
            alert(error);
        }
    };

    const confirmDelete = (id, title) => {
        confirmAlert({
            title: 'Confirm to delete',
            message: `Do you want to delete the appointment with ${title}?`,
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => deleteAppointment(id)
                },
                {
                    label: 'No',
                    onClick: () => {}
                }
            ]
        });
    };

    return (
        <div className="calendar-container">
            <h2>Appointments Calendar</h2>
            <Calendar
                localizer={localizer}
                events={appointments}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 900, width:1000 }} // Increase the height of the calendar
                onSelectEvent={handleSelectEvent}
                components={{
                    event: Event,
                }}
                views={['month', 'week', 'day']} // Exclude the agenda view
            />
            <ReactTooltip />
        </div>
    );
}

export default AppointmentsCalendar;