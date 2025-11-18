import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  // ... thêm nếu cần
}

interface AuthState {
  user: User | null;
  access_token: string | null;
  refresh_token: string | null;
  // isRedirecting: boolean;
}

const initialState: AuthState = {
  user: null,
  access_token: null,
  refresh_token: null,
  // isRedirecting: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUserState: (state, action: PayloadAction<AuthState>) => {
      state.access_token = action.payload.access_token;
      state.refresh_token = action.payload.refresh_token;
      state.user = action.payload.user;
    },
    logoutUserState: (state) => {
      state.access_token = null;
      state.refresh_token = null;
      state.user = null;
    },
    updateUserState: (state, action: PayloadAction<Partial<User>>) => {
      if (!state.user) return;
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },
    // setIsRedirecting(state, action: PayloadAction<boolean>) {
    //   state.isRedirecting = action.payload;
    // },
  },
});

export const { loginUserState, logoutUserState, updateUserState  } = authSlice.actions;
export default authSlice.reducer;
