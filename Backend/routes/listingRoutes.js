const express = require('express');
const {
  getListings,
  getListingById,
  createListing,
  getUserListings,
  updateListing,
  deleteListing
} = require('../controllers/listingController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', getListings);
router.get('/:id', getListingById);
router.get('/user/:userId', getUserListings);
router.post('/', auth, createListing);
router.put('/:id', auth, updateListing);
router.delete('/:id', auth, deleteListing);

module.exports = router;