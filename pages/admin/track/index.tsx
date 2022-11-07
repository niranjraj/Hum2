import type { GetServerSidePropsContext, NextPage } from "next";
import { getSession, useSession } from "next-auth/react";

import { useRouter } from "next/router";
import { useState } from "react";

import AdminTrack from "../../../components/AdminTrack";
import AdminTrackItem from "../../../components/AdminTrackItem";

import Wrapper from "../../../layout/Wrapper";
import { useAppDispatch, useAppSelector } from "../../../redux/redux-hook";
import { setErrorAdminValue } from "../../../redux/util-slice";
import { parcel } from "../../../types/track";

import prisma from "../../../utils/prismaInit";

type currentParcel = {
  state: boolean;
  parcelItem: parcel | null;
};
const TrackAdmin: NextPage<{
  activeOrderCount: number;
  activeData: parcel[];
}> = (props) => {
  const { data: session, status } = useSession({ required: true });
  const [currentParcel, setCurrentParcel] = useState<currentParcel>({
    state: false,
    parcelItem: null,
  });
  const adminError = useAppSelector((state) => state.util.errorAdmin);
  const dispatch = useAppDispatch();
  const [currentList, setCurrentList] = useState(props.activeData);
  const [activeDataCount, setActiveDataCount] = useState(
    props.activeOrderCount
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (session && session?.user?.role == "user") {
    router.push("/");
  }
  if (session && session?.user?.role == "admin") {
    // return <Maintenance />;
    return (
      <Wrapper>
        {adminError && (
          <div
            className="error-sign-wrapper"
            onClick={() => dispatch(setErrorAdminValue(null))}
          >
            {adminError}
          </div>
        )}
        {currentParcel.state && currentParcel.parcelItem ? (
          <AdminTrackItem
            item={currentParcel.parcelItem}
            currentList={currentList}
            setCurrentList={setCurrentList}
            setCurrentParcel={setCurrentParcel}
          />
        ) : (
          <AdminTrack
            setCurrentParcel={setCurrentParcel}
            currentList={currentList}
            setCurrentList={setCurrentList}
            setParcelCount={setActiveDataCount}
            activeOrderCount={activeDataCount}
            activeData={props.activeData}
            setLoading={setLoading}
            loading={loading}
          />
        )}
      </Wrapper>
    );
  }
  return <div></div>;
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getSession(context);
  console.log("at server");
  if (session && session.user?.email) {
    const activeOrder = await prisma.tracker.findMany({
      orderBy: {
        createdAt: "desc",
      },

      take: 10,
    });
    let activeOrderCountValue = await prisma.tracker.aggregate({
      _count: true,
    });
    const activeOrderCount = activeOrderCountValue._count;
    let activeData = activeOrder.map(({ userId, createdAt, ...rest }) => {
      return { ...rest, createdAt: JSON.stringify(createdAt) };
    });
    return {
      props: {
        activeOrderCount,
        activeData,
      },
    };
  }
  return {
    props: {},
  };
};

export default TrackAdmin;
