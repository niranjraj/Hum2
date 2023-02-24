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
import AdminOrder from "../../components/AdminOrder";
import { Serialized } from "../../types/order";
import AdminOrderItem from "../../components/AdminOrderItem";

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

const Admin: NextPage = (props) => {
  const { data: session, status } = useSession({ required: true });
  const router = useRouter();
  const [currentOrder, setCurrentOrder] = useState<currentOrder>({
    state: false,
    orderItem: null,
  });
  const [loading, setLoading] = useState(false);
  const [disabel, setDisabled] = useState(false);
  console.log(currentOrder);

  if (session && session?.user?.role == "user") {
    router.push("/");
  }
  if (session && session?.user?.role == "admin") {
    return (
      <Wrapper addClass="admin-container">
        {currentOrder.state && currentOrder.orderItem ? (
          <AdminOrderItem
            setCurrentOrder={setCurrentOrder}
            serializedOrder={currentOrder.orderItem}
          />
        ) : (
          <AdminOrder setCurrentOrder={setCurrentOrder} />
        )}
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
        include: {
          orderItem: {
            select: {
              name: true,
              quantity: true,
              unit: true,
            },
          },
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
