import React, { useState } from "react";
import { Field, FieldArray, Form, Formik } from "formik";
import Image from "next/image";

import "yup-phone-lite";
import Input from "./Input";
import formErrorMsg from "../utils/errorMessage";
import {
  FormValues,
  OrderProps1,
  OrderProps2,
  OrderProps3,
  OrderProps4,
} from "../types/order";
import { BsCheckLg } from "react-icons/bs";

import {
  orderPage2Schema,
  orderPage3Schema,
  orderPage4Schema,
} from "../utils/schema";
import { useAppDispatch } from "../redux/redux-hook";
import { setInitialCategory } from "../redux/order-slice";

export const OrderPage1 = (props: OrderProps1) => {
  const dispatch = useAppDispatch();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const handleNextStep = () => {
    if (props.initialCategory.restaurant || props.initialCategory.supermarket) {
      props.setCurrentStep((prev) => prev + 1);
    } else {
      setErrorMsg("Select an option to continue");
    }
  };
  return (
    <div className="order-page-1">
      <h2>{`Let's get you started!`}</h2>
      <p>What are you looking for?</p>
      {errorMsg && <div className="validation-msg">{errorMsg}</div>}
      <div className="order-section">
        <div
          className={`supermarket-wrapper ${
            props.initialCategory.supermarket ? "active-category" : ""
          }`}
          onClick={
            () =>
              dispatch(
                setInitialCategory({
                  ...props.initialCategory,
                  supermarket: !props.initialCategory.supermarket,
                })
              )
            // props.setCategory((prev) => ({
            //   ...prev,
            //   supermarket: !prev.supermarket,
            // }))
          }
        >
          {props.initialCategory.supermarket ? <BsCheckLg /> : null}
          <p>Supermarket</p>
          <Image
            src="/supermarket.png"
            width="150"
            height="150"
            className="supermarket-img"
            alt="supermarket"
          />
        </div>
        <div
          className={`restaurant-wrapper ${
            props.initialCategory.restaurant ? "active-category" : ""
          }`}
          onClick={() =>
            dispatch(
              setInitialCategory({
                ...props.initialCategory,
                restaurant: !props.initialCategory.restaurant,
              })
            )
          }
        >
          {props.initialCategory.restaurant ? <BsCheckLg /> : null}
          <p>Restaurant</p>

          <Image
            src="/restaurant.png"
            width="150"
            height="150"
            alt="restaurant"
          />
        </div>
      </div>

      <button className="next-step-button" onClick={handleNextStep}>
        Next step
      </button>
    </div>
  );
};

