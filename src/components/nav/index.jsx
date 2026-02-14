import { Link, useLocation, useNavigate } from "react-router-dom";
import "./style.css";
import { Fragment, useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import LnaguageMenu from "./LnaguageMenu";

const Nav = () => {
  const { i18n, t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  // Navigation items configuration
  const navItems = [
    { id: "home", labelEn: "Home", labelAr: "الرئيسية", isSection: true },
    { id: "skills", labelEn: "Skills", labelAr: "المهارات", isSection: true },
    {
      id: "experience",
      labelEn: "Experience",
      labelAr: "الخبرات",
      isSection: true,
    },
    { id: "certifications", labelEn: "About", labelAr: "عني", isSection: true },
    {
      id: "projects",
      labelEn: "Projects",
      labelAr: "المشاريع",
      isSection: false,
      path: "/projects",
    },
    { id: "contact", labelEn: "Contact", labelAr: "تواصل", isSection: true },
  ];

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

  // Track active section on scroll
  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      const sections = navItems
        .filter((item) => item.isSection)
        .map((item) => item.id);
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  // Smooth scroll to section
  const scrollToSection = useCallback((sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }, []);

  // Handle navigation click
  const handleNavClick = (item, e) => {
    e.preventDefault();
    closeMobileMenu();

    if (!item.isSection) {
      // Navigate to route (like /projects)
      navigate(item.path);
      return;
    }

    if (isHomePage) {
      // Smooth scroll to section on home page
      scrollToSection(item.id);
    } else {
      // Navigate to home page and then scroll to section
      navigate("/", { state: { scrollTo: item.id } });
    }
  };

  // Handle scroll after navigation from other pages
  useEffect(() => {
    if (location.state?.scrollTo) {
      setTimeout(() => {
        scrollToSection(location.state.scrollTo);
        // Clear the state
        window.history.replaceState({}, document.title);
      }, 100);
    }
  }, [location.state, scrollToSection]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const getNavLabel = (item) => {
    return i18n.language === "ar" ? item.labelAr : item.labelEn;
  };

  const isActive = (item) => {
    if (!item.isSection) {
      return location.pathname === item.path;
    }
    return isHomePage && activeSection === item.id;
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
          </div>

          <div
            className={`nav__mobile-menu ${isMobileMenuOpen ? "active" : ""}`}
          >
            <ul className="nav nav__mobile-list">
              {navItems.map((item) => (
                <li className="nav-item" key={item.id}>
                  <a
                    className={`nav-link ${isActive(item) ? "active" : ""}`}
                    href={item.isSection ? `#${item.id}` : item.path}
                    onClick={(e) => handleNavClick(item, e)}
                  >
                    {getNavLabel(item)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Fragment>
      ) : (
        // Desktop Navigation
        <Fragment>
          <div className="nav__bar">
            <ul className="nav">
              {navItems.map((item) => (
                <li className="nav-item" key={item.id}>
                  <a
                    className={`nav-link ${isActive(item) ? "active" : ""}`}
                    href={item.isSection ? `#${item.id}` : item.path}
                    onClick={(e) => handleNavClick(item, e)}
                  >
                    {getNavLabel(item)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default Nav;
