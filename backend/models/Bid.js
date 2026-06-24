const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema(
  {
    punkId: {
      type: Number,
      required: true,
      index: true
    },
    bidderWallet: {
      type: String,
      required: true,
      lowercase: true,
      index: true
    },
    bidAmount: {
      type: String, // Store as string to handle large numbers
      required: true
    },
    bidAmountETH: {
      type: Number,
      required: true
    },
    bidAmountUSD: {
      type: Number,
      default: null
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'cancelled'],
      default: 'pending'
    },
    transactionHash: {
      type: String,
      default: null
    },
    blockNumber: {
      type: Number,
      default: null
    },
    notes: {
      type: String,
      default: ''
    },
    isVerified: {
      type: Boolean,
      default: false
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

bidSchema.index({ punkId: 1, createdAt: -1 });
bidSchema.index({ bidderWallet: 1, createdAt: -1 });

module.exports = mongoose.model('Bid', bidSchema);
