const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true
    },
    username: {
      type: String,
      default: null
    },
    email: {
      type: String,
      default: null,
      lowercase: true
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationTimestamp: {
      type: Date,
      default: null
    },
    totalBids: {
      type: Number,
      default: 0
    },
    acceptedBids: {
      type: Number,
      default: 0
    },
    totalBidAmount: {
      type: Number,
      default: 0
    },
    profileImage: {
      type: String,
      default: null
    },
    bio: {
      type: String,
      default: ''
    },
    twitterHandle: {
      type: String,
      default: null
    },
    discordUsername: {
      type: String,
      default: null
    },
    lastActivity: {
      type: Date,
      default: Date.now
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

module.exports = mongoose.model('Wallet', walletSchema);
