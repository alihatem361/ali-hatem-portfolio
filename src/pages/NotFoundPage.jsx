import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SEO from "../components/SEO";
import { track } from "../helpers/analytics";
import "./ProjectDetailsPage.css";

/**
 * Catch-all route. Prerendered to build/404.html, which Vercel serves with a
 * real 404 status for any URL that has no prerendered page.
 */
const NotFoundPage = () => {
  const { i18n } = useTranslation();
  const { pathname } = useLocation();
  const isArabic = i18n.language === "ar";

  useEffect(() => {
    track("page_not_found", { requested_path: pathname });
  }, [pathname]);

  return (
    <div className="pdp-not-found">
      <SEO
        title={isArabic ? "الصفحة غير موجودة | علي حاتم" : "Page Not Found | Ali Hatem"}
        description={
          isArabic
            ? "عذراً، هذه الصفحة غير موجودة."
            : "Sorry, this page does not exist."
        }
        noindex={true}
        language={i18n.language}
      />
      <div className="pdp-not-found-content">
        <span className="pdp-404">404</span>
        <h1>{isArabic ? "الصفحة غير موجودة" : "Page Not Found"}</h1>
        <p>
          {isArabic
            ? "عذراً، لم نتمكن من العثور على هذه الصفحة."
            : "Sorry, we couldn't find the page you're looking for."}
        </p>
        <Link to="/projects" className="pdp-back-home">
          <span>{isArabic ? "عرض المشاريع" : "Browse projects"}</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
