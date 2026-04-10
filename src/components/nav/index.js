import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import LnaguageMenu from "./LnaguageMenu";
import "./style.css";
const Nav = () => {
  const { i18n } = useTranslation();
  return (
    <div className="nav__container">
      <div className="nav__bar">
        <ul className="nav">
          <li className="nav-item">
            <Link className="nav-link active" aria-current="page" to="/">
              {i18n.language === "ar" ? "الرئيسية" : "Home"}
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="projects">
              {i18n.language === "ar" ? "المشاريع" : "Projects"}
            </Link>
          </li>
        </ul>
      </div>
      <LnaguageMenu />
    </div>
  );
};

export default Nav;
