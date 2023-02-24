import { current } from "@reduxjs/toolkit";
import { Item, Serialized, SerializedItem } from "../types/order";

export const category = [
  "Nilgiris",
  "ExoticaStore",
  "Dominos",
  "SupremeGourmet",

  "Sijis",
  "Paragon",
  "Springs",
  "BikashBabu",
  "LaFornoCafe",
  "Other",
];

export const statusColors = {
  active: {
    backgroundColor: " #ff8700 ",
    color: " #ff8700",
    transColor: "rgba(255, 135, 0, 0.04)",
  },
  confirmed: {
    backgroundColor: "#33d7a0",
    color: "#33d7a0",
    transColor: "rgba(51, 214, 159, 0.04)",
  },
};
export const paidColors = {
  notPaid: {
    backgroundColor: "#f98787",
    color: "#a62b2b",
    transColor: "rgb(249, 135, 135, 0.5)",
  },
  paid: {
    backgroundColor: "#87F994",
    color: "#369d42",
    transColor: "rgba(135, 249, 148, 0.5)",
  },
};

type currentOrder = {
  state: boolean;
  orderItem: Serialized | null;
};
export const initialItems = (currentOrder: Serialized) => {
  try {
    let orderCopy = `${currentOrder.name}\n ${currentOrder.phoneNumber}\n`;

    currentOrder.orderItem.forEach(
      (x) => (orderCopy += `${x.name}  ${x.quantity}  ${x.unit} \n`)
    );

    return orderCopy;
  } catch (err) {
    return "";
  }
};
export const verifiedColors = {
  notVerified: {
    backgroundColor: "#a62b2b",
    color: "#a62b2b",
    transColor: "rgb(249, 135, 135, 0.5)",
  },
  verifed: {
    backgroundColor: "#369d42",
    color: "#369d42",
    transColor: "rgba(135, 249, 148, 0.5)",
  },
};
const prod = {
  url: {
    API_URL: "https://iiser.humeats.com",
  },
};
const dev = {
  url: {
    API_URL: "http://localhost:3000",
  },
};

export const config = process.env.NODE_ENV === "development" ? dev : prod;
