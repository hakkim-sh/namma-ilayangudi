const mongoose = require('mongoose');
const Listing = require('../models/Listing');
const adminKey = () => process.env.ADMIN_KEY || 'admin123';

const providedManagementKey = (req) => req.body?.pin || req.body?.adminKey || req.headers['x-admin-key'];
const canManageListing = (req, listing) => providedManagementKey(req) === listing.pin || providedManagementKey(req) === adminKey();

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
    const listing = await Listing.create({ ...listingData, userId, ownerEmail });
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
    if (!canManageListing(req, existingListing)) return res.status(403).json({ message: 'Incorrect PIN or Admin Key' });
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
    if (!canManageListing(req, existingListing)) return res.status(403).json({ message: 'Incorrect PIN or Admin Key' });
    const { userId, ownerEmail, _id, pin, adminKey, ...updatedData } = req.body;
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
