import React, { useState } from 'react';
import axios from '../../api/axios';

// filepath: /home/med/Desktop/Projects/medicabinet/web_frontend/src/pages/appointments/RescheduleAppointment.jsx

function RescheduleAppointment({ appointment, onRescheduled, onCancel }) {
    const [newTime, setNewTime] = useState(() => {
        // Default to current appointment time in "YYYY-MM-DDTHH:mm" format
        return new Date(appointment.time).toISOString().slice(0, 16);
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
            await axios.put(`/appointments/${appointment.appointment_id}`, { time: newTime }, config);
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
                New Time:
                <input
                    type="date"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    required
                    min={new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16)}
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