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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // كائن يربط اسم وسائل التواصل الاجتماعي مع الأيقونة المناسبة
  const socialIcons = {
    github: FaGithub,
    linkedin: FaLinkedin,
    youtube: FaYoutube,
    whatsapp: FaWhatsapp,
    email: MdEmail,
    twitter: FaTwitter,
    facebook: FaFacebook,
  };

  return (
    <ul className="list-unstyled">
      {socialsData.map((social) => {
        if (social.name in socialIcons) {
          const Icon = socialIcons[social.name];
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
