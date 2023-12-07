import { NextApiHandler } from "next";
import prisma from "../../../utils/prismaInit";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
const pagination: NextApiHandler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (session && session.user?.email) {
    if (req.method === "GET") {
      if (req.query.userId) {
        const id = req.query.userId as string;
        const page = parseInt(req.query.page as string);

        const activeOrder = await prisma.order.findMany({
          orderBy: {
            createdAt: "desc",
          },
          where: {
            userId: id,
          },
          skip: page,
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

        let activeData = activeOrder.map(({ userId, createdAt, ...rest }) => {
          return { ...rest, createdAt: JSON.stringify(createdAt) };
        });

        res.status(200).json(activeData);
      }
    }
  }
};
export default pagination;
