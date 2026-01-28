import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Header from "../components/header";
import Footer from "../components/footer";
import HomeProjectsContainer from "../components/Home/HomeProjectsContainer";
import SEO from "../components/SEO";

const HomePage = () => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <React.Fragment>
      <SEO
        title={
          isArabic
            ? "علي حاتم | مطور واجهات أمامية - React و Next.js"
            : "Ali Hatem | Senior Frontend Developer - React & Next.js Expert"
        }
        description={
          isArabic
            ? "مطور واجهات أمامية من مصر متخصص في React.js و Next.js وتقنيات الويب الحديثة. أكثر من 4 سنوات خبرة في بناء تطبيقات ويب عالية الأداء."
            : "Senior Frontend Developer from Egypt specializing in React.js, Next.js, TypeScript, and modern web technologies. 4+ years of experience building high-performance web applications."
        }
        keywords={
          isArabic
            ? "علي حاتم, مطور واجهات أمامية, React, Next.js, مصر, مطور ويب"
            : "Ali Hatem, Frontend Developer, React Developer, Next.js, JavaScript, TypeScript, Egypt, Portfolio"
        }
        language={i18n.language}
      />
      <Header />
      <div className="background-effects">
        <div className="gradient-orb orb-3"></div>
      </div>
      <HomeProjectsContainer />
      <Footer />
    </React.Fragment>
  );
};

export default HomePage;
