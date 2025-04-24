import React, { useEffect } from 'react';
import CryptoTable from './Components/CryptoTable';
import { store } from './app/store';
import CryptoApiService from './services/cryptoService';

function App() {
  // Create API service instance
  const cryptoService = new CryptoApiService(store);
  
  useEffect(() => {
    // Start service when component mounts
    cryptoService.start();
    
    // Stop service when component unmounts
    return () => {
      cryptoService.stop();
    };
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Crypto Price Tracker
            </h1>
          </div>
        </div>
      </header>
      <main className="max-w-full mx-auto py-6 px-4 sm:px-6 lg:px-8 h-screen">
        <CryptoTable />
      </main>
    </div>
  );
}

export default App;