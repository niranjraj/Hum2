import { NextApiHandler } from "next";

import prisma from "../../../utils/prismaInit";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
const downloadHandler: NextApiHandler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (session) {
    if (req.method == "POST") {
      const data = req.body;

      const order = await prisma.order.findMany({
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

      const newOrder = order.map(({ userId, createdAt, ...item }) => {
        return { ...item, createdAt: JSON.stringify(createdAt) };
      });
      res.status(200).json({ newOrder });
    }
  }
};
export default downloadHandler;
