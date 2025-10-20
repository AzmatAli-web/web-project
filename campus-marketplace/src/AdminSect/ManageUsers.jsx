import React, { useState } from 'react';
import './Stylng.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Ali Raza', email: 'ali@example.com', role: 'Buyer' },
    { id: 2, name: 'Sara Khan', email: 'sara@example.com', role: 'Seller' },
    { id: 3, name: 'Hamza Malik', email: 'hamza@example.com', role: 'Admin' },
  ]);

  const handleDelete = (id) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  const handleEdit = (id) => {
    alert(`Edit feature for user #${id} coming soon `);
  };

  return (
    <div className="admin-page">
      <h2>👥 Manage Users</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(user.id)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="5">No users available</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
