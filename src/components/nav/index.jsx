import { useLocation, useNavigate } from "react-router-dom";
import "./style.css";
import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import LnaguageMenu from "./LnaguageMenu";

const NAV_ITEMS = [
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

const HEADER_OFFSET = 90;

const Nav = () => {
  const { i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";
  const toggleRef = useRef(null);

  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  // Track the active section and whether the page has scrolled away from the
  // top, in a single passive scroll listener.
  useEffect(() => {
    const sectionIds = NAV_ITEMS.filter((item) => item.isSection).map(
      (item) => item.id,
    );

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      if (!isHomePage) return;
      const scrollPosition = window.scrollY + HEADER_OFFSET + 10;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const section = document.getElementById(sectionIds[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  // While the mobile menu is open: lock background scrolling, close on Escape,
  // and return focus to the toggle so keyboard users are not stranded.
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeMobileMenu();
        toggleRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen, closeMobileMenu]);

  // Close the menu whenever the route changes.
  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname, closeMobileMenu]);

  const scrollToSection = useCallback((sectionId) => {
    const element = document.getElementById(sectionId);
    if (!element) return;
    const offsetPosition =
      element.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;
    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
  }, []);

  const handleNavClick = (item, event) => {
    event.preventDefault();
    closeMobileMenu();

    if (!item.isSection) {
      navigate(item.path);
      return;
    }

    if (isHomePage) {
      scrollToSection(item.id);
    } else {
      navigate("/", { state: { scrollTo: item.id } });
    }
  };

  useEffect(() => {
    if (!location.state?.scrollTo) return;
    const timer = setTimeout(() => {
      scrollToSection(location.state.scrollTo);
      window.history.replaceState({}, document.title);
    }, 100);
    return () => clearTimeout(timer);
  }, [location.state, scrollToSection]);

  const getNavLabel = (item) =>
    i18n.language === "ar" ? item.labelAr : item.labelEn;

  const isActive = (item) =>
    item.isSection
      ? isHomePage && activeSection === item.id
      : location.pathname === item.path;

  const renderLinks = () =>
    NAV_ITEMS.map((item) => (
      <li className="nav-item" key={item.id}>
        <a
          className={`nav-link ${isActive(item) ? "active" : ""}`}
          href={item.isSection ? `#${item.id}` : item.path}
          aria-current={isActive(item) ? "page" : undefined}
          onClick={(event) => handleNavClick(item, event)}
        >
          {getNavLabel(item)}
        </a>
      </li>
    ));

  return (
    <header
      className={`site-header ${isScrolled ? "scrolled" : ""}`}
      key={i18n.language}
    >
      <div className="nav__container">
        <a
          className="nav__brand"
          href="/"
          onClick={(event) => {
            event.preventDefault();
            closeMobileMenu();
            if (isHomePage) {
              window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
              navigate("/");
            }
          }}
        >
          <span className="nav__brand-mark">AH</span>
          <span className="nav__brand-text">Ali Hatem</span>
        </a>

        <nav className="nav__bar" aria-label="Main navigation">
          <ul className="nav">{renderLinks()}</ul>
        </nav>

        <div className="nav__actions">
          <div className="nav__lang-desktop">
            <LnaguageMenu />
          </div>

          <button
            ref={toggleRef}
            className="nav__mobile-toggle"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-label={
              isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            <span className={`hamburger ${isMobileMenuOpen ? "active" : ""}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>

      {/* Tapping anywhere outside the panel dismisses it. */}
      <div
        className={`nav__overlay ${isMobileMenuOpen ? "active" : ""}`}
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      <div
        id="mobile-navigation"
        className={`nav__mobile-menu ${isMobileMenuOpen ? "active" : ""}`}
        inert={isMobileMenuOpen ? undefined : ""}
      >
        <nav aria-label="Mobile navigation">
          <ul className="nav nav__mobile-list">{renderLinks()}</ul>
        </nav>
        <div className="nav__lang-mobile">
          <LnaguageMenu />
        </div>
      </div>
    </header>
  );
};

export default Nav;
