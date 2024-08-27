import express from 'express';
import dotenv from "dotenv";
import connectDb from './config/connectionDb';
import userRoutes from "./routers/userRoute"
import cors from "cors";
import stockroute from "./routers/stockRoutes"
import watchRoutes from "./routers/watchlistRoute";

dotenv.config();
connectDb()
const Port = process.env.PORT || 5001;
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/user',userRoutes);
app.use('/api/stock',stockroute);
app.use('/api/watchlist',watchRoutes);

app.listen(Port, () => {
  console.log(`Application started on port now will it work http://localhost:${Port} `);
});