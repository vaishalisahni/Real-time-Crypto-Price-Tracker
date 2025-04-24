import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectAllAssets, 
  selectLoading, 
  selectError, 
  selectLastUpdated,
  selectFavorites,
  fetchCryptoData 
} from '../features/crypto/cryptoSlice';
import CryptoRow from './CryptoRow';
import ErrorDisplay from './ErrorDisplay';

const CryptoTable = () => {
    const dispatch = useDispatch();
    const assets = useSelector(selectAllAssets);
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);
    const lastUpdated = useSelector(selectLastUpdated);
    const favorites = useSelector(selectFavorites);
    
    // State for filters and sorting
    const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: 'rank', direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [filterOptions, setFilterOptions] = useState({
      priceMin: '',
      priceMax: '',
      percentChangeMin: '',
      searchTerm: ''
    });
  

  // Handle pagination changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Handle fetching data for different pages
  useEffect(() => {
    dispatch(fetchCryptoData({ page: currentPage, perPage: itemsPerPage }));
  }, [dispatch, currentPage, itemsPerPage]);

  const formatLastUpdated = () => {
    if (!lastUpdated) return '';
    const date = new Date(lastUpdated);
    return `Last updated: ${date.toLocaleTimeString()}`;
  };

  // Sorting function
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Apply sorting
  const sortedAssets = React.useMemo(() => {
    let sortableAssets = [...assets];
    if (sortConfig.key) {
      sortableAssets.sort((a, b) => {
        // Handle null values
        if (a[sortConfig.key] === null) return 1;
        if (b[sortConfig.key] === null) return -1;
        
        // Compare based on data type
        if (typeof a[sortConfig.key] === 'string') {
          return sortConfig.direction === 'asc' 
            ? a[sortConfig.key].localeCompare(b[sortConfig.key])
            : b[sortConfig.key].localeCompare(a[sortConfig.key]);
        } else {
          return sortConfig.direction === 'asc' 
            ? a[sortConfig.key] - b[sortConfig.key]
            : b[sortConfig.key] - a[sortConfig.key];
        }
      });
    }
    return sortableAssets;
  }, [assets, sortConfig]);

  // Apply filters
  const filteredAssets = React.useMemo(() => {
    return sortedAssets.filter(asset => {
      // Filter by favorites
      if (showOnlyFavorites && !favorites.includes(asset.id)) {
        return false;
      }
      
      // Filter by price range
      if (filterOptions.priceMin && asset.price < parseFloat(filterOptions.priceMin)) {
        return false;
      }
      if (filterOptions.priceMax && asset.price > parseFloat(filterOptions.priceMax)) {
        return false;
      }
      
      // Filter by percentage change
      if (filterOptions.percentChangeMin && asset.percentChange24h < parseFloat(filterOptions.percentChangeMin)) {
        return false;
      }
      
      // Filter by search term (name or symbol)
      if (filterOptions.searchTerm && 
         !asset.name.toLowerCase().includes(filterOptions.searchTerm.toLowerCase()) && 
         !asset.symbol.toLowerCase().includes(filterOptions.searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }, [sortedAssets, showOnlyFavorites, favorites, filterOptions]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilterOptions({
      priceMin: '',
      priceMax: '',
      percentChangeMin: '',
      searchTerm: ''
    });
    setShowOnlyFavorites(false);
  };
  
  // Get sort direction indicator
  const getSortDirectionIndicator = (key) => {
    if (sortConfig.key !== key) return '↕';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  if (loading && assets.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading crypto data...</p>
        </div>
      </div>
    );
  }

  // Use our new error component
  if (error) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col">
      {/* Rest of the component remains the same */}
      <div className="mb-4 px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Top Cryptocurrencies by Market Cap</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                id="favorites-toggle"
                type="checkbox"
                checked={showOnlyFavorites}
                onChange={() => setShowOnlyFavorites(!showOnlyFavorites)}
                className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
              />
              <label htmlFor="favorites-toggle" className="ml-2 block text-sm text-gray-900">
                Show favorites only
              </label>
            </div>
            <p className="text-sm text-gray-500">{formatLastUpdated()}</p>
          </div>
        </div>
        
        {/* Advanced Filter Section */}
        <div className="bg-white p-4 rounded shadow-sm mb-4">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label htmlFor="searchTerm" className="block text-xs text-gray-500">Search</label>
              <input
                id="searchTerm"
                name="searchTerm"
                type="text"
                value={filterOptions.searchTerm}
                onChange={handleFilterChange}
                placeholder="Name or symbol"
                className="mt-1 block w-40 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="priceMin" className="block text-xs text-gray-500">Min Price ($)</label>
              <input
                id="priceMin"
                name="priceMin"
                type="number"
                value={filterOptions.priceMin}
                onChange={handleFilterChange}
                placeholder="Min"
                className="mt-1 block w-24 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="priceMax" className="block text-xs text-gray-500">Max Price ($)</label>
              <input
                id="priceMax"
                name="priceMax"
                type="number"
                value={filterOptions.priceMax}
                onChange={handleFilterChange}
                placeholder="Max"
                className="mt-1 block w-24 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="percentChangeMin" className="block text-xs text-gray-500">Min 24h Change (%)</label>
              <input
                id="percentChangeMin"
                name="percentChangeMin"
                type="number"
                value={filterOptions.percentChangeMin}
                onChange={handleFilterChange}
                placeholder="% change"
                className="mt-1 block w-24 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium text-gray-700 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Table and pagination components remain the same */}
      <div className="flex-grow overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                
              </th>
              <th 
                className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('rank')}
              >
                # {getSortDirectionIndicator('rank')}
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('name')}
              >
                Name {getSortDirectionIndicator('name')}
              </th>
              <th 
                className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('price')}
              >
                Price {getSortDirectionIndicator('price')}
              </th>
              <th 
                className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('percentChange1h')}
              >
                1h % {getSortDirectionIndicator('percentChange1h')}
              </th>
              <th 
                className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('percentChange24h')}
              >
                24h % {getSortDirectionIndicator('percentChange24h')}
              </th>
              <th 
                className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('percentChange7d')}
              >
                7d % {getSortDirectionIndicator('percentChange7d')}
              </th>
              <th 
                className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('marketCap')}
              >
                Market Cap {getSortDirectionIndicator('marketCap')}
              </th>
              <th 
                className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('volume24h')}
              >
                Volume(24h) {getSortDirectionIndicator('volume24h')}
              </th>
              <th 
                className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('circulatingSupply')}
              >
                Circulating Supply {getSortDirectionIndicator('circulatingSupply')}
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">7D Chart</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAssets.length > 0 ? (
              filteredAssets.map((asset) => (
                <CryptoRow key={asset.id} asset={asset} />
              ))
            ) : (
              <tr>
                <td colSpan="11" className="px-4 py-8 text-center text-gray-500">
                  {showOnlyFavorites ? "No favorites added yet." : "No cryptocurrency data available."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination controls */}
      <div className="py-4 px-4 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <label htmlFor="itemsPerPage" className="mr-2 text-sm text-gray-700">Show:</label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="form-select rounded-md border-gray-300 shadow-sm text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CryptoTable;