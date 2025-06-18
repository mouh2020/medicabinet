import React, { useState } from 'react';
import axios from '../../api/axios';

const Register = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    gender: 'male',
    phone: '',
    birthday: '',
    address: '',
    email: '',
    password: '',
    weight: '',
    height: ''
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
      const res = await axios.post('patient/register', formData);
      localStorage.setItem('token', res.data.token);
      setMessage('Registration successful');
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div>
      <h2>Patient Registration</h2>
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input type="text" name="full_name" placeholder="Full Name" onChange={handleChange} required /><br/>
        <select name="gender" onChange={handleChange}>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select><br/>
        <input type="text" name="phone" placeholder="Phone" onChange={handleChange} required /><br/>
        <input type="date" name="birthday" onChange={handleChange} /><br/>
        <input type="text" name="address" placeholder="Address" onChange={handleChange} /><br/>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required /><br/>
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required /><br/>
        <input type="number" name="weight" placeholder="Weight" onChange={handleChange} /><br/>
        <input type="number" step="any" name="height" placeholder="Height" onChange={handleChange} /><br/>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
