import express from 'express';
import { addToWatchList, removeFromWatchList, getWatchList } from '../controller/watchlistController';
import validateToken from '../middleware/protect';

const router = express.Router();

router.route("/add").post(validateToken,addToWatchList);
router.route("/remove/:itemId").delete(validateToken,removeFromWatchList);
router.route("/show").get(validateToken, getWatchList);

export default router 