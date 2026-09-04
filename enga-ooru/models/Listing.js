const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 150 },
  category: { type: String, required: [true, 'Category is required'], trim: true },
  subcategory: { type: String, required: [true, 'Subcategory is required'], trim: true },
  price: { type: mongoose.Schema.Types.Mixed },
  priceType: { type: String, trim: true },
  locality: { type: String, required: [true, 'Locality is required'], trim: true },
  whatsappNumber: { type: String, required: [true, 'WhatsApp number is required'], trim: true },
  description: { type: String, required: [true, 'Description is required'], trim: true },
  images: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

listingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Listing', listingSchema);
