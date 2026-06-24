const express = require('express');
const router = express.Router();
const Bid = require('../models/Bid');
const Wallet = require('../models/Wallet');
const Listing = require('../models/Listing');

// Dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const totalBids = await Bid.countDocuments();
    const totalWallets = await Wallet.countDocuments({ isVerified: true });
    const pendingBids = await Bid.countDocuments({ status: 'pending' });
    const acceptedBids = await Bid.countDocuments({ status: 'accepted' });
    const totalBidAmount = await Bid.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$bidAmountETH' }
        }
      }
    ]);

    res.json({
      totalBids,
      totalWallets,
      pendingBids,
      acceptedBids,
      totalBidAmount: totalBidAmount[0]?.total || 0,
      averageBid: totalBids > 0 ? (totalBidAmount[0]?.total || 0) / totalBids : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Recent bids
router.get('/recent-bids', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const bids = await Bid.find().sort({ createdAt: -1 }).limit(limit);
    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Top bidders
router.get('/top-bidders', async (req, res) => {
  try {
    const topBidders = await Bid.aggregate([
      {
        $group: {
          _id: '$bidderWallet',
          totalBids: { $sum: 1 },
          totalAmount: { $sum: '$bidAmountETH' },
          maxBid: { $max: '$bidAmountETH' }
        }
      },
      { $sort: { totalAmount: -1 } },
      { $limit: 10 }
    ]);

    res.json(topBidders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Top punks by bids
router.get('/top-punks', async (req, res) => {
  try {
    const topPunks = await Bid.aggregate([
      {
        $group: {
          _id: '$punkId',
          bidCount: { $sum: 1 },
          highestBid: { $max: '$bidAmountETH' },
          totalAmount: { $sum: '$bidAmountETH' }
        }
      },
      { $sort: { bidCount: -1 } },
      { $limit: 10 }
    ]);

    res.json(topPunks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
