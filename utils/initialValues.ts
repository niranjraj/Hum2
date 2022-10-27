export const category = [
  "Nilgiris",
  "ExoticaStore",
  "Dominos",
  "SupremeGourmet",
  "PaulsCreamery",
  "SankersCoffe",
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
