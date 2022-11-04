import { Field, Form, Formik } from "formik";
import React, { Dispatch, SetStateAction, useState } from "react";
import { setAdminCount, setAdminOrder } from "../redux/order-slice";
import { useAppDispatch } from "../redux/redux-hook";
import { setErrorAdminValue } from "../redux/util-slice";
import { category, config } from "../utils/initialValues";
import DateRangePicker from "./DateRangePicker";

const initialValue = {
  dateRange: [null, null],
  category: "",
};
interface adminQuery {
  dateRange: Date[] | null[];
  category: string;
}
type Props = {
  loading?: boolean;
  filterValues?: adminQuery | null;
  setFilterValues: Dispatch<SetStateAction<adminQuery | null>>;

  setLoading: Dispatch<SetStateAction<boolean>>;
};
const Filter = (props: Props) => {
  const dispatch = useAppDispatch();
  const handleRequest = async (values: adminQuery) => {
    props.setLoading(true);
    try {
      const res = await fetch(`${config.url.API_URL}/api/order/admin`, {
        body: JSON.stringify(values),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await res.json();

      dispatch(setAdminOrder(response.newOrder));
      dispatch(setAdminCount(response.count));
    } catch (error) {
      dispatch(setErrorAdminValue("Can't fetch resources"));
    } finally {
      props.setLoading(false);
    }
  };

  const handleSubmit = (values: adminQuery) => {
    handleRequest(values);
    props.setFilterValues(values);
  };
  return (
    <div className="filter-wrapper">
      <Formik initialValues={initialValue} onSubmit={handleSubmit}>
        {({ values }) => (
          <Form className="admin-filter-options">
            <DateRangePicker name="dateRange" />
            <Field as="select" name="category">
              <option value="" label="Select a store">
                Select a store
              </option>
              {category.map((item, index) => (
                <option key={`${item}-${index}`} value={item} label={item}>
                  {" "}
                  store: true,
                  {item}
                </option>
              ))}
            </Field>
            <div className="admin-order-button-wrapper">
              <button type="submit">Filter</button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Filter;
