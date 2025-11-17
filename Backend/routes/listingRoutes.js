const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listingController");

// GET all listings
router.get("/", listingController.getListings);

// GET listing by ID
router.get("/:id", listingController.getListingById);

// POST create new listing
router.post("/", listingController.createListing);

// PUT update listing (approve/change status)
router.put("/:id", listingController.updateListing);

// DELETE listing
router.delete("/:id", listingController.deleteListing);

module.exports = router;
