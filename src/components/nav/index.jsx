import { Link } from "react-router-dom";
import "./style.css";
import { Fragment, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import LnaguageMenu from "./LnaguageMenu";

const Nav = () => {
  const { i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="nav__container" key={i18n.language}>
      {isMobile ? (
        // Mobile Navigation
        <Fragment>
          <div className="nav__mobile-header">
            <button
              className="nav__mobile-toggle"
              onClick={toggleMobileMenu}
              aria-label="Toggle navigation menu"
            >
              <span className={`hamburger ${isMobileMenuOpen ? "active" : ""}`}>
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
            <LnaguageMenu />
          </div>

          <div
            className={`nav__mobile-menu ${isMobileMenuOpen ? "active" : ""}`}
          >
            <ul className="nav nav__mobile-list">
              <li className="nav-item">
                <Link
                  className="nav-link active"
                  aria-current="page"
                  to="/"
                  onClick={closeMobileMenu}
                >
                  {i18n.language === "ar" ? "الرئيسية" : "Home"}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="projects"
                  onClick={closeMobileMenu}
                >
                  {i18n.language === "ar" ? "المشاريع" : "Projects"}
                </Link>
              </li>
            </ul>
          </div>
        </Fragment>
      ) : (
        // Desktop Navigation
        <Fragment>
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
        </Fragment>
      )}
    </div>
  );
};

export default Nav;
