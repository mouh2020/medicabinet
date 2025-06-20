import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Patient
import PatientRegister from './pages/patient/Register';
import PatientLogin from './pages/patient/Login';
import PatientDashboard from './pages/patient/Dashboard';
import PatientAppointments from './pages/appointments/Appointments';

// Doctor
import DoctorLogin from './pages/doctor/Login';
import DoctorDashboard from './pages/doctor/Dashboard';
import DoctorAssistant from './pages/doctor/DoctorAssistant';
import DoctorPatient from './pages/doctor/DoctorPatient';

// Assistant
import AssistantLogin from './pages/assistant/Login';
import AssistantDashboard from './pages/assistant/Dashboard';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/patient/login" />;
};

const DoctorRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/doctor/login" />;
};

const AssistantRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/assistant/login" />;
};

const DoctorLayout = ({ children }) => (
  <div>
    <nav
      style={{
        background: '#f3f4f6',
        padding: '32px 48px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: '#2563eb',
        fontWeight: 600,
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        borderBottom: '1px solid #e5e7eb',
        fontSize: '2rem',
      }}
    >
      <div style={{ flex: 1, textAlign: 'left' }}>
        <a href="/doctor/dashboard" style={{ textDecoration: 'none', color: '#2563eb' }}>📅 Appointments</a>
      </div>
      <div style={{ flex: 1, textAlign: 'center' }}>
        <a href="/doctor/assistants" style={{ textDecoration: 'none', color: '#2563eb' }}>🧑‍💼 Assistants</a>
      </div>
      <div style={{ flex: 1, textAlign: 'right' }}>
        <a href="/doctor/patients" style={{ textDecoration: 'none', color: '#2563eb' }}>👨‍⚕️ Patients</a>
      </div>
    </nav>
    <main
      style={{
        padding: '32px',
        background: '#fff',
        minHeight: '100vh',
        fontSize: '1.25rem',
      }}
    >
      {children}
    </main>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Patient Routes */}
        <Route path="/patient/register" element={<PatientRegister />} />
        <Route path="/patient/login" element={<PatientLogin />} />
        <Route
          path="/patient/dashboard"
          element={<PrivateRoute><PatientDashboard /></PrivateRoute>}
        />
        <Route
          path="/patient/appointments"
          element={<PrivateRoute><PatientAppointments /></PrivateRoute>}
        />

        {/* Doctor Routes */}
        <Route path="/doctor/login" element={<DoctorLogin />} />
        <Route
          path="/doctor/dashboard"
          element={
            <DoctorRoute>
              <DoctorLayout>
                <DoctorDashboard />
              </DoctorLayout>
            </DoctorRoute>
          }
        />
        <Route
          path="/doctor/assistants"
          element={
            <DoctorRoute>
              <DoctorLayout>
                <DoctorAssistant />
              </DoctorLayout>
            </DoctorRoute>
          }
        />
        <Route
          path="/doctor/patients"
          element={
            <DoctorRoute>
              <DoctorLayout>
                <DoctorPatient />
              </DoctorLayout>
            </DoctorRoute>
          }
        />

        {/* Assistant Routes */}
        <Route path="/assistant/login" element={<AssistantLogin />} />
        <Route
          path="/assistant/dashboard"
          element={
            <AssistantRoute>
              <AssistantDashboard />
            </AssistantRoute>
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/patient/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
