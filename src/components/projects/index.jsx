import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "./style.css";
// components
import PojectItem from "./components/projectItem";
import Footer from "../footer";
import GetAllData from "../../data/projects";
import LoaderCom from "../Utilities/LoaderCom";
import { techSkills } from "../../data/index";
import SEO from "../SEO";

// Project titles to group into collections
const TEACHERS_COLLECTION_TITLES = [
  "Mr Mohamed",
  "Mr Abdullah",
  "Mr Ahmed",
  "Alshaatir Academy",
  "Hadafik Altaelimia",
];
const MPS_COLLECTION_TITLES = [
  "mohammed-al-huwaila",
  "thamer-al-suwait",
  "saoud-al-asfour",
  "abdullah-mutlaq-awad-al-mutairi",
];
const E3MEL_LANDING_PAGES_TITLES = [
  "Saudi National Day",
  "EBU Certificate",
  "shahadat alhadaf",
];

/**
 * Groups specific projects into collection objects
 * @param {Array} projects - Original projects array
 * @param {string} language - Current language (en/ar)
 * @returns {Array} - Projects array with collections
 */
const groupProjectsIntoCollections = (projects, language) => {
  if (!projects || projects.length === 0) return [];

  const teachersProjects = [];
  const mpsProjects = [];
  const e3melLandingProjects = [];
  const otherProjects = [];

  projects.forEach((project) => {
    const titleLower = project.title?.toLowerCase() || "";

    if (
      TEACHERS_COLLECTION_TITLES.some((t) => t.toLowerCase() === titleLower)
    ) {
      teachersProjects.push(project);
    } else if (
      MPS_COLLECTION_TITLES.some((t) => t.toLowerCase() === titleLower)
    ) {
      mpsProjects.push(project);
    } else if (
      E3MEL_LANDING_PAGES_TITLES.some((t) => t.toLowerCase() === titleLower)
    ) {
      e3melLandingProjects.push(project);
    } else {
      otherProjects.push(project);
    }
  });

  // Build collections array
  const collections = [];

  // Create Teachers Collection
  if (teachersProjects.length > 0) {
    collections.push({
      type: "collection",
      collectionId: "teachers-collection",
      title: language === "ar" ? "مواقع المعلمين" : "Teachers' Websites",
      description:
        language === "ar"
          ? "مجموعة من المواقع الشخصية للمعلمين تعرض ملفاتهم المهنية وإنجازاتهم"
          : "A collection of personal websites for teachers showcasing their professional profiles and achievements",
      image: teachersProjects[0]?.image,
      technology: [
        ...new Set(teachersProjects.flatMap((p) => p.technology || [])),
      ],
      subProjects: teachersProjects,
    });
  }

  // Create MPs/Candidates Collection
  if (mpsProjects.length > 0) {
    collections.push({
      type: "collection",
      collectionId: "mps-collection",
      title:
        language === "ar"
          ? "مواقع المرشحين والنواب"
          : "MPs & Candidates Websites",
      description:
        language === "ar"
          ? "مجموعة من المواقع الشخصية للمرشحين والنواب تعرض ملفاتهم ومعلومات التواصل"
          : "A collection of personal websites for MPs and candidates showcasing their portfolios and contact information",
      image: mpsProjects[0]?.image,
      technology: [...new Set(mpsProjects.flatMap((p) => p.technology || []))],
      subProjects: mpsProjects,
    });
  }

  // Create E3melbusiness Landing Pages Collection
  if (e3melLandingProjects.length > 0) {
    collections.push({
      type: "collection",
      collectionId: "e3mel-landing-collection",
      title:
        language === "ar"
          ? "صفحات E3melbusiness الترويجية"
          : "E3melbusiness Landing Pages",
      description:
        language === "ar"
          ? "مجموعة من الصفحات الترويجية والشهادات المصممة لمؤسسة E3melbusiness"
          : "A collection of promotional landing pages and certificates designed for E3melbusiness organization",
      image: e3melLandingProjects[0]?.image,
      technology: [
        ...new Set(e3melLandingProjects.flatMap((p) => p.technology || [])),
      ],
      subProjects: e3melLandingProjects,
    });
  }

  // Find index of "1M Brothers" project and insert collections after it
  const result = [];
  const targetTitle = "1m brothers";

  for (let i = 0; i < otherProjects.length; i++) {
    result.push(otherProjects[i]);

    // Insert all collections right after 1M Brothers
    if (otherProjects[i].title?.toLowerCase() === targetTitle) {
      result.push(...collections);
    }
  }

  // If 1M Brothers wasn't found, append collections at the end
  if (!otherProjects.some((p) => p.title?.toLowerCase() === targetTitle)) {
    result.push(...collections);
  }

  return result;
};

