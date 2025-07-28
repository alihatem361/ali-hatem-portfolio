import ProjectsApi from "./projects.json";
import ProjectsApiAR from "./projectsAR.json";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
const GetAllData = () => {
  const { t, i18n } = useTranslation();

  const getProjects = () => {
    const projects =
      i18n.language === "en" ? ProjectsApi.Projects : ProjectsApiAR.Projects;
    // Filter out hidden projects
    const visibleProjects = projects.filter((project) => !project.hidden);
    return Promise.resolve([visibleProjects]);
  };

  const getAllProjects = () => {
    // This function returns all projects including hidden ones
    return Promise.resolve(
      i18n.language === "en" ? [ProjectsApi.Projects] : [ProjectsApiAR.Projects]
    );
  };

  const getSocials = () => {
    return Promise.resolve(
      i18n.language === "en" ? [ProjectsApi.socials] : [ProjectsApiAR.socials]
    );
  };

  const getAboutme = () => {
    return Promise.resolve(
      i18n.language === "en" ? [ProjectsApi.aboutme] : [ProjectsApiAR.aboutme]
    );
  };

  return { getProjects, getAllProjects, getSocials, getAboutme };
};

export default GetAllData;
