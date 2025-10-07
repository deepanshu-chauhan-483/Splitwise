// frontend/src/store/slices/balancesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import balanceService from "../../services/balance.service";

// Thunks
export const fetchOverallBalances = createAsyncThunk(
  "balances/fetchOverall",
  async (_, { rejectWithValue }) => {
    try {
      const res = await balanceService.getOverall();
      // expected res.data = { balances: [...] }
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchGroupBalances = createAsyncThunk(
  "balances/fetchGroup",
  async (groupId, { rejectWithValue }) => {
    try {
      const res = await balanceService.getGroupBalances(groupId);
      return { groupId, ...res.data }; // { balances: [...] }
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const suggestSettlements = createAsyncThunk(
  "balances/suggestSettlements",
  async (groupId, { rejectWithValue }) => {
    try {
      const res = await balanceService.getGroupSettlements(groupId);
      // expected res.data = { transactions: [...] }
      return { groupId, transactions: res.data.transactions || [] };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// IMPORTANT: recordSettlement must return the server response so component can unwrap and then refresh
export const recordSettlement = createAsyncThunk(
  "balances/recordSettlement",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await balanceService.recordSettlement(payload);
      // server should return created settlement in res.data
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Slice
const balancesSlice = createSlice({
  name: "balances",
  initialState: {
    overall: [],
    group: [],
    suggestions: [],
    loading: false,
    error: null,
    lastGroupId: null,
  },
  reducers: {
    clearSuggestions(state) {
      state.suggestions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch overall
      .addCase(fetchOverallBalances.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchOverallBalances.fulfilled, (s, action) => {
        s.loading = false;
        s.overall = action.payload.balances || [];
      })
      .addCase(fetchOverallBalances.rejected, (s, action) => {
        s.loading = false;
        s.error = action.payload;
      })

      // fetch group
      .addCase(fetchGroupBalances.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchGroupBalances.fulfilled, (s, action) => {
        s.loading = false;
        s.group = action.payload.balances || [];
        s.lastGroupId = action.payload.groupId || s.lastGroupId;
      })
      .addCase(fetchGroupBalances.rejected, (s, action) => {
        s.loading = false;
        s.error = action.payload;
      })

      // suggest settlements
      .addCase(suggestSettlements.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(suggestSettlements.fulfilled, (s, action) => {
        s.loading = false;
        s.suggestions = action.payload.transactions || [];
      })
      .addCase(suggestSettlements.rejected, (s, action) => {
        s.loading = false;
        s.error = action.payload;
      })

      // record settlement
      .addCase(recordSettlement.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(recordSettlement.fulfilled, (s, action) => {
        s.loading = false;
        // Optionally, you can push the recorded settlement into a recorded list or do nothing.
        // We rely on component to re-fetch balances & suggestions after this resolves.
      })
      .addCase(recordSettlement.rejected, (s, action) => {
        s.loading = false;
        s.error = action.payload;
      });
  },
});

export const { clearSuggestions } = balancesSlice.actions;
export default balancesSlice.reducer;
