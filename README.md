# Real-Time Crypto Price Tracker

A responsive React + Redux Toolkit application that tracks real-time cryptocurrency prices using the CoinGecko API.


## Features

- **Live data from CoinGecko**: Real cryptocurrency market data
- **Auto-refreshing**: Updates every 10 seconds
- **Responsive design**: Works on mobile, tablet, and desktop
- **Redux state management**: All data managed through Redux Toolkit
- **Visual price charts**: 7-day sparkline charts for each cryptocurrency
- **Performance optimized**: Using selectors and memo to prevent unnecessary rerenders

## Tech Stack

- React 18
- Redux Toolkit for state management
- Tailwind CSS for styling
- CoinGecko API for cryptocurrency data

## Architecture

```
src/
├── app/
│   └── store.js             # Redux store configuration
├── components/
│   ├── CryptoTable.jsx      # Main table component
│   ├── CryptoRow.jsx        # Individual crypto row component
│   └── SparklineChart.jsx   # SVG sparkline chart component
├── features/
│   └── crypto/
│       └── cryptoSlice.js   # Redux slice with async thunks
├── services/
│   └── cryptoService.js     # Service to manage API calls
├── App.jsx                  # Main app component
└── index.js                 # Entry point
```

## State Management Flow

1. The app initializes and starts the CryptoApiService
2. CryptoApiService dispatches the fetchCryptoData async thunk
3. Redux handles the pending/fulfilled/rejected states
4. Data is fetched from CoinGecko API and stored in Redux
5. Components access data via selectors and render
6. Every 10 seconds, new data is fetched and the cycle repeats

## Setup Instructions

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/crypto-tracker.git
   cd crypto-tracker
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## CoinGecko API

This project uses the free tier of the [CoinGecko API](https://www.coingecko.com/en/api/documentation). Please be aware of rate limits:
- 10-30 calls per minute
- No API key required for basic endpoints

## License

MIT"# Real-time-Crypto-Price-Tracker" 
