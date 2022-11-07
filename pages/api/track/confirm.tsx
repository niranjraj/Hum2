import { NextApiHandler } from "next";
import { getSession } from "next-auth/react";
import { category } from "../../../utils/initialValues";
import prisma from "../../../utils/prismaInit";

const activeHandler: NextApiHandler = async (req, res) => {
  const session = await getSession({ req });

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
