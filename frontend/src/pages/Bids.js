import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Bids.css';

function Bids({ socket }) {
  const [bids, setBids] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchBids();

    if (socket) {
      socket.on('newBid', () => fetchBids());
      socket.on('bidUpdated', () => fetchBids());
    }

    return () => {
      if (socket) {
        socket.off('newBid');
        socket.off('bidUpdated');
      }
    };
  }, [socket]);

  const fetchBids = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/bids/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setBids(res.data.bids);
    } catch (error) {
      console.error('Error fetching bids:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBidStatus = async (bidId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/bids/${bidId}`,
        { status: newStatus },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      fetchBids();
    } catch (error) {
      console.error('Error updating bid:', error);
    }
  };

  const filteredBids = filter === 'all' ? bids : bids.filter(bid => bid.status === filter);

  return (
    <div className="bids-container">
      <h1>Manage Bids</h1>
      
      <div className="filter-buttons">
        <button 
          className={`btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({bids.length})
        </button>
        <button 
          className={`btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending ({bids.filter(b => b.status === 'pending').length})
        </button>
        <button 
          className={`btn ${filter === 'accepted' ? 'active' : ''}`}
          onClick={() => setFilter('accepted')}
        >
          Accepted ({bids.filter(b => b.status === 'accepted').length})
        </button>
        <button 
          className={`btn ${filter === 'rejected' ? 'active' : ''}`}
          onClick={() => setFilter('rejected')}
        >
          Rejected ({bids.filter(b => b.status === 'rejected').length})
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading bids...</div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Punk ID</th>
                <th>Bidder Wallet</th>
                <th>Amount (ETH)</th>
                <th>Amount (USD)</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBids.map((bid) => (
                <tr key={bid._id}>
                  <td>#{bid.punkId}</td>
                  <td className="wallet-address">{bid.bidderWallet}</td>
                  <td>{bid.bidAmountETH.toFixed(4)}</td>
                  <td>${bid.bidAmountUSD ? bid.bidAmountUSD.toFixed(2) : 'N/A'}</td>
                  <td><span className={`badge badge-${bid.status}`}>{bid.status}</span></td>
                  <td>{new Date(bid.createdAt).toLocaleDateString()}</td>
                  <td className="actions">
                    {bid.status === 'pending' && (
                      <>
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={() => updateBidStatus(bid._id, 'accepted')}
                        >
                          Accept
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => updateBidStatus(bid._id, 'rejected')}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Bids;
