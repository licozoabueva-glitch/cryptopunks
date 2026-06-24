import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

function Dashboard({ socket }) {
  const [stats, setStats] = useState(null);
  const [recentBids, setRecentBids] = useState([]);
  const [topBidders, setTopBidders] = useState([]);
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchDashboardData();

    if (socket) {
      socket.on('newBid', (bid) => {
        console.log('New bid received:', bid);
        fetchDashboardData();
      });
    }

    return () => {
      if (socket) socket.off('newBid');
    };
  }, [socket]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, bidsRes, biddersRes] = await Promise.all([
        axios.get('http://localhost:5000/api/dashboard/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/dashboard/recent-bids?limit=10', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/dashboard/top-bidders', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      setStats(statsRes.data);
      setRecentBids(bidsRes.data);
      setTopBidders(biddersRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="page-title">Dashboard Overview</div>

      {stats && (
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-label">Total Bids</div>
            <div className="stat-value">{stats.totalBids}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Connected Wallets</div>
            <div className="stat-value">{stats.totalWallets}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pending Bids</div>
            <div className="stat-value">{stats.pendingBids}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Bid Amount (ETH)</div>
            <div className="stat-value">{stats.totalBidAmount.toFixed(2)}</div>
          </div>
        </div>
      )}

      <div className="grid-2">
        <div className="card">
          <div className="card-title">📊 Recent Bids</div>
          <table className="table">
            <thead>
              <tr>
                <th>Punk ID</th>
                <th>Bidder</th>
                <th>Amount (ETH)</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentBids.map((bid) => (
                <tr key={bid._id}>
                  <td>#{bid.punkId}</td>
                  <td>{bid.bidderWallet.slice(0, 6)}...{bid.bidderWallet.slice(-4)}</td>
                  <td>{bid.bidAmountETH.toFixed(4)}</td>
                  <td><span className={`badge badge-${bid.status}`}>{bid.status}</span></td>
                  <td>{new Date(bid.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-title">🏆 Top Bidders</div>
          <table className="table">
            <thead>
              <tr>
                <th>Wallet</th>
                <th>Bids</th>
                <th>Total Amount (ETH)</th>
              </tr>
            </thead>
            <tbody>
              {topBidders.map((bidder, idx) => (
                <tr key={idx}>
                  <td>{bidder._id.slice(0, 6)}...{bidder._id.slice(-4)}</td>
                  <td>{bidder.totalBids}</td>
                  <td>{bidder.totalAmount.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
