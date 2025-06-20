import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const PatientNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand */}
          <div className="flex-shrink-0">
            <Link to="/patient/dashboard" className="text-xl font-bold text-blue-600">
              MediPortal
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <Link
              to="/patient/dashboard"
              className={`text-gray-700 hover:text-blue-600 ${
                isActive('/patient/dashboard') ? 'font-semibold text-blue-600' : ''
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/patient/appointments"
              className={`text-gray-700 hover:text-blue-600 ${
                isActive('/patient/appointments') ? 'font-semibold text-blue-600' : ''
              }`}
            >
              Appointments
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/patient/login';
              }}
              className="text-red-500 hover:underline"
            >
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 focus:outline-none"
              aria-label="Toggle menu"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4">
          <Link
            to="/patient/dashboard"
            className="block py-2 text-gray-700 hover:text-blue-600"
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/patient/appointments"
            className="block py-2 text-gray-700 hover:text-blue-600"
            onClick={() => setMenuOpen(false)}
          >
            Appointments
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/patient/login';
            }}
            className="block py-2 text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default PatientNavbar;
