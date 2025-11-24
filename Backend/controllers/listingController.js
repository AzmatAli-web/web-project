const Listing = require('../models/listing');
const db = require('../config/database'); // Import once

const getListings = (req, res) => {
  // Join with user data
  const listingsWithUser = db.listings.map(listing => {
    const user = db.users.find(u => u.id === listing.userId);
    return {
      ...listing,
      user: user ? { id: user.id, name: user.name, email: user.email } : null
    };
  });
  
  res.json(listingsWithUser);
};

const getListingById = (req, res) => {
  const listing = db.listings.find(l => l.id === parseInt(req.params.id));
  
  if (!listing) {
    return res.status(404).json({ message: 'Listing not found' });
  }

  // Join with user data
  const user = db.users.find(u => u.id === listing.userId);
  const listingWithUser = {
    ...listing,
    user: user ? { id: user.id, name: user.name, email: user.email } : null
  };
  
  res.json(listingWithUser);
};

const createListing = (req, res) => {
  const { title, description, price } = req.body;

  const listing = new Listing(title, description, price, req.user.userId);
  listing.id = db.listingIdCounter;
  db.listings.push(listing);
  db.listingIdCounter++;

  res.status(201).json({
    message: 'Listing created successfully',
    listing
  });
};

const getUserListings = (req, res) => {
  const userListings = db.listings.filter(l => l.userId === parseInt(req.params.userId));
  res.json(userListings);
};

const updateListing = (req, res) => {
  const listingIndex = db.listings.findIndex(l => l.id === parseInt(req.params.id));
  
  if (listingIndex === -1) {
    return res.status(404).json({ message: 'Listing not found' });
  }

  // Check if user owns the listing
  if (db.listings[listingIndex].userId !== req.user.userId) {
    return res.status(403).json({ message: 'Not authorized to update this listing' });
  }

  const { title, description, price } = req.body;
  
  db.listings[listingIndex] = {
    ...db.listings[listingIndex],
    title: title || db.listings[listingIndex].title,
    description: description || db.listings[listingIndex].description,
    price: price || db.listings[listingIndex].price
  };

  res.json({
    message: 'Listing updated successfully',
    listing: db.listings[listingIndex]
  });
};

const deleteListing = (req, res) => {
  const listingIndex = db.listings.findIndex(l => l.id === parseInt(req.params.id));
  
  if (listingIndex === -1) {
    return res.status(404).json({ message: 'Listing not found' });
  }

  // Check if user owns the listing
  if (db.listings[listingIndex].userId !== req.user.userId) {
    return res.status(403).json({ message: 'Not authorized to delete this listing' });
  }

  db.listings.splice(listingIndex, 1);
  res.json({ message: 'Listing deleted successfully' });
};

module.exports = {
  getListings,
  getListingById,
  createListing,
  getUserListings,
  updateListing,
  deleteListing
};