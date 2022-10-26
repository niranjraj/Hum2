import * as yup from "yup";
import "yup-phone-lite";

export const orderPage2Schema = yup.object().shape({
  category: yup.string().required("Select a store"),
  // .min(1, "Select atleast one store in order to continue."),
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
