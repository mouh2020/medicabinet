import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';

const DoctorAssistant = () => {
    const [assistants, setAssistants] = useState([]);
    const [assistantForm, setAssistantForm] = useState({});
    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');

    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        fetchAssistants();
    }, []);

    const fetchAssistants = async () => {
        try {
            const res = await axios.get('/doctor/assistants', config);
            setAssistants(res.data.assistants || []);
        } catch {
            setError('Failed to load assistants.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await axios.put(`/doctor/assistants/${editId}`, assistantForm, config);
                alert('Assistant updated.');
            } else {
                await axios.post('/doctor/assistants', assistantForm, config);
                alert('Assistant added.');
            }
            resetForm();
            fetchAssistants();
        } catch {
            alert('Failed to save assistant.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this assistant?')) return;
        try {
            await axios.delete(`/doctor/assistants/${id}`, config);
            fetchAssistants();
        } catch {
            alert('Failed to delete assistant.');
        }
    };

    const resetForm = () => {
        setEditId(null);
        setAssistantForm({});
        setShowForm(false);
    };

    const filteredAssistants = assistants.filter(a =>
        a.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: 20 }}>
            <h2>Manage Assistants</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div style={{ marginBottom: 10 }}>
                <button onClick={() => { setShowForm(true); setEditId(null); setAssistantForm({}); }}>
                    Add Assistant
                </button>
            </div>

            <input
                type="text"
                placeholder="Search assistant..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ padding: 6, width: '100%', maxWidth: 300, marginBottom: 10 }}
            />

            {filteredAssistants.length === 0 ? (
                <p>No assistants found.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #ccc', padding: 8 }}>Full Name</th>
                            <th style={{ border: '1px solid #ccc', padding: 8 }}>Email</th>
                            <th style={{ border: '1px solid #ccc', padding: 8 }}>Password</th>
                            <th style={{ border: '1px solid #ccc', padding: 8 }}>Phone</th>
                            <th style={{ border: '1px solid #ccc', padding: 8 }}>Birthday</th>
                            <th style={{ border: '1px solid #ccc', padding: 8 }}>Address</th>
                            <th style={{ border: '1px solid #ccc', padding: 8 }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAssistants.map(a => (
                            <tr key={a.id}>
                                <td style={{ border: '1px solid #ccc', padding: 8 }}>{a.full_name}</td>
                                <td style={{ border: '1px solid #ccc', padding: 8 }}>{a.email}</td>
                                <td style={{ border: '1px solid #ccc', padding: 8 }}>{a.password}</td>
                                <td style={{ border: '1px solid #ccc', padding: 8 }}>{a.phone}</td>
                                <td style={{ border: '1px solid #ccc', padding: 8 }}>{a.birthday}</td>
                                <td style={{ border: '1px solid #ccc', padding: 8 }}>{a.address}</td>
                                <td style={{ border: '1px solid #ccc', padding: 8 }}>
                                    <button
                                        onClick={() => {
                                            setAssistantForm(a);
                                            setEditId(a.id);
                                            setShowForm(true);
                                        }}
                                        style={{ marginRight: 6 }}
                                    >
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(a.id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

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
                            <h3 style={{ marginTop: 0 }}>{editId ? 'Edit Assistant' : 'Add Assistant'}</h3>
                            <input
                                type="text"
                                placeholder="Full Name"
                                required
                                value={assistantForm.full_name || ''}
                                onChange={e => setAssistantForm(f => ({ ...f, full_name: e.target.value }))}
                                style={{ display: 'block', marginBottom: 10, width: '100%', padding: 8 }}
                            />
                            <input
                                type="text"
                                placeholder="Phone"
                                required
                                value={assistantForm.phone || ''}
                                onChange={e => setAssistantForm(f => ({ ...f, phone: e.target.value }))}
                                style={{ display: 'block', marginBottom: 10, width: '100%', padding: 8 }}
                            />
                            <input
                                type="date"
                                placeholder="Birthday"
                                required
                                value={assistantForm.birthday || ''}
                                onChange={e => setAssistantForm(f => ({ ...f, birthday: e.target.value }))}
                                style={{ display: 'block', marginBottom: 10, width: '100%', padding: 8 }}
                            />
                            <input
                                type="text"
                                placeholder="Address"
                                required
                                value={assistantForm.address || ''}
                                onChange={e => setAssistantForm(f => ({ ...f, address: e.target.value }))}
                                style={{ display: 'block', marginBottom: 10, width: '100%', padding: 8 }}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                required
                                value={assistantForm.email || ''}
                                onChange={e => setAssistantForm(f => ({ ...f, email: e.target.value }))}
                                style={{ display: 'block', marginBottom: 10, width: '100%', padding: 8 }}
                            />
                            <input
                                type="text"
                                placeholder="Password"
                                required={!editId}
                                value={assistantForm.password || ''}
                                onChange={e => setAssistantForm(f => ({ ...f, password: e.target.value }))}
                                style={{ display: 'block', marginBottom: 10, width: '100%', padding: 8 }}
                            />
                            <button type="submit" style={{ marginTop: 10 }}>
                                {editId ? 'Update' : 'Create'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorAssistant;