export const OrderPage2 = (props: OrderProps2) => {
  const handleSubmit = (values: FormValues) => {
    if (props.formData.category !== values.category) {
      values.orderItem = [];
      props.setStoreValue(null);
    }

    props.next(values);
  };

  return (
    <div className="order-page-2">
      <h2>Choose your desired store</h2>
      <Formik
        initialValues={props.formData}
        onSubmit={handleSubmit}
        validationSchema={orderPage2Schema}
      >
        {({ values, errors }) => (
          <Form>
            <div className="fields-wrapper">
              {errors.category && (
                <div className="validation-msg">{errors.category}</div>
              )}
              {props.initialCategory.supermarket && (
                <>
                  <h3>Supermarket Section</h3>
                  <div className="supermarket-section">
                    <label>
                      <Field type="radio" name="category" value="Nilgiris" />
                      <Image
                        src="Nilgiris.png"
                        width="150"
                        height="150"
                        alt="Nilgiris"
                      />
                    </label>
                    <label>
                      <Field
                        type="radio"
                        name="category"
                        value="ExoticaStore"
                      />
                      <Image
                        src="/ExoticaStore.png"
                        width="150"
                        height="150"
                        alt="ExoticaStore"
                      />
                    </label>
                  </div>
                </>
              )}
              {props.initialCategory.restaurant && (
                <>
                  <h3>Restaurant Section</h3>
                  <div className="restaurant-section">
                    <label>
                      <Field type="radio" name="category" value="Dominos" />
                      <Image
                        src="/Dominos.png"
                        width="150"
                        height="150"
                        alt="Dominos"
                      />
                    </label>
                    <label>
                      <Field
                        type="radio"
                        name="category"
                        value="SupremeGourmet"
                      />
                      <Image
                        src="/SupremeGourmet.png"
                        width="150"
                        height="150"
                        alt="Supreme Gourmet"
                      />
                    </label>
                    <label>
                      <Field
                        type="radio"
                        name="category"
                        value="PaulsCreamery"
                      />
                      <Image
                        src="/PaulsCreamery.png"
                        width="150"
                        height="150"
                        alt="Paul's Creamery"
                      />
                    </label>
                    <label>
                      <Field
                        type="radio"
                        name="category"
                        value="SankersCoffe"
                      />
                      <Image
                        src="/SankersCoffe.png"
                        width="150"
                        height="150"
                        alt="Sanker's Coffee"
                      />
                    </label>
                  </div>
                </>
              )}
              <h3>From other stores</h3>
              <label className="other-options">
                <Field type="radio" name="category" value="Other" />
                <Image src="/Other.png" width="150" height="150" alt="Other" />
              </label>
            </div>
            <div className="form-bottom">
              <div className="form-nav-btn-wrapper">
                <button
                  className="prev-step-button"
                  type="button"
                  onClick={() => props.prev(values)}
                >
                  Go back
                </button>
                <button className="next-step-button" type="submit">
                  Next step
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export const OrderPage3 = (props: OrderProps3) => {
  let initialOtherValue = props.formData;
  if (props.formData.category !== "Other") {
    initialOtherValue = { ...props.formData, store: props.formData.category };
  }
  const handleSubmit = (values: FormValues) => {
    props.next(values);
  };

  return (
    <div className="order-page-3">
      <h2>Add items of your choice</h2>
      <Formik
        initialValues={initialOtherValue}
        onSubmit={handleSubmit}
        validationSchema={orderPage3Schema}
      >
        {({ values, errors, setFieldValue }) => (
          <Form>
            <div className="fields-wrapper">
              {errors.orderItem &&
                errors.orderItem?.length > 0 &&
                formErrorMsg(errors.orderItem).map(
                  (item: string, index: number) => {
                    return (
                      <div
                        key={index}
                        className="validation-msg order-item-validation"
                      >
                        {item}
                      </div>
                    );
                  }
                )}
              <fieldset className="itemList-wrapper">
                {/* <legend className="itemList-legend">ItemList</legend> */}
                <legend className="item-list-store-heading">
                  {values.category == "Other"
                    ? props.storeValue
                      ? props.storeValue
                      : "Select a store"
                    : values.category}
                </legend>

                {props.formData.category == "Other" && (
                  <Input label="Enter Store" name="store" />
                )}
                <FieldArray
                  name="orderItem"
                  render={(helpers) => {
                    return (
                      <div className="orderForm-itemList">
                        {values.orderItem.map((item, index) => {
                          return (
                            <div className="orderForm-item-wrapper" key={index}>
                              <Input
                                label="Item Name"
                                name={`orderItem[${index}].name`}
                                hideLabels={index > 0}
                              />

                              <Input
                                label="Qty."
                                name={`orderItem[${index}].quantity`}
                                number={true}
                                min="0"
                                hideLabels={index > 0}
                              />
                              <div className="select-wrapper">
                                <p>Select unit</p>
                                <Field
                                  as="select"
                                  name={`orderItem[${index}].unit`}
                                >
                                  <option value="" label="Select">
                                    Select a unit
                                  </option>
                                  <option value="number" label="number">
                                    number
                                  </option>
                                  <option value="kilogram" label="kg">
                                    kilogram
                                  </option>
                                  <option value="gram" label="g">
                                    gram
                                  </option>
                                  <option value="litre" label="L">
                                    litre
                                  </option>
                                </Field>
                              </div>

                              <div className="delete-btn-wrapper">
                                <p>Delete Item</p>
                                <button
                                  className="delete-item-btn"
                                  type="button"
                                  onClick={() => helpers.remove(index)}
                                >
                                  <Image
                                    src="/icon-delete.svg"
                                    alt="delete"
                                    width="16"
                                    height="16"
                                  />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                        <button
                          className="add-item-btn"
                          type="button"
                          onClick={() => {
                            helpers.push({
                              name: "",
                              quantity: "",
                              unit: "",
                            });
                          }}
                        >
                          + Add New Item
                        </button>
                      </div>
                    );
                  }}
                />
              </fieldset>
            </div>
            <div className="form-bottom">
              <div className="form-nav-btn-wrapper">
                <button
                  className="prev-step-button"
                  type="button"
                  onClick={() => props.prev(values)}
                >
                  Go back
                </button>
                <button className="next-step-button" type="submit">
                  Next step
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export const OrderPage4 = (props: OrderProps4) => {
  const [confirmOrder, setConfirmOrder] = useState(false);

  const handleSubmit = (values: FormValues) => {
    props.next(values, true);
  };

  const handlePreComplete = (values: FormValues) => {
    setConfirmOrder(true);
    props.preComplete(values);
  };

  return (
    <div className="order-page-4">
      {confirmOrder ? (
        <h2>Complete order now</h2>
      ) : (
        <h2>Fill contact information</h2>
      )}
      <Formik
        initialValues={props.formData}
        onSubmit={handleSubmit}
        validationSchema={orderPage4Schema}
      >
        {({ values, errors, validateForm, touched }) => (
          <Form>
            {confirmOrder ? (
              <div className="confirm-order-wrapper">
                <div className="order-confirmation-summary">
                  <div className="order-item-summary">
                    <h4>Confirm these items?</h4>
                    <div className="items-in-order">
                      {values.orderItem.map((item, index) => {
                        return (
                          <div
                            className="summary-item"
                            key={`${item.name}-${index}`}
                          >
                            <p className="summary-item-name">{item.name}</p>
                            <Image
                              src={`/${values.category}.png`}
                              width="32"
                              height="32"
                              alt={values.category}
                            />
                            <p>{item.quantity}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="store-item-summary">
                    <h4>Order from the following stores</h4>
                    <div className="stores-in-order">
                      <div className="summary-store">
                        <Image
                          src={`/${values.category}.png`}
                          width="60"
                          height="60"
                          alt={values.category}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="confirm-btn-wrapper">
                  <button
                    type="button"
                    className="cancel-order-btn"
                    onClick={() => setConfirmOrder(false)}
                  >
                    Cancel Order
                  </button>
                  <button type="submit" className="complete-btn">
                    Complete Order
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="fields-wrapper">
                  {(errors.location || errors.phoneNumber || errors.name) && (
                    <div className="validation-msg ">
                      {errors.name
                        ? errors.name
                        : errors.location
                        ? errors.location
                        : errors.phoneNumber}
                    </div>
                  )}
                  <div className="order-form-contact">
                    <Input label="Name" name="name" />
                    <Input label="PhoneNumber" name="phoneNumber" />
                    <Input label="Address" name="location" />
                  </div>
                  <div className="order-contact-details">
                    <h4>Important Info</h4>
                    <p>
                      Please make sure the order is as per your need before
                      submiting the order.
                    </p>
                    <p>
                      Once the order is confirmed it cannot be updated or
                      modified.
                    </p>
                  </div>
                </div>
                <div className="form-bottom">
                  <div className="form-nav-btn-wrapper">
                    <button
                      className="prev-step-button"
                      type="button"
                      onClick={() => props.prev(values)}
                    >
                      Go back
                    </button>
                    <button
                      className="next-step-button"
                      type="button"
                      onClick={() =>
                        validateForm().then((errormsg) => {
                          if (
                            !errormsg.name &&
                            !errormsg.location &&
                            !errormsg.phoneNumber
                          ) {
                            handlePreComplete(values);
                          }
                        })
                      }
                    >
                      Complete Now
                    </button>
                  </div>
                </div>
              </>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};
