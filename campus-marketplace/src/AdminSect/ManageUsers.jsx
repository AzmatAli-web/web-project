import React, { useState, useEffect } from 'react';
import './Stylng.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  // Fetch users from backend
  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));
  }, []);

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/users/${id}`, {
      method: "DELETE"
    })
      .then(res => res.json())
      .then(() => {
        setUsers(users.filter(u => u.id !== id));
      });
  };

  const handleEdit = (id) => {
    alert(`Edit feature for user #${id} coming soon`);
  };

  return (
    <div className="admin-page">
      <h2>👥 Manage Users</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Actions</th>
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
            <tr><td colSpan="5">Loading...</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
