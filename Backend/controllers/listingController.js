// Mock database for listings
let listings = [
  { id: 101, title: 'Used Laptop', seller: 'Sara Khan', status: 'Pending' },
  { id: 102, title: 'iPhone 13', seller: 'Ali Raza', status: 'Approved' },
  { id: 103, title: 'Bluetooth Speaker', seller: 'Hamza Malik', status: 'Pending' },
];

let nextId = 104;

/**
 * GET all listings
 */
exports.getListings = (req, res) => {
  res.json(listings);
};

/**
 * GET single listing by ID
 */
exports.getListingById = (req, res) => {
  const listing = listings.find(l => l.id === parseInt(req.params.id));
  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }
  res.json(listing);
};

/**
 * CREATE new listing
 */
exports.createListing = (req, res) => {
  const { title, seller, status = 'Pending' } = req.body;
  
  if (!title || !seller) {
    return res.status(400).json({ message: "Title and seller are required" });
  }

  const newListing = {
    id: nextId++,
    title,
    seller,
    status,
  };

  listings.push(newListing);
  res.status(201).json({ message: "Listing created", listing: newListing });
};

/**
 * UPDATE listing (approve/change status)
 */
exports.updateListing = (req, res) => {
  const id = parseInt(req.params.id);
  const listing = listings.find(l => l.id === id);

  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }

  if (req.body.status) {
    listing.status = req.body.status;
  }
  if (req.body.title) {
    listing.title = req.body.title;
  }
  if (req.body.seller) {
    listing.seller = req.body.seller;
  }

  res.json({ message: "Listing updated", listing });
};

/**
 * DELETE listing
 */
exports.deleteListing = (req, res) => {
  const id = parseInt(req.params.id);
  const index = listings.findIndex(l => l.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Listing not found" });
  }

  listings.splice(index, 1);
  res.json({ message: "Listing deleted" });
};
