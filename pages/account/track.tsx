import { Form, Formik } from "formik";
import type { GetServerSidePropsContext, NextPage } from "next";
import { getSession, useSession } from "next-auth/react";

import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import Input from "../../components/Input";

import Wrapper from "../../layout/Wrapper";
import prisma from "../../utils/prismaInit";
import { useAppDispatch, useAppSelector } from "../../redux/redux-hook";
import { wrapper } from "../../redux/store";
import { trackParcel } from "../../types/track";
import {
  config,
  statusColors,
  verifiedColors,
} from "../../utils/initialValues";
import { otpSchema, trackSchema } from "../../utils/schema";
import { setTrackParcels } from "../../redux/track-slice";
import moment from "moment";
import Maintenance from "../../components/Maintenance";
import { setErrorTrackValue } from "../../redux/util-slice";

const Track: NextPage<{ userId: string }> = (props) => {
  const { data: session, status } = useSession({ required: true });
  const [trackModal, setTrackModal] = useState(false);
  const parcelItemRef = useRef<Array<HTMLLIElement | null>>([]);
  const [currPage, setCurrPage] = useState(1); // storing current page number
  const [prevPage, setPrevPage] = useState(0); // storing prev page numbe
  const [lastList, setLastList] = useState(false);
  const formItemRef = useRef<Array<HTMLFormElement | null>>([]);
  const listInnerRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const initialValue = useAppSelector((state) => state.track.trackForm);
  const parcelData = useAppSelector((state) => state.track.parcelList);
  const trackError = useAppSelector((state) => state.util.errorTrack);

  const handleClick = (index: number, e: React.MouseEvent<HTMLLIElement>) => {
    const item = parcelItemRef?.current;
    const form = formItemRef?.current;
    if (
      item[index] &&
      item[index]?.classList.contains("parcel-open") &&
      !form[index]?.contains(e.target as HTMLLIElement)
    ) {
      item[index]?.classList.remove("parcel-open");
    } else {
      item[index]?.classList.add("parcel-open");
    }
  };
  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (scrollTop + clientHeight === scrollHeight) {
        setCurrPage((prev) => prev + 1);
      }
    }
  };

  useEffect(() => {
    try {
      const fetchData = async () => {
        const response = await fetch(
          `${config.url.API_URL}/api/track?` +
            new URLSearchParams({
              userId: props.userId,
              page: parcelData.length.toString(),
            })
        );

        const res = await response.json();
        if (!res.length) {
          setLastList(true);
          return;
        }
        setPrevPage(currPage);

        dispatch(setTrackParcels([...parcelData, ...res]));
      };

      if (!lastList && prevPage !== currPage && currPage > 1) {
        fetchData();
      }
    } catch (err) {
      dispatch(setErrorTrackValue("Failed to fetch resources"));
    }
  }, [currPage, lastList, prevPage, props.userId, parcelData, dispatch]);

  const handleRequest = async (values: trackParcel) => {
    try {
      const res = await fetch(`${config.url.API_URL}/api/track`, {
        body: JSON.stringify(values),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await res.json();
      dispatch(setTrackParcels([response, ...parcelData]));
    } catch (error) {
      dispatch(setErrorTrackValue("Failed to set Tracking"));
    }
  };
  const handleOtpRequest = async (values: {
    otp: string;
    id: string;
    index: number;
  }) => {
    try {
      const res = await fetch(`${config.url.API_URL}/api/track/update`, {
        body: JSON.stringify(values),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await res.json();
      if (res.status == 200) {
        const item = parcelItemRef?.current;
        if (
          item[values.index] &&
          item[values.index]?.classList.contains("parcel-open")
        ) {
          item[values.index]?.classList.remove("parcel-open");
        }
      }
    } catch (error) {
      dispatch(setErrorTrackValue("Failed to set Otp"));
    }
  };
  const handleSubmit = (values: trackParcel) => {
    handleRequest(values);
    setTrackModal(false);
  };
  const handleOtp = (values: { otp: string; id: string; index: number }) => {
    handleOtpRequest(values);
  };
  if (status === "authenticated") {
    return (
      <Wrapper addClass="track-wrapper">
        {trackError && (
          <div
            className="error-sign-wrapper"
            onClick={() => dispatch(setErrorTrackValue(null))}
          >
            {trackError}
          </div>
        )}
        <div className="account-content">
          <div className="account-header">
            <h2>My Parcels</h2>
            <button className="order-btn" onClick={() => setTrackModal(true)}>
              Track Now
            </button>
          </div>
          <div className="parcel-wrapper">
            <div
              className="active-parcel-list-wrapper"
              onScroll={onScroll}
              ref={listInnerRef}
            >
              <ul className="active-parcel-list">
                {parcelData.length > 0 &&
                  parcelData.map((item, index) => {
                    return (
                      <li
                        key={`${item.createdAt}-${index}`}
                        className="parcel-item-wrapper"
                        onClick={(e) => {
                          handleClick(index, e);
                        }}
                        ref={(el) => (parcelItemRef.current[index] = el)}
                      >
                        <div className="active-parcel">
                          <div className="active-parcel-date">
                            {moment(
                              item.createdAt.split("T")[0],
                              "YYYY-MM-DD"
                            ).format("DD MMM YYYY")}
                          </div>
                          <div
                            className="active-order-status"
                            style={{
                              backgroundColor: `${
                                item.active
                                  ? statusColors.active.transColor
                                  : statusColors.confirmed.transColor
                              }`,
                            }}
                          >
                            <div
                              className="active-order-status-circle"
                              style={{
                                backgroundColor: `${
                                  item.active
                                    ? statusColors.active.backgroundColor
                                    : statusColors.confirmed.backgroundColor
                                }`,
                              }}
                            ></div>
                            <p
                              style={{
                                color: `${
                                  item.active
                                    ? statusColors.active.color
                                    : statusColors.confirmed.color
                                }`,
                              }}
                            >
                              {item.active ? "active" : "confirmed"}
                            </p>
                          </div>
                          <div className="parcel-verified-wrapper">
                            {item.otpVerified ? (
                              ""
                            ) : (
                              <div>
                                Otp<span> Required</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="otp-form-wrapper">
                          <div className="otp-form-info">
                            <div className="otp-form-id">
                              <span>Parcel Id: </span> {item.parcelId}
                            </div>
                            <div className="otp-form-name">
                              <span>Name: </span>
                              {item.name}
                            </div>
                            <div className="otp-form-location">
                              <span>Address: </span>
                              {item.location}
                            </div>
                            <div className="otp-form-phone">
                              <span>Phone: </span>
                              {item.phoneNumber}
                            </div>
                          </div>
                          {!item.otpVerified && (
                            <Formik
                              initialValues={{ otp: "" }}
                              onSubmit={(values) => {
                                handleOtp({
                                  ...values,
                                  id: item.id,
                                  index: index,
                                });
                              }}
                              validationSchema={otpSchema}
                            >
                              {({ values, errors }) => (
                                <Form
                                  className="otp-form"
                                  ref={(el) =>
                                    (formItemRef.current[index] = el)
                                  }
                                >
                                  <div className="track-fields-wrapper">
                                    {errors.otp && (
                                      <div className="validation-msg ">
                                        {errors.otp}
                                      </div>
                                    )}

                                    <Input label="Otp" name="otp" />
                                  </div>
                                  <button className="track-btn" type="submit">
                                    Confirm Otp
                                  </button>
                                </Form>
                              )}
                            </Formik>
                          )}
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
        </div>

        {trackModal && (
          <div className="track-modal-wrapper">
            <div className="track-modal">
              <div
                className="close-modal-wrapper"
                onClick={() => setTrackModal(false)}
              >
                <IoClose />
              </div>
              <div className="track-modal-content">
                <h2>Track your parcels Now</h2>
                <Formik
                  initialValues={initialValue}
                  onSubmit={handleSubmit}
                  validationSchema={trackSchema}
                >
                  {({ values, errors, validateForm, touched }) => (
                    <Form>
                      <div className="track-fields-wrapper">
                        {(errors.location ||
                          errors.phoneNumber ||
                          errors.name ||
                          errors.otp ||
                          errors.parcelId) && (
                          <div className="validation-msg ">
                            {errors.name
                              ? errors.name
                              : errors.location
                              ? errors.location
                              : errors.phoneNumber
                              ? errors.phoneNumber
                              : errors.otp
                              ? errors.otp
                              : errors.parcelId}
                          </div>
                        )}
                        <div className="track-form">
                          <Input label="Parcel Id" name="parcelId" />
                          <Input label="Otp" name="otp" />
                          <Input label="Name" name="name" />
                          <Input label="PhoneNumber" name="phoneNumber" />
                          <Input label="Address" name="location" />
                        </div>
                      </div>
                      <button className="track-btn" type="submit">
                        Confirm Parcel
                      </button>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        )}
      </Wrapper>
    );
  }
  return <div></div>;
};
export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx: GetServerSidePropsContext) => {
    let userId = null;
    const session = await getSession(ctx);

    let activeData: any = [];
    if (session && session.user?.email) {
      try {
        const user = await prisma.user.findUnique({
          where: { email: session.user?.email },
        });

        userId = user?.id;

        const activeParcel = await prisma?.tracker.findMany({
          orderBy: {
            createdAt: "desc",
          },
          where: { userId: user?.id },
          take: 10,
        });

        activeData = activeParcel.map(({ userId, createdAt, otp, ...rest }) => {
          return { ...rest, createdAt: JSON.stringify(createdAt) };
        });

        store.dispatch(setTrackParcels(activeData));
      } catch (e) {
        // store.dispatch(setErrorAccountValue("There seems to be a problem"));
      }
    }

    return {
      props: { userId },
    };
  }
);
export default Track;
