import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import ScheduleAppointment from './ScheduleAppointment';
import RescheduleAppointment from './RescheduleAppointment';
import CancelAppointment from './CancelAppointment'; // Add this import

function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [reschedulingId, setReschedulingId] = useState(null);
    const [cancellingId, setCancellingId] = useState(null); // Add state for cancelling

    const fetchAppointments = async () => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        };
        try {
            const response = await axios.get('patient/appointments', config);
            if (response.data && response.data.appointments) {
                setAppointments(response.data.appointments);
            } else {
                console.error('Unexpected response structure:', response.data);
            }
        } catch (error) {
            console.error('Failed to fetch appointments:', error);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleRescheduleClick = (id) => {
        setReschedulingId(id);
    };

    const handleRescheduled = () => {
        setReschedulingId(null);
        fetchAppointments();
    };

    const handleCancelReschedule = () => {
        setReschedulingId(null);
    };

    const handleCancelClick = (id) => {
        setCancellingId(id);
    };

    const handleCancelled = () => {
        setCancellingId(null);
        fetchAppointments();
    };

    const handleCancelCancel = () => {
        setCancellingId(null);
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
                            <strong>Time:</strong> {new Date(appt.time).toLocaleDateString()} <br />
                            <strong>Created:</strong> {new Date(appt.created_at).toLocaleDateString()}
                            <br />
                            {reschedulingId === appt.appointment_id ? (
                                <RescheduleAppointment
                                    appointment={appt}
                                    onRescheduled={handleRescheduled}
                                    onCancel={handleCancelReschedule}
                                />
                            ) : cancellingId === appt.appointment_id ? (
                                <CancelAppointment
                                    appointmentId={appt.appointment_id}
                                    onCancelled={handleCancelled}
                                    onCancel={handleCancelCancel}
                                />
                            ) : (
                                <>
                                    <button onClick={() => handleRescheduleClick(appt.appointment_id)}>
                                        Reschedule
                                    </button>
                                    {appt.status === 'scheduled' && (
                                        <button
                                            onClick={() => handleCancelClick(appt.appointment_id)}
                                            style={{ marginLeft: 8 }}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </>
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
