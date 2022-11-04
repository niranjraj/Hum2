import type { GetServerSidePropsContext, NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import { useState } from "react";
import SideNav from "../../components/SideNav";
import prisma from "../../utils/prismaInit";
import { MdPending } from "react-icons/md";

import {
  AiFillCheckCircle,
  AiOutlineRight,
  AiOutlineLeft,
} from "react-icons/ai";
import moment from "moment";
import Image from "next/image";
import DateRangePicker from "../../components/DateRangePicker";
import { wrapper } from "../../redux/store";
import ReactPaginate from "react-paginate";

import { useAppSelector, useAppDispatch } from "../../redux/redux-hook";
import { Field, Form, Formik } from "formik";
import {
  setAdminCount,
  setAdminOrder,
  setSelectedOrder,
} from "../../redux/order-slice";
import { category, config } from "../../utils/initialValues";

import Link from "next/link";
import { useRouter } from "next/router";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import Loader from "../../components/Loader";

import { createDoc } from "../../utils/documentGenerator";
import { setErrorAdminValue } from "../../redux/util-slice";
import Filter from "../../components/Filter";
import Wrapper from "../../layout/Wrapper";

const initialValue = {
  dateRange: [null, null],
  category: "",
};

interface adminQuery {
  dateRange: Date[] | null[];
  category: string;
}

const Admin: NextPage = (props) => {
  const { data: session, status } = useSession({ required: true });
  const router = useRouter();
  const [filterValues, setFilterValues] = useState<adminQuery | null>(null);
  const [loading, setLoading] = useState(false);
  const [disabel, setDisabled] = useState(false);

  const [checkAll, setCheckAll] = useState(false);
  const [modal, setModal] = useState({ state: false, mode: "payment" });
  const currentList = useAppSelector((state) => state.order.adminOrder);
  const adminOrderCount = useAppSelector((state) => state.order.adminCount);
  const selectedOrder = useAppSelector((state) => state.order.selectedOrder);
  const adminError = useAppSelector((state) => state.util.errorAdmin);
  const dataPerPage = 10;

  const pageCount = Math.ceil(adminOrderCount / dataPerPage);

  const dispatch = useAppDispatch();

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
          dispatch(setSelectedOrder([]));
          setModal({ state: false, mode: "payment" });
        }
      }
    } catch (err) {
      dispatch(setErrorAdminValue("Failed try again"));
    } finally {
      setLoading(false);
      setDisabled(false);
    }
  };

  const handleDownload = async () => {
    setLoading(true);
    setDisabled(true);
    try {
      if (filterValues) {
        const res = await fetch(`${config.url.API_URL}/api/order/download`, {
          body: JSON.stringify(filterValues),
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const response = await res.json();
        await createDoc(response.newOrder);
      }
    } catch (err) {
      dispatch(setErrorAdminValue("An error occured"));
    } finally {
      setDisabled(false);
      setLoading(false);
    }
  };
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

  if (session && session?.user?.role == "user") {
    router.push("/");
  }
  if (session && session?.user?.role == "admin") {
    return (
      <Wrapper addClass="admin-container">
        <div className="admin-content-wrapper">
          {adminError && <div className="error-sign-wrapper">{adminError}</div>}
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
          {/* <div className="filter-wrapper">
            <Formik initialValues={initialValue} onSubmit={handleSubmit}>
              {({ values }) => (
                <Form className="admin-filter-options">
                  <DateRangePicker name="dateRange" />
                  <Field
                    as="select"
                    name="category"
                    // onChange={() => handleSubmit(values)}
                  >
                    <option value="" label="Select a store">
                      Select a store
                    </option>
                    {category.map((item, index) => (
                      <option
                        key={`${item}-${index}`}
                        value={item}
                        label={item}
                      >
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
          </div> */}
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
                            alt={item.category}
                          />
                        </div>
                        <div className="admin-link">
                          <Link href={`/admin/${item.id}`}>
                            <BsFillArrowRightCircleFill />
                          </Link>
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
                  <button disabled={disabel} onClick={() => handleDownload()}>
                    Download
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
      </Wrapper>
    );
  }

  return <div></div>;
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx: GetServerSidePropsContext) => {
    const session = await getSession(ctx);

    let activeData: any = [];
    if (session && session.user?.email) {
      const activeOrder = await prisma.order.findMany({
        orderBy: {
          createdAt: "desc",
        },

        take: 10,
      });
      const activeOrderCount = await prisma.order.aggregate({
        _count: true,
      });
      activeData = activeOrder.map(({ userId, createdAt, ...rest }) => {
        return { ...rest, createdAt: JSON.stringify(createdAt) };
      });

      store.dispatch(setAdminOrder(activeData));
      store.dispatch(setAdminCount(activeOrderCount._count));
    }

    return {
      props: {},
    };
  }
);
export default Admin;
