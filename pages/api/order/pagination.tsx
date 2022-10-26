import { NextApiHandler } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../utils/prismaInit";

const pagination: NextApiHandler = async (req, res) => {
  const session = await getSession({ req });
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
