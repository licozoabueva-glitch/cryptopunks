const express = require('express');
const router = express.Router();
const Bid = require('../models/Bid');
const Wallet = require('../models/Wallet');
const Listing = require('../models/Listing');

// Create new bid
router.post('/create', async (req, res) => {
  try {
    const { punkId, bidderWallet, bidAmount, bidAmountETH } = req.body;

    if (!punkId || !bidderWallet || !bidAmount || !bidAmountETH) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create bid
    const bid = new Bid({
      punkId,
      bidderWallet: bidderWallet.toLowerCase(),
      bidAmount,
      bidAmountETH,
      status: 'pending'
    });

    await bid.save();

    // Update or create wallet
    let wallet = await Wallet.findOne({ address: bidderWallet.toLowerCase() });
    if (!wallet) {
      wallet = new Wallet({ address: bidderWallet.toLowerCase() });
    }
    wallet.totalBids = (wallet.totalBids || 0) + 1;
    wallet.lastActivity = new Date();
    await wallet.save();

    // Update listing
    let listing = await Listing.findOne({ punkId });
    if (!listing) {
      listing = new Listing({ punkId });
    }
    if (bidAmountETH > (listing.currentHighestBid || 0)) {
      listing.currentHighestBid = bidAmountETH;
      listing.currentHighestBidder = bidderWallet.toLowerCase();
    }
    await listing.save();

    // Emit real-time notification via Socket.IO
    const io = req.app.get('io');
    io.emit('newBid', {
      punkId,
      bidderWallet,
      bidAmountETH,
      timestamp: new Date()
    });

    res.status(201).json({
      message: 'Bid created successfully',
      bid
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all bids
router.get('/all', async (req, res) => {
  try {
    const bids = await Bid.find().sort({ createdAt: -1 });
    res.json({ count: bids.length, bids });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get bids by punk
router.get('/punk/:punkId', async (req, res) => {
  try {
    const bids = await Bid.find({ punkId: req.params.punkId }).sort({ bidAmountETH: -1 });
    res.json({ punkId: req.params.punkId, count: bids.length, bids });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get bids by wallet
router.get('/wallet/:address', async (req, res) => {
  try {
    const bids = await Bid.find({ bidderWallet: req.params.address.toLowerCase() }).sort({ createdAt: -1 });
    res.json({ wallet: req.params.address, count: bids.length, bids });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update bid status
router.put('/:bidId', async (req, res) => {
  try {
    const { status, notes } = req.body;
    const bid = await Bid.findByIdAndUpdate(
      req.params.bidId,
      { status, notes, updatedAt: new Date() },
      { new: true }
    );

    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    // Emit update via Socket.IO
    const io = req.app.get('io');
    io.emit('bidUpdated', bid);

    res.json({ message: 'Bid updated', bid });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
