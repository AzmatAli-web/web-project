import React, { useState, useEffect } from "react";
import "./Stylng.css";
import userService from "../services/userService"; // ✅ Use our existing userService

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  // Fetch users from backend
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Use userService to fetch users (requires admin token)
      const userData = await userService.getAllUsers();
      setUsers(userData || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError("Failed to fetch users: " + (err.message || 'Please check admin permissions'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (userId) => {
    setActionLoading(userId);
    try {
      await userService.approveUser(userId);
      // Update user status in local state
      setUsers(prev => prev.map(user => 
        user._id === userId ? { ...user, status: 'approved' } : user
      ));
      alert('User approved successfully!');
    } catch (err) {
      console.error('Error approving user:', err);
      alert("Failed to approve user: " + (err.message || 'Please try again'));
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    
    setActionLoading(userId);
    try {
      await userService.deleteUser(userId);
      // Remove user from local state
      setUsers(prev => prev.filter(user => user._id !== userId));
      alert('User deleted successfully!');
    } catch (err) {
      console.error('Error deleting user:', err);
      alert("Failed to delete user: " + (err.message || 'Please try again'));
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = (user) => {
    alert(`Edit feature for ${user.name} coming soon`);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'bg-warning', text: 'Pending' },
      approved: { class: 'bg-success', text: 'Approved' },
      suspended: { class: 'bg-danger', text: 'Suspended' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <span className={`badge ${config.class} text-white`}>{config.text}</span>;
  };

  const getRoleBadge = (role) => {
    return role === 'admin' 
      ? <span className="badge bg-primary text-white">Admin</span>
      : <span className="badge bg-secondary text-white">User</span>;
  };

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-2">Loading users...</p>
    </div>
  );

  if (error) return (
    <div className="alert alert-danger" role="alert">
      {error}
      <div className="mt-2">
        <button className="btn btn-sm btn-outline-danger" onClick={fetchUsers}>
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="admin-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>👥 Manage Users</h2>
        <button className="btn btn-outline-primary btn-sm" onClick={fetchUsers}>
          🔄 Refresh
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          {users.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <strong>{user.name}</strong>
                        {user._id === JSON.parse(localStorage.getItem('user'))?.id && (
                          <span className="badge bg-info ms-1">You</span>
                        )}
                      </td>
                      <td>{user.email}</td>
                      <td>{getRoleBadge(user.role)}</td>
                      <td>{getStatusBadge(user.status)}</td>
                      <td>
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          {user.status === 'pending' && (
                            <button 
                              className="btn btn-success"
                              onClick={() => handleApprove(user._id)}
                              disabled={actionLoading === user._id}
                              title="Approve User"
                            >
                              {actionLoading === user._id ? (
                                <span className="spinner-border spinner-border-sm" />
                              ) : (
                                '✓ Approve'
                              )}
                            </button>
                          )}
                          
                          <button 
                            className="btn btn-outline-primary"
                            onClick={() => handleEdit(user)}
                            title="Edit User"
                          >
                            Edit
                          </button>
                          
                          {/* Prevent admin from deleting themselves */}
                          {user._id !== JSON.parse(localStorage.getItem('user'))?.id && (
                            <button 
                              className="btn btn-outline-danger"
                              onClick={() => handleDelete(user._id)}
                              disabled={actionLoading === user._id}
                              title="Delete User"
                            >
                              {actionLoading === user._id ? (
                                <span className="spinner-border spinner-border-sm" />
                              ) : (
                                'Delete'
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted">No users found in the system.</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="row mt-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <h4>{users.length}</h4>
              <small>Total Users</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <h4>{users.filter(u => u.status === 'approved').length}</h4>
              <small>Approved</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body text-center">
              <h4>{users.filter(u => u.status === 'pending').length}</h4>
              <small>Pending</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body text-center">
              <h4>{users.filter(u => u.role === 'admin').length}</h4>
              <small>Admins</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;