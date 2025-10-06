import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import expensesReducer from "./slices/expensesSlice";
import balancesReducer from "./slices/balancesSlice";


const store = configureStore({
  reducer: {
     auth: authReducer,
      expenses: expensesReducer ,
      balances: balancesReducer 
  }
});

export default store;
