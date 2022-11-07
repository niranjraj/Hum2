import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { Item, FormValues, ActiveOrder, InitialCategory } from "../types/order";

interface utilState {
  errorSign: string | null;
  errorAccount: string | null;
  errorAdmin: string | null;
  errorTrack: string | null;
}

const initialState: utilState = {
  errorSign: null,
  errorAccount: null,
  errorTrack: null,
  errorAdmin: null,
};

export const utilSlice = createSlice({
  name: "utilState",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setErrorSignValue: (state, action: PayloadAction<string | null>) => {
      state.errorSign = action.payload;
    },
    setErrorAccountValue: (state, action: PayloadAction<string | null>) => {
      state.errorAccount = action.payload;
    },
    setErrorAdminValue: (state, action: PayloadAction<string | null>) => {
      state.errorAdmin = action.payload;
    },
    setErrorTrackValue: (state, action: PayloadAction<string | null>) => {
      state.errorTrack = action.payload;
    },
  },
});

export const {
  setErrorSignValue,
  setErrorAccountValue,
  setErrorAdminValue,
  setErrorTrackValue,
} = utilSlice.actions;

// Other code such as selectors can use the imported `RootState` type

export default utilSlice.reducer;
