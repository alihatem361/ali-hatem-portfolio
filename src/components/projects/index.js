import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import "./style.css";
// components
import PojectItem from "./components/projectItem";
import Footer from "../footer";
import GetAllData from "../../data/projects";
import LoaderCom from "../Utilities/LoaderCom";
import LowerCurve from "../Utilities/LowerCurve";
import { techSkills } from "../../data/index";
const Projects = () => {
  const { i18n } = useTranslation();
  const { getProjects } = GetAllData();
  const [filteringItems, setFilteringItems] = useState([]);
  const [projectsDta, setProjectsData] = useState([]);
  const [filteredProjectsData, setFilteredProjectsData] = useState([]);

  const getProjectsFromApi = useCallback(() => {
    getProjects().then((data) => {
      setProjectsData(data[0]);
      setFilteredProjectsData(data[0]);
    });
  }, [getProjects]);
  const filterItems = useCallback(() => {
    if (filteringItems.length > 0) {
      const filteredProjects = projectsDta.filter((project) =>
        project.technology.some((r) =>
          filteringItems
            .map((item) => item.toLowerCase())
            .includes(r.toLowerCase())
        )
      );
      setFilteredProjectsData(filteredProjects);
    } else {
      getProjectsFromApi();
    }
  }, [filteringItems, projectsDta, getProjectsFromApi]);

  useEffect(() => {
    if (projectsDta.length === 0) {
      getProjectsFromApi();
    }
  }, [i18n.language, projectsDta.length, getProjectsFromApi]);

  const handelFilterClick = (name) => {
    if (filteringItems.includes(name)) {
      setFilteringItems(filteringItems.filter((item) => item !== name));
    } else {
      setFilteringItems([name]);
    }
  };

  useEffect(() => {
    filterItems();
  }, [filteringItems, filterItems]);

  return (
    <React.Fragment>
      <div className="container pt-5">
        {" "}
        <div className="filter-buttons d-flex justify-content-center flex-wrap gap-2 px-3 py-3">
          {techSkills.map((skill, index) => {
            return (
              <button
                className={`btn filter-btn ${
                  filteringItems.includes(skill) ? "active" : ""
                }`}
                key={index}
                onClick={() => handelFilterClick(skill)}
                style={{
                  zIndex: "1",
                  backgroundColor: filteringItems.includes(skill)
                    ? "var(--warning-color)"
                    : "var(--tertiary-color)",
                  color: "white",
                  fontSize: "0.85rem",
                  padding: "6px 12px",
                  borderRadius: "15px",
                  transition: "all 0.3s ease",
                  margin: "2px",
                }}
              >
                {skill}
              </button>
            );
          })}
          <button
            className="btn btn-outline-warning filter-btn"
            onClick={() => setFilteringItems([])}
            style={{
              borderRadius: "15px",
              padding: "6px 12px",
              fontSize: "0.85rem",
              fontWeight: "500",
            }}
          >
            Clear
          </button>
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
      <LowerCurve />
      <Footer />
    </React.Fragment>
  );
};

export default Projects;
