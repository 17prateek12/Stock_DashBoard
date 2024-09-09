import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../slice/authSlice";
import stockReducer from "../slice/stockSlice";

const store = configureStore({
    reducer: {
     auth:authReducer,
     stock:stockReducer
    },
  });
  
  export type RootState = ReturnType<typeof store.getState>;
  export type AppDispatch = typeof store.dispatch;
  export {store};