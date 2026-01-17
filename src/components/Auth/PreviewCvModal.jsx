import { useState } from "react";
import Modal from "react-bootstrap/Modal";
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
          {isLoading && <div className="loading-spinner">جاري التحميل...</div>}

          {error && <div className="error-message">{error}</div>}

          <iframe
            // link to the pdf file
            src="https://drive.google.com/file/d/1J_WWAkwVSSAyFEs5aU49aXeir8pM-MXT/view?usp=drive_link"
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