const Projects = () => {
  const { t, i18n } = useTranslation();
  const { getProjects } = GetAllData();
  const [filteringItems, setFilteringItems] = useState([]);
  const [projectsDta, setProjectsData] = useState([]);
  const [filteredProjectsData, setFilteredProjectsData] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const getProjectsFromApi = () => {
    getProjects().then((data) => {
      const rawProjects = data[0];
      const groupedProjects = groupProjectsIntoCollections(
        rawProjects,
        i18n.language,
      );
      setProjectsData(groupedProjects);
      setFilteredProjectsData(groupedProjects);
    });
  };

  useEffect(() => {
    // Reload projects when language changes
    getProjectsFromApi();
  }, [i18n.language]);

  const handelFilterClick = (name) => {
    if (filteringItems.includes(name)) {
      setFilteringItems(filteringItems.filter((item) => item !== name));
    } else {
      setFilteringItems([name]);
    }
  };

  useEffect(() => {
    filterItems();
  }, [filteringItems]);

  const filterItems = () => {
    if (filteringItems.length > 0) {
      const filteredProjects = projectsDta.filter((project) =>
        project.technology.some((r) =>
          filteringItems
            .map((item) => item.toLowerCase())
            .includes(r.toLowerCase()),
        ),
      );
      setFilteredProjectsData(filteredProjects);
    } else {
      getProjectsFromApi();
    }
  };

  const isArabic = i18n.language === "ar";

  return (
    <React.Fragment>
      <SEO
        title={
          isArabic
            ? "المشاريع | علي حاتم - مطور واجهات أمامية"
            : "Projects | Ali Hatem - Frontend Developer Portfolio"
        }
        description={
          isArabic
            ? "استكشف مجموعة مشاريعي في تطوير الويب باستخدام React و Next.js و TypeScript وتقنيات الويب الحديثة. أكثر من 30 مشروع احترافي."
            : "Explore my portfolio of web development projects built with React, Next.js, TypeScript, and modern web technologies. 30+ professional projects showcasing my expertise."
        }
        keywords={
          isArabic
            ? "مشاريع علي حاتم, React مشاريع, Next.js مشاريع, تطوير الويب, محفظة أعمال"
            : "Ali Hatem projects, React projects, Next.js projects, web development portfolio, frontend projects"
        }
        language={i18n.language}
      />
      <div className="container pt-2">
        {/* Mobile Filter Toggle */}
        <div className="filter-toggle-mobile d-md-none">
          <button
            className={`filter-toggle-btn ${filteringItems.length > 0 ? "has-filter" : ""}`}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span>{t("Filter")}</span>
            {filteringItems.length > 0 && (
              <span className="filter-count">{filteringItems.length}</span>
            )}
            <svg
              className={`chevron ${isFilterOpen ? "open" : ""}`}
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>

        {/* Filter Pills - Desktop always visible, Mobile collapsible */}
        <div className={`filter-wrapper ${isFilterOpen ? "open" : ""}`}>
          <div className="filter-pills">
            {techSkills.map((skill, index) => (
              <button
                className={`filter-pill ${filteringItems.includes(skill) ? "active" : ""}`}
                key={index}
                onClick={() => handelFilterClick(skill)}
              >
                {skill}
              </button>
            ))}
            {filteringItems.length > 0 && (
              <button
                className="filter-pill clear-pill"
                onClick={() => setFilteringItems([])}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="projects">
          {filteredProjectsData && filteredProjectsData.length > 0 ? (
            filteredProjectsData.map((project, index) => {
              return (
                <PojectItem
                  project={project}
                  key={project.collectionId || index}
                />
              );
            })
          ) : (
            <LoaderCom />
          )}
        </div>
      </div>

      <Footer />
    </React.Fragment>
  );
};

export default Projects;
