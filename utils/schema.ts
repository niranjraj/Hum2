import * as yup from "yup";
import "yup-phone-lite";

const digitsOnly = (value: string | undefined) => /^\d+$/.test(value as string);
export const orderPage2Schema = yup.object().shape({
  category: yup.string().required("Select a store"),
  // .min(1, "Select atleast one store in order to continue."),
});
export const otpSchema = yup.object().shape({
  otp: yup
    .string()
    .min(6, "- Must be exactly 6 digits")
    .max(6, "- Must be exactly 6 digits")
    .test("Digits only", "The field should have digits only", digitsOnly)
    .required(),
});
export const trackSchema = yup.object().shape({
  name: yup.string().required("- All fields must be filled."),
  otp: yup
    .string()
    .min(6, "- Must be exactly 6 digits")
    .max(6, "- Must be exactly 6 digits"),
  parcelId: yup
    .string()
    .required("- All fields must be filled")
    .min(8, "- Must be exactly 8 digits")
    .max(8, "- Must be exactly 8 digits"),
  phoneNumber: yup
    .string()
    .phone("IN", "- Phone number is not valid")
    .required("- All fields must be filled."),
  location: yup.string().required("- All fields must be filled"),
});

export const orderPage4Schema = yup.object().shape({
  name: yup.string().required("- All fields must be filled."),
  phoneNumber: yup
    .string()
    .phone("IN", "- Phone number is not valid")
    .required("- All fields must be filled."),
  location: yup.string().required("- All fields must be filled"),
});
export const orderPage3Schema = yup.object().shape({
  store: yup.string().required("- Enter a store to continue."),
  orderItem: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required("- All fields must be filled."),
        quantity: yup
          .number()
          .typeError("- Invalid input.")
          .required("- All fields must be filled.")
          .max(9999999999, "- Quantity limit reached.")
          .min(0, "- Invalid input."),
        unit: yup
          .string()
          .oneOf(["number", "kilogram", "litre", "gram"])
          .required("- Select a unit."),
      })
    )
    .min(1, "Atleast one item must be added"),
});
