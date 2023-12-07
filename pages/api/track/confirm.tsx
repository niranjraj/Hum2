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

      if (data.selectedParcel.length == 1) {
        const updatedActive = await prisma.tracker.update({
          where: {
            id: data.selectedParcel[0],
          },
          data: {
            active: false,
          },
        });
        const { userId, ...newTracker } = updatedActive;
        console.log(newTracker);
        res.status(200).json(newTracker);
      } else {
        const updatedActive = await prisma.tracker.updateMany({
          where: {
            id: { in: data.selectedParcel },
          },
          data: {
            active: false,
          },
        });
        console.log(updatedActive);
        res.status(200).json(updatedActive);
      }
    }
  }
};
export default activeHandler;
