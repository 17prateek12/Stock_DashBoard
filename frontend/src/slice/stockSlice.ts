import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface MetaData {
    currency: string;
    symbol: string;
    exchangeName: string;
    fullExchangeName: string;
    instrumentType: string;
    firstTradeDate: string;
    regularMarketTime: string;
    hasPrePostMarketData: boolean;
    gmtoffset: number;
    timezone: string;
    exchangeTimezoneName: string;
    regularMarketPrice: number;
    fiftyTwoWeekHigh: number;
    fiftyTwoWeekLow: number;
    regularMarketDayHigh: number;
    regularMarketDayLow: number;
    regularMarketVolume: number;
    longName: string;
    shortName: string;
    chartPreviousClose: number;
    priceHint: number;
}


interface QuoteData {
    open: number[];
    close: number[];
    high: number[];
    low: number[];
    volume: number[];
}

interface IndicatorData {
    quote: QuoteData[];
    adjclose: { adjclose: number[] }[];
}

interface HistoricalData {
    meta: MetaData;
    timestamp: number[];
    indicators: IndicatorData;
    validRanges:string;
}

interface StockState {
    historicalData: HistoricalData | null;
    loading: boolean;
    error: string | null;
    searchResults: string[];

}

export const fetchHistoricalData = createAsyncThunk<HistoricalData, { symbol: string, startdate: string, enddate: string, range: string }>(
    'stock/fetchhistoricalData',
    async ({ symbol, startdate, enddate, range }) => {
        const response = await axios.get(`/api/stock/hisdata/${symbol}?startdate=${startdate}&enddate=${enddate}&range=${range}`);
        console.log(response.data);
        return response.data;
    }
);

export const searchStockSymbol = createAsyncThunk<string[], string>(
    'stock/searchStockSymbol',
    async (symbol) => {
        const response = await axios.get(`/api/stock/search/${symbol}`);
        return response.data;
    }
);


const initialState: StockState = {
    historicalData: null,
    loading: false,
    error: null,
    searchResults: [],
}

const stockSlice = createSlice({
    name: 'stock',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchHistoricalData.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchHistoricalData.fulfilled, (state, action: PayloadAction<HistoricalData>) => {
          state.historicalData = action.payload;
          state.loading = false; // Set loading to false when fulfilled
        })
        .addCase(fetchHistoricalData.rejected, (state, action) => {
          state.error = action.error.message || 'Failed to fetch historical data';
          state.loading = false; // Also set loading to false when rejected
        })
        .addCase(searchStockSymbol.pending, (state) => {
          state.loading = true;
        })
        .addCase(searchStockSymbol.fulfilled, (state, action: PayloadAction<string[]>) => {
          state.searchResults = action.payload;
          state.loading = false;
        })
        .addCase(searchStockSymbol.rejected, (state, action) => {
          state.error = action.error.message || 'Failed to search stock symbols';
          state.loading = false;
        });
    },
  });

export default stockSlice.reducer;