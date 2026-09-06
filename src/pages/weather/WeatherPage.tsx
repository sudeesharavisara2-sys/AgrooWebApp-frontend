import React from 'react';
import WeatherDashboard from '../../components/weather/WeatherDashboard';

const WeatherPage: React.FC = () => {
  return (
    <div className="min-h-0 bg-gray-50 py-2">
      <WeatherDashboard />
    </div>
  );
};

export default WeatherPage;