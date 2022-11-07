import React, { Dispatch, SetStateAction } from "react";
import type { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import Image from "next/image";
import SideNav from "./SideNav";

import Link from "next/link";
import { useState } from "react";

import { config, statusColors } from "../utils/initialValues";
import { useSession } from "next-auth/react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { MdPaid } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";
import { Serialized } from "../types/order";
import Wrapper from "../layout/Wrapper";

type currentOrder = {
  state: boolean;
  orderItem: Serialized | null;
};
type Props = {
  serializedOrder: Serialized;
  setCurrentOrder: Dispatch<SetStateAction<currentOrder>>;
};

const AdminOrderItem = (props: Props) => {
  const { data: session, status } = useSession({ required: true });
  const [modal, setModal] = useState(false);
  const [currentPreview, setCurrentPreview] = useState(props.serializedOrder);

  const router = useRouter();
  const handleRequest = async (handleKey: string) => {
    const res = await fetch(`${config.url.API_URL}/api/order/active`, {
      body: JSON.stringify({
        selectedOrder: [currentPreview.id],
        selected: handleKey,
      }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await res.json();
  };
  const handleConfirm = async () => {
    if (currentPreview.active) {
      const response = await handleRequest("confirm");
      setCurrentPreview(response);
    }
  };
  const handlePayment = async () => {
    if (!currentPreview.paid) {
      const response = await handleRequest("payment");
      setCurrentPreview(response);
      setModal(false);
    }
  };
  return (
    <div className="admin-preview-content-wrapper">
      {modal && (
        <div className="modal-wrapper">
          <div className="modal-container">
            <h3>Confirm payment for this Order?</h3>

            <div>
              <button
                className="confirm-paid-btn"
                onClick={() => handlePayment()}
              >
                Paid
              </button>
              <button className="cancel-btn" onClick={() => setModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="admin-order-detail-wrapper">
        <div className="admin-preview-header">
          <div className="admin-preview-id">Id: #{currentPreview.id}</div>
          <div
            className="admin-order-status"
            style={{
              backgroundColor: `${
                currentPreview.active
                  ? statusColors.active.transColor
                  : statusColors.confirmed.transColor
              }`,
            }}
          >
            <div
              className="admin-order-status-circle"
              style={{
                backgroundColor: `${
                  currentPreview.active
                    ? statusColors.active.backgroundColor
                    : statusColors.confirmed.backgroundColor
                }`,
              }}
            ></div>
            <p
              style={{
                color: `${
                  currentPreview.active
                    ? statusColors.active.color
                    : statusColors.confirmed.color
                }`,
              }}
            >
              {currentPreview.active ? "active" : "confirmed"}
            </p>
          </div>
        </div>
        <div className="order-preview-store">
          <div className="admin-preview-paid">
            {currentPreview.paid ? "Paid" : "Not Paid"}
          </div>
          <div className="admin-preview-store">
            <div className="admin-preview-store-name">
              {currentPreview.store}
            </div>
            <Image
              src={`/${currentPreview.category}.png`}
              alt={currentPreview.store ? currentPreview.store : "store"}
              height="100"
              width="100"
            />
          </div>
        </div>
        <div className="admin-preview-info">
          <h3>Client Info:</h3>
          <p>
            <span>Name:</span> {currentPreview.name}
          </p>
          <p>
            <span>Address: </span>
            {currentPreview.location}
          </p>
          <p>
            <span>PhoneNumber: </span>
            {currentPreview.phoneNumber}
          </p>
        </div>
        <div className="admin-preview-order-header">
          <div className="admin-header-preview-name">Client</div>
          <div className="admin-header-preview-qty">Quantity</div>
          <div className="admin-header-preview-unit">Unit</div>
        </div>
        <div className="admin-preview-order">
          {currentPreview.orderItem.map((item, index) => {
            return (
              <div className="admin-preview-item" key={`${index}-${item.name}`}>
                <div className="admin-preview-name">{item.name}</div>
                <div className="admin-preview-qty">{item.quantity}</div>
                <div className="admin-preview-unit">{item.unit}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="admin-preview-buttons-wrapper">
        <button
          onClick={() =>
            props.setCurrentOrder({ state: false, orderItem: null })
          }
        >
          <AiOutlineArrowLeft /> Back
        </button>
        <button onClick={() => handleConfirm()}>
          <GiConfirmed /> Confirm
        </button>
        <button onClick={() => setModal(true)}>
          <MdPaid /> Payment
        </button>
      </div>
    </div>
  );
};

export default AdminOrderItem;
