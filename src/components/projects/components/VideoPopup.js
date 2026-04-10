"use client";

import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import YoutubeVideo from "./YoutubeVideo";
import LoomVideo from "./LoomVideo";
import { SiLoom } from "react-icons/si";
import { FaYoutube } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

function VideoPopup({ videoKey, project }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <a className="btn" onClick={handleShow}>
        {project.loomVideo ? <SiLoom /> : <FaYoutube />}
      </a>

      <Modal
        show={show}
        onHide={handleClose}
        fullscreen="true"
        size="lg"
        className="posaition-relative"
      >
        <div
          className="d-flex justify-content-end align-items-center p-2 position-absolute"
          style={{ top: "-12px", right: "-12px" }}
        >
          <Button
            variant="secondary"
            onClick={handleClose}
            className="btn btn-danger p-2"
            style={{ zIndex: "999" }}
          >
            <IoClose size={32} color="white" />
          </Button>
        </div>
        {project.loomVideo ? <LoomVideo videoUrl={project.loomVideo} /> : null}
        <YoutubeVideo project={project} />
      </Modal>
    </>
  );
}

export default VideoPopup;
