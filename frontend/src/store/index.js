import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import expensesReducer from "./slices/expensesSlice";
import balancesReducer from "./slices/balancesSlice";
import groupsReducer from "./slices/groupsSlice";


const store = configureStore({
  reducer: {
     auth: authReducer,
      expenses: expensesReducer ,
      balances: balancesReducer , 
      groups: groupsReducer
  }
});

export default store;
