import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import * as authService from '../services/authService';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch listings from backend
  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.getListings();
      
      // Validate using Zod
      const result = listingsArraySchema.safeParse(data);

      if (result.success) {
        setListings(result.data);
      } else {
        console.error("Zod validation error:", result.error);
        setError("Invalid data format from server");
      }
    } catch (err) {
      console.error("Failed to fetch listings:", err);
      setError(err.message || "Failed to fetch listings");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await authService.approveListing(id);
      setListings(
        listings.map((l) =>
          l.id === id ? { ...l, status: 'Approved' } : l
        )
      );
    } catch (err) {
      console.error("Failed to approve listing:", err);
      alert(err.message || "Failed to approve listing");
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm("Are you sure you want to remove this listing?")) return;
    
    try {
      await authService.removeListing(id);
      setListings(listings.filter((l) => l.id !== id));
    } catch (err) {
      console.error("Failed to remove listing:", err);
      alert(err.message || "Failed to remove listing");
    }
  };

  if (loading) return <div className="admin-page"><p>Loading listings...</p></div>;
  if (error) return <div className="admin-page"><p style={{ color: 'red' }}>{error}</p></div>;

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
