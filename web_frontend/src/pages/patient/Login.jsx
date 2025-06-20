import React, { useState } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true);
    try {
      const res = await axios.post('patient/login', formData);
      localStorage.setItem('token', res.data.token);
      setMessage('Login successful! Redirecting...');
      setTimeout(() => navigate('/patient/dashboard'), 1500);
    } catch {
      setError('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Panel */}
      <div style={styles.leftPanel}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>MediCabinet Portal</h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '500px', marginBottom: '40px' }}>
          Your secure gateway to managing health appointments, prescriptions, and consultations.
        </p>

        <div style={styles.features}>
          <Feature icon="📅" title="Appointment Management" desc="Schedule, reschedule, or cancel appointments with ease" />
          <Feature icon="💊" title="Prescription Access" desc="View and manage your prescriptions anytime" />
          <Feature icon="👨‍⚕️" title="Consultation History" desc="Access your complete medical consultation records" />
          <Feature icon="🔒" title="Secure & Private" desc="Your health data is protected with bank-level security" />
        </div>

        <div style={styles.footer}>
          <p>© 2025 MediCabinet Portal. All rights reserved.</p>
        </div>
      </div>

      {/* Right Panel */}
      <div style={styles.rightPanel}>
        <div style={styles.card}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>⚕️</span>
            <h2 style={{ fontSize: '1.8rem', margin: 0 }}>MediCabinet</h2>
          </div>

          <h1 style={styles.title}>Patient Login</h1>
          <p style={styles.subtitle}>Access your health portal account</p>

          {message && <div style={{ ...styles.message, ...styles.success }}>{message}</div>}
          {error && <div style={{ ...styles.message, ...styles.error }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                ...styles.button,
                ...(isLoading ? styles.buttonDisabled : {}),
              }}
            >
              {isLoading ? (
                <span style={styles.spinner}></span>
              ) : (
                'Login to Account'
              )}
            </button>

            <a href="register" style={styles.forgotPassword}>You don't an account yet?</a>
          </form>
        </div>
      </div>

      {/* Spinner animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

const Feature = ({ icon, title, desc }) => (
  <div style={styles.feature}>
    <div style={styles.featureIcon}>{icon}</div>
    <h3>{title}</h3>
    <p>{desc}</p>
  </div>
);

// Design styles
const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f0f8ff',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  leftPanel: {
    flex: 1,
    background: 'linear-gradient(135deg, #1e88e5, #0d47a1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    color: 'white',
    textAlign: 'center',
  },
  rightPanel: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    padding: '40px 30px',
    textAlign: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '30px',
  },
  logoIcon: {
    fontSize: '2.5rem',
    color: '#1e88e5',
    marginRight: '15px',
  },
  title: {
    color: '#2c3e50',
    margin: '0 0 10px 0',
    fontSize: '1.8rem',
    fontWeight: '600',
  },
  subtitle: {
    color: '#7f8c8d',
    marginBottom: '30px',
    fontSize: '1rem',
  },
  formGroup: {
    marginBottom: '20px',
    textAlign: 'left',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#2c3e50',
    fontWeight: '500',
    fontSize: '0.9rem',
  },
  input: {
    width: '100%',
    padding: '14px 15px',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    fontSize: '1rem',
    transition: 'border-color 0.3s',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#1e88e5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#90caf9',
    cursor: 'not-allowed',
  },
  message: {
    padding: '12px',
    borderRadius: '8px',
    margin: '15px 0',
    fontWeight: '500',
    fontSize: '0.9rem',
  },
  success: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  spinner: {
    border: '3px solid rgba(255, 255, 255, 0.3)',
    borderTop: '3px solid white',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    animation: 'spin 1s linear infinite',
  },
  features: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: '30px',
    gap: '20px',
  },
  feature: {
    flex: '0 0 calc(50% - 20px)',
    textAlign: 'center',
    padding: '15px',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
  },
  featureIcon: {
    fontSize: '2rem',
    marginBottom: '10px',
  },
  footer: {
    marginTop: '40px',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.9rem',
  },
  forgotPassword: {
    display: 'block',
    marginTop: '15px',
    color: '#1e88e5',
    textDecoration: 'none',
    fontSize: '0.9rem',
  },
};

export default Login;
