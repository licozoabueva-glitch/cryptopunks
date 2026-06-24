const express = require('express');
const router = express.Router();
const Wallet = require('../models/Wallet');

// Get all wallets
router.get('/all', async (req, res) => {
  try {
    const wallets = await Wallet.find().sort({ createdAt: -1 });
    res.json({ count: wallets.length, wallets });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get wallet details
router.get('/:address', async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ address: req.params.address.toLowerCase() });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }
    res.json(wallet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Connect/verify wallet
router.post('/connect', async (req, res) => {
  try {
    const { address, username, email } = req.body;

    if (!address) {
      return res.status(400).json({ message: 'Wallet address is required' });
    }

    let wallet = await Wallet.findOne({ address: address.toLowerCase() });
    if (!wallet) {
      wallet = new Wallet({
        address: address.toLowerCase(),
        username,
        email,
        isVerified: true,
        verificationTimestamp: new Date()
      });
    } else {
      wallet.isVerified = true;
      wallet.verificationTimestamp = new Date();
      if (username) wallet.username = username;
      if (email) wallet.email = email;
    }

    await wallet.save();

    // Emit via Socket.IO
    const io = req.app.get('io');
    io.emit('walletConnected', wallet);

    res.json({ message: 'Wallet connected successfully', wallet });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update wallet profile
router.put('/:address', async (req, res) => {
  try {
    const wallet = await Wallet.findOneAndUpdate(
      { address: req.params.address.toLowerCase() },
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    res.json({ message: 'Wallet updated', wallet });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
