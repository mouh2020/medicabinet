import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import ScheduleAppointment from './ScheduleAppointment';
import RescheduleAppointment from './RescheduleAppointment';

function Appointments() {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            try {
                const response = await axios.get('/appointments', config);
                if (response.data && response.data.appointments) {
                    setAppointments(response.data.appointments);
                } else {
                    console.error('Unexpected response structure:', response.data);
                }
            } catch (error) {
                console.error('Failed to fetch appointments:', error);
            }
        };

        fetchData();
    }, []);

    // Add import for RescheduleAppointment

    const [reschedulingId, setReschedulingId] = useState(null);

    const handleRescheduleClick = (id) => {
        setReschedulingId(id);
    };

    const handleRescheduled = () => {
        setReschedulingId(null);
        // Refresh appointments after rescheduling
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            try {
                const response = await axios.get('/appointments', config);
                if (response.data && response.data.appointments) {
                    setAppointments(response.data.appointments);
                }
            } catch (error) {
                console.error('Failed to fetch appointments:', error);
            }
        };
        fetchData();
    };

    const handleCancelReschedule = () => {
        setReschedulingId(null);
    };

    return (
        <div>
            <h1>Appointments</h1>
            {appointments.length === 0 ? (
                <p>No appointments found.</p>
            ) : (
                <ul>
                    {appointments.map((appt) => (
                        <li key={appt.appointment_id}>
                            <strong>ID:</strong> {appt.appointment_id} <br />
                            <strong>Status:</strong> {appt.status} <br />
                            <strong>Time:</strong> {new Date(appt.time).toLocaleString()} <br />
                            <strong>Created:</strong> {new Date(appt.created_at).toLocaleString()}
                            <br />
                            {reschedulingId === appt.appointment_id ? (
                                <RescheduleAppointment
                                    appointment={appt}
                                    onRescheduled={handleRescheduled}
                                    onCancel={handleCancelReschedule}
                                />
                            ) : (
                                <button onClick={() => handleRescheduleClick(appt.appointment_id)}>
                                    Reschedule
                                </button>
                            )}
                            <hr />
                        </li>
                    ))}
                </ul>
            )}
            <ScheduleAppointment />
        </div>
    );
}

export default Appointments;
