import { NextApiHandler } from "next";
import { getServerSession } from "next-auth";
import prisma from "../../../utils/prismaInit";
import { authOptions } from "../auth/[...nextauth]";
const activeHandler: NextApiHandler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (session) {
    console.log("in here");
    if (req.method == "POST") {
      const data = req.body;

      const updatedActiveParcel = await prisma.tracker.findMany({
        where: {
          ...(data.dateRange[0] !== null && data.dateRange[1] !== null
            ? {
                createdAt: {
                  gte: data.dateRange[0],
                  lte: data.dateRange[1],
                },
              }
            : {}),
        },
        take: 10,
      });
      const activeTrackerCount = await prisma.tracker.aggregate({
        where: {
          ...(data.dateRange[0] !== null && data.dateRange[1] !== null
            ? {
                createdAt: {
                  gte: data.dateRange[0],
                  lte: data.dateRange[1],
                },
              }
            : {}),
        },
        _count: true,
      });

      const newParcel = updatedActiveParcel.map(({ userId, ...item }) => item);
      res.status(200).json({ newParcel, count: activeTrackerCount._count });
    }
  }
};
export default activeHandler;
