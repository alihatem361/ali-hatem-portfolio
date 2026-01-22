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

const Projects = () => {
  const { t, i18n } = useTranslation();
  const { getProjects } = GetAllData();
  const [filteringItems, setFilteringItems] = useState([]);
  const [projectsDta, setProjectsData] = useState([]);
  const [filteredProjectsData, setFilteredProjectsData] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const getProjectsFromApi = () => {
    getProjects().then((data) => {
      setProjectsData(data[0]);
      setFilteredProjectsData(data[0]);
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

  return (
    <React.Fragment>
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
              return <PojectItem project={project} key={index} />;
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
