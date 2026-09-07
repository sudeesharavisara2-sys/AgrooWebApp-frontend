import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface WeatherData {
  id: number;
  location: string;
  alertType: string | null;
  severity: string | null;
  message: string | null;
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainfall: number;
  isActive: boolean;
  isSent: boolean;
  createdAt: string;
}

// 🇱🇰 Sri Lanka - District-wise Cities / Towns
const districtLocations: { [key: string]: string[] } = {
  // Western Province
  'Colombo District': [
    'Colombo',
    'Sri Jayawardenepura Kotte',
    'Dehiwala-Mount Lavinia',
    'Moratuwa',
    'Kaduwela',
    'Kolonnawa',
    'Maharagama',
    'Kesbewa',
    'Boralesgamuwa',
    'Homagama',
    'Avissawella',
    'Padukka',
    'Kottawa',
    'Nugegoda',
    'Rajagiriya',
    'Battaramulla',
    'Nawala',
    'Kotikawatta',
    'Wellampitiya',
    'Piliyandala'
  ],

  'Gampaha District': [
    'Gampaha',
    'Negombo',
    'Minuwangoda',
    'Wattala',
    'Ja-Ela',
    'Ragama',
    'Kadawatha',
    'Kelaniya',
    'Peliyagoda',
    'Nittambuwa',
    'Veyangoda',
    'Kiribathgoda',
    'Divulapitiya',
    'Katunayake',
    'Seeduwa',
    'Dompe',
    'Delgoda',
    'Ganemulla',
    'Yakkala',
    'Biyagama'
  ],

  'Kalutara District': [
    'Kalutara',
    'Panadura',
    'Horana',
    'Beruwala',
    'Aluthgama',
    'Wadduwa',
    'Matugama',
    'Bandaragama',
    'Ingiriya',
    'Bulathsinhala',
    'Agalawatta',
    'Payagala',
    'Dodangoda'
  ],

  // Central Province
  'Kandy District': [
    'Kandy',
    'Peradeniya',
    'Katugastota',
    'Kundasale',
    'Gampola',
    'Nawalapitiya',
    'Wattegama',
    'Kadugannawa',
    'Akurana',
    'Pilimathalawa',
    'Digana',
    'Galagedara',
    'Pussellawa',
    'Teldeniya'
  ],

  'Matale District': [
    'Matale',
    'Dambulla',
    'Ukuwela',
    'Rattota',
    'Galewela',
    'Naula',
    'Laggala',
    'Palapathwela',
    'Yatawatta',
    'Sigiriya'
  ],

  'Nuwara Eliya District': [
    'Nuwara Eliya',
    'Hatton',
    'Talawakele',
    'Nanu Oya',
    'Ragala',
    'Maskeliya',
    'Kotagala',
    'Norton Bridge',
    'Lindula',
    'Pundaluoya',
    'Walapane',
    'Hanguranketha'
  ],

  // Southern Province
  'Galle District': [
    'Galle',
    'Ambalangoda',
    'Hikkaduwa',
    'Bentota',
    'Elpitiya',
    'Baddegama',
    'Karandeniya',
    'Udugama',
    'Imaduwa',
    'Ahangama',
    'Weligama',
    'Unawatuna',
    'Koggala',
    'Neluwa',
    'Nagoda'
  ],

  'Matara District': [
    'Matara',
    'Weligama',
    'Akuressa',
    'Dikwella',
    'Devinuwara',
    'Hakmana',
    'Kamburupitiya',
    'Deniyaya',
    'Kekanadurra',
    'Mirissa',
    'Kamburugamuwa',
    'Gandara',
    'Kotapola'
  ],

  'Hambantota District': [
    'Hambantota',
    'Tangalle',
    'Ambalantota',
    'Beliatta',
    'Tissamaharama',
    'Kataragama',
    'Weeraketiya',
    'Middeniya',
    'Sooriyawewa',
    'Lunugamvehera',
    'Walasmulla',
    'Angunakolapelessa'
  ],

  // Northern Province
  'Jaffna District': [
    'Jaffna',
    'Chavakachcheri',
    'Point Pedro',
    'Karainagar',
    'Kayts',
    'Nallur',
    'Kopay',
    'Tellippalai',
    'Chankanai',
    'Manipay',
    'Uduvil',
    'Velanai'
  ],

  'Kilinochchi District': [
    'Kilinochchi',
    'Pallai',
    'Poonakary',
    'Karachchi',
    'Akkarayankulam',
    'Murukandy'
  ],

  'Mannar District': [
    'Mannar',
    'Erukkulampiddi',
    'Madhu',
    'Murunkan',
    'Pesalai',
    'Talaimannar',
    'Nanaddan'
  ],

  'Vavuniya District': [
    'Vavuniya',
    'Nedunkeni',
    'Settikulam',
    'Vengalacheddikulam',
    'Omanthai'
  ],

  'Mullaitivu District': [
    'Mullaitivu',
    'Puthukkudiyiruppu',
    'Mankulam',
    'Oddusuddan',
    'Maritimepattu',
    'Thunukkai',
    'Puthukudiyiruppu'
  ],

  // Eastern Province
  'Trincomalee District': [
    'Trincomalee',
    'Kinniya',
    'Kantale',
    'Mutur',
    'China Bay',
    'Nilaveli',
    'Kuchchaveli',
    'Serunuwara',
    'Echchilampattai'
  ],

  'Batticaloa District': [
    'Batticaloa',
    'Kattankudy',
    'Eravur',
    'Kalmunai',
    'Valachchenai',
    'Valaichchenai',
    'Kiran',
    'Chenkalady',
    'Oddamavadi',
    'Vakarai',
    'Kokkadichcholai',
    'Paddiruppu'
  ],

  'Ampara District': [
    'Ampara',
    'Kalmunai',
    'Akkaraipattu',
    'Sainthamaruthu',
    'Sammanthurai',
    'Nintavur',
    'Pottuvil',
    'Kattankudy',
    'Dehiattakandiya',
    'Maha Oya',
    'Uhana',
    'Damana',
    'Lahugala',
    'Samanthurai'
  ],

  // North Western Province
  'Kurunegala District': [
    'Kurunegala',
    'Kuliyapitiya',
    'Narammala',
    'Wariyapola',
    'Pannala',
    'Nikaweratiya',
    'Mawathagama',
    'Polgahawela',
    'Alawwa',
    'Ibbagamuwa',
    'Galgamuwa',
    'Maho',
    'Bingiriya',
    'Giriulla',
    'Dankotuwa',
    'Kobeigane',
    'Rideegama'
  ],

  'Puttalam District': [
    'Puttalam',
    'Chilaw',
    'Wennappuwa',
    'Marawila',
    'Nattandiya',
    'Dankotuwa',
    'Kalpitiya',
    'Anamaduwa',
    'Nawagattegama',
    'Madampe',
    'Mundel',
    'Vanathavilluwa',
    'Norachcholai'
  ],

  // North Central Province
  'Anuradhapura District': [
    'Anuradhapura',
    'Kekirawa',
    'Medawachchiya',
    'Eppawala',
    'Thambuttegama',
    'Nochchiyagama',
    'Galenbindunuwewa',
    'Mihintale',
    'Talawa',
    'Horowpothana',
    'Padaviya',
    'Rambewa',
    'Rajanganaya'
  ],

  'Polonnaruwa District': [
    'Polonnaruwa',
    'Kaduruwela',
    'Medirigiriya',
    'Hingurakgoda',
    'Kantale',
    'Welikanda',
    'Dimbulagala',
    'Elahera',
    'Aralaganwila',
    'Bakamoona'
  ],

  // Uva Province
  'Badulla District': [
    'Badulla',
    'Bandarawela',
    'Haputale',
    'Welimada',
    'Mahiyanganaya',
    'Diyatalawa',
    'Ella',
    'Hali Ela',
    'Passara',
    'Kandaketiya',
    'Lunugala',
    'Meegahakiula',
    'Soranathota'
  ],

  'Monaragala District': [
    'Monaragala',
    'Wellawaya',
    'Bibile',
    'Buttala',
    'Kataragama',
    'Siyambalanduwa',
    'Medagama',
    'Thanamalwila',
    'Badalkumbura',
    'Madulla',
    'Okkampitiya'
  ],

  // Sabaragamuwa Province
  'Ratnapura District': [
    'Ratnapura',
    'Embilipitiya',
    'Balangoda',
    'Pelmadulla',
    'Eheliyagoda',
    'Kuruwita',
    'Rakwana',
    'Kalawana',
    'Godakawela',
    'Opanayake',
    'Kolonna',
    'Nivithigala',
    'Ayagama'
  ],

  'Kegalle District': [
    'Kegalle',
    'Mawanella',
    'Warakapola',
    'Rambukkana',
    'Ruwanwella',
    'Avissawella',
    'Deraniyagala',
    'Yatiyantota',
    'Dehiowita',
    'Galigamuwa',
    'Aranayake',
    'Bulathkohupitiya'
  ]
};

