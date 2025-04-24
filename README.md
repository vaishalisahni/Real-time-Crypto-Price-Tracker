# Real-Time Crypto Price Tracker

A responsive React + Redux Toolkit application that tracks real-time cryptocurrency prices using the CoinGecko API.

## 🚀 Features

- **Live data from CoinGecko**: Real-time cryptocurrency market updates  
- **Auto-refreshing**: Data refreshes every 10 seconds  
- **Responsive design**: Optimized for mobile, tablet, and desktop  
- **Redux Toolkit**: Centralized state management  
- **Visual price charts**: 7-day sparkline charts for each coin  
- **Performance optimized**: Selectors and `memo` used to reduce unnecessary re-renders  

## 🎥 Demo

Check out the live demo video of the project here:  
👉 [Real-Time Crypto Price Tracker - Demo](https://drive.google.com/file/d/1PVH8t-qPTZu8rsBxYbU6PQDH6oIepUGd/view?usp=sharing)


## 🛠 Tech Stack

- **React 18**
- **Redux Toolkit**
- **Tailwind CSS**
- **CoinGecko API**

## 📁 Project Structure

```
src/
├── app/
│   └── store.js             # Redux store configuration
├── components/
│   ├── CryptoTable.jsx      # Table displaying all crypto data
│   ├── CryptoRow.jsx        # Individual crypto row
│   └── SparklineChart.jsx   # SVG sparkline chart component
├── features/
│   └── crypto/
│       └── cryptoSlice.js   # Redux slice with async thunks
├── services/
│   └── cryptoService.js     # Handles API requests
├── App.jsx                  # Main application component
└── index.js                 # Entry point
```

## 🔁 State Management Flow

1. App initializes and starts `cryptoService`
2. `fetchCryptoData` async thunk is dispatched
3. Redux handles loading, success, and error states
4. Data from CoinGecko is stored in Redux state
5. Components subscribe to Redux state via selectors
6. Data auto-refreshes every 10 seconds

## 🧰 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/Real-time-Crypto-Price-Tracker.git
cd Real-time-Crypto-Price-Tracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## 📡 CoinGecko API

This project uses the [CoinGecko API](https://www.coingecko.com/en/api/documentation) (free tier).  
**Note**: No API key is needed, but rate limits apply:
- 10–30 requests per minute

## 📄 License

This project is licensed under the MIT License.

