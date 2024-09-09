import asyncHandler from 'express-async-handler';
import axios from 'axios';
import * as cheerio from 'cheerio';
import yahooFinance from 'yahoo-finance2';
import { Request, Response } from 'express';

interface HistoricalOptions {
    period1: number;
    period2: number;
    interval: '1m' | '2m' | '5m' | '15m' | '30m' | '60m' | '90m' | '1h' | '1d' | '5d' | '1wk' | '1mo' | '3mo';
    return: 'object'; 
  }
  
  const historicaldata = asyncHandler(async (req: Request, res: Response) => {
    const { symbol } = req.params;
    const { startdate, enddate, range } = req.query;
  
    try {
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 2);
  
      const end = enddate ? new Date(enddate as string) : today;
      const start = startdate ? new Date(startdate as string) : yesterday;
  
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error('Invalid date format');
      }
  
      // Check if the range is a valid interval
      const validIntervals = ['1m' , '2m' , '5m' , '15m' , '30m' , '60m' , '90m' , '1h' , '1d' , '5d' , '1wk' , '1mo' , '3mo'];
      const interval = validIntervals.includes(range as string) ? (range as HistoricalOptions['interval']) : '1d'; // Default to '1d'
  
      const options: HistoricalOptions = {
        period1: Math.floor(start.getTime() / 1000),
        period2: Math.floor(end.getTime() / 1000),
        interval,
        return: 'object',
      };

      const data = await yahooFinance.chart(symbol, options);
      res.json(data);
    } catch (error) {
      console.error('Error fetching historical data:', error);
      res.status(500).send('Error fetching historical data from Yahoo Finance');
    }
  });



const searchStockHandler = asyncHandler(async (req: Request, res: Response) => {
    const { symbol } = req.params;

    try {
        const data = await yahooFinance.search(symbol);
        res.json(data);
    } catch (error) {
        console.error('Error fetching search data from Yahoo Finance:', error);
        res.status(500).send('Error fetching search data from Yahoo Finance');
    }
});

const StockDataHandler = asyncHandler(async (req: Request, res: Response) => {
    const { symbol } = req.params;

    try {
        const datas = await yahooFinance.quoteSummary(symbol);
        res.json(datas);
    } catch (error) {
        console.error('Error fetching search data from Yahoo Finance:', error);
        res.status(500).send('Error fetching search data from Yahoo Finance');
    }
});


const url:string = 'https://www.livemint.com/market/bse-top-gainers';

async function fetchTopGainers(url: string) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const stockData: Array<{ stockName: string, link: string, stockPrice: string, stockChange: string, stockPercentageChange: string }> = [];
        let datatime = "";

        // Extract stock data
        $('table.table tbody tr').each((index, element) => {
            const stockName = $(element).find('td').eq(0).text().trim();
            const link = $(element).find('td').eq(0).find('a').attr('href') || '';
            const stockPrice = $(element).find('td').eq(1).text().trim();
            const stockChange = $(element).find('td').eq(2).text().trim();
            const stockPercentageChange = $(element).find('td').eq(3).text().trim();

            stockData.push({
                stockName,
                link,
                stockPrice,
                stockChange,
                stockPercentageChange
            });
        });


        datatime = $('div.dateNew').text().trim() || new Date().toLocaleString();

        const Topgainer = {
            datatime,
            stockData
        };

        console.log(Topgainer);
        return Topgainer;
    } catch (error) {
        console.error("Failed to fetch data from URL:", url, error);
        return [];
    }
}

const getTopgainer = asyncHandler(async(req: Request, res: Response) => {
    try {
        const data = await fetchTopGainers(url);
        res.json(data);
    } catch (error) {
        console.error("Error in fetching data from Mint:", error);
        res.status(500).json({ error: 'Error in fetching data' });
    }
});


const url2:string = 'https://www.livemint.com/market/bse-top-losers';

async function fetchTopLoser(url2: string) {
    try {
        const response = await axios.get(url2);
        const $ = cheerio.load(response.data);

        const stockData: Array<{ stockName: string, link:string , stockPrice: string, stockChange: string, stockPercentageChange: string }> = [];
        let datatime = "";

        // Extract stock data
        $('table.table tbody tr').each((index, element) => {
            const stockName = $(element).find('td').eq(0).text().trim();
            const link = $(element).find('td').eq(0).find('a').attr('href') || '';
            const stockPrice = $(element).find('td').eq(1).text().trim();
            const stockChange = $(element).find('td').eq(2).text().trim();
            const stockPercentageChange = $(element).find('td').eq(3).text().trim();

            stockData.push({
                stockName,
                link,
                stockPrice,
                stockChange,
                stockPercentageChange
            });
        });

        datatime = $('div.dateNew').text().trim() || new Date().toLocaleString();

        const Toploser = {
            datatime,
            stockData
        };

        console.log(Toploser);
        return Toploser;
    } catch (error) {
        console.error("Failed to fetch data from URL:", url2, error);
        return [];
    }
}

const getToploser = asyncHandler(async(req: Request, res: Response) => {
    try {
        const data = await fetchTopLoser(url2);
        res.json(data);
    } catch (error) {
        console.error("Error in fetching data from Mint:", error);
        res.status(500).json({ error: 'Error in fetching data' });
    }
});


const url3 = 'https://www.livemint.com/market/india-indices'

async function fetchIndiaindice(url3: string) {
    try {
        const response = await axios.get(url3);
        const $ = cheerio.load(response.data);

        const stockData: Array<{ stockName: string, link:string , stockPrice: string, stockChange: string, stockPercentageChange: string }> = [];

        // Extract stock data
        $('table.table tbody tr').each((index, element) => {
            const stockName = $(element).find('td').eq(0).text().trim();
            const link = $(element).find('td').eq(0).find('a').attr('href') || '';
            const stockPrice = $(element).find('td').eq(1).text().trim();
            const stockChange = $(element).find('td').eq(2).text().trim();
            const stockPercentageChange = $(element).find('td').eq(3).text().trim();

            stockData.push({
                stockName,
                link,
                stockPrice,
                stockChange,
                stockPercentageChange
            });
        });


        console.log( stockData);
        return  stockData
    } catch (error) {
        console.error("Failed to fetch data from URL:", url2, error);
        return [];
    }
}

const Indiaindice = asyncHandler(async(req: Request, res: Response) => {
    try {
        const data = await fetchIndiaindice(url3);
        res.json(data);
    } catch (error) {
        console.error("Error in fetching data from Mint:", error);
        res.status(500).json({ error: 'Error in fetching data' });
    }
});


interface Historical{
    period1:number;
    period2:number;
};

async function Categoryfetch(symbol: string) {
    try {
        const end: Date = new Date();
        const start: Date = new Date();
        start.setDate(end.getDate() -2);

        const options: Historical = {
            period1: Math.floor(start.getTime() / 1000), 
            period2: Math.floor(end.getTime() / 1000),
        };

        const data = await yahooFinance.chart(symbol, options);
        return data;
    } catch (error) {
        console.error(`Error fetching historical data for ${symbol}:`, error);
        return null;  // Return null or an empty array to signify failure
    }
}

const symbolsStock = ['^BSESN', '^NSEI', 'GC=F', 'BTC-USD', 'DIA', '0P0001BLH8.BO', 'SENSEXADD.BO', '^NSEBANK', '^NSEMDCP50'];

const StockCategoryfetch = asyncHandler(async (req: Request, res: Response) => {
    try {
        const allData: any[] = [];

        for (let i = 0; i < symbolsStock.length; i++) {
            const symbol = symbolsStock[i];
            const data = await Categoryfetch(symbol);
            if (data) {
                allData.push({ symbol, data });
            } else {
                console.warn(`Skipping symbol ${symbol} due to fetch error.`);
            }
        }

        res.json(allData); // Return all successfully fetched data
    } catch (error) {
        console.error("Error fetching historical data for multiple symbols:", error);
        res.status(500).send('Error fetching historical data from Yahoo Finance');
    }
});


const getTrendingSymbols = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { count = 8, lang = 'en-US' } = req.query;

        const queryOptions = {
            count: Number(count),  // Convert count to a number
            lang: lang as string    // Ensure lang is a string
        };

        console.log('Query Options:', queryOptions);
        const result = await yahooFinance.trendingSymbols('US', queryOptions);
        
        console.log('Trending Symbols:', result);
        res.json(result);
    } catch (error) {
        console.error('Error fetching trending symbols:', error);
        res.status(500).send('Error fetching trending symbols from Yahoo Finance');
    }
});


export {historicaldata,searchStockHandler, StockDataHandler , getTopgainer , getToploser , Indiaindice, StockCategoryfetch, getTrendingSymbols};  