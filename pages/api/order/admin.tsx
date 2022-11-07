import { NextApiHandler } from "next";
import { getSession } from "next-auth/react";

import prisma from "../../../utils/prismaInit";

const adminHandler: NextApiHandler = async (req, res) => {
  const session = await getSession({ req });

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
        ...(!data.dateRange[0] && !data.dateRange[1]
          ? {
              orderBy: {
                createdAt: "desc",
              },
            }
          : {}),
      });
      const activeOrderCount = await prisma.order.aggregate({
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
        _count: true,
      });
      const newOrder = activeOrder.map(({ userId, ...item }) => item);
      res.status(200).json({ newOrder, count: activeOrderCount._count });
    }
    if (req.method == "GET") {
      const page = parseInt(req.query.page as string);

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
