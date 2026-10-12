import React from "react";
import { useTranslation } from "react-i18next";
import Header from "../components/header";
import Footer from "../components/footer";
import HomeProjectsContainer from "../components/Home/HomeProjectsContainer";
import SEO from "../components/SEO";
import HireMe from "../components/HireMe";

const HomePage = () => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <React.Fragment>
      <SEO
        title={
          isArabic
            ? "علي حاتم | مطور واجهات أمامية - React و Next.js"
            : "Ali Hatem | Frontend Developer - React & Next.js"
        }
        description={
          isArabic
            ? "مطور واجهات أمامية من مصر متخصص في React و Next.js و TypeScript. استعرض المشاريع ودراسات الحالة وحمّل سيرتي الذاتية."
            : "Frontend Developer from Egypt specializing in React, Next.js and TypeScript. Explore case studies and live projects, and download my CV."
        }
        keywords={
          isArabic
            ? "علي حاتم, مطور واجهات أمامية, React, Next.js, مصر, مطور ويب"
            : "Ali Hatem, Frontend Developer, React Developer, Next.js, JavaScript, TypeScript, Egypt, Portfolio"
        }
        language={i18n.language}
      />
      <Header />
      <HomeProjectsContainer />
      <HireMe placement="home" />
      <Footer />
    </React.Fragment>
  );
};

export default HomePage;
