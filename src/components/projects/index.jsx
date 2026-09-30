import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "./style.css";
// components
import PojectItem from "./components/projectItem";
import Footer from "../footer";
import GetAllData from "../../data/projects";
import LoaderCom from "../Utilities/LoaderCom";
import { getTechSkills } from "../../data/index";
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
    /**
     * Membership comes from the CMS `collectionId` field.
     *
     * This used to compare hardcoded English titles against `project.title`,
     * which silently failed in Arabic: members were never pulled out of the
     * list, so each one rendered BOTH on its own and inside a collection card,
     * colliding on the React key. The title lists are kept as a fallback for
     * any record that has no collectionId yet.
     */
    const titleLower = project.title?.toLowerCase() || "";
    const matchesTitles = (titles) =>
      titles.some((title) => title.toLowerCase() === titleLower);

    const collectionId =
      project.collectionId ||
      (matchesTitles(TEACHERS_COLLECTION_TITLES) && "teachers-collection") ||
      (matchesTitles(MPS_COLLECTION_TITLES) && "mps-collection") ||
      (matchesTitles(E3MEL_LANDING_PAGES_TITLES) &&
        "e3mel-landing-collection") ||
      null;

    if (project.type === "collection") {
      // Already a synthetic collection card — never re-group it.
      otherProjects.push(project);
    } else if (collectionId === "teachers-collection") {
      teachersProjects.push(project);
    } else if (collectionId === "mps-collection") {
      mpsProjects.push(project);
    } else if (collectionId === "e3mel-landing-collection") {
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
      const selected = filteringItems.map((item) => item.toLowerCase());
      const filteredProjects = projectsDta.filter((project) =>
        // Optional chaining: a project without technologies used to throw here
        // and take the whole listing down.
        (project.technology || []).some((tech) =>
          selected.includes(String(tech).toLowerCase()),
        ),
      );
      setFilteredProjectsData(filteredProjects);
    } else {
      getProjectsFromApi();
    }
  };

  // A single technology is selectable at a time, so the active filter is the
  // first (and only) entry. Kept as an array because filterItems() expects one.
  const activeFilter = filteringItems[0] || null;

  /**
   * How many cards each technology would yield, counted over the same list
   * filterItems() filters — including the grouped collection cards — so the
   * number next to a filter always matches what clicking it shows.
   */
  const techCounts = useMemo(() => {
    const counts = new Map();
    for (const project of projectsDta) {
      for (const tech of project.technology || []) {
        const key = String(tech).toLowerCase();
        counts.set(key, (counts.get(key) || 0) + 1);
      }
    }
    return counts;
  }, [projectsDta]);

  const clearFilters = () => {
    setFilteringItems([]);
    setIsFilterOpen(false);
  };

  const selectFilter = (skill) => {
    handelFilterClick(skill);
    setIsFilterOpen(false);
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
        <h2 className="project-header">{t("projects.pageTitle")}</h2>

        <div className="projects-layout">
          <aside className="tech-filter">
            <div className="tech-filter__head">
              <span className="tech-filter__title" id="tech-filter-title">
                {t("Filter")}
              </span>
              {activeFilter && (
                <button
                  type="button"
                  className="tech-filter__reset"
                  onClick={clearFilters}
                >
                  {t("projects.allFilter")}
                </button>
              )}
            </div>

            {/* Mobile/tablet: the list collapses behind this control. */}
            <button
              type="button"
              className="tech-filter__toggle"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              aria-expanded={isFilterOpen}
              aria-controls="tech-filter-list"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              <span className="tech-filter__toggle-label">
                {activeFilter || t("projects.allFilter")}
              </span>
              <svg
                className={`tech-filter__chevron ${isFilterOpen ? "is-open" : ""}`}
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            <div
              className={`tech-filter__list ${isFilterOpen ? "is-open" : ""}`}
              id="tech-filter-list"
              role="group"
              aria-labelledby="tech-filter-title"
            >
              <button
                type="button"
                className={`tech-filter__item ${!activeFilter ? "is-active" : ""}`}
                onClick={clearFilters}
                aria-pressed={!activeFilter}
              >
                <span className="tech-filter__name">
                  {t("projects.allFilter")}
                </span>
                <span className="tech-filter__count">{projectsDta.length}</span>
              </button>

              {getTechSkills().map((skill) => {
                const isActive = filteringItems.includes(skill);
                return (
                  <button
                    type="button"
                    key={skill}
                    className={`tech-filter__item ${isActive ? "is-active" : ""}`}
                    onClick={() => selectFilter(skill)}
                    aria-pressed={isActive}
                  >
                    <span className="tech-filter__name">{skill}</span>
                    <span className="tech-filter__count">
                      {techCounts.get(skill.toLowerCase()) || 0}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="projects-main">
            <div className="projects">
              {filteredProjectsData && filteredProjectsData.length > 0 ? (
                filteredProjectsData.map((project, index) => {
                  return (
                    <PojectItem
                      project={project}
                      key={project.collectionId || project.slug || index}
                    />
                  );
                })
              ) : (
                <LoaderCom />
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </React.Fragment>
  );
};

export default Projects;
