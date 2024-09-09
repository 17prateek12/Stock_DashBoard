import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState } from 'react';
import { IoSearch } from "react-icons/io5";
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { TextField } from '@mui/material';

const SearchDateNTime = () => {
  const today: Dayjs = dayjs(); // Current date
  const oneYearAgo: Dayjs = dayjs().subtract(1, 'year'); // One year back
  const [startDate, setStartDate] = useState<Dayjs>(oneYearAgo);
  const [endDate, setEndDate] = useState<Dayjs>(today);
  const dispatch = useDispatch<AppDispatch>();
  const ranges = ['1m', '2m', '5m', '15m', '30m', '60m', '90m', '1h', '1d', '5d', '1wk', '1mo', '3mo'];

  return (
    <div>
      <div className='w-full flex flex-wrap justify-between items-center gap-4 sm:justify-center'>
        <div className='w-[300px] h-10 sm:w-full relative overflow-hidden flex justify-end items-center'>
          <input
            type='text'
            placeholder='Search Stock...'
            className='w-full h-full rounded-2xl bg-white text-black pl-2 focus:outline-none border-none' />
          <IoSearch className='text-black absolute mr-4' />
        </div>
        
        <div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Start Date"
              value={startDate}
              maxDate={endDate}
              onChange={(date) => setStartDate(date as Dayjs)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      height: '2.5rem',
                      backgroundColor: 'white',
                      borderRadius: '0.75rem',
                      '& fieldset': {
                        border: 'none',  // Remove border
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'transparent', // Remove focus border
                      },
                    },
                    '& .MuiInputBase-input': {
                      padding: '10px', // Adjust padding for the input text
                    }
                  }
                }
              }}
            />
          </LocalizationProvider>
        </div>

        <div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="End Date"
              value={endDate}
              maxDate={today} // Prevent future dates
              onChange={(date) => setEndDate(date as Dayjs)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      height: '2.5rem',
                      backgroundColor: 'white',
                      borderRadius: '0.75rem',
                      '& fieldset': {
                        border: 'none',  // Remove border
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'transparent', // Remove focus border
                      },
                    },
                    '& .MuiInputBase-input': {
                      padding: '10px', // Adjust padding for the input text
                    }
                  }
                }
              }}
            />
          </LocalizationProvider>
        </div>
        
        <div>
          <select defaultValue='1d' className='h-8 w-16 pl-2 rounded-lg'>
            {ranges.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default SearchDateNTime;

{/*
  import * as React from 'react';
import { useState, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { IoSearch } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchHistoricalData, searchStockSymbol } from '../slice/stockSlice';
import { TextField } from '@mui/material';

const SearchDateNTime = () => {
  const today: Dayjs = dayjs(); // Current date
  const oneYearAgo: Dayjs = dayjs().subtract(1, 'year'); // One year back
  const [startDate, setStartDate] = useState<Dayjs>(oneYearAgo);
  const [endDate, setEndDate] = useState<Dayjs>(today);
  const [searchInput, setSearchInput] = useState<string>('');
  const [selectedSymbol, setSelectedSymbol] = useState<string>('^BSESN'); // Default symbol
  const [range, setRange] = useState<string>('1d');
  
  const dispatch = useDispatch<AppDispatch>();
  const { searchResults, historicalData, loading } = useSelector((state: RootState) => state.stock);

  useEffect(() => {
    const shouldFetchData = () => {
      // If historicalData doesn't exist, fetch new data
      if (!historicalData) {
        return true;
      }
  
      // Check if the selected symbol has changed
      const isSymbolChanged = historicalData.meta.symbol !== selectedSymbol;
  
      // Check if validRanges exist and if the selected range has changed
      const isRangeChanged = historicalData.validRanges ? !historicalData.validRanges.includes(range) : true;
  
      // Check if the date range has changed
      const isStartDateChanged = historicalData.timestamp.length && historicalData.timestamp[0] !== dayjs(startDate).unix();
      const isEndDateChanged = historicalData.timestamp.length && historicalData.timestamp[historicalData.timestamp.length - 1] !== dayjs(endDate).unix();
  
      return isSymbolChanged || isRangeChanged || isStartDateChanged || isEndDateChanged;
    };
  
    if (!loading && shouldFetchData()) {
      console.log("Fetching new historical data...");
      dispatch(
        fetchHistoricalData({
          symbol: selectedSymbol || '^BSESN',
          startdate: startDate.format('YYYY-MM-DD'),
          enddate: endDate.format('YYYY-MM-DD'),
          range: range,
        })
      );
    }
  }, [dispatch, selectedSymbol, startDate, endDate, range, loading, historicalData]);
  
  
  
  

  // Search for stock symbol when user types
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    if (e.target.value) {
      dispatch(searchStockSymbol(e.target.value));
    }
  };

  // Select a stock symbol from search results
  const handleSelectSymbol = (symbol: string) => {
    setSelectedSymbol(symbol);
    setSearchInput('');
  };

  return (
    <div>
      <div className='w-full flex flex-wrap justify-between items-center gap-4 sm:justify-center'>
        <div className='w-[300px] h-10 sm:w-full relative overflow-hidden flex justify-end items-center'>
          <input
            type='text'
            value={searchInput}
            onChange={handleSearch}
            placeholder='Search Stock...'
            className='w-full h-full rounded-2xl bg-white text-black pl-2 focus:outline-none border-none' />
          <IoSearch className='text-black absolute mr-4' />

          {searchInput && searchResults.length > 0 && (
            <ul className="absolute top-full left-0 bg-white w-full border border-gray-300 z-10 max-h-60 overflow-y-auto">
              {searchResults.map((symbol, index) => (
                <li key={index} className="cursor-pointer p-2 hover:bg-gray-200" onClick={() => handleSelectSymbol(symbol)}>
                  {symbol}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Start Date"
              value={startDate}
              maxDate={endDate}
              onChange={(date) => setStartDate(date as Dayjs)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      height: '2.5rem',
                      backgroundColor: 'white',
                      borderRadius: '0.75rem',
                      '& fieldset': {
                        border: 'none',  // Remove border
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'transparent', // Remove focus border
                      },
                    },
                    '& .MuiInputBase-input': {
                      padding: '10px', // Adjust padding for the input text
                    }
                  }
                }
              }}
            />
          </LocalizationProvider>
        </div>

        <div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="End Date"
              value={endDate}
              maxDate={today} // Prevent future dates
              onChange={(date) => setEndDate(date as Dayjs)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      height: '2.5rem',
                      backgroundColor: 'white',
                      borderRadius: '0.75rem',
                      '& fieldset': {
                        border: 'none',  // Remove border
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'transparent', // Remove focus border
                      },
                    },
                    '& .MuiInputBase-input': {
                      padding: '10px', // Adjust padding for the input text
                    }
                  }
                }
              }}
            />
          </LocalizationProvider>
        </div>

        <div>
          <select value={range} onChange={(e) => setRange(e.target.value)} className='h-8 w-16 pl-2 rounded-lg'>
            {['1m', '2m', '5m', '15m', '30m', '60m', '90m', '1h', '1d', '5d', '1wk', '1mo', '3mo'].map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchDateNTime;

  */}