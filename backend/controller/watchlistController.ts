import asyncHandler from 'express-async-handler';
import WatchList from '../models/watchListModel';
import { Request, Response } from 'express';

const addToWatchList = asyncHandler(async (req: Request, res: Response) => {
    const { symbol } = req.query;

    if (!req.user) {
        res.status(401);
        throw new Error('User is not authenticated');
    }

    const userId = req.user.id;

    if (!symbol || typeof symbol !== 'string') {
        res.status(400);
        throw new Error("A valid symbol is required.");
    }

    try {
        let watchlist = await WatchList.findOne({ userId });

        if (!watchlist) {
            watchlist = await WatchList.create({
                userId,
                items: [{ symbol, addAt: new Date() }],
            });
        } else {
            const existingItem = watchlist.items.find(item => item.symbol === symbol);

            if (existingItem) {
                res.status(400);
                throw new Error("Symbol already exists in the watchlist.");
            }

            watchlist.items.push({ symbol, addAt: new Date() });
            await watchlist.save();
        }

        res.status(201).json(watchlist);
    } catch (error) {
        console.error("Error adding to watchlist:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

const removeFromWatchList = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
        res.status(401);
        throw new Error('User is not authenticated');
    }

    const userId = req.user.id;
    const { itemId } = req.params;

    if (!itemId) {
        res.status(400);
        throw new Error('Item ID is required');
    }

    try {
        const watchlist = await WatchList.findOne({ userId });

        if (!watchlist) {
            res.status(404).json({ message: 'Watchlist not found' });
        } else {
            watchlist.items = watchlist.items.filter(item => item._id && item._id.toString() !== itemId);
            await watchlist.save();
            res.status(200).json({ message: "Removed successfully" });
        }
    } catch (error) {
        console.error('Error removing item from watchlist:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

const getWatchList = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
        res.status(401);
        throw new Error('User is not authenticated');
    }

    const userId = req.user.id;

    try {
        const watchlist = await WatchList.findOne({ userId });

        if (!watchlist) {
            res.status(404).json({ message: 'Watchlist not found' });
        } else {
            res.status(200).json(watchlist);
        }
    } catch (error) {
        console.error('Error fetching watchlist:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export { addToWatchList, removeFromWatchList, getWatchList };
