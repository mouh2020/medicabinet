import React, { useState } from 'react';
import axios from '../../api/axios';

const ConsultationForm = ({ patientId, token, initialNotes = '', consultationId = null, onSaved }) => {
  const [notes, setNotes] = useState(initialNotes);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (consultationId) {
        await axios.put(`doctor/consultations/${consultationId}`, { notes }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Consultation updated!');
      } else {
        await axios.post('doctor/consultations', { patient_id: patientId, notes }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Consultation saved!');
        setNotes('');
      }
      if (onSaved) onSaved();
    } catch {
      alert('Failed to save consultation');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 8 }}>
      <input
        type="text"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Consultation notes"
        required
      />
      <button type="submit">{consultationId ? 'Update' : 'Save Note'}</button>
    </form>
  );
};

export default ConsultationForm;
