const mongoose = require('mongoose');
const Listing = require('../models/Listing');
const adminKey = () => process.env.ADMIN_KEY || 'admin123';

const verifyAdminKey = (req, res) => {
  if (req.headers['x-admin-key'] !== adminKey()) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return false;
  }
  return true;
};

const canManageListing = (req, listing) => req.user?.role === 'admin' || req.headers['x-admin-key'] === adminKey() || (req.user && listing.ownerEmail && listing.ownerEmail.toLowerCase() === req.user.email.toLowerCase());

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getApprovedListings = async (req, res, next) => {
  try {
    const { category, subcategory, locality, location, keyword } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (locality || location) filter.locality = { $regex: escapeRegex(locality || location), $options: 'i' };
    if (keyword) {
      const search = { $regex: escapeRegex(keyword), $options: 'i' };
      filter.$or = [{ title: search }, { locality: search }, { category: search }, { subcategory: search }];
    }

    const listings = await Listing.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: listings.length, data: listings });
  } catch (error) {
    next(error);
  }
};

const getListingById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid listing id' });
    }

    const listing = await Listing.findOneAndUpdate(
      { _id: req.params.id, isApproved: true },
      { $inc: { views: 1 } },
      { new: true, runValidators: true }
    );

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    res.json({ success: true, data: listing });
  } catch (error) {
    next(error);
  }
};

const addListing = async (req, res, next) => {
  try {
    const { userId, ownerEmail, ...listingData } = req.body;
    const listing = await Listing.create({ ...listingData, userId: req.user._id, ownerEmail: req.user.email });
    res.status(201).json({ success: true, message: 'Listing saved to MongoDB Atlas', data: listing });
  } catch (error) {
    next(error);
  }
};

const getPendingListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({ isApproved: false }).sort({ createdAt: -1 });
    res.json({ success: true, count: listings.length, data: listings });
  } catch (error) {
    next(error);
  }
};

const approveListing = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid listing id' });
    }

    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true, runValidators: true }
    );

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    res.json({ success: true, message: 'Listing approved', data: listing });
  } catch (error) {
    next(error);
  }
};

const deleteListing = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid listing id' });
    }

    const existingListing = await Listing.findById(req.params.id);
    if (!existingListing) return res.status(404).json({ success: false, message: 'Listing not found' });
    if (!canManageListing(req, existingListing)) return res.status(403).json({ success: false, message: 'You do not have permission to delete this listing' });
    const listing = await Listing.findByIdAndDelete(req.params.id);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    res.json({ success: true, message: 'Listing deleted' });
  } catch (error) {
    next(error);
  }
};

const updateListing = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid listing id' });
    const existingListing = await Listing.findById(req.params.id);
    if (!existingListing) return res.status(404).json({ success: false, message: 'Listing not found' });
    if (!canManageListing(req, existingListing)) return res.status(403).json({ success: false, message: 'You do not have permission to edit this listing' });
    const { userId, ownerEmail, _id, ...updatedData } = req.body;
    const listing = await Listing.findByIdAndUpdate(req.params.id, updatedData, { new: true, runValidators: true });
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });
    res.json({ success: true, data: listing });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getApprovedListings,
  getListingById,
  addListing,
  getPendingListings,
  approveListing,
  deleteListing,
  updateListing,
};
