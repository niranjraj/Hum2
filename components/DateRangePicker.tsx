import React from "react";

import DatePicker from "react-datepicker";

import { useField, useFormikContext } from "formik";

const DateRangePicker = (props: { name: string }) => {
  const { setFieldValue, values } = useFormikContext();
  const [field] = useField(props.name);

  return (
    <div className="calendar-wrapper">
      <DatePicker
        selectsRange={true}
        startDate={field.value[0]}
        endDate={field.value[1]}
        placeholderText={"Please select a date"}
        onChange={(update) => {
          setFieldValue(field.name, update);
        }}
        isClearable={true}
      />
    </div>
  );
};

export default DateRangePicker;
