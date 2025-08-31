import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner: React.FC = React.memo(() => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <div className="loading-text">
      <h3>Loading CO₂ Data...</h3>
      <p>Fetching global emissions data from local JSON</p>
      <div className="loading-details">
        <span>• Processing countries and regions</span>
        <span>• Loading historical data (1750-2024)</span>
        <span>• Preparing interactive tables</span>
      </div>
    </div>
  </div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;
