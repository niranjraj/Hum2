import moment from "moment";
import React, { Dispatch, SetStateAction, useState } from "react";
import { currentParcel, parcel } from "../types/track";
import { config, statusColors } from "../utils/initialValues";
import { IoMdArrowRoundBack } from "react-icons/io";
import Loader from "./Loader";
import { useAppDispatch } from "../redux/redux-hook";
import { setErrorAdminValue } from "../redux/util-slice";
type Props = {
  item: parcel;
  setCurrentParcel: Dispatch<SetStateAction<currentParcel>>;
  currentList: parcel[];
  setCurrentList: React.Dispatch<React.SetStateAction<parcel[]>>;
};
const AdminTrackItem = (props: Props) => {
  const [currentItem, setCurrentItem] = useState(props.item);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const dateFormatter = (date: string) => {
    return moment(date.split("T")[0], "YYYY-MM-DD").format("DD MMM YYYY");
  };
  const handleRequest = async () => {
    const res = await fetch(`${config.url.API_URL}/api/track/confirm`, {
      body: JSON.stringify({ selectedParcel: [currentItem.id] }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await res.json();
  };

  const handleConfirm = async () => {
    if (currentItem.active) {
      setLoading(true);
      try {
        await handleRequest();
        const newList = props.currentList.map((item) => {
          if (item.id === currentItem.id) {
            return (item.active = false);
          }
        });
      } catch (err) {
        dispatch(setErrorAdminValue("Failed to confirm"));
      } finally {
        setLoading(false);
      }
    }
  };
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="parcel-page-wrapper">
      <div className="parcel-page">
        <div className="parcel-page-back">
          <button
            onClick={() => {
              props.setCurrentParcel({ state: false, parcelItem: null });
            }}
          >
            <IoMdArrowRoundBack />
            Back
          </button>
        </div>
        <div className="parcel-page-button-wrapper">
          <div
            className="active-order-status"
            style={{
              backgroundColor: `${
                currentItem.active
                  ? statusColors.active.transColor
                  : statusColors.confirmed.transColor
              }`,
            }}
          >
            <div
              className="active-order-status-circle"
              style={{
                backgroundColor: `${
                  currentItem.active
                    ? statusColors.active.backgroundColor
                    : statusColors.confirmed.backgroundColor
                }`,
              }}
            ></div>
            <p
              style={{
                color: `${
                  currentItem.active
                    ? statusColors.active.color
                    : statusColors.confirmed.color
                }`,
              }}
            >
              {currentItem.active ? "active" : "confirmed"}
            </p>
          </div>

          <div className="confirm-parcel-button" onClick={handleConfirm}>
            Confirm
          </div>
        </div>
        <div className="parcel-page-info-wrapper">
          <div className="parcel-page-ident">
            <div className="parcel-item-id">
              <span>Parcel Id: </span>
              {currentItem.parcelId}
            </div>
            <div className="parcel-item-date">
              {dateFormatter(currentItem.createdAt)}
            </div>
          </div>

          <div className="parcel-page-info">
            <div
              className={`parcel-item-verified ${
                currentItem.otpVerified ? "" : "non-active"
              }`}
            >
              {currentItem.otpVerified ? (
                <>
                  <span>Otp: </span> {currentItem.otp}
                </>
              ) : (
                "Not Verified"
              )}
            </div>
            <div className="parcel-item-name">
              {" "}
              <span>Name: </span>
              {currentItem.name}
            </div>
            <div className="parcel-item-location">
              <span>Address: </span>
              {currentItem.location}
            </div>
            <div className="parcel-item-phone">
              <span>PhoneNumber: </span>
              {currentItem.phoneNumber}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTrackItem;
