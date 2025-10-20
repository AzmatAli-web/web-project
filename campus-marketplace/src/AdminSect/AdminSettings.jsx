import React from "react";
// import './AdminDashboard.css'; // optional styling reuse

function AdminSettings() {
  return (
    <div className="container mt-4 styling">
      <h2 className="text-center mb-4">⚙️ Admin Settings</h2>

      <div className="card p-4 shadow-sm">
        <h5>Profile Settings</h5>
        <p>Change your password, email, or profile picture.</p>

        <h5 className="mt-4">System Preferences</h5>
        <p>Manage site configurations and notifications.</p>

        <button className="btn btn-primary mt-3">Save Changes</button>
      </div>
    </div>
  );
}

export default AdminSettings;
