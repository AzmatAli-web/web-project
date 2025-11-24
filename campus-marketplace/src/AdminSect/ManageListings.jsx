import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import './Stylng.css';
import { listingService } from '../services/sellpage'; // Import listing service

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

  // Load listings from backend on component mount
  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use listingService to fetch listings from backend
      const listingsData = await listingService.getAllListings();
      
      // Validate using Zod
      const result = listingsArraySchema.safeParse(listingsData);

      if (result.success) {
        setListings(result.data);
      } else {
        console.error("Zod validation error:", result.error);
        setError("Invalid data format");
      }
    } catch (err) {
      console.error("Failed to load listings:", err);
      setError(err.message || "Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      // Use listingService to approve listing
      await listingService.approveListing(id);
      setListings(
        listings.map((l) =>
          l.id === id ? { ...l, status: 'Approved' } : l
        )
      );
      console.log("Listing approved:", id);
    } catch (err) {
      console.error("Error updating listing:", err);
      alert("Failed to approve listing");
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm("Are you sure you want to remove this listing?")) return;
    
    try {
      // Use listingService to delete listing
      await listingService.deleteListing(id);
      setListings(listings.filter((l) => l.id !== id));
      console.log("Listing removed:", id);
    } catch (err) {
      console.error("Error removing listing:", err);
      alert("Failed to remove listing");
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