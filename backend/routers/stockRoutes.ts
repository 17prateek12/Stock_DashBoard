import { historicaldata , searchStockHandler, StockDataHandler , getTopgainer ,getToploser , Indiaindice, StockCategoryfetch, getTrendingSymbols } from "../controller/stockController";
import express from 'express';

const router = express.Router();

router.route("/hisdata/:symbol").get(historicaldata);
router.route("/search/:symbol").get(searchStockHandler);
router.route("/quotedata/:symbol").get(StockDataHandler);
router.route("/topgainer").get(getTopgainer);
router.route("/toploser").get(getToploser);
router.route("/indices").get(Indiaindice);
router.route("/fetchStock").get(StockCategoryfetch);
router.route("/trending").get(getTrendingSymbols);

export default router;