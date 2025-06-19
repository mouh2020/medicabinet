import React, { useState } from 'react';
import axios from '../../api/axios';

const PrescriptionForm = ({ patientId, token, initialContent = '', prescriptionId = null, onSaved }) => {
  const [content, setContent] = useState(initialContent);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (prescriptionId) {
        await axios.put(`doctor/prescriptions/${prescriptionId}`, { content }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Prescription updated!');
      } else {
        await axios.post('doctor/prescriptions', { patient_id: patientId, content }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Prescription added!');
        setContent('');
      }
      if (onSaved) onSaved();
    } catch {
      alert('Failed to save prescription');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 8 }}>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Prescription content"
        required
      />
      <button type="submit">{prescriptionId ? 'Update' : 'Prescribe'}</button>
    </form>
  );
};

export default PrescriptionForm;
