import React, { Dispatch, SetStateAction } from "react";
import moment from "moment";
import type { GetServerSidePropsContext, NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  AiFillCheckCircle,
  AiOutlineLeft,
  AiOutlineRight,
} from "react-icons/ai";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import { MdPending } from "react-icons/md";
import ReactPaginate from "react-paginate";
import Loader from "./Loader";

import { currentParcel, parcel } from "../types/track";
import { config } from "../utils/initialValues";
import DateRangePicker from "./DateRangePicker";
import { Form, Formik } from "formik";
import { useAppDispatch } from "../redux/redux-hook";
import { setErrorAdminValue } from "../redux/util-slice";

type Props = {
  activeOrderCount: number;
  activeData: parcel[];
  setCurrentParcel: Dispatch<SetStateAction<currentParcel>>;
  currentList: parcel[];
  setParcelCount: Dispatch<SetStateAction<number>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  setCurrentList: React.Dispatch<React.SetStateAction<parcel[]>>;
};

const initialValue = {
  dateRange: [null, null],
};

interface adminQuery {
  dateRange: Date[] | null[];
}
const AdminTrack = (props: Props) => {
  const { data: session, status } = useSession({ required: true });

  // const [currentList, setCurrentList] = useState(props.activeData);
  const [disabel, setDisabled] = useState(false);
  const [modal, setModal] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const dataPerPage = 10;
  console.log(props.activeOrderCount);
  const dateFormatter = (date: string) => {
    return moment(date.split("T")[0], "YYYY-MM-DD").format("DD MMM YYYY");
  };
  const pageCount = Math.ceil(props.activeOrderCount / dataPerPage);
  const handleSelectAll = () => {
    setCheckAll((prev) => !prev);
    setSelectedParcel(props.currentList.map((li) => li.id));

    if (checkAll) {
      setSelectedParcel([]);
    }
  };
  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedParcel((prev) => [...prev, e.target.id]);

    if (!e.target.checked) {
      setSelectedParcel((prev) => prev.filter((item) => item !== e.target.id));
    }
  };
  const fetchData = async (pageNumber: number) => {
    props.setLoading(true);
    try {
      const response = await fetch(
        ` ${config.url.API_URL}/api/pagination/track?` +
          new URLSearchParams({
            page: pageNumber.toString(),
          })
      );

      const res = await response.json();
      props.setCurrentList(res);
    } catch (err) {
      dispatch(setErrorAdminValue("can't fetch resources"));
    } finally {
      props.setLoading(false);
    }
  };

  const handlePageClick = async ({ selected }: { selected: number }) => {
    const pageNumber = dataPerPage * selected;

    await fetchData(pageNumber);
  };
  const handleSelected = async () => {
    props.setLoading(true);
    setDisabled(true);
    try {
      if (selectedParcel.length < 1) {
        return;
      } else {
        const res = await fetch(`${config.url.API_URL}/api/track/confirm`, {
          body: JSON.stringify({ selectedParcel }),
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (res.status == 200) {
          props.currentList.map((item) => {
            if (selectedParcel.includes(item.id)) {
              return (item.active = false);
            }
          });

          setSelectedParcel([]);
          setModal(false);
        }
      }
    } catch (err) {
      dispatch(setErrorAdminValue("Failed to fetch"));
    } finally {
      props.setLoading(false);
      setDisabled(false);
    }
  };

  const handleRequest = async (values: adminQuery) => {
    props.setLoading(true);
    try {
      const res = await fetch(`${config.url.API_URL}/api/track/filter`, {
        body: JSON.stringify(values),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await res.json();
      props.setCurrentList(response.newParcel);
      props.setParcelCount(response.count);
    } catch (error) {
      dispatch(setErrorAdminValue("Can't fetch resources"));
    } finally {
      props.setLoading(false);
    }
  };

  const handleSubmit = (values: adminQuery) => {
    handleRequest(values);
  };

  return (
    <div className="admin-track-content">
      <div className="filter-wrapper">
        <Formik initialValues={initialValue} onSubmit={handleSubmit}>
          {({ values }) => (
            <Form className="admin-filter-options">
              <DateRangePicker name="dateRange" />

              <div className="admin-order-button-wrapper">
                <button type="submit">Filter</button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <div className="admin-order-list-wrapper">
        {modal && (
          <div className="modal-wrapper">
            <div className="modal-container">
              <h3>Confirm Parcel?</h3>

              <div>
                <button
                  className="confirm-paid-btn"
                  disabled={disabel}
                  onClick={() => handleSelected()}
                >
                  Confirm
                </button>
                <button className="cancel-btn" onClick={() => setModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="admin-parcel-list">
          <div className="admin-order-list-heading">
            <div className="admin-list-select-all">
              <input
                type="checkbox"
                name="selectAll"
                id="selectAll"
                onChange={handleSelectAll}
              />
            </div>

            <div className="admin-tracker-order-id">Parcel id</div>
            <div className="admin-tracker-order-status">Status</div>
            <div className="admin-tracker-client-name">Client</div>
            <div className="admin-tracker-issue-date">issued Date</div>
            <div className="admin-tracker-phone">otp</div>
            <div className="admin-tracker-link">phoneNumber</div>
          </div>
          <ul className="admin-order-list-content">
            {props.loading ? (
              <Loader />
            ) : props.currentList ? (
              props.currentList.map((item, index) => {
                return (
                  <div key={item.id} className="admin-parcel-list-item">
                    <div className="admin-parcel-item-select">
                      <input
                        type="checkbox"
                        name={`${item.name}`}
                        id={item.id}
                        checked={selectedParcel.includes(item.id)}
                        onChange={(e) => handleCheck(e)}
                      />
                    </div>
                    <div className="admin-parcel-id">{item.parcelId}</div>
                    <div className="admin-parcel-status">
                      {item.active ? (
                        <MdPending
                          style={{ color: "rgba(255, 135, 0, 0.5)" }}
                        />
                      ) : (
                        <AiFillCheckCircle
                          style={{ color: "rgba(51, 214, 159, 0.5)" }}
                        />
                      )}
                    </div>
                    <div className="admin-client-name">{item.name}</div>
                    <div className="admin-issue-date">
                      {dateFormatter(item.createdAt)}
                    </div>
                    <div className="admin-phone">
                      {item.otpVerified ? item.otp : "not verified"}
                    </div>

                    <div
                      className="admin-link"
                      onClick={() =>
                        props.setCurrentParcel({
                          state: true,
                          parcelItem: item,
                        })
                      }
                    >
                      <BsFillArrowRightCircleFill />
                    </div>
                  </div>
                );
              })
            ) : (
              <Loader />
            )}
          </ul>
          <div className="admin-order-list-footer">
            <div className="admin-order-count">
              <p>
                Orders: <span>{props.activeOrderCount}</span>
              </p>
            </div>
            <div className="admin-order-button-wrapper">
              <button onClick={() => setModal(true)}>confirm</button>
            </div>
            <div className="admin-order-list-pagination">
              <ReactPaginate
                breakLabel="..."
                nextLabel={<AiOutlineRight />}
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                pageCount={pageCount}
                previousLabel={<AiOutlineLeft />}
                containerClassName="pagination-btn-wrapper"
                pageClassName="pagination-page-btn"
                nextLinkClassName="pagination-next-btn"
                previousLinkClassName="pagination-prev-btn"
                activeLinkClassName="pagination-active-btn"
                // renderOnZeroPageCount={null}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTrack;
