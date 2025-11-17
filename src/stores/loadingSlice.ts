import { createSlice } from '@reduxjs/toolkit';

interface LoadingState {
  uploading: boolean;
}

const initialState: LoadingState = {
  uploading: false,
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    showLoading: (state) => {
      state.uploading = true;
    },
    hideLoading: (state) => {
      state.uploading = false;
    },
  },
});

export const { showLoading, hideLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
