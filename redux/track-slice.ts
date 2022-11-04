import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

import { parcel, trackParcel } from "../types/track";
import { HYDRATE } from "next-redux-wrapper";

interface trackState {
  trackForm: trackParcel;
  parcelList: parcel[];
}

const initialState: trackState = {
  trackForm: {
    otp: "",
    parcelId: "",
    location: "",
    name: "",
    phoneNumber: "",
  },
  parcelList: [],
};

export const trackSlice = createSlice({
  name: "trackState",

  initialState,
  reducers: {
    settrackFormValue: (state, action: PayloadAction<trackParcel>) => {
      state.trackForm = action.payload;
    },
    setTrackParcels: (state, action: PayloadAction<parcel[]>) => {
      state.parcelList = action.payload;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action: PayloadAction<{ track: trackState }>) => {
      if (action.payload.track.parcelList.length !== 0) {
        state.parcelList = action.payload.track.parcelList;
      }
    },
  },
});

export const { settrackFormValue, setTrackParcels } = trackSlice.actions;

export const selectActiveParcel = (state: RootState) => state.track.parcelList;

export default trackSlice.reducer;
