import React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import GetAllData from "../../data/projects";
import {
  FaGithub,
  FaLinkedin,
  FaYoutube,
  FaWhatsapp,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaPhone,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";

/**
 * Icon per platform value in the CMS. A platform with no entry here still
 * renders, using the generic link icon, rather than disappearing.
 */
const socialIcons = {
  linkedin: FaLinkedin,
  github: FaGithub,
  whatsapp: FaWhatsapp,
  email: MdEmail,
  twitter: FaTwitter,
  youtube: FaYoutube,
  facebook: FaFacebook,
  instagram: FaInstagram,
  phone: FaPhone,
};

/** Bare phone numbers are stored without a scheme. */
const toHref = (social) => {
  const link = (social.link || "").trim();
  if (!link) return "";
  if (social.name === "phone" && !/^(tel:|https?:)/i.test(link)) {
    return `tel:${link.replace(/\s+/g, "")}`;
  }
  return link;
};

const SocialMedia = () => {
  const { i18n } = useTranslation();
  const { getSocials } = GetAllData();
  const [socialsData, setSocialsData] = useState([]);

  useEffect(() => {
    getSocials().then((data) => {
      setSocialsData(data[0]);
    });
    // Re-run on language change so the translated labels update.
  }, [i18n.language]);

  return (
    <ul className="list-unstyled">
      {socialsData.map((social) => {
        const href = toHref(social);
        if (!href) return null;

        // Order comes from the CMS; the list arrives already sorted.
        const Icon = socialIcons[social.name] || MdEmail;
        const label = social.label || social.name;

        return (
          <li key={social.id}>
            <a
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              aria-label={label}
              title={label}
            >
              <Icon aria-hidden="true" />
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default SocialMedia;
