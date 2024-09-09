import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchHistoricalData } from '../slice/stockSlice';
import SearchDateNTime from '../component/SearchDateNTime';

const MainPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { historicalData, loading, error } = useSelector((state: RootState) => state.stock);

 

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='w-full min-h-screen bg-blue-200'>
      <SearchDateNTime />
      <div>
      {historicalData && (
        <>
          <h1>{historicalData.meta.longName} ({historicalData.meta.symbol})</h1>
          <p>Currency: {historicalData.meta.currency}</p>
          <p>Market Price: {historicalData.meta.regularMarketPrice}</p>

          {historicalData.timestamp.map((timestamp, index) => (
            <div key={index}>
              <p>Date: {new Date(timestamp * 1000).toLocaleDateString()}</p>
              <p>Open: {historicalData.indicators.quote[0].open[index]}</p>
              <p>Close: {historicalData.indicators.quote[0].close[index]}</p>
              <p>High: {historicalData.indicators.quote[0].high[index]}</p>
              <p>Low: {historicalData.indicators.quote[0].low[index]}</p>
              <p>Volume: {historicalData.indicators.quote[0].volume[index]}</p>
            </div>
          ))}
        </>
      )}
    </div>
    </div>
  );
};

export default MainPage;
