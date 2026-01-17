import "./style.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
// components
import GetAllData from "../../data/projects.jsx";
import LowerCurve from "../Utilities/LowerCurve";
import HeaderImage from "./HeaderImage";
import HeaderBio from "./HeaderBio";
import "./style.css";
const Header = () => {
  const { i18n } = useTranslation();
  const { getProjects, getSocials, getAboutme } = GetAllData();
  const [aboutmeData, setAboutmeData] = useState([]);
  useEffect(() => {
    getAboutme().then((data) => {
      setAboutmeData(data[0][0]);
    });
  }, i18n.language);

  return (
    <div className="position-relative">
      <div className="header">
        <HeaderBio aboutmeData={aboutmeData} />
        <HeaderImage aboutmeData={aboutmeData} />
      </div>
    </div>
  );
};

export default Header;
