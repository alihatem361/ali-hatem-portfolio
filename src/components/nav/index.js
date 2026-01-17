import { Link } from "react-router-dom";
import "./style.css";
import { useTranslation } from "react-i18next";
import LnaguageMenu from "./LnaguageMenu";
const Nav = () => {
  const { i18n } = useTranslation();
  return (
    <div className="nav__container">
      <div className="nav__bar">
        <ul class="nav">
          <li class="nav-item">
            <Link class="nav-link active" aria-current="page" to="/">
              {i18n.language === "ar" ? "الرئيسية" : "Home"}
            </Link>
          </li>
          <li class="nav-item">
            <Link class="nav-link" to="projects">
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
