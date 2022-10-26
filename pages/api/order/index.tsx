import { NextApiHandler } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../utils/prismaInit";

const orderHandler: NextApiHandler = async (req, res) => {
  const session = await getSession({ req });
  if (session && session.user?.email) {
    if (req.method === "POST") {
      const user = await prisma.user.findUnique({
        where: { email: session.user?.email },
      });

      const order = await prisma.order.create({
        data: {
          ...req.body,
          orderItem: {
            create: req.body.orderItem,
          },
          userId: user?.id,
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
      });
      const { userId, ...newOrder } = order;

      res.status(200).json(newOrder);
    }
    if (req.method === "GET") {
      let startDate = new Date(String(req.query.startDate));
      let endDate = new Date(String(req.query.endDate));
      const activeOrder = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
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
      });
      let activeData = activeOrder;
      res.status(200).json(activeData);
    }
  }
};
export default orderHandler;
