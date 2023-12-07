import { NextApiHandler } from "next";
import prisma from "../../../utils/prismaInit";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
const activeHandler: NextApiHandler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (session) {
    if (req.method == "POST") {
      const data = req.body;

      if (data.selected == "confirm") {
        if (data.selectedOrder.length == 1) {
          const updatedActive = await prisma.order.update({
            where: {
              id: data.selectedOrder[0],
            },
            data: {
              active: false,
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
          const { userId, ...newOrder } = updatedActive;

          res.status(200).json(newOrder);
        } else {
          const updatedActive = await prisma.order.updateMany({
            where: {
              id: { in: data.selectedOrder },
            },
            data: {
              active: false,
            },
          });

          res.status(200).json(updatedActive);
        }
      }

      if (data.selected == "payment") {
        if (data.selectedOrder.length == 1) {
          const updatedActive = await prisma.order.update({
            where: {
              id: data.selectedOrder[0],
            },
            data: {
              paid: true,
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
          const { userId, ...newOrder } = updatedActive;

          res.status(200).json(newOrder);
        } else {
          const updatedActive = await prisma.order.updateMany({
            where: {
              id: { in: data.selectedOrder },
            },
            data: {
              paid: true,
            },
          });

          res.status(200).json(updatedActive);
        }
      }
    }
  }
};
export default activeHandler;
