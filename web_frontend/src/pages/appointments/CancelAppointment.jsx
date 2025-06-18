import React, { useState } from 'react';
import axios from '../../api/axios';

function CancelAppointment({ appointmentId, onCancelled, onCancel }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCancel = async () => {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`/appointments/${appointmentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (onCancelled) onCancelled();
        } catch (err) {
            setError('Failed to cancel appointment.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <p>Are you sure you want to cancel this appointment?</p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button onClick={handleCancel} disabled={loading}>
                {loading ? 'Cancelling...' : 'Yes, Cancel'}
            </button>
            <button onClick={onCancel} disabled={loading} style={{ marginLeft: 8 }}>
                No, Go Back
            </button>
        </div>
    );
}

export default CancelAppointment;