const express = require('express');
const {
  getApprovedListings,
  getListingById,
  addListing,
  getPendingListings,
  approveListing,
  deleteListing,
  updateListing,
} = require('../controllers/listingController');

const router = express.Router();

router.get('/', getApprovedListings);
router.post('/', addListing);
router.put('/:id', updateListing);
router.delete('/:id', deleteListing);
router.post('/add', addListing);
router.get('/admin/pending', getPendingListings);
router.put('/admin/approve/:id', approveListing);
router.delete('/admin/:id', deleteListing);
router.get('/:id', getListingById);

module.exports = router;
