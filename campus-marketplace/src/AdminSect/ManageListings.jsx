import React, { useState } from 'react';
import './Stylng.css';

const ManageListings = () => {
  const [listings, setListings] = useState([
    { id: 101, title: 'Used Laptop', seller: 'Sara Khan', status: 'Pending' },
    { id: 102, title: 'iPhone 13', seller: 'Ali Raza', status: 'Approved' },
    { id: 103, title: 'Bluetooth Speaker', seller: 'Hamza Malik', status: 'Pending' },
  ]);

  const handleApprove = (id) => {
    setListings(listings.map(l => l.id === id ? { ...l, status: 'Approved' } : l));
  };

  const handleRemove = (id) => {
    setListings(listings.filter((l) => l.id !== id));
  };

  return (
    <div className="admin-page">
      <h2>🏠 Manage Listings</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Seller</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {listings.length > 0 ? (
            listings.map((listing) => (
              <tr key={listing.id}>
                <td>{listing.id}</td>
                <td>{listing.title}</td>
                <td>{listing.seller}</td>
                <td>{listing.status}</td>
                <td>
                  {listing.status !== 'Approved' && (
                    <button className="approve-btn" onClick={() => handleApprove(listing.id)}>Approve</button>
                  )}
                  <button className="delete-btn" onClick={() => handleRemove(listing.id)}>Remove</button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="5">No listings found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageListings;
