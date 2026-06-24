import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Listings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    try {
      // This would connect to your listings API
      // const res = await axios.get('http://localhost:5000/api/listings/all');
      // setListings(res.data.listings);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '30px 20px' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '20px', color: '#f1f5f9' }}>Punk Listings</h1>
      <div style={{ background: '#1e293b', padding: '30px', borderRadius: '8px', textAlign: 'center', color: '#94a3b8' }}>
        Coming soon - Connect your Punk data source here
      </div>
    </div>
  );
}

export default Listings;
