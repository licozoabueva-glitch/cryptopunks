import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Wallets.css';

function Wallets() {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/wallets/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setWallets(res.data.wallets);
    } catch (error) {
      console.error('Error fetching wallets:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wallets-container">
      <h1>Connected Wallets</h1>

      {loading ? (
        <div className="loading">Loading wallets...</div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Wallet Address</th>
                <th>Username</th>
                <th>Email</th>
                <th>Total Bids</th>
                <th>Accepted Bids</th>
                <th>Total Amount (ETH)</th>
                <th>Status</th>
                <th>Connected Date</th>
              </tr>
            </thead>
            <tbody>
              {wallets.map((wallet) => (
                <tr key={wallet._id}>
                  <td className="wallet-address">{wallet.address}</td>
                  <td>{wallet.username || '-'}</td>
                  <td>{wallet.email || '-'}</td>
                  <td>{wallet.totalBids}</td>
                  <td>{wallet.acceptedBids}</td>
                  <td>{wallet.totalBidAmount.toFixed(4)}</td>
                  <td>
                    {wallet.isVerified ? (
                      <span className="badge badge-verified">✓ Verified</span>
                    ) : (
                      <span className="badge">Unverified</span>
                    )}
                  </td>
                  <td>{new Date(wallet.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Wallets;
