import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  roles: []
  // ... thêm nếu cần
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isRedirecting: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isRedirecting: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },

    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    setRefreshToken: (state, action: PayloadAction<string>) => {
      state.refreshToken = action.payload;
    },
    logoutUser: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
    },
    setIsRedirecting(state, action: PayloadAction<boolean>) {
      state.isRedirecting = action.payload;
    },
  },
});

export const { setUser, setAccessToken, setRefreshToken, logoutUser, setIsRedirecting  } = authSlice.actions;
export default authSlice.reducer;
