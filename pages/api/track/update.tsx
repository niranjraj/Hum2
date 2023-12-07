import { NextApiHandler } from "next";
import { getServerSession } from "next-auth";
import prisma from "../../../utils/prismaInit";
import { authOptions } from "../auth/[...nextauth]";
const trackerHandler: NextApiHandler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (session && session.user?.email) {
    if (req.method === "POST") {
      const parcel = await prisma.tracker.update({
        where: {
          id: req.body.id,
        },
        data: {
          otp: req.body.otp,
          otpVerified: true,
        },
      });
      res.status(200).json("success");
    }
  }
};
export default trackerHandler;
