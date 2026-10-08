"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./style.css";
// components
import PojectItem from "./components/projectItem";
import Footer from "../footer";
import GetAllData from "../../data/projects";
import LoaderCom from "../Utilities/LoaderCom";
import StateMessage from "../Utilities/StateMessage";
import LowerCurve from "../Utilities/LowerCurve";
import { techSkills } from "../../data/index";
const Projects = () => {
  const { t, i18n } = useTranslation();
  const { getProjects } = GetAllData();
  const [filteringItems, setFilteringItems] = useState([]);
  const [projectsDta, setProjectsData] = useState([]);
  const [filteredProjectsData, setFilteredProjectsData] = useState([]);
  const [status, setStatus] = useState("loading");
  const [reloadKey, setReloadKey] = useState(0);

  // Load (or reload) projects only when the language changes
  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    getProjects()
      .then((data) => {
        if (cancelled) return;
        setProjectsData(data[0]);
        setFilteredProjectsData(data[0]);
        setStatus("ready");
      })
      .catch((error) => {
        if (cancelled) return;
        // Without this the page would sit on the loader forever.
        console.error("Failed to load projects from Sanity:", error);
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
    // getProjects is intentionally omitted – it reads i18n.language which
    // is already in the dep array, so we don't need the unstable fn ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language, reloadKey]);

  // Apply / clear filters whenever the selection or the base data changes
  useEffect(() => {
    if (projectsDta.length === 0) return;
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
      setFilteredProjectsData(projectsDta);
    }
  }, [filteringItems, projectsDta]);

  const handelFilterClick = (name) => {
    if (filteringItems.includes(name)) {
      setFilteringItems(filteringItems.filter((item) => item !== name));
    } else {
      setFilteringItems([name]);
    }
  };

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
          {status === "loading" ? (
            <LoaderCom />
          ) : status === "error" ? (
            <StateMessage
              message={t("projects.error")}
              retryLabel={t("projects.retry")}
              onRetry={() => setReloadKey((k) => k + 1)}
            />
          ) : filteredProjectsData && filteredProjectsData.length > 0 ? (
            filteredProjectsData.map((project, index) => {
              return <PojectItem project={project} key={index} />;
            })
          ) : (
            <StateMessage
              message={
                filteringItems.length > 0
                  ? t("projects.noMatch")
                  : t("projects.empty")
              }
            />
          )}
        </div>
      </div>
      <LowerCurve />
      <Footer />
    </React.Fragment>
  );
};

export default Projects;
