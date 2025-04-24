// src/components/ErrorDisplay.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCryptoData } from '../features/crypto/cryptoSlice';

const ErrorDisplay = ({ error }) => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    // Fade in animation
    setVisible(true);
    
    // Shake animation after fade in
    const timer = setTimeout(() => {
      setShake(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const handleRetry = () => {
    // Get current state parameters
    const state = dispatch(fetchCryptoData({ 
      page: 1, // Reset to first page on retry
      perPage: 5 
    }));
  };

  // Generate a more unique and helpful error message
  const getErrorMessage = (errorText) => {
    if (errorText.includes('Network')) {
      return "Connection lost! Please check your internet connection and try again.";
    } else if (errorText.includes('429') || errorText.includes('too many')) {
      return "Whoa! We're hitting API rate limits. Please wait a moment before retrying.";
    } else if (errorText.includes('unauthorized') || errorText.includes('401')) {
      return "Authentication error. API key might be invalid or expired.";
    } else {
      return `Unexpected error: ${errorText}. Our crypto-gnomes are working on it!`;
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div 
        className={`
          bg-white rounded-lg shadow-lg p-8 max-w-md w-full 
          border-l-4 border-red-500
          transform transition-all duration-500 ease-in-out
          ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
          ${shake ? 'animate-shake' : ''}
        `}
      >
        <div className="flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Data Fetch Failed</h2>
        
        <p className="text-gray-600 mb-6 text-center">
          {getErrorMessage(error)}
        </p>
        
        <div className="flex justify-center">
          <button
            onClick={handleRetry}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Retry Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;