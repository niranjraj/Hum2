import { NextApiHandler } from "next";
import { getServerSession } from "next-auth";
import prisma from "../../../utils/prismaInit";
import { authOptions } from "../auth/[...nextauth]";
const trackerHandler: NextApiHandler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (session && session.user?.email) {
    if (req.method === "POST") {
      const user = await prisma.user.findUnique({
        where: { email: session.user?.email },
      });
      req.body.otp;

      const parcel = await prisma.tracker.create({
        data: {
          ...req.body,
          otpVerified: req.body.otp == "" ? false : true,
          userId: user?.id,
        },
      });
      const { userId, ...newOrder } = parcel;

      res.status(200).json(newOrder);
    }
    if (req.method === "GET") {
      if (req.query.userId) {
        const id = req.query.userId as string;
        const page = parseInt(req.query.page as string);

        const activeParcel = await prisma.tracker.findMany({
          orderBy: {
            createdAt: "desc",
          },
          where: {
            userId: id,
          },
          skip: page,
          take: 10,
        });

        let activeData = activeParcel.map(({ userId, createdAt, ...rest }) => {
          return { ...rest, createdAt: JSON.stringify(createdAt) };
        });

        res.status(200).json(activeData);
      }
    }
  }
};
export default trackerHandler;
