import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import groupService from "../../services/group.service";

export const fetchGroups = createAsyncThunk("groups/fetch", async (_, { rejectWithValue }) => {
  try {
    const res = await groupService.getMyGroups();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const createGroup = createAsyncThunk("groups/create", async (data, { rejectWithValue }) => {
  try {
    const res = await groupService.createGroup(data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const addMember = createAsyncThunk("groups/addMember", async (data, { rejectWithValue }) => {
  try {
    const res = await groupService.addMember(data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

const groupsSlice = createSlice({
  name: "groups",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroups.pending, (s) => { s.loading = true; })
      .addCase(fetchGroups.fulfilled, (s, a) => { s.loading = false; s.list = a.payload; })
      .addCase(fetchGroups.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(createGroup.fulfilled, (s, a) => { s.list.unshift(a.payload); });
  },
});

export default groupsSlice.reducer;
