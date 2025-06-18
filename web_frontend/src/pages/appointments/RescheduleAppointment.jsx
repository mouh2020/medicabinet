import React, { useState } from 'react';
import axios from '../../api/axios';

// filepath: /home/med/Desktop/Projects/medicabinet/web_frontend/src/pages/appointments/RescheduleAppointment.jsx

function RescheduleAppointment({ appointment, onRescheduled, onCancel }) {
    // Helper to get tomorrow's date in "YYYY-MM-DD" format
    const getTomorrowDateString = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        return tomorrow.toISOString().slice(0, 10);
    };

    const [newDate, setNewDate] = useState(() => {
        // Default to current appointment date if it's after tomorrow, else tomorrow
        const appointmentDate = new Date(appointment.time).toISOString().slice(0, 10);
        const tomorrow = getTomorrowDateString();
        return appointmentDate > tomorrow ? appointmentDate : tomorrow;
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };

        try {
            await axios.put(`/appointments/${appointment.appointment_id}`, { time: newDate }, config);
            if (onRescheduled) onRescheduled();
        } catch (err) {
            setError('Failed to reschedule appointment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
            <label>
                New Date:
                <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    required
                    min={getTomorrowDateString()}
                />
            </label>
            <button type="submit" disabled={loading}>
                {loading ? 'Rescheduling...' : 'Reschedule'}
            </button>
            <button type="button" onClick={onCancel} style={{ marginLeft: '1rem' }}>
                Cancel
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
}

export default RescheduleAppointment;
