// AdminSect/Admin.jsx
import React, { useState } from 'react';
import AdminDashboard from './AdminSect/AdminDashboard';
import AdminAnalytics from './AdminSect/AdminAnalytics';
import AdminReports from './AdminSect/AdminReports';
import ManageUsers from './AdminSect/ManageUsers';
import ManageListings from './AdminSect/ManageListings';

const Admin = () => {
  const [activePage, setActivePage] = useState('dashboard');

  const pages = {
    dashboard: <AdminDashboard />,
    analytics: <AdminAnalytics />,
    reports: <AdminReports />,
    users: <ManageUsers />,
    listings: <ManageListings />,
  };

  const menuItems = [
    { key: 'dashboard', icon: '📊', label: 'Dashboard' },
    { key: 'analytics', icon: '📈', label: 'Analytics' },
    { key: 'reports', icon: '📋', label: 'Reports' },
    { key: 'users', icon: '👥', label: 'Manage Users' },
    { key: 'listings', icon: '🏠', label: 'Manage Listings' },
  ];

  return (
    
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 bg-dark text-white vh-100 p-3">
          <h4 className="text-white mb-4">Admin Panel</h4>
          
          {menuItems.map(item => (
            <button
              key={item.key}
              className={`btn w-100 text-start text-white mb-2 ${activePage === item.key ? 'btn-primary' : 'btn-dark'}`}
              onClick={() => setActivePage(item.key)}
            >
              {item.icon} {item.label}
            </button>
          ))}
          
          <div className="mt-5 pt-3 border-top">
            <button 
              className="btn btn-outline-light w-100"
              onClick={() => window.location.href = '/'}
            >
              ← Back to Site
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-9 p-4">
          {pages[activePage]}
        </div>
      </div>
    </div>
  );
};

export default Admin;