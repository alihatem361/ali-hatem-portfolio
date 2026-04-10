"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import LnaguageMenu from "./LnaguageMenu";
import "./style.css";
const Nav = () => {
  const { i18n } = useTranslation();
  return (
    <div className="nav__container">
      <div className="nav__bar">
        <ul className="nav">
          <li className="nav-item">
            <Link className="nav-link active" aria-current="page" href="/">
              {i18n.language === "ar" ? "الرئيسية" : "Home"}
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" href="/projects">
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