const WeatherDashboard: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState('Colombo');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log(`🌤️ Fetching weather for: ${selectedLocation}`);
      
      let realWeatherData = null;
      try {
        const weatherResponse = await axios.post(
          `http://localhost:8081/api/weather/check/${selectedLocation}`
        );
        
        if (weatherResponse.status === 204) {
          console.log('ℹ️ No new alert, but weather is normal');
        } else if (weatherResponse.status === 200 && weatherResponse.data) {
          realWeatherData = weatherResponse.data;
          console.log('✅ REAL weather data received:', realWeatherData);
        }
      } catch (weatherErr) {
        console.log('⚠️ Could not fetch real weather data:', weatherErr);
      }

      let fetchedAlerts: any[] = [];
      try {
        const alertsResponse = await axios.get(
          `http://localhost:8081/api/weather/alerts/location/${selectedLocation}`
        );
        fetchedAlerts = alertsResponse.data || [];
      } catch (alertErr) {
        console.log('ℹ️ No alerts found for this location');
      }

      if (realWeatherData) {
        setWeather(realWeatherData);
        console.log('✅ Using REAL weather data from OpenWeatherMap');
      } else if (fetchedAlerts.length > 0) {
        const latestAlert = [...fetchedAlerts].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];
        
        setWeather({
          id: latestAlert.id,
          location: selectedLocation,
          alertType: null,
          severity: null,
          message: null,
          temperature: latestAlert.temperature,
          humidity: latestAlert.humidity,
          windSpeed: latestAlert.windSpeed,
          rainfall: latestAlert.rainfall,
          isActive: false,
          isSent: false,
          createdAt: latestAlert.createdAt
        });
        console.log('⚠️ Using fallback alert data (no real weather)');
      } else {
        setWeather(null);
        console.log('❌ No weather data available');
      }

      setLastUpdated(new Date().toLocaleTimeString());

    } catch (err: any) {
      console.error('❌ Error fetching weather:', err);
      if (err.response?.status === 403) {
        setError('🔐 Please login to view weather data');
      } else if (err.code === 'ECONNREFUSED') {
        setError('🔌 Cannot connect to server. Please check if backend is running.');
      } else {
        setError(`❌ Failed to fetch weather data`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [selectedLocation]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (autoRefresh) {
      intervalRef.current = setInterval(() => {
        console.log('🔄 Auto-refreshing weather...');
        fetchWeatherData();
      }, 300000); // 5 minutes
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [selectedLocation, autoRefresh]);

  const getWeatherIcon = (temp: number) => {
    if (temp > 35) return '☀️';
    if (temp > 30) return '🌤️';
    if (temp > 25) return '⛅';
    if (temp > 20) return '🌥️';
    return '☁️';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">🌤️ Real-Time Weather</h2>
          <span className="text-sm text-gray-500">
            Last updated: {lastUpdated || 'Not yet'}
          </span>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            {Object.entries(districtLocations).map(([district, cities]) => (
              <optgroup key={district} label={district}>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          <button
            onClick={fetchWeatherData}
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : '🔄 Refresh'}
          </button>

          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-4 py-2 rounded-lg border ${
              autoRefresh 
                ? 'bg-green-100 text-green-700 border-green-300' 
                : 'bg-gray-100 text-gray-700 border-gray-300'
            }`}
          >
            {autoRefresh ? '⏸️ Auto Refresh ON' : '▶️ Auto Refresh OFF'}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* REAL WEATHER DISPLAY */}
        {weather && (
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-5xl">
                  {getWeatherIcon(weather.temperature || 25)}
                </span>
                <div>
                  <h3 className="text-2xl font-bold">{selectedLocation}</h3>
                  <p className="text-gray-500 text-sm">
                    {weather.alertType ? '⚠️ Alert Active' : '✅ Weather is normal'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-blue-600">
                  {weather.temperature ? weather.temperature.toFixed(1) : '--'}°C
                </div>
                <div className="text-sm text-gray-500">
                  Real-time data
                </div>
              </div>
            </div>

            {/* Weather Parameters Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white rounded-lg p-4 text-center shadow-md hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-1">🌡️</div>
                <div className="text-2xl font-bold text-blue-600">
                  {weather.temperature ? weather.temperature.toFixed(1) : '--'}°C
                </div>
                <div className="text-sm text-gray-600">Temperature</div>
              </div>

              <div className="bg-white rounded-lg p-4 text-center shadow-md hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-1">💧</div>
                <div className="text-2xl font-bold text-blue-500">
                  {weather.humidity ? weather.humidity.toFixed(1) : '--'}%
                </div>
                <div className="text-sm text-gray-600">Humidity</div>
              </div>

              <div className="bg-white rounded-lg p-4 text-center shadow-md hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-1">💨</div>
                <div className="text-2xl font-bold text-teal-600">
                  {weather.windSpeed ? weather.windSpeed.toFixed(1) : '--'} km/h
                </div>
                <div className="text-sm text-gray-600">Wind Speed</div>
              </div>

              <div className="bg-white rounded-lg p-4 text-center shadow-md hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-1">🌧️</div>
                <div className="text-2xl font-bold text-blue-400">
                  {weather.rainfall ? weather.rainfall.toFixed(1) : '--'} mm
                </div>
                <div className="text-sm text-gray-600">Rainfall</div>
              </div>
            </div>
          </div>
        )}

        {!weather && !loading && !error && (
          <div className="text-center py-12 text-gray-500">
            Select a location to view weather data
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-500">Loading weather data...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherDashboard;