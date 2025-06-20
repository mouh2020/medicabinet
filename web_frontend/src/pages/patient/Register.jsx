import React, { useState } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';

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
      const res = await axios.post('patient/register', formData);
      localStorage.setItem('token', res.data.token);
      setMessage('Registration successful! Redirecting to dashboard...');
      setTimeout(() => navigate('/patient/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Panel */}
      <div style={styles.leftPanel}>
        <h1 style={styles.heading}>MediCabinet Portal</h1>
        <p style={styles.subheading}>
          Join thousands of patients managing their health through our secure platform.
        </p>
        <div style={styles.features}>
          {[
            ['🔐', 'Secure Registration', 'Your personal information is encrypted and protected'],
            ['⚕️', 'Comprehensive Profile', 'Build a complete health profile for better care'],
            ['📱', 'Easy Access', 'Manage appointments from anywhere, anytime'],
            ['💊', 'Medication Tracking', 'Keep all your prescriptions in one place']
          ].map(([icon, title, desc]) => (
            <div key={title} style={styles.feature}>
              <div style={styles.featureIcon}>{icon}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
        <footer style={styles.footer}>© 2025 MediCabinet Portal. All rights reserved.</footer>
      </div>

      {/* Right Panel */}
      <div style={styles.rightPanel}>
        <div style={styles.card}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>⚕️</span>
            <h2 style={{ fontSize: '1.8rem', margin: 0 }}>MediCabinet</h2>
          </div>

          <h1 style={styles.title}>Create Patient Account</h1>
          <p style={styles.subtitle}>Fill in your details to get started</p>

          {message && <div style={{ ...styles.message, ...styles.success }}>{message}</div>}
          {error && <div style={{ ...styles.message, ...styles.error }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              {renderInput('Full Name', 'full_name', 'text', true)}
              {renderSelect('Gender', 'gender', ['male', 'female'])}
              {renderInput('Email', 'email', 'email', true)}
              {renderInput('Phone', 'phone', 'text', true)}
              {renderInput('Date of Birth', 'birthday', 'date')}
              {renderInput('Password', 'password', 'password', true)}
              {renderInput('Weight (kg)', 'weight', 'number')}
              {renderInput('Height (cm)', 'height', 'number')}
              {renderInput('Address', 'address', 'text', false, true)}
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
                <>
                  <div style={styles.spinner}></div> Creating Account...
                </>
              ) : (
                'Register Account'
              )}
            </button>

            <p style={styles.loginPrompt}>
              Already have an account?
              <a href="/patient/login" style={styles.loginLink}>Login here</a>
            </p>
          </form>
        </div>
      </div>

      {/* Global focus style and spinner */}
      <style>{`
        input:focus, select:focus {
          border-color: #1e88e5 !important;
          box-shadow: 0 0 0 3px rgba(30, 136, 229, 0.2) !important;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  function renderInput(label, name, type, required = false, fullWidth = false) {
    return (
      <div
        style={{
          ...styles.formGroup,
          ...(fullWidth ? styles.formGroupFull : {}),
        }}
      >
        <label style={styles.label}>
          {label} {required && <span style={styles.required}>*</span>}
        </label>
        <input
          type={type}
          name={name}
          required={required}
          onChange={handleChange}
          style={styles.input}
          value={formData[name]}
          placeholder={name === 'weight' || name === 'height' ? 'e.g. 75' : ''}
        />
      </div>
    );
  }

  function renderSelect(label, name, options) {
    return (
      <div style={styles.formGroup}>
        <label style={styles.label}>{label}</label>
        <select
          name={name}
          value={formData[name]}
          onChange={handleChange}
          style={styles.select}
        >
          {options.map(opt => (
            <option key={opt} value={opt}>
              {opt[0].toUpperCase() + opt.slice(1)}
            </option>
          ))}
        </select>
      </div>
    );
  }
};

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
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    textAlign: 'center',
  },
  heading: {
    fontSize: '2.5rem',
    marginBottom: '10px',
  },
  subheading: {
    fontSize: '1.2rem',
    maxWidth: '500px',
    marginBottom: '40px',
  },
  features: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '40px',
  },
  feature: {
    flex: '0 0 calc(50% - 20px)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '8px',
    padding: '15px',
  },
  featureIcon: {
    fontSize: '2rem',
    marginBottom: '10px',
  },
  footer: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.9rem',
  },
  rightPanel: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  card: {
    maxWidth: '600px',
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '40px 30px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  logoIcon: {
    fontSize: '2.5rem',
    color: '#1e88e5',
    marginRight: '15px',
  },
  title: {
    textAlign: 'center',
    color: '#2c3e50',
    fontSize: '1.8rem',
    margin: '0 0 10px',
    fontWeight: '600',
  },
  subtitle: {
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: '30px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  formGroupFull: {
    gridColumn: '1 / -1',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    fontSize: '0.9rem',
    color: '#2c3e50',
  },
  input: {
    width: '100%',
    padding: '14px 15px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '1rem',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '14px 15px',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    fontSize: '1rem',
    backgroundColor: 'white',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23333' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 15px center',
    backgroundSize: '12px',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#1e88e5',
    color: 'white',
    fontSize: '1rem',
    fontWeight: '600',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#90caf9',
    cursor: 'not-allowed',
  },
  spinner: {
    border: '3px solid rgba(255, 255, 255, 0.3)',
    borderTop: '3px solid white',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    animation: 'spin 1s linear infinite',
    marginRight: '10px',
  },
  message: {
    padding: '12px',
    borderRadius: '8px',
    margin: '15px 0',
    fontWeight: '500',
    fontSize: '0.9rem',
    textAlign: 'center',
  },
  success: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  loginPrompt: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#7f8c8d',
  },
  loginLink: {
    color: '#1e88e5',
    textDecoration: 'none',
    fontWeight: '600',
    marginLeft: '5px',
  },
  required: {
    color: '#e53935',
  },
};

export default Register;
