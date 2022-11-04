import React, { ReactNode } from "react";
import SideNav from "../components/SideNav";
type Props = {
  children?: ReactNode;
  addClass?: string;
};
const Wrapper = (props: Props) => {
  return (
    <div className={`global-wrapper ${props.addClass}`}>
      <SideNav />
      {props.children}
    </div>
  );
};

export default Wrapper;
