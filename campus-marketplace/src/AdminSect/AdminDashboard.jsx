// AdminSect/AdminDashboard.jsx
import React from 'react';

const AdminDashboard = () => {
  return (
    <div>
      <h1 className="mb-4">Dashboard</h1>
      <div className="row">
        <div className="col-md-3 mb-3">
          <div className="card text-bg-primary">
            <div className="card-body">
              <h3>1,254</h3>
              <p>Total Users</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-bg-success">
            <div className="card-body">
              <h3>324</h3>
              <p>Active Listings</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-bg-warning">
            <div className="card-body">
              <h3>$12,540</h3>
              <p>Revenue</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-bg-danger">
            <div className="card-body">
              <h3>18</h3>
              <p>Pending Actions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;