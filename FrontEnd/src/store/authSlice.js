import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, setToken, clearToken, getToken } from "../services/api";
import { storage } from "../utils/storage";

export const signup = createAsyncThunk("auth/signup", async (payload) => {
  const { token, user } = await api.signup(payload);
  setToken(token);
  storage.write(storage.KEYS.CURRENT_USER, user);
  return user;
});

export const login = createAsyncThunk("auth/login", async (payload) => {
  const { token, user } = await api.login(payload);
  setToken(token);
  storage.write(storage.KEYS.CURRENT_USER, user);
  return user;
});


export const refreshSession = createAsyncThunk("auth/refreshSession", async (_, { rejectWithValue }) => {
  try {
    const { user } = await api.me();
    storage.write(storage.KEYS.CURRENT_USER, user);
    return user;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchAllUsers = createAsyncThunk("auth/fetchAllUsers", async () => {
  const { users } = await api.allUsers();
  return users;
});

const initialState = {
  currentUser: getToken() ? storage.read(storage.KEYS.CURRENT_USER, null) : null,
  users: [],
  status: "idle", 
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    sessionEnded(state) {
      state.currentUser = null;
      clearToken();
      localStorage.removeItem(storage.KEYS.CURRENT_USER);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentUser = action.payload;
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentUser = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(refreshSession.fulfilled, (state, action) => {
        state.currentUser = action.payload;
      })
      .addCase(refreshSession.rejected, (state) => {
        // Cached token is no longer valid - sign the user out locally.
        state.currentUser = null;
        clearToken();
        localStorage.removeItem(storage.KEYS.CURRENT_USER);
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      });
  },
});

export const { sessionEnded } = authSlice.actions;
export default authSlice.reducer;


export const selectCurrentUser = (state) => state.auth.currentUser;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
export const selectAllUsers = (state) => state.auth.users;
