"use client";

import ProjectsApi from "./projects.json";
import ProjectsApiAR from "./projectsAR.json";
import { useTranslation } from "react-i18next";

const GetAllData = () => {
  const { i18n } = useTranslation();

  const normalizeProjects = (projects = []) => {
    return projects.map((project) => ({
      ...project,
      startDate: project.startDate || "",
      endDate: project.endDate || "",
      companyName: project.companyName || "",
      android: project.android || "",
      ios: project.ios || "",
    }));
  };

  const getProjects = () => {
    return Promise.resolve(
      i18n.language === "en"
        ? [normalizeProjects(ProjectsApi.Projects)]
        : [normalizeProjects(ProjectsApiAR.Projects)],
    );
  };

  const getSocials = () => {
    return Promise.resolve(
      i18n.language === "en" ? [ProjectsApi.socials] : [ProjectsApiAR.socials],
    );
  };

  const getAboutme = () => {
    return Promise.resolve(
      i18n.language === "en" ? [ProjectsApi.aboutme] : [ProjectsApiAR.aboutme],
    );
  };

  return { getProjects, getSocials, getAboutme };
};

export default GetAllData;
