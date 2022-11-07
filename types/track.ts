export interface trackParcel {
  otp: string;
  parcelId: string;
  name: string;
  phoneNumber: string;
  location: string;
}

export interface parcel {
  parcelId: string;
  id: string;
  name: string;
  phoneNumber: string;
  location: string;
  otp: string;
  active: boolean;
  otpVerified: boolean;
  createdAt: string;
}

export type currentParcel = {
  state: boolean;
  parcelItem: parcel | null;
};
