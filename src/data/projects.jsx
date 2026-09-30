import { useTranslation } from "react-i18next";
import {
  getProjectsForLanguage,
  getVisibleProjectsForLanguage,
  getSocialsForLanguage,
  getAboutmeForLanguage,
} from "./mergeProjects";

const GetAllData = () => {
  const { i18n } = useTranslation();

  const getProjects = () =>
    Promise.resolve([getVisibleProjectsForLanguage(i18n.language)]);

  // Includes hidden projects.
  const getAllProjects = () =>
    Promise.resolve([getProjectsForLanguage(i18n.language)]);

  const getSocials = () =>
    Promise.resolve([getSocialsForLanguage(i18n.language)]);

  const getAboutme = () =>
    Promise.resolve([getAboutmeForLanguage(i18n.language)]);

  return { getProjects, getAllProjects, getSocials, getAboutme };
};

export default GetAllData;
