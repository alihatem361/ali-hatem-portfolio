import React, { Fragment } from "react";
import "./style.css";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useTranslation } from "react-i18next";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ProjectOffcanvas from "../ProjectOffcanvas";
import { FaAnglesRight } from "react-icons/fa6";
// components
import ProjectCardButtons from "../ProjectCardButtons";
const PojectItem = ({ project }) => {
  const [show, setShow] = React.useState(false);
  const [projectData, setProjectData] = React.useState({});
  const handleClose = () => setShow(false);

  return (
    <Fragment>
      <ProjectOffcanvas
        project={projectData}
        show={show}
        handleClose={handleClose}
      />
      <div className="card" data-aos="fade-up">
        <div className="img-container w-100">
          <LazyLoadImage
            src={project.imeg}
            alt={project.title}
            effect="blur"
            className="card-img-top w-100"
            placeholderSrc={project.imeg}
            onClick={() => {
              setShow(true);
              setProjectData(project);
            }}
            style={{ cursor: "pointer" }}
          />
        </div>
        <div className="card-body">
          <h5
            className="card-title"
            onClick={() => {
              setShow(true);
              setProjectData(project);
            }}
            style={{ cursor: "pointer" }}
          >
            {project.title} <FaAnglesRight className="ms-2" />
          </h5>

          <ProjectCardButtons project={project} />
        </div>
      </div>
    </Fragment>
  );
};

export default PojectItem;
