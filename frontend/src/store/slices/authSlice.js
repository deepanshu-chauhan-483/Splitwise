import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/auth.service";

const localToken = localStorage.getItem("token");
const localUser = localStorage.getItem("user");

const initialState = {
  user: localUser ? JSON.parse(localUser) : null,
  token: localToken || null,
  loading: false,
  error: null,
};

// ─── Async thunks ────────────────────────────────────────────
export const signup = createAsyncThunk("auth/signup", async (payload, { rejectWithValue }) => {
  try {
    const res = await authService.signup(payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const login = createAsyncThunk("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const res = await authService.login(payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const fetchMe = createAsyncThunk("auth/me", async (_, { rejectWithValue }) => {
  try {
    const res = await authService.getMe();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

// ─── Slice ──────────────────────────────────────────────────
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // ✅ Added setUser reducer
    setUser(state, action) {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      // signup
      .addCase(signup.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(signup.fulfilled, (s, action) => {
        s.loading = false;
        s.token = action.payload.token;
        s.user = action.payload.user;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(signup.rejected, (s, action) => {
        s.loading = false;
        s.error = action.payload;
      })

      // login
      .addCase(login.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(login.fulfilled, (s, action) => {
        s.loading = false;
        s.token = action.payload.token;
        s.user = action.payload.user;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (s, action) => {
        s.loading = false;
        s.error = action.payload;
      })

      // me
      .addCase(fetchMe.fulfilled, (s, action) => {
        s.user = action.payload.user;
      })
      .addCase(fetchMe.rejected, (s, action) => {
        s.error = action.payload;
      });
  },
});

// ─── Exports ─────────────────────────────────────────────────
export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
