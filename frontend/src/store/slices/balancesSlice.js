import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import balanceService from "../../services/balance.service";
import settlementService from "../../services/settlement.service";

export const fetchOverallBalances = createAsyncThunk("balances/fetchOverall", async (_, { rejectWithValue }) => {
  try {
    const res = await balanceService.getOverall();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const fetchGroupBalances = createAsyncThunk("balances/fetchGroup", async (groupId, { rejectWithValue }) => {
  try {
    const res = await balanceService.getGroup(groupId);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const suggestSettlements = createAsyncThunk("balances/suggestSettlements", async (groupId, { rejectWithValue }) => {
  try {
    const res = await settlementService.suggestForGroup(groupId);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const recordSettlement = createAsyncThunk("balances/recordSettlement", async (payload, { rejectWithValue }) => {
  try {
    const res = await settlementService.record(payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

const balancesSlice = createSlice({
  name: "balances",
  initialState: {
    overall: [],
    group: [],
    suggestions: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchOverallBalances.pending, (s) => { s.loading = true; })
     .addCase(fetchOverallBalances.fulfilled, (s, a) => { s.loading = false; s.overall = a.payload.balances; })
     .addCase(fetchOverallBalances.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

     .addCase(fetchGroupBalances.pending, (s) => { s.loading = true; })
     .addCase(fetchGroupBalances.fulfilled, (s, a) => { s.loading = false; s.group = a.payload.balances; })
     .addCase(fetchGroupBalances.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

     .addCase(suggestSettlements.fulfilled, (s, a) => { s.suggestions = a.payload.transactions; })
     .addCase(recordSettlement.fulfilled, (s, a) => {
       // add recorded settlement to suggestions? we simply clear suggestions so user can re-fetch
       s.suggestions = [];
     });
  }
});

export default balancesSlice.reducer;
