const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    punkId: {
      type: Number,
      required: true,
      unique: true,
      index: true
    },
    ownerWallet: {
      type: String,
      required: true,
      lowercase: true,
      index: true
    },
    image: {
      type: String,
      required: true
    },
    traits: [
      {
        name: String,
        value: String
      }
    ],
    minBidAmount: {
      type: Number,
      default: 0
    },
    currentHighestBid: {
      type: Number,
      default: 0
    },
    currentHighestBidder: {
      type: String,
      default: null,
      lowercase: true
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    description: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Listing', listingSchema);
