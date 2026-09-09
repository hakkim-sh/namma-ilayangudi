const express = require('express');
const { authenticateToken } = require('../middleware/auth');
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
router.post('/', authenticateToken, addListing);
router.put('/:id', authenticateToken, updateListing);
router.delete('/:id', authenticateToken, deleteListing);
router.post('/add', authenticateToken, addListing);
router.get('/admin/pending', getPendingListings);
router.put('/admin/approve/:id', approveListing);
router.delete('/admin/:id', deleteListing);
router.get('/:id', getListingById);

module.exports = router;
