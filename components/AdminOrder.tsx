import React, { Dispatch, SetStateAction } from "react";

import { useState } from "react";
import SideNav from "./SideNav";
import prisma from "../utils/prismaInit";
import { MdPending } from "react-icons/md";

import {
  AiFillCheckCircle,
  AiOutlineRight,
  AiOutlineLeft,
} from "react-icons/ai";
import moment from "moment";
import Image from "next/image";
import DateRangePicker from "./DateRangePicker";
import { wrapper } from "../redux/store";
import ReactPaginate from "react-paginate";

import { useAppSelector, useAppDispatch } from "../redux/redux-hook";
import { Field, Form, Formik } from "formik";
import {
  setAdminCount,
  setAdminOrder,
  setSelectedOrder,
} from "../redux/order-slice";
import { category, config, selectedCopy } from "../utils/initialValues";

import Link from "next/link";
import { useRouter } from "next/router";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import Loader from "./Loader";

import { createDoc } from "../utils/documentGenerator";
import { setErrorAdminValue } from "../redux/util-slice";
import Filter from "./Filter";
import Wrapper from "../layout/Wrapper";
import { Serialized } from "../types/order";
import { current } from "@reduxjs/toolkit";
import CopyToClipboard from "react-copy-to-clipboard";
import { FaCopy } from "react-icons/fa";

const initialValue = {
  dateRange: [null, null],
  category: "",
};

