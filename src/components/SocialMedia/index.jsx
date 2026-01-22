import React from "react";
import { useEffect, useState } from "react";
import GetAllData from "../../data/projects";
import {
  FaGithub,
  FaLinkedin,
  FaYoutube,
  FaWhatsapp,
  FaTwitter,
  FaFacebook,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const SocialMedia = () => {
  const { getSocials } = GetAllData();
  const [socialsData, setSocialsData] = useState([]);

  useEffect(() => {
    getSocials().then((data) => {
      setSocialsData(data[0]);
    });
  }, []);

  // كائن يربط اسم وسائل التواصل الاجتماعي مع الأيقونة المناسبة
  const socialIcons = {
    linkedin: FaLinkedin,
    github: FaGithub,
    whatsapp: FaWhatsapp,
    email: MdEmail,
    twitter: FaTwitter,
    youtube: FaYoutube,
  };

  // ترتيب العرض المطلوب
  const displayOrder = [
    "linkedin",
    "github",
    "whatsapp",
    "email",
    "twitter",
    "youtube",
  ];

  return (
    <ul className="list-unstyled">
      {displayOrder.map((name) => {
        const social = socialsData.find((s) => s.name === name);
        if (social) {
          const Icon = socialIcons[name];
          return (
            <li key={social.id}>
              <a href={social.link} target="_blank" rel="noreferrer">
                <Icon />
              </a>
            </li>
          );
        }
        return null;
      })}
    </ul>
  );
};

export default SocialMedia;
