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
import Loader from "../../../components/Loader";
import Wrapper from "../../../layout/Wrapper";
import { parcel } from "../../../types/track";
import { config } from "../../../utils/initialValues";
import prisma from "../../../utils/prismaInit";

const TrackAdmin: NextPage<{
  activeOrderCount: number;
  activeData: parcel[];
}> = (props) => {
  const { data: session, status } = useSession({ required: true });
  const [currentList, setCurrentList] = useState(props.activeData);
  const [disabel, setDisabled] = useState(false);
  const [modal, setModal] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dataPerPage = 10;
  const dateFormatter = (date: string) => {
    return moment(date.split("T")[0], "YYYY-MM-DD").format("DD MMM YYYY");
  };
  const pageCount = Math.ceil(props.activeOrderCount / dataPerPage);
  const handleSelectAll = () => {
    setCheckAll((prev) => !prev);
    setSelectedParcel(currentList.map((li) => li.id));

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
    setLoading(true);
    try {
      const response = await fetch(
        ` ${config.url.API_URL}/api/pagination/track?` +
          new URLSearchParams({
            page: pageNumber.toString(),
          })
      );

      const res = await response.json();
      setCurrentList(res);
    } catch (err) {
      // dispatch(setErrorAdminValue("can't fetch resources"));
    } finally {
      setLoading(false);
    }
  };

  const handlePageClick = async ({ selected }: { selected: number }) => {
    const pageNumber = dataPerPage * selected;

    await fetchData(pageNumber);
  };
  const handleSelected = async (handleKey: string) => {
    setLoading(true);
    setDisabled(true);
    try {
      if (selectedParcel.length < 1) {
        return;
      } else {
        const res = await fetch(`${config.url.API_URL}/api/order/active`, {
          body: JSON.stringify({ selectedParcel, selected: handleKey }),
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (res.status == 200) {
          setSelectedParcel([]);
        }
      }
    } catch (err) {
    } finally {
      setLoading(false);
      setDisabled(false);
    }
  };

  if (session && session?.user?.role == "user") {
    router.push("/");
  }
  if (session && session?.user?.role == "admin") {
    return (
      <Wrapper>
        <div className="admin-track-content">
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

                <div className="admin-header-order-id">Parcel id</div>
                <div className="admin-header-order-status">Status</div>
                <div className="admin-header-client-name">Client</div>
                <div className="admin-header-issue-date">issued Date</div>
                <div className="admin-header-phone">otp</div>
                <div className="admin-header-store">phoneNumber</div>
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
                            checked={selectedParcel.includes(item.id)}
                            onChange={(e) => handleCheck(e)}
                          />
                        </div>
                        <div className="admin-order-store">{item.parcelId}</div>
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
                    Orders: <span>{}</span>
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
      </Wrapper>
    );
  }
  return <div></div>;
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getSession(context);
  if (session && session.user?.email) {
    const activeOrder = await prisma.tracker.findMany({
      orderBy: {
        createdAt: "desc",
      },

      take: 10,
    });
    const activeOrderCount = await prisma.tracker.aggregate({
      _count: true,
    });
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
