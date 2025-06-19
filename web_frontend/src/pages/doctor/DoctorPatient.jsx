import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';

const DoctorPatient = () => {
    const [patients, setPatients] = useState([]);
    const [patientForm, setPatientForm] = useState({});
    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');

    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const res = await axios.get('/doctor/patients', config);
            setPatients(res.data.patients || []);
        } catch {
            setError('Failed to load patients.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await axios.put(`/doctor/patients/${editId}`, patientForm, config);
                alert('Patient updated.');
            } else {
                await axios.post('/doctor/patients', patientForm, config);
                alert('Patient created.');
            }
            resetForm();
            fetchPatients();
        } catch {
            alert('Failed to save patient.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this patient?')) return;
        try {
            await axios.delete(`/doctor/patients/${id}`, config);
            fetchPatients();
        } catch {
            alert('Failed to delete patient.');
        }
    };

    const resetForm = () => {
        setEditId(null);
        setPatientForm({});
        setShowForm(false);
    };

    const filteredPatients = patients.filter(p =>
        p.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: 20 }}>
            <h2>Manage Patients</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div style={{ marginBottom: 10 }}>
                <button
                    onClick={() => {
                        setShowForm(true);
                        setEditId(null);
                        setPatientForm({});
                    }}
                >
                    Add Patient
                </button>
            </div>

            {/* Popup Modal for Add/Edit */}
            {showForm && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: '#fff',
                        padding: 24,
                        borderRadius: 8,
                        minWidth: 320,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        position: 'relative'
                    }}>
                        <button
                            onClick={resetForm}
                            style={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                background: 'transparent',
                                border: 'none',
                                fontSize: 20,
                                cursor: 'pointer'
                            }}
                            aria-label="Close"
                        >
                            &times;
                        </button>
                        <form onSubmit={handleSubmit}>
                            <h3 style={{ marginTop: 0 }}>{editId ? 'Edit Patient' : 'Add Patient'}</h3>
                            <input
                                type="text"
                                placeholder="Full Name"
                                required
                                value={patientForm.full_name || ''}
                                onChange={e => setPatientForm(f => ({ ...f, full_name: e.target.value }))}
                                style={{ display: 'block', marginBottom: 10, width: '100%', padding: 6 }}
                            />
                            <input
                                type="date"
                                placeholder="Birthday"
                                required
                                value={patientForm.birthday || ''}
                                onChange={e => setPatientForm(f => ({ ...f, birthday: e.target.value }))}
                                style={{ display: 'block', marginBottom: 10, width: '100%', padding: 6 }}
                            />
                            <input
                                type="number"
                                placeholder="Weight (kg)"
                                required
                                value={patientForm.weight || ''}
                                onChange={e => setPatientForm(f => ({ ...f, weight: e.target.value }))}
                                style={{ display: 'block', marginBottom: 10, width: '100%', padding: 6 }}
                            />
                            <input
                                type="number"
                                placeholder="Height (cm)"
                                required
                                value={patientForm.height || ''}
                                onChange={e => setPatientForm(f => ({ ...f, height: e.target.value }))}
                                style={{ display: 'block', marginBottom: 10, width: '100%', padding: 6 }}
                            />
                            <input
                                type="text"
                                placeholder="Phone"
                                required
                                value={patientForm.phone || ''}
                                onChange={e => setPatientForm(f => ({ ...f, phone: e.target.value }))}
                                style={{ display: 'block', marginBottom: 10, width: '100%', padding: 6 }}
                            />
                            <input
                                type="text"
                                placeholder="Address"
                                required
                                value={patientForm.address || ''}
                                onChange={e => setPatientForm(f => ({ ...f, address: e.target.value }))}
                                style={{ display: 'block', marginBottom: 10, width: '100%', padding: 6 }}
                            />
                            <select
                                required
                                value={patientForm.gender || ''}
                                onChange={e => setPatientForm(f => ({ ...f, gender: e.target.value }))}
                                style={{ display: 'block', marginBottom: 10, width: '100%', padding: 6 }}
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                            <input
                                type="email"
                                placeholder="Email"
                                required
                                value={patientForm.email || ''}
                                onChange={e => setPatientForm(f => ({ ...f, email: e.target.value }))}
                                style={{ display: 'block', marginBottom: 10, width: '100%', padding: 6 }}
                            />
                            <input
                                type="text"
                                placeholder="Password"
                                required
                                value={patientForm.password || ''}
                                onChange={e => setPatientForm(f => ({ ...f, password: e.target.value }))}
                                style={{ display: 'block', marginBottom: 10, width: '100%', padding: 6 }}
                            />
                            <button type="submit" style={{ marginTop: 10 }}>
                                {editId ? 'Update' : 'Create'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <input
                type="text"
                placeholder="Search patient..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ padding: 6, width: '100%', maxWidth: 300, marginBottom: 10 }}
            />

            {filteredPatients.length === 0 ? (
                <p>No patients found.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #ccc', padding: 8 }}>Full Name</th>
                            <th style={{ border: '1px solid #ccc', padding: 8 }}>Email</th>
                            <th style={{ border: '1px solid #ccc', padding: 8 }}>Gender</th>
                            <th style={{ border: '1px solid #ccc', padding: 8 }}>Address</th>
                            <th style={{ border: '1px solid #ccc', padding: 8 }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPatients.map(p => (
                            <tr key={p.id}>
                                <td style={{ border: '1px solid #ccc', padding: 8 }}>{p.full_name}</td>
                                <td style={{ border: '1px solid #ccc', padding: 8 }}>{p.email}</td>
                                <td style={{ border: '1px solid #ccc', padding: 8 }}>{p.gender}</td>
                                <td style={{ border: '1px solid #ccc', padding: 8 }}>{p.address}</td>
                                <td style={{ border: '1px solid #ccc', padding: 8 }}>
                                    <button
                                        onClick={() => {
                                            setPatientForm(p);
                                            setEditId(p.id);
                                            setShowForm(true);
                                        }}
                                        style={{ marginRight: 6 }}
                                    >
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(p.id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default DoctorPatient;
