import React, { useState } from 'react';
import axios from '../../api/axios';

const DoctorLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await axios.post('doctor/login', formData);
      localStorage.setItem('token', res.data.token); // unified token
      setMessage('Login successful');
      window.location.href = '/doctor/dashboard';
    } catch {
      setError('Login failed');
    }
  };

  return (
    <div>
      <h2>Doctor Login</h2>
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required /><br/>
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required /><br/>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default DoctorLogin;
