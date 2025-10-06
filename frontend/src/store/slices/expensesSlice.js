import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import expenseService from "../../services/expense.service";

export const addExpense = createAsyncThunk("expenses/add", async (data, { rejectWithValue }) => {
  try {
    const res = await expenseService.createExpense(data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const fetchExpenses = createAsyncThunk("expenses/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const res = await expenseService.getAllExpenses();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const deleteExpense = createAsyncThunk("expenses/delete", async (id, { rejectWithValue }) => {
  try {
    await expenseService.deleteExpense(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

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
      .addCase(fetchExpenses.pending, (s) => { s.loading = true; })
      .addCase(fetchExpenses.fulfilled, (s, a) => { s.loading = false; s.list = a.payload; })
      .addCase(fetchExpenses.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(addExpense.fulfilled, (s, a) => { s.list.unshift(a.payload); })
      .addCase(deleteExpense.fulfilled, (s, a) => { s.list = s.list.filter((e) => e._id !== a.payload); });
  },
});

export default expensesSlice.reducer;
