import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const HeaderBar = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold text-gray-800">JOB<span className="text-yellow-500">GATE</span></span>
        </div>

        {/* Navigation */}
        <nav className="space-x-6 text-sm font-medium text-gray-700">
          <Link to="/" className="hover:text-blue-600">Dashboard</Link>
          <Link to="/offers" className="hover:text-blue-600">Job Offers</Link>
          <Link to="/tips" className="hover:text-blue-600">Career tips</Link>
        </nav>

        {/* Avatar */}
        <div>
          <FaUserCircle size={28} className="text-gray-500" />
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;
