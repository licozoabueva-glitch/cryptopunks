# CryptoPunks Admin Dashboard

A comprehensive admin dashboard for managing CryptoPunk bids, wallets, and transactions.

## Features

✅ **Real-time Bid Management**
- View all incoming bids in real-time
- Accept or reject pending bids
- Track bid history and status

✅ **Wallet Management**
- Monitor connected wallets
- Track wallet activity and bid history
- Verify wallet addresses

✅ **Live Notifications**
- Real-time alerts when new bids arrive
- WebSocket integration via Socket.IO
- Instant dashboard updates

✅ **Analytics Dashboard**
- Total bids and connected wallets stats
- Top bidders leaderboard
- Bid trends and patterns
- Revenue tracking

✅ **Admin Authentication**
- Secure login system
- JWT token-based authentication
- Role-based access control

## Project Structure

```
├── backend/
│   ├── models/
│   │   ├── Bid.js
│   │   ├── Wallet.js
│   │   ├── Listing.js
│   │   └── Admin.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── bids.js
│   │   ├── wallets.js
│   │   └── dashboard.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Bids.js
│   │   │   ├── Wallets.js
│   │   │   └── Listings.js
│   │   ├── components/
│   │   │   └── Navbar.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
```

## Installation

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Install MongoDB (local or use MongoDB Atlas):
```bash
# Make sure MongoDB is running on localhost:27017
# Or update MONGODB_URI in .env
```

4. Start the server:
```bash
npm run dev  # with nodemon for development
# or
npm start
```

Server runs on: `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
npm install
```

2. Start React development server:
```bash
npm start
```

App runs on: `http://localhost:3000`

## Default Admin Credentials

```
Email: admin@cryptopunks.com
Password: change_this_password
```

⚠️ **Important**: Change these credentials in production!

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify token

### Bids
- `POST /api/bids/create` - Create new bid
- `GET /api/bids/all` - Get all bids
- `GET /api/bids/punk/:punkId` - Get bids for specific punk
- `GET /api/bids/wallet/:address` - Get bids by wallet
- `PUT /api/bids/:bidId` - Update bid status

### Wallets
- `GET /api/wallets/all` - Get all wallets
- `GET /api/wallets/:address` - Get wallet details
- `POST /api/wallets/connect` - Connect/verify wallet
- `PUT /api/wallets/:address` - Update wallet profile

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/recent-bids` - Recent bids
- `GET /api/dashboard/top-bidders` - Top bidders
- `GET /api/dashboard/top-punks` - Top punks by bids

## Web3 Integration

To integrate wallet connection (MetaMask, WalletConnect, etc.):

1. Install web3 packages (already in package.json):
```bash
npm install web3 @web3-react/core
```

2. Create a wallet connection component:
```javascript
// frontend/src/components/WalletConnect.js
```

3. Handle wallet events and send bids to backend

## Real-time Features

Socket.IO is configured for real-time updates:
- New bids arrive instantly
- Bid status changes update immediately
- Wallet connections broadcast in real-time

Events:
- `newBid` - New bid created
- `bidUpdated` - Bid status changed
- `walletConnected` - New wallet connected

## Database Models

### Bid
- `punkId` - CryptoPunk ID
- `bidderWallet` - Wallet address
- `bidAmount` - Amount in wei
- `bidAmountETH` - Amount in ETH
- `bidAmountUSD` - Amount in USD
- `status` - pending, accepted, rejected, cancelled
- `transactionHash` - Blockchain transaction hash
- `isVerified` - Verified on-chain

### Wallet
- `address` - Wallet address
- `username` - User's display name
- `email` - Email address
- `isVerified` - Wallet verified
- `totalBids` - Number of bids placed
- `acceptedBids` - Number of accepted bids
- `totalBidAmount` - Total amount bid in ETH

### Listing
- `punkId` - Punk ID
- `ownerWallet` - Owner's wallet
- `currentHighestBid` - Highest bid amount
- `currentHighestBidder` - Highest bidder wallet
- `isActive` - Listing active status

## Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/cryptopunks-admin
PORT=5000
JWT_SECRET=your_jwt_secret_key
WEB3_PROVIDER_URL=https://mainnet.infura.io/v3/YOUR_KEY
NODE_ENV=development
```

## Security Considerations

1. **JWT Secret**: Change `JWT_SECRET` in production
2. **CORS**: Update CORS origin in `server.js` for production
3. **Database**: Use strong MongoDB credentials
4. **Wallet Verification**: Implement signature verification for bids
5. **Rate Limiting**: Add rate limiting for API endpoints
6. **Input Validation**: All inputs are validated server-side

## Production Deployment

1. Set environment variables on server
2. Use MongoDB Atlas or similar managed database
3. Configure HTTPS/SSL
4. Set `NODE_ENV=production`
5. Deploy backend (Heroku, AWS, DigitalOcean, etc.)
6. Deploy frontend (Vercel, Netlify, AWS S3, etc.)
7. Update API endpoints in frontend config

## Troubleshooting

**MongoDB connection error:**
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`

**Port already in use:**
- Change PORT in `.env`
- Kill existing process: `lsof -i :5000`

**CORS errors:**
- Update CORS origin in backend `server.js`
- Ensure frontend and backend URLs match

**Socket.IO not connecting:**
- Check Socket.IO configuration matches
- Verify firewall allows WebSocket connections

## Future Enhancements

- [ ] Email notifications for new bids
- [ ] SMS alerts
- [ ] Export reports (CSV, PDF)
- [ ] Advanced filtering and search
- [ ] Bid history analytics
- [ ] Automated bid acceptance rules
- [ ] Multi-chain support
- [ ] Admin user management
- [ ] Audit logs
- [ ] 2FA for admin login

## License

MIT

## Support

For issues or questions, please create an issue on GitHub or contact support.
