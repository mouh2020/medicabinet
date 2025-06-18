import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/patient/Register';
import Login from './pages/patient/Login';
import Dashboard from './pages/patient/Dashboard';
import Appointments from './pages/appointments/Appointments';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/patient/register" element={<Register />} />
        <Route path="/patient/login" element={<Login />} />
        <Route 
          path="/patient/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route path="/patient/appointments" element={
          <PrivateRoute>
            <Appointments />
          </PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
