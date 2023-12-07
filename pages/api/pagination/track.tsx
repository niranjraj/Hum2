import { NextApiHandler } from "next";

import { getServerSession } from "next-auth";
import prisma from "../../../utils/prismaInit";
import { authOptions } from "../auth/[...nextauth]";
const adminHandler: NextApiHandler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (session) {
    if (req.method == "POST") {
      const data = req.body;

      const activeOrder = await prisma.order.findMany({
        where: {
          ...(data.dateRange[0] !== null && data.dateRange[1] !== null
            ? {
                createdAt: {
                  gte: data.dateRange[0],
                  lte: data.dateRange[1],
                },
              }
            : {}),

          ...(data.category === "" ? {} : { category: data.category }),
        },
        skip: data.pageNumber,
        take: 10,
        ...(!data.dateRange[0] && !data.dateRange[1]
          ? {
              orderBy: {
                createdAt: "desc",
              },
            }
          : {}),
      });

      const newOrder = activeOrder.map(({ userId, createdAt, ...item }) => {
        return { ...item, createdAt: JSON.stringify(createdAt) };
      });
      res.status(200).json({ newOrder });
    }
    if (req.method == "GET") {
      console.log("here");
      const page = parseInt(req.query.page as string);

      const activeOrder = await prisma.tracker.findMany({
        orderBy: {
          createdAt: "desc",
        },

        skip: page,
        take: 10,
      });

      let activeData = activeOrder.map(({ userId, createdAt, ...rest }) => {
        return { ...rest, createdAt: JSON.stringify(createdAt) };
      });

      res.status(200).json(activeData);
    }
  }
};
export default adminHandler;
