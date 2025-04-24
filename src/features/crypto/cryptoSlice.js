import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCryptoData = createAsyncThunk(
  'crypto/fetchCryptoData',
  async ({ page = 1, perPage = 5 } = {}) => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=1h,24h,7d`
      );
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      return { data, page, perPage };
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      throw error;
    }
  }
);

// Load favorites from localStorage
const loadFavorites = () => {
  try {
    const favoritesString = localStorage.getItem('cryptoFavorites');
    return favoritesString ? JSON.parse(favoritesString) : [];
  } catch (e) {
    console.error('Error loading favorites:', e);
    return [];
  }
};

export const cryptoSlice = createSlice({
  name: 'crypto',
  initialState: {
    assets: [],
    loading: false,
    error: null,
    lastUpdated: null,
    favorites: loadFavorites(),
    currentPage: 1,
    itemsPerPage: 5,
    totalPages: 1,
    hasMore: true
  },
  reducers: {
    updateLastUpdated: (state) => {
      state.lastUpdated = new Date().toISOString();
    },
    toggleFavorite: (state, action) => {
      const cryptoId = action.payload;
      if (state.favorites.includes(cryptoId)) {
        state.favorites = state.favorites.filter(id => id !== cryptoId);
      } else {
        state.favorites.push(cryptoId);
      }
      // Save to localStorage
      localStorage.setItem('cryptoFavorites', JSON.stringify(state.favorites));
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action) => {
      state.itemsPerPage = action.payload;
      state.currentPage = 1; // Reset to first page when changing items per page
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptoData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCryptoData.fulfilled, (state, action) => {
        state.loading = false;
        const { data, page, perPage } = action.payload;
        
        state.assets = data.map(crypto => ({
          id: crypto.id,
          rank: crypto.market_cap_rank,
          name: crypto.name,
          symbol: crypto.symbol.toUpperCase(),
          logo: crypto.image,
          price: crypto.current_price,
          percentChange1h: crypto.price_change_percentage_1h_in_currency,
          percentChange24h: crypto.price_change_percentage_24h_in_currency,
          percentChange7d: crypto.price_change_percentage_7d_in_currency,
          marketCap: crypto.market_cap,
          volume24h: crypto.total_volume,
          circulatingSupply: crypto.circulating_supply,
          maxSupply: crypto.max_supply,
          sparklineData: crypto.sparkline_in_7d?.price || []
        }));
        
        state.currentPage = page;
        state.itemsPerPage = perPage;
        state.hasMore = data.length === perPage; // If we got back fewer than requested, we've reached the end
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchCryptoData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { updateLastUpdated, toggleFavorite, setCurrentPage, setItemsPerPage } = cryptoSlice.actions;

// Selectors
export const selectAllAssets = (state) => state.crypto.assets;
export const selectAssetById = (state, id) => state.crypto.assets.find(asset => asset.id === id);
export const selectLoading = (state) => state.crypto.loading;
export const selectError = (state) => state.crypto.error;
export const selectLastUpdated = (state) => state.crypto.lastUpdated;
export const selectFavorites = (state) => state.crypto.favorites;
export const selectCurrentPage = (state) => state.crypto.currentPage;
export const selectItemsPerPage = (state) => state.crypto.itemsPerPage;
export const selectHasMorePages = (state) => state.crypto.hasMore;

export default cryptoSlice.reducer;