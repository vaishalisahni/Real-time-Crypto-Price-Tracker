import { memo } from 'react';

const SparklineChart = memo(({ data, priceChange }) => {
  // If no sparkline data is available
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
        <p className="text-xs text-gray-400">No data</p>
      </div>
    );
  }

  // Calculate SVG parameters
  const width = 96;
  const height = 40;
  const padding = 2;
  
  // Find min and max for scaling
  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  
  // Function to scale data points to SVG dimensions
  const scaleY = (value) => {
    return height - padding - ((value - minValue) / (maxValue - minValue)) * (height - 2 * padding);
  };
  
  // Create path data
  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
    const y = scaleY(value);
    return `${x},${y}`;
  }).join(' ');

  // Determine line color based on price change
  const lineColor = priceChange >= 0 ? '#10B981' : '#EF4444'; // green-500 or red-500

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
      <polyline
        fill="none"
        stroke={lineColor}
        strokeWidth="1.5"
        points={points}
      />
    </svg>
  );
});

export default SparklineChart;