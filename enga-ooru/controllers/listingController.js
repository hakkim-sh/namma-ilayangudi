const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Listing = require('../models/Listing');

// Helper to verify Admin Key or User PIN
const verifyAccess = async (req, listing) => {
  const candidate = String(
    req.body?.adminKey || 
    req.body?.pin || 
    req.query?.adminKey || 
    req.query?.pin || 
    req.headers['x-admin-key'] || 
    req.headers['x-pin'] || 
    ''
  ).trim();

  const masterKey = String(process.env.ADMIN_KEY || 'admin123').trim();

  // 1. Direct Master Admin Bypass
  if (candidate === 'admin123' || candidate === masterKey) {
    return true;
  }

  // 2. Listing Owner PIN Check
  if (listing.pin && candidate) {
    const storedPin = String(listing.pin).trim();
    if (storedPin.startsWith('$2a$') || storedPin.startsWith('$2b$')) {
      return await bcrypt.compare(candidate, storedPin);
    }
    return storedPin === candidate;
  }

  return false;
};


// GET approved listings
const getApprovedListings = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let query = { status: { $ne: 'pending' } };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { locality: { $regex: search, $options: 'i' } }
      ];
    }

    const listings = await Listing.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: listings.length, data: listings });
  } catch (error) {
    next(error);
  }
};

// GET single listing
const getListingById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid listing ID' });
    }

    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    res.json({ success: true, data: listing });
  } catch (error) {
    next(error);
  }
};

// ADD listing
const addListing = async (req, res, next) => {
  try {
    const listingData = { ...req.body };

    if (listingData.pin) {
      listingData.pin = String(listingData.pin).trim();
    }

    const newListing = await Listing.create(listingData);
    res.status(201).json({ success: true, data: newListing });
  } catch (error) {
    next(error);
  }
};

// GET pending listings
const getPendingListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.json({ success: true, data: listings });
  } catch (error) {
    next(error);
  }
};

// APPROVE listing
const approveListing = async (req, res, next) => {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    res.json({ success: true, data: listing });
  } catch (error) {
    next(error);
  }
};

// UPDATE listing
const updateListing = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid listing ID' });
    }

    const existingListing = await Listing.findById(req.params.id);
    if (!existingListing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    const hasAccess = await verifyAccess(req, existingListing);
    if (!hasAccess) {
      return res.status(403).json({ success: false, message: 'Incorrect PIN or Admin Key' });
    }

    const updatedData = { ...req.body };
    delete updatedData.pin;

    const updatedListing = await Listing.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, message: 'Listing updated successfully', data: updatedListing });
  } catch (error) {
    next(error);
  }
};

// DELETE listing (Strict Admin Master Key or Owner PIN)
// DELETE listing (Strict Admin Master Key or Owner PIN)
const deleteListing = async (req, res, next) => {
  try {
    console.log('--- DELETE REQUEST RECEIVED ---');
    console.log('Params ID:', req.params.id);
    console.log('Body:', req.body);
    console.log('Query:', req.query);

    const candidate = String(
      req.body?.adminKey || 
      req.body?.pin || 
      req.query?.adminKey || 
      req.query?.pin || 
      req.headers['x-admin-key'] || 
      req.headers['x-pin'] || 
      ''
    ).trim();

    console.log('Candidate Key received:', candidate);

    // Master Key Bypass - Direct Match
    if (candidate === 'admin123') {
      console.log('Master Key matched! Deleting from DB...');
      const deletedItem = await Listing.findByIdAndDelete(req.params.id);
      console.log('Deleted result:', deletedItem ? 'SUCCESS' : 'NOT FOUND');
      return res.json({ success: true, message: 'Listing deleted successfully' });
    }

    // Normal PIN check
    const existingListing = await Listing.findById(req.params.id);
    if (!existingListing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    const hasAccess = await verifyAccess(req, existingListing);
    if (!hasAccess) {
      console.log('Access Denied for candidate:', candidate);
      return res.status(403).json({ success: false, message: 'Incorrect PIN or Admin Key' });
    }

    await Listing.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Delete Error:', error);
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
  updateListing
};