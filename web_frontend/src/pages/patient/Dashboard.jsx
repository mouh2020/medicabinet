import React, { useEffect, useState, useCallback } from 'react';
import axios from '../../api/axios';

const Dashboard = () => {
  const today = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [error, setError] = useState('');

  const [newAppt, setNewAppt] = useState('');
  const [apptMessage, setApptMessage] = useState('');

  const token = localStorage.getItem('token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const fetchData = useCallback(async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    try {
      const [apptRes, prescRes, consRes] = await Promise.all([
        axios.get('/appointments', config),
        axios.get('/prescriptions', config),
        axios.get('/consultations', config)
      ]);

      setAppointments(apptRes.data.appointments);
      setPrescriptions(prescRes.data.prescriptions);
      setConsultations(consRes.data.consultations);
    } catch (err) {
      setError('Failed to load dashboard data');
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSchedule = async (e) => {
    e.preventDefault();
    setApptMessage('');
    try {
      await axios.post('/appointments', { time: newAppt }, config);
      setApptMessage('Appointment scheduled.');
      setNewAppt('');
      fetchData();
    } catch {
      setApptMessage('Failed to schedule.');
    }
  };

  const handleCancel = async (appointment_id) => {
    try {
      await axios.delete(`/appointments/${appointment_id}`, config);
      alert('Cancelled');
      fetchData();
    } catch {
      alert('Failed to cancel');
    }
  };

  return (
    <div>
      <h2>Patient Dashboard</h2>
      {error && <p>{error}</p>}

      <h3>Schedule New Appointment</h3>
      <form onSubmit={handleSchedule}>
        <input 
          type="date"
          value={newAppt}
          onChange={(e) => setNewAppt(e.target.value)}
          required
          min={today}
        />
        <button type="submit" disabled={!newAppt}>Schedule</button>
      </form>
      <p>{apptMessage}</p>

      <h3>Appointments</h3>
      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>ID</th>
              <th>Time</th>
              <th>Status</th>
              <th>Reschedule</th>
              <th>Cancel</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(appt => (
              <tr key={appt.appointment_id}>
                <td>{appt.appointment_id}</td>
                <td>{appt.time}</td>
                <td>{appt.status}</td>
                <td>
                  <Reschedule apptId={appt.appointment_id} token={token} onSuccess={fetchData} />
                </td>
                <td>
                  <button onClick={() => handleCancel(appt.appointment_id)}>Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>Prescriptions</h3>
      {prescriptions.length === 0 ? (
        <p>No prescriptions found.</p>
      ) : (
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>ID</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map(p => (
              <tr key={p.prescription_id}>
                <td>{p.prescription_id}</td>
                <td>{p.content || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>Consultations</h3>
      {consultations.length === 0 ? (
        <p>No consultations found.</p>
      ) : (
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>ID</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {consultations.map(c => (
              <tr key={c.consultation_id}>
                <td>{c.consultation_id}</td>
                <td>{c.notes || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const Reschedule = ({ apptId, token, onSuccess }) => {
  const today = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [newTime, setNewTime] = useState('');

  const reschedule = async () => {
    try {
      await axios.put(`/appointments/${apptId}`, { time: newTime }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Rescheduled!');
      onSuccess();
    } catch {
      alert('Failed to reschedule');
    }
  };

  return (
    <span>
      <input 
        type="date" 
        min={today}
        onChange={(e) => setNewTime(e.target.value)} 
        value={newTime}
        required
      />
      <button onClick={reschedule} disabled={!newTime}>Reschedule</button>
    </span>
  );
};

export default Dashboard;
