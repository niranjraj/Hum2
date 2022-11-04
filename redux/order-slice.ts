import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import {
  AdminOrder,
  FormValues,
  ActiveOrder,
  InitialCategory,
} from "../types/order";

import { HYDRATE } from "next-redux-wrapper";

interface orderState {
  formValue: FormValues;
  activeOrder: ActiveOrder[];
  adminOrder: AdminOrder[];
  selectedOrder: string[];
  adminCount: number;
  initialCategory: InitialCategory;
}

const initialState: orderState = {
  formValue: {
    category: "",
    store: "",
    orderItem: [],
    name: "",
    phoneNumber: "",
    location: "",
  },
  adminOrder: [],
  selectedOrder: [],
  adminCount: 0,
  activeOrder: [],
  initialCategory: {
    supermarket: false,
    restaurant: false,
  },
};

export const orderSlice = createSlice({
  name: "orderState",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setFormValue: (state, action: PayloadAction<FormValues>) => {
      state.formValue = action.payload;
    },
    setActiveOrder: (state, action: PayloadAction<ActiveOrder[]>) => {
      state.activeOrder = action.payload;
    },
    setAdminCount: (state, action: PayloadAction<number>) => {
      state.adminCount = action.payload;
    },
    setSelectedOrder: (state, action: PayloadAction<string[]>) => {
      state.selectedOrder = action.payload;
    },
    setAdminOrder: (state, action: PayloadAction<AdminOrder[]>) => {
      state.adminOrder = action.payload;
    },
    updateActiveOrder: (state, action: PayloadAction<ActiveOrder>) => {
      state.activeOrder = [action.payload, ...state.activeOrder];
    },
    setInitialCategory: (state, action: PayloadAction<InitialCategory>) => {
      state.initialCategory = action.payload;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action: PayloadAction<{ order: orderState }>) => {
      state.adminOrder = action.payload.order.adminOrder;
      state.activeOrder = action.payload.order.activeOrder;
      state.adminCount = action.payload.order.adminCount;
    },
  },
});

export const {
  setFormValue,
  setActiveOrder,
  setInitialCategory,
  setSelectedOrder,
  setAdminOrder,
  setAdminCount,
  updateActiveOrder,
} = orderSlice.actions;

export const selectFormValue = (state: RootState) => state.order.formValue;
export const selectActiveOrder = (state: RootState) => state.order.activeOrder;
export default orderSlice.reducer;
