"use client";

import { useTranslation } from "react-i18next";
import { client } from "../../sanity/lib/client";
import {
  allProjectsQuery,
  heroQuery,
  socialLinksQuery,
} from "../../sanity/lib/queries";

const GetAllData = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language === "ar" ? "ar" : "en";

  const getProjects = async () => {
    const projects = await client.fetch(allProjectsQuery);
    const mapped = projects.map((p) => ({
      imeg: p.mainImageUrl || "",
      titleEn: p.title?.en || "",
      title: p.title?.[lang] || p.title?.en || "",
      description: p.description?.[lang] || p.description?.en || "",
      technology: p.technologies ?? [],
      demo: p.googlePlayLink || p.demoLink || "",
      android: p.googlePlayLink || "",
      ios: p.appStoreLink || "",
      github: p.githubLink || "",
      video: p.videoUrl || "",
      videoKey: "",
      screenshots: p.screenshots ?? [],
      codeStatus: p.codeStatus || "PUBLIC",
      startDate: p.startDate || "",
      endDate: p.endDate || "",
      companyName: "",
      _id: p._id,
    }));
    return [mapped];
  };

  const getSocials = async () => {
    const socials = await client.fetch(socialLinksQuery);
    const mapped = socials.map((s, i) => ({
      id: i + 1,
      name: s.platform?.toLowerCase() || "other",
      link: s.url || "",
    }));
    return [mapped];
  };

  const getAboutme = async () => {
    const hero = await client.fetch(heroQuery);
    if (!hero) return [[]];
    return [
      [
        {
          name: hero.name?.[lang] || hero.name?.en || "",
          title: hero.jobTitle?.[lang] || hero.jobTitle?.en || "",
          bio: hero.bio?.[lang] || hero.bio?.en || "",
          heaaderimag: hero.heroImageUrl || "",
          cv: hero.cvFileUrl || "",
        },
      ],
    ];
  };

  return { getProjects, getSocials, getAboutme };
};

export default GetAllData;
