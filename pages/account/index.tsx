import type { GetServerSidePropsContext, NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import Image from "next/image";
import { FormValues, Item } from "../../types/order";
import prisma from "../../utils/prismaInit";

import { useEffect, useRef, useState } from "react";

import { IoClose } from "react-icons/io5";
import {
  OrderPage1,
  OrderPage2,
  OrderPage3,
  OrderPage4,
} from "../../components/OrderPage";

import moment from "moment";
import {
  setActiveOrder,
  setFormValue,
  updateActiveOrder,
} from "../../redux/order-slice";
import { wrapper } from "../../redux/store";

import { useRouter } from "next/router";
import Wrapper from "../../layout/Wrapper";
import { useAppDispatch, useAppSelector } from "../../redux/redux-hook";
import { setErrorAccountValue } from "../../redux/util-slice";
import { config, paidColors, statusColors } from "../../utils/initialValues";

const Account: NextPage<{ userId: string }> = (props) => {
  const orderItemRef = useRef<Array<HTMLDivElement | null>>([]);
  const listInnerRef = useRef<HTMLDivElement | null>(null);
  const { data: session, status } = useSession({ required: true });
  const [orderModal, setOrderModal] = useState<boolean>(false);
  const [storeValue, setStoreValue] = useState<string | null>(null);

  const [currPage, setCurrPage] = useState(1); // storing current page number
  const [prevPage, setPrevPage] = useState(0); // storing prev page numbe
  const [lastList, setLastList] = useState(false); // setting a flag to know the last list

  const activeOrder = useAppSelector((state) => state.order.activeOrder);
  const accountError = useAppSelector((state) => state.util.errorAccount);
  const formData = useAppSelector((state) => state.order.formValue);
  const router = useRouter();
  const initialCategory = useAppSelector(
    (state) => state.order.initialCategory
  );

  const dispatch = useAppDispatch();

  const [currentStep, setCurrentStep] = useState(0);

  const handleClick = (index: number) => {
    const item = orderItemRef?.current;
    if (item[index] && item[index]?.classList.contains("active-open")) {
      item[index]?.classList.remove("active-open");
    } else {
      item[index]?.classList.add("active-open");
    }
  };
  const handleRequest = async (formValues: FormValues) => {
    console.log("order request called from frontend");
    try {
      const res = await fetch(`${config.url.API_URL}/api/order`, {
        body: JSON.stringify(formValues),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await res.json();
      console.log(response);

      dispatch(updateActiveOrder(response));
    } catch (error) {
      dispatch(setErrorAccountValue("Failed order didn't go through"));
    }
  };

  const handleNextStep = (newData: FormValues, final = false) => {
    dispatch(setFormValue({ ...formData, ...newData }));

    if (final) {
      setOrderModal(false);
      setCurrentStep(0);

      handleRequest(newData);

      dispatch(
        setFormValue({
          category: "",
          orderItem: [],
          name: "",
          store: "",
          phoneNumber: "",
          location: "",
        })
      );

      return;
    }
    setCurrentStep((prev) => prev + 1);
  };
  const handlePreComplete = (newData: FormValues) => {
    dispatch(setFormValue({ ...formData, ...newData }));
  };
  const handlePrevStep = (newData: FormValues) => {
    dispatch(setFormValue({ ...formData, ...newData }));

    setCurrentStep((prev) => prev - 1);
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
          `${config.url.API_URL}/api/order/pagination?` +
            new URLSearchParams({
              userId: props.userId,
              page: activeOrder.length.toString(),
            })
        );

        const res = await response.json();
        if (!res.length) {
          setLastList(true);
          return;
        }
        setPrevPage(currPage);

        dispatch(setActiveOrder([...activeOrder, ...res]));
      };

      if (!lastList && prevPage !== currPage && currPage > 1) {
        fetchData();
      }
    } catch (err) {
      dispatch(setErrorAccountValue("Failed to fetch resources"));
    }
  }, [currPage, lastList, prevPage, props.userId, activeOrder, dispatch]);

  const pages = [
    <OrderPage1
      initialCategory={initialCategory}
      setCurrentStep={setCurrentStep}
      key="order-1"
    />,
    <OrderPage2
      key="order-2"
      formData={formData}
      setStoreValue={setStoreValue}
      initialCategory={initialCategory}
      next={handleNextStep}
      prev={handlePrevStep}
    />,
    <OrderPage3
      key="order-3"
      formData={formData}
      next={handleNextStep}
      storeValue={storeValue}
      setStoreValue={setStoreValue}
      prev={handlePrevStep}
    />,
    <OrderPage4
      key="order-4"
      formData={formData}
      next={handleNextStep}
      prev={handlePrevStep}
      preComplete={handlePreComplete}
    />,
  ];

  useEffect(() => {
    if (orderModal) {
      document.body.classList.add("form-modal-open");
    } else {
      if (document.body.classList) {
        document.body.classList.remove("form-modal-open");
      }
    }
  }, [orderModal]);

  if (status === "authenticated") {
    return (
      <Wrapper addClass="account-container">
        {accountError && (
          <div
            className="error-sign-wrapper"
            onClick={() => dispatch(setErrorAccountValue(null))}
          >
            {accountError}
          </div>
        )}

        <div className="account-content">
          <div className="account-header">
            <h2>My Orders</h2>
            <button className="order-btn" onClick={() => setOrderModal(true)}>
              Order Now
            </button>
          </div>

          <div className="user-active-order">
            <div
              className="active-order-list-wrapper"
              onScroll={onScroll}
              ref={listInnerRef}
            >
              <ul className="active-order-list">
                {activeOrder.length > 0 &&
                  activeOrder.map((item, index) => {
                    return (
                      <div
                        key={`${item}-${index}`}
                        className="active-order-item-wrapper"
                        ref={(el) => (orderItemRef.current[index] = el)}
                        onClick={() => handleClick(index)}
                      >
                        <li className="active-order-item">
                          <div className="active-order-id">
                            {`#${item.id.slice(0, 6)}...`}
                          </div>
                          <div className="active-order-date">
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
                        </li>

                        <div className="active-in-detail">
                          <div className="active-item-wrapper">
                            {Object(item.orderItem).map(
                              (orderContent: Item, index: number) => {
                                return (
                                  <div
                                    className="active-item"
                                    key={`active-${orderContent.name}-${index}`}
                                  >
                                    <p className="active-item-name">
                                      {orderContent.name}
                                    </p>
                                    <p className="active-item-quantity">{`${
                                      orderContent.quantity
                                    } ${
                                      orderContent.unit === "number"
                                        ? ""
                                        : orderContent.unit
                                    }`}</p>
                                    <Image
                                      src={`/${item.category}.png`}
                                      width="32"
                                      height="32"
                                      alt={item.category}
                                    />
                                  </div>
                                );
                              }
                            )}
                          </div>
                          <div className="active-order-info">
                            <h4>Order Info</h4>
                            <div className="active-lb">
                              <p>
                                <span className="active-lb-name">
                                  {item.name}
                                </span>
                                <span className="active-lb-location">
                                  {item.location}
                                </span>
                              </p>
                              <div className="active-lb-info">
                                <p className="active-lb-order-id">
                                  <span>
                                    <span className="order-span">Order</span>{" "}
                                    Id:
                                  </span>
                                  {`#${item.id}`}
                                </p>

                                <p>
                                  <span>PhoneNumber:</span>
                                  {item.phoneNumber}
                                </p>
                                <p>
                                  <span>Store:</span>
                                  {item.store}
                                </p>
                                <p
                                  className="paid-tag"
                                  style={{
                                    backgroundColor: `${
                                      item.paid
                                        ? paidColors.paid.transColor
                                        : paidColors.notPaid.transColor
                                    }`,
                                    color: `${
                                      item.paid
                                        ? paidColors.paid.color
                                        : paidColors.notPaid.color
                                    }`,
                                  }}
                                >
                                  {item.paid ? "Paid" : "Not Paid"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </ul>
            </div>
          </div>
        </div>
        {orderModal && (
          <div className="order-modal-wrapper">
            <div className="order-modal">
              <div
                className="close-modal-wrapper"
                onClick={() => setOrderModal(false)}
              >
                <IoClose />
              </div>
              {pages[currentStep]}
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

        const activeOrder = await prisma.order.findMany({
          orderBy: {
            createdAt: "desc",
          },
          where: { userId: user?.id },
          take: 10,

          include: {
            orderItem: {
              select: {
                name: true,
                quantity: true,
                unit: true,
              },
            },
          },
        });

        activeData = activeOrder.map(({ userId, createdAt, ...rest }) => {
          return { ...rest, createdAt: JSON.stringify(createdAt) };
        });

        store.dispatch(setActiveOrder(activeData));
      } catch (e) {
        store.dispatch(setErrorAccountValue("There seems to be a problem"));
      }
    }

    return {
      props: { userId },
    };
  }
);

//async (
//   context: GetServerSidePropsContext
// ) => {
//   const session = await getSession(context);

//   let activeData: any = [];
//   if (session && session.user?.email) {
//     const user = await prisma.user.findUnique({
//       where: { email: session.user?.email },
//     });

//     const activeOrder = await prisma.order.findMany({
//       orderBy: {
//         createdAt: "desc",
//       },
//       where: { active: true, userId: user?.id },

//       include: {
//         orderItem: {
//           select: {
//             name: true,
//             quantity: true,
//             unit: true,
//             store: true,
//           },
//         },
//       },
//     });
//     activeData = activeOrder.map(({ userId, createdAt, ...rest }) => {
//       return { ...rest, createdAt: JSON.stringify(createdAt) };
//     });
//   }

//   return {
//     props: { activeData },
//   };
// };

export default Account;
