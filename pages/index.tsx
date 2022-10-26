import type { NextPage } from "next";

import Greeter from "../components/Greeter";
// import Info from "../components/Info";
// import Navbar from "../components/Navbar";
import MainContainer from "../layout/MainContainer";

const Home: NextPage = () => {
  return (
    <MainContainer>
      <Greeter />
      {/* <Info /> */}
    </MainContainer>
  );
};

export default Home;
