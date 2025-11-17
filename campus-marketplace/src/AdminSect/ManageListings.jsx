import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import './Stylng.css';

// Zod schema for a single listing
const listingSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  seller: z.string(),
  status: z.enum(['Pending', 'Approved']),
});

// Zod schema for array of listings
const listingsArraySchema = z.array(listingSchema);

const ManageListings = () => {
  const [listings, setListings] = useState([]);

  // Simulated backend data
  useEffect(() => {
    const fakeListings = [
      { id: 101, title: 'Used Laptop', seller: 'Sara Khan', status: 'Pending' },
      { id: 102, title: 'iPhone 13', seller: 'Ali Raza', status: 'Approved' },
      { id: 103, title: 'Bluetooth Speaker', seller: 'Hamza Malik', status: 'Pending' },
    ];

    // Validate using Zod
    const result = listingsArraySchema.safeParse(fakeListings);

    if (result.success) {
      setListings(result.data);
    } else {
      console.error("Zod validation error:", result.error);
    }
  }, []);

  const handleApprove = (id) => {
    setListings(
      listings.map((l) =>
        l.id === id ? { ...l, status: 'Approved' } : l
      )
    );
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
                    <button
                      className="approve-btn"
                      onClick={() => handleApprove(listing.id)}
                    >
                      Approve
                    </button>
                  )}

                  <button
                    className="delete-btn"
                    onClick={() => handleRemove(listing.id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No listings found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageListings;
