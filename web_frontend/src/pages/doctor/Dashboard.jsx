import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';

const PAGE_SIZE = 5;

const getPatientFromResponse = (data) => data.patient || data;

const Pagination = ({ page, total, pageSize, onPageChange }) => {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;
  return (
    <div style={{ margin: '8px 0' }}>
      <button onClick={() => onPageChange(page - 1)} disabled={page === 1}>Prev</button>
      <span style={{ margin: '0 8px' }}>Page {page} of {totalPages}</span>
      <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>Next</button>
    </div>
  );
};

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

const PatientDetails = ({ patientId, token, onClose }) => {
  const [patient, setPatient] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editPatient, setEditPatient] = useState(false);
  const [editConsultationId, setEditConsultationId] = useState(null);
  const [editPrescriptionId, setEditPrescriptionId] = useState(null);
  const [patientForm, setPatientForm] = useState({});
  const [consultationPage, setConsultationPage] = useState(1);
  const [prescriptionPage, setPrescriptionPage] = useState(1);

  const fetchData = async () => {
    setLoading(true);
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const [pRes, cRes, prRes] = await Promise.all([
        axios.get(`/doctor/patients/${patientId}`, config),
        axios.get(`/doctor/consultations?patient_id=${patientId}`, config),
        axios.get(`/doctor/prescriptions?patient_id=${patientId}`, config)
      ]);
      setPatient(getPatientFromResponse(pRes.data));
      setPatientForm(getPatientFromResponse(pRes.data));
      setConsultations(cRes.data.consultations || []);
      setPrescriptions(prRes.data.prescriptions || []);
    } catch {
      setPatient(null);
      setConsultations([]);
      setPrescriptions([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    setConsultationPage(1);
    setPrescriptionPage(1);
    // eslint-disable-next-line
  }, [patientId, token]);

  const handlePatientEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/doctor/patients/${patientId}`, patientForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Patient updated!');
      setEditPatient(false);
      fetchData();
    } catch {
      alert('Failed to update patient');
    }
  };

  const handleDeleteConsultation = async (id) => {
    if (!window.confirm('Delete this consultation?')) return;
    try {
      await axios.delete(`/doctor/consultations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch {
      alert('Failed to delete consultation');
    }
  };

  const handleDeletePrescription = async (id) => {
    if (!window.confirm('Delete this prescription?')) return;
    try {
      await axios.delete(`/doctor/prescriptions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch {
      alert('Failed to delete prescription');
    }
  };

  const pagedConsultations = consultations.slice((consultationPage - 1) * PAGE_SIZE, consultationPage * PAGE_SIZE);
  const pagedPrescriptions = prescriptions.slice((prescriptionPage - 1) * PAGE_SIZE, prescriptionPage * PAGE_SIZE);

  if (loading) return <div>Loading patient details...</div>;
  if (!patient) return <div>Failed to load patient details.</div>;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 350, maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', right: 16, top: 16 }}>Close</button>
        <h4>Patient Information</h4>
        {editPatient ? (
          <form onSubmit={handlePatientEdit}>
            <div><label>Name: </label>
              <input value={patientForm.full_name || ''} onChange={e => setPatientForm(f => ({ ...f, full_name: e.target.value }))} required />
            </div>
            <div><label>Email: </label>
              <input value={patientForm.email || ''} onChange={e => setPatientForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div><label>Password: </label>
              <input value={patientForm.password || ''} onChange={e => setPatientForm(f => ({ ...f, password: e.target.value }))} required />
            </div>
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditPatient(false)}>Cancel</button>
          </form>
        ) : (
          <div>
            <p><b>ID:</b> {patient.id || patientId}</p>
            <p><b>Name:</b> {patient.full_name}</p>
            <p><b>Address:</b> {patient.address}</p>
            <p><b>Gender:</b> {patient.gender}</p>
            <p><b>Email:</b> {patient.email}</p>
            <p><b>Password:</b> {patient.password}</p>
            <button onClick={() => setEditPatient(true)}>Edit Patient</button>
          </div>
        )}

        <h5>Consultations</h5>
        <ConsultationForm patientId={patientId} token={token} onSaved={fetchData} />
        {consultations.length === 0 ? <p>No consultations found.</p> : (
          <>
            <ul>
              {pagedConsultations.map(c => (
                <li key={c.consultation_id}>
                  {editConsultationId === c.consultation_id ? (
                    <ConsultationForm
                      patientId={patientId}
                      token={token}
                      initialNotes={c.notes}
                      consultationId={c.consultation_id}
                      onSaved={() => {
                        setEditConsultationId(null);
                        fetchData();
                      }}
                    />
                  ) : (
                    <div>
                      <b>Date:</b> {c.created_at} <br />
                      <b>Notes:</b> {c.notes}
                      <div>
                        <button onClick={() => setEditConsultationId(c.consultation_id)}>Edit</button>
                        <button onClick={() => handleDeleteConsultation(c.consultation_id)}>Delete</button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <Pagination
              page={consultationPage}
              total={consultations.length}
              pageSize={PAGE_SIZE}
              onPageChange={setConsultationPage}
            />
          </>
        )}

        <h5>Prescriptions</h5>
        <PrescriptionForm patientId={patientId} token={token} onSaved={fetchData} />
        {prescriptions.length === 0 ? <p>No prescriptions found.</p> : (
          <>
            <ul>
              {pagedPrescriptions.map(p => (
                <li key={p.prescription_id}>
                  {editPrescriptionId === p.prescription_id ? (
                    <PrescriptionForm
                      patientId={patientId}
                      token={token}
                      initialContent={p.content}
                      prescriptionId={p.prescription_id}
                      onSaved={() => {
                        setEditPrescriptionId(null);
                        fetchData();
                      }}
                    />
                  ) : (
                    <div>
                      <b>Date:</b> {p.created_at} <br />
                      <b>Content:</b> {p.content}
                      <div>
                        <button onClick={() => setEditPrescriptionId(p.prescription_id)}>Edit</button>
                        <button onClick={() => handleDeletePrescription(p.prescription_id)}>Delete</button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <Pagination
              page={prescriptionPage}
              total={prescriptions.length}
              pageSize={PAGE_SIZE}
              onPageChange={setPrescriptionPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState({});
  const [error, setError] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [patientPage, setPatientPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAppointments();
  }, [token]);

  const fetchAppointments = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('doctor/appointments', config);
      setAppointments(res.data.appointments);

      const patientIds = [...new Set(res.data.appointments.map(a => a.patient_id))];
      const patientData = {};

      await Promise.all(
        patientIds.map(async (id) => {
          const pRes = await axios.get(`/doctor/patients/${id}`, config);
          patientData[id] = getPatientFromResponse(pRes.data);
        })
      );

      setPatients(patientData);
    } catch (err) {
      setError('Failed to load doctor dashboard');
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    if (!window.confirm(`Mark appointment as ${newStatus}?`)) return;
    try {
      await axios.put(`/doctor/appointments/${appointmentId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`Appointment marked as ${newStatus}`);
      fetchAppointments();
    } catch {
      alert(`Failed to update appointment status`);
    }
  };

  const isToday = (dateStr) => {
    const today = new Date();
    const apptDate = new Date(dateStr);
    return (
      today.getFullYear() === apptDate.getFullYear() &&
      today.getMonth() === apptDate.getMonth() &&
      today.getDate() === apptDate.getDate()
    );
  };

  const sortedAppointments = [...appointments].sort((a, b) => {
    const aToday = isToday(a.time) && a.status === 'scheduled';
    const bToday = isToday(b.time) && b.status === 'scheduled';
    if (aToday && !bToday) return -1;
    if (!aToday && bToday) return 1;
    return new Date(b.time) - new Date(a.time);
  });

  const uniquePatientIds = [...new Set(sortedAppointments.map(a => a.patient_id))];
  const filteredPatientIds = uniquePatientIds.filter(id => {
    const patient = patients[id];
    return patient?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const patientStart = (patientPage - 1) * PAGE_SIZE;
  const pagedPatientIds = filteredPatientIds.slice(patientStart, patientStart + PAGE_SIZE);
  const pagedAppointments = sortedAppointments.filter(a => pagedPatientIds.includes(a.patient_id));

  return (
    <div>
      <h2>Doctor Dashboard</h2>
      {error && <p>{error}</p>}

      <input
        type="text"
        placeholder="Search patient by name..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setPatientPage(1);
        }}
        style={{ marginBottom: 16, padding: 6, width: '100%', maxWidth: 300 }}
      />

      <h3>Appointments</h3>
      {pagedAppointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <ul>
          {pagedAppointments.map(appt => (
            <li key={appt.appointment_id}>
              <p>
                <b>Time:</b> {appt.time} | <b>Status:</b> {appt.status}
                {appt.status === 'scheduled' && (
                  <>
                    <button style={{ marginLeft: 8 }} onClick={() => handleStatusUpdate(appt.appointment_id, 'completed')}>Complete</button>
                    <button style={{ marginLeft: 4 }} onClick={() => handleStatusUpdate(appt.appointment_id, 'cancelled')}>Cancel</button>
                  </>
                )}
              </p>
              <p>
                <b>Patient:</b> {patients[appt.patient_id]?.full_name || 'Loading...'} (ID: {appt.patient_id})
                <button style={{ marginLeft: 10 }} onClick={() => setSelectedPatientId(appt.patient_id)}>
                  Show Patient Info
                </button>
              </p>
              <PrescriptionForm patientId={appt.patient_id} token={token} onSaved={null} />
              <ConsultationForm patientId={appt.patient_id} token={token} onSaved={null} />
              <hr />
            </li>
          ))}
        </ul>
      )}

      <Pagination
        page={patientPage}
        total={filteredPatientIds.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPatientPage}
      />

      {selectedPatientId && (
        <PatientDetails
          patientId={selectedPatientId}
          token={token}
          onClose={() => setSelectedPatientId(null)}
        />
      )}
    </div>
  );
};

export default DoctorDashboard;