interface adminQuery {
  dateRange: Date[] | null[];
  category: string;
}
type currentOrder = {
  state: boolean;
  orderItem: Serialized | null;
};
type Props = {
  setCurrentOrder: Dispatch<SetStateAction<currentOrder>>;
};
const AdminOrder = (props: Props) => {
  const [filterValues, setFilterValues] = useState<adminQuery | null>(null);
  const [loading, setLoading] = useState(false);
  const [disabel, setDisabled] = useState(false);

  const [checkAll, setCheckAll] = useState(false);
  const [modal, setModal] = useState({ state: false, mode: "payment" });
  const currentList = useAppSelector((state) => state.order.adminOrder);
  const adminOrderCount = useAppSelector((state) => state.order.adminCount);
  const selectedOrder = useAppSelector((state) => state.order.selectedOrder);
  const adminError = useAppSelector((state) => state.util.errorAdmin);
  const [textToCopy, setTextToCopy] = useState(
    selectedCopy(selectedOrder, currentList)
  );
  const [copyState, setCopyState] = useState({
    value: selectedCopy(selectedOrder, currentList),
    copied: false,
  });

  const dataPerPage = 10;

  const pageCount = Math.ceil(adminOrderCount / dataPerPage);

  const dispatch = useAppDispatch();

  console.log(selectedOrder);

  const dateFormatter = (date: string) => {
    return moment(date.split("T")[0], "YYYY-MM-DD").format("DD MMM YYYY");
  };

  const handleSelectAll = () => {
    setCheckAll((prev) => !prev);
    dispatch(setSelectedOrder(currentList.map((li) => li.id)));

    if (checkAll) {
      dispatch(setSelectedOrder([]));
    }
  };
  // const handleCopy = () => {
  //   setLoading(true);
  //   setDisabled(true);
  //   try {
  //     if (selectedOrder.length < 1) {
  //       return "";
  //     } else {
  //       const copyList = currentList.filter((item) => {
  //         if (selectedOrder.includes(item.id)) {
  //           return item;
  //         }
  //       });

  //       setCopyState((prev) => {
  //         return {
  //           value: selectedCopy(copyList),
  //           copied: true,
  //         };
  //       });
  //     }
  //   } catch (err) {
  //     dispatch(setErrorAdminValue("An error occured"));
  //   } finally {
  //     setDisabled(false);
  //     setLoading(false);
  //   }
  // };
  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSelectedOrder([...selectedOrder, e.target.id]));
    if (!e.target.checked) {
      dispatch(
        setSelectedOrder(selectedOrder.filter((item) => item !== e.target.id))
      );
    }
  };
  const handleSelected = async (handleKey: string) => {
    setLoading(true);
    setDisabled(true);
    try {
      if (selectedOrder.length < 1) {
        return;
      } else {
        const res = await fetch(`${config.url.API_URL}/api/order/active`, {
          body: JSON.stringify({ selectedOrder, selected: handleKey }),
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (res.status == 200) {
          let newList = currentList;
          if (handleKey == "confirm") {
            newList = currentList.map(({ active, ...item }) => {
              if (selectedOrder.includes(item.id)) {
                return {
                  ...item,
                  active: false,
                };
              }
              return { ...item, active };
            });
          } else if (handleKey === "payment") {
            newList = currentList.map(({ paid, ...item }) => {
              if (selectedOrder.includes(item.id)) {
                return {
                  ...item,
                  paid: true,
                };
              }
              return { ...item, paid };
            });
          }
          dispatch(setAdminOrder(newList));
          dispatch(setSelectedOrder([]));
        }
      }
    } catch (err) {
      dispatch(setErrorAdminValue("Failed try again"));
    } finally {
      setLoading(false);
      setDisabled(false);
      setModal({ state: false, mode: "payment" });
    }
  };

  // const handleDownload = async () => {
  //   setLoading(true);
  //   setDisabled(true);
  //   try {
  //     if (selectedOrder.length < 1) {
  //       await createDoc(currentList);
  //     } else {
  //       const downloadList = currentList.filter((item) => {
  //         if (selectedOrder.includes(item.id)) {
  //           return item;
  //         }
  //       });
  //       await createDoc(downloadList as Serialized[]);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     dispatch(setErrorAdminValue("An error occured"));
  //   } finally {
  //     setDisabled(false);
  //     setLoading(false);
  //   }
  // };
  const fetchData = async (pageNumber: number) => {
    setLoading(true);
    try {
      if (filterValues) {
        const res = await fetch(`${config.url.API_URL}/api/pagination/orders`, {
          body: JSON.stringify({ pageNumber, ...filterValues }),
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const response = await res.json();

        dispatch(setAdminOrder(response.newOrder));
      } else {
        const response = await fetch(
          ` ${config.url.API_URL}/api/pagination/orders?` +
            new URLSearchParams({
              page: pageNumber.toString(),
            })
        );

        const res = await response.json();

        dispatch(setAdminOrder(res));
      }
    } catch (err) {
      dispatch(setErrorAdminValue("can't fetch resources"));
    } finally {
      setLoading(false);
    }
  };

  const handlePageClick = async ({ selected }: { selected: number }) => {
    const pageNumber = dataPerPage * selected;

    await fetchData(pageNumber);
  };

  return (
    <div className="admin-content-wrapper">
      {adminError && (
        <div
          className="error-sign-wrapper"
          onClick={() => dispatch(setErrorAdminValue(null))}
        >
          {adminError}
        </div>
      )}
      {modal.state && (
        <div className="modal-wrapper">
          <div className="modal-container">
            <h3>
              Confirm{" "}
              {modal.mode == "payment"
                ? "Payment for this Order?"
                : "this Order?"}
            </h3>

            <div>
              <button
                className="confirm-paid-btn"
                disabled={disabel}
                onClick={() => handleSelected(modal.mode)}
              >
                {modal.mode == "payment" ? "Paid" : "Confirm"}
              </button>
              <button
                className="cancel-btn"
                onClick={() =>
                  setModal((prev) => {
                    return { state: false, mode: prev.mode };
                  })
                }
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Filter setFilterValues={setFilterValues} setLoading={setLoading} />
      <div className="admin-order-list-wrapper">
        <div className="admin-order-list">
          <div className="admin-order-list-heading">
            <div className="admin-list-select-all">
              <input
                type="checkbox"
                name="selectAll"
                id="selectAll"
                onChange={handleSelectAll}
              />
            </div>

            <div className="admin-header-order-id">store</div>
            <div className="admin-header-order-status">status</div>
            <div className="admin-header-client-name">Client</div>
            <div className="admin-header-issue-date">issued Date</div>
            <div className="admin-header-phone">Phone Number</div>
            <div className="admin-header-store">category</div>
          </div>
          <ul className="admin-order-list-content">
            {loading ? (
              <Loader />
            ) : currentList ? (
              currentList.map((item, index) => {
                return (
                  <div key={item.id} className="admin-order-list-item">
                    <div className="admin-order-item-select">
                      <input
                        type="checkbox"
                        name={`${item.name}`}
                        id={item.id}
                        checked={selectedOrder.includes(item.id)}
                        onChange={(e) => handleCheck(e)}
                      />
                    </div>
                    <div className="admin-order-store">{item.store}</div>
                    <div className="admin-order-status">
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
                    <div className="admin-phone">{item.phoneNumber}</div>
                    <div className="admin-category">
                      <Image
                        src={`/${item.category}.png`}
                        width="32"
                        height="32"
                        alt={item.category ? item.category : "store"}
                      />
                    </div>
                    <div
                      className="admin-link"
                      onClick={() =>
                        props.setCurrentOrder({ state: true, orderItem: item })
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
                Orders: <span>{adminOrderCount}</span>
              </p>
            </div>
            <div className="admin-order-button-wrapper">
              <button
                onClick={() => setModal({ state: true, mode: "payment" })}
              >
                Payment
              </button>
              <button
                onClick={() => setModal({ state: true, mode: "confirm" })}
              >
                confirm
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    selectedCopy(selectedOrder, currentList)
                  );
                }}
              >
                Copy
              </button>
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

export default AdminOrder;
