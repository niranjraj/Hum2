import React, { ReactNode } from "react";
import Navbar from "../components/Navbar";
type Props = {
  children?: ReactNode;
};
const MainContainer = (props: Props) => {
  return (
    <>
      <div className="main-container">
        <Navbar />
        {props.children}
      </div>
    </>
  );
};

export default MainContainer;
