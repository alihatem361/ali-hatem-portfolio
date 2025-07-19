import React, { useEffect } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import HomeProjectsContainer from "../components/Home/HomeProjectsContainer";
const HomePage = () => {
  return (
    <React.Fragment>
      <div className="background-effects">
        <div className="gradient-orb orb-3"></div>
      </div>
      <Header />
      <HomeProjectsContainer />
      <Footer />
    </React.Fragment>
  );
};

export default HomePage;
