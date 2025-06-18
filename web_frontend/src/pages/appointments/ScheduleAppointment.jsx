import React, { useState } from 'react';
import axios from '../../api/axios';



function ScheduleAppointment({ onScheduled }) {
    const [newTime, setNewTime] = useState(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };

        try {
            await axios.post('/appointments', { time: newTime }, config);
            alert("Your appointment scheduled");
        } catch (err) {
            console.error('scheduling appointment:', err);
            alert("Failed to schedule appointment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
            <label>
                Schedule for:
                <input
                    type="date"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    required
                    min = {new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                />
            </label>
            <button type="submit" disabled={loading}>
                {loading ? 'Scheduling...' : 'Schedule Appointment'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
}

export default ScheduleAppointment;