import { NextApiHandler } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../utils/prismaInit";

const trackerHandler: NextApiHandler = async (req, res) => {
  const session = await getSession({ req });
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
