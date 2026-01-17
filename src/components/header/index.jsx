import "./style.css";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
// components
import GetAllData from "../../data/projects.js";
import LowerCurve from "../Utilities/LowerCurve";
import HeaderImage from "./HeaderImage";
import HeaderBio from "./HeaderBio";

const Header = () => {
  const { i18n } = useTranslation();
  const { getAboutme } = GetAllData();
  const [aboutmeData, setAboutmeData] = useState([]);

  const fetchAboutMe = useCallback(() => {
    getAboutme().then((data) => {
      setAboutmeData(data[0][0]);
    });
  }, [getAboutme]);

  useEffect(() => {
    fetchAboutMe();
  }, [i18n.language, fetchAboutMe]);

  return (
    <div className="position-relative">
      <div className="header">
        <HeaderBio aboutmeData={aboutmeData} />
        <HeaderImage aboutmeData={aboutmeData} />
      </div>

      <LowerCurve />
    </div>
  );
};

export default Header;
