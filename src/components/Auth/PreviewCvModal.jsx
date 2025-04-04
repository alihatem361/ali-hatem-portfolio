import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import React from "react";
import { useTranslation } from "react-i18next";
import "./style.css";

function PreviewCvModal() {
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const handleClose = () => {
    setShow(false);
    setIsLoading(true);
    setError(null);
  };
  
  const handleShow = () => setShow(true);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setError("عفواً، حصل مشكلة في تحميل ال CV. برجاء المحاولة تاني");
    setIsLoading(false);
  };

  return (
    <div className="login__modal">
      <button className="login__modal__btn" onClick={handleShow}>
        <span>Preview CV</span>
        <i className="fas fa-eye"></i>
      </button>

      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="modal__header_text">CV Preview</Modal.Title>
        </Modal.Header>

        <Modal.Body className="login__modal__container">
          {isLoading && (
            <div className="loading-spinner">
              جاري التحميل...
            </div>
          )}
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <iframe
            src="https://drive.google.com/file/d/17OHpoQE-SmeLgNI30T1mA1pjvBS-ATdm/preview"
            allow="autoplay"
            width="100%"
            height="100%"
            allowFullScreen
            title="pdf cv"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default PreviewCvModal;
