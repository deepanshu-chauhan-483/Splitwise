import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import expenseService from "../../services/expense.service";

// Fetch all expenses
export const fetchExpenses = createAsyncThunk(
  "expenses/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await expenseService.getAllExpenses();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Add expense
export const addExpense = createAsyncThunk(
  "expenses/add",
  async (data, { rejectWithValue }) => {
    try {
      const res = await expenseService.createExpense(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update expense
export const updateExpense = createAsyncThunk(
  "expenses/update",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await expenseService.updateExpense(payload._id, payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Delete expense
export const deleteExpense = createAsyncThunk(
  "expenses/delete",
  async (id, { rejectWithValue }) => {
    try {
      await expenseService.deleteExpense(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const expensesSlice = createSlice({
  name: "expenses",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchExpenses.pending, (state) => { state.loading = true; })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // add
      .addCase(addExpense.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })

      // update
      .addCase(updateExpense.fulfilled, (state, action) => {
        const idx = state.list.findIndex(e => e._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      })

      // delete
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.list = state.list.filter((e) => e._id !== action.payload);
      });
  },
});

export default expensesSlice.reducer;
