import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import PatientRegister from './pages/patient/Register';
import PatientLogin from './pages/patient/Login';
import PatientDashboard from './pages/patient/Dashboard';
import PatientAppointments from './pages/appointments/Appointments';
import DoctorLogin from './pages/doctor/Login';
import DoctorDashboard from './pages/doctor/Dashboard';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/patient/login" />;
};

const DoctorRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // assuming shared token
  return token ? children : <Navigate to="/doctor/login" />;
};

function App() {
  return (
    <Router>
      <Routes>

        {/* Patient Routes */}
        <Route path="/patient/register" element={<PatientRegister />} />
        <Route path="/patient/login" element={<PatientLogin />} />
        <Route path="/patient/dashboard" element={<PrivateRoute><PatientDashboard /></PrivateRoute>} />
        <Route path="/patient/appointments" element={<PrivateRoute><PatientAppointments /></PrivateRoute>} />

        {/* Doctor Routes */}
        <Route path="/doctor/login" element={<DoctorLogin />} />
        <Route path="/doctor/dashboard" element={<DoctorRoute><DoctorDashboard /></DoctorRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/patient/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
