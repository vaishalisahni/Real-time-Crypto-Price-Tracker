import { fetchCryptoData } from '../features/crypto/cryptoSlice';

class CryptoApiService {
  constructor(store) {
    this.store = store;
    this.interval = null;
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) return;
    
    // Get current state
    const state = this.store.getState().crypto;
    const { currentPage, itemsPerPage } = state;
    
    // Fetch initial data
    this.store.dispatch(fetchCryptoData({ page: currentPage, perPage: itemsPerPage }));
    
    // Set up interval for data refresh
    this.interval = setInterval(() => {
      // Get latest state for current pagination settings
      const currentState = this.store.getState().crypto;
      this.store.dispatch(fetchCryptoData({ 
        page: currentState.currentPage, 
        perPage: currentState.itemsPerPage 
      }));
    }, 10000); // Fetch every 10 seconds (CoinGecko API has rate limits)
    
    this.isRunning = true;
    console.log('CryptoApiService started');
  }

  stop() {
    if (!this.isRunning) return;
    
    clearInterval(this.interval);
    this.interval = null;
    this.isRunning = false;
    
    console.log('CryptoApiService stopped');
  }
}

export default CryptoApiService;