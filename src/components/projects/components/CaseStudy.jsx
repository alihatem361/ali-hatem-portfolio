import React from "react";
import { useTranslation } from "react-i18next";

/**
 * Case-study sections for a project page. Every field is optional and comes
 * from the Sanity `caseStudy` object; a section renders only when its field
 * has content, so projects without a write-up are unaffected.
 */
const CaseStudy = ({ caseStudy }) => {
  const { t } = useTranslation();
  if (!caseStudy) return null;

  const {
    role,
    period,
    context,
    problem,
    contributions,
    decisions,
    challenge,
    outcome,
  } = caseStudy;

  const facts = [
    role && { label: t("projectDetails.role"), value: role },
    period && { label: t("projectDetails.period"), value: period },
  ].filter(Boolean);

  const prose = [
    context && { title: t("projectDetails.context"), text: context },
    problem && { title: t("projectDetails.problem"), text: problem },
  ].filter(Boolean);

  const lists = [
    contributions?.length && {
      title: t("projectDetails.contributions"),
      items: contributions,
    },
    decisions?.length && {
      title: t("projectDetails.decisions"),
      items: decisions,
    },
  ].filter(Boolean);

  const closing = [
    challenge && { title: t("projectDetails.challenge"), text: challenge },
    outcome && { title: t("projectDetails.outcome"), text: outcome },
  ].filter(Boolean);

  if (!facts.length && !prose.length && !lists.length && !closing.length) {
    return null;
  }

  return (
    <div className="pdp-case-study">
      {facts.length > 0 && (
        <dl className="pdp-case-facts">
          {facts.map((fact) => (
            <div key={fact.label} className="pdp-case-fact">
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {prose.map((block) => (
        <section key={block.title} className="pdp-case-block">
          <h2 className="pdp-section-title">{block.title}</h2>
          <p className="pdp-description-text">{block.text}</p>
        </section>
      ))}

      {lists.map((block) => (
        <section key={block.title} className="pdp-case-block">
          <h2 className="pdp-section-title">{block.title}</h2>
          <ul className="pdp-case-list">
            {block.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
      ))}

      {closing.map((block) => (
        <section key={block.title} className="pdp-case-block">
          <h2 className="pdp-section-title">{block.title}</h2>
          <p className="pdp-description-text">{block.text}</p>
        </section>
      ))}
    </div>
  );
};

export default CaseStudy;
