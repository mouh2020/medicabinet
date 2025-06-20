import React, { useState } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const AssistantLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const res = await axios.post('/assistant/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', 'assistant');
      setTimeout(() => navigate('/assistant/dashboard'), 1500);
    } catch {
      setError('Login failed. Please check your credentials.');
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left Panel with Branding and Features */}
      <div className="left-panel">
        <h1>👩‍⚕️ MediCabinet Portal</h1>
        <p className="subtitle">Supporting healthcare professionals with efficient patient management</p>
        
        <div className="features">
          <div className="feature">
            <div className="feature-icon">📅</div>
            <h3>Appointment Coordination</h3>
            <p>Efficiently manage patient schedules and appointments</p>
          </div>
          <div className="feature">
            <div className="feature-icon">📋</div>
            <h3>Patient Records</h3>
            <p>Quick access to patient information</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🔔</div>
            <h3>Reminder System</h3>
            <p>Patient reminders for appointments and follow-ups</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🔒</div>
            <h3>Secure Access</h3>
            <p>Platform ensuring patient data security</p>
          </div>
        </div>
        
        <div className="footer">
          <p>© 2023 MediCabinet Portal. All rights reserved.</p>
        </div>
      </div>
      
      {/* Right Panel with Login Form */}
      <div className="right-panel">
        <div className="login-card">
          <div className="logo">
            <span className="logo-icon">⚕️</span>
            <h2>MediCabinet</h2>
          </div>
          
          <h1 className="title">Medical Assistant Login</h1>
          <p className="subtitle">Access your healthcare management tools</p>
          
          {error && (
            <div className="message error">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                placeholder="your.email@example.com"
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                placeholder="Enter your password"
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span> Logging in...
                </>
              ) : (
                'Access Dashboard'
              )}
            </button>
          </form>
        </div>
      </div>
      
      <style jsx>{`
        .login-container {
          display: flex;
          min-height: 100vh;
          background-color: #f0f8ff;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .left-panel {
          flex: 1;
          background: linear-gradient(135deg, #4a6fa5, #2e4c7a);
          padding: 40px;
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        .left-panel h1 {
          font-size: 2.5rem;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .subtitle {
          font-size: 1.2rem;
          max-width: 500px;
          margin-bottom: 40px;
          opacity: 0.9;
        }
        
        .features {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 25px;
          margin-top: 30px;
        }
        
        .feature {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 10px;
          padding: 20px;
          transition: transform 0.3s;
        }
        
        .feature:hover {
          transform: translateY(-5px);
        }
        
        .feature-icon {
          font-size: 2rem;
          margin-bottom: 15px;
        }
        
        .feature h3 {
          margin: 0 0 10px 0;
          font-size: 1.2rem;
        }
        
        .feature p {
          margin: 0;
          font-size: 0.95rem;
          opacity: 0.9;
        }
        
        .footer {
          margin-top: auto;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
          padding-top: 30px;
        }
        
        .right-panel {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        
        .login-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          padding: 40px;
          width: 100%;
          max-width: 450px;
          text-align: center;
        }
        
        .logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 25px;
        }
        
        .logo-icon {
          font-size: 2.5rem;
          color: #4a6fa5;
        }
        
        .logo h2 {
          font-size: 1.8rem;
          margin: 0;
          color: #2c3e50;
        }
        
        .title {
          color: #2c3e50;
          margin: 0 0 10px 0;
          font-size: 1.8rem;
        }
        
        .subtitle {
          color: #7f8c8d;
          margin-bottom: 30px;
          font-size: 1rem;
        }
        
        .message {
          padding: 12px;
          border-radius: 8px;
          margin: 15px 0;
          font-weight: 500;
          font-size: 0.9rem;
        }
        
        .error {
          background: #f8d7da;
          color: #721c24;
        }
        
        .login-form {
          text-align: left;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 8px;
          color: #2c3e50;
          font-weight: 500;
          font-size: 0.95rem;
        }
        
        .form-group input {
          width: 100%;
          padding: 14px 15px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }
        
        .form-group input:focus {
          outline: none;
          border-color: #4a6fa5;
          box-shadow: 0 0 0 3px rgba(74, 111, 165, 0.2);
        }
        
        .login-button {
          width: 100%;
          padding: 14px;
          background: #4a6fa5;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
        }
        
        .login-button:hover:not(:disabled) {
          background: #3a5a8a;
        }
        
        .login-button:disabled {
          background: #90a9d1;
          cursor: not-allowed;
        }
        
        .spinner {
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .login-container {
            flex-direction: column;
          }
          
          .left-panel {
            padding: 30px 20px;
          }
          
          .features {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AssistantLogin;