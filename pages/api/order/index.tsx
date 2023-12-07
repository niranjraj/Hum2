import { NextApiHandler } from "next";
import { getServerSession } from "next-auth";
import prisma from "../../../utils/prismaInit";
import { authOptions } from "../auth/[...nextauth]";
const orderHandler: NextApiHandler = async (req, res) => {
  console.log("request in backend");
  console.log("session in backend");
  const session = await getServerSession(req, res, authOptions);
  console.log(session);
  if (session && session.user?.email) {
    if (req.method === "POST") {
      const user = await prisma.user.findUnique({
        where: { email: session.user?.email },
      });
      console.log(user);
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
