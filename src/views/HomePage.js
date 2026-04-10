import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import HomeProjectsContainer from "../components/Home/HomeProjectsContainer";
const HomePage = () => {
  return (
    <React.Fragment>
      <Header />
      <HomeProjectsContainer />
      <Footer />
    </React.Fragment>
  );
};

export default HomePage;
