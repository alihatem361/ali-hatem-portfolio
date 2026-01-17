import React, { useState, useEffect } from "react";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./WhatsappChat.css";
function WhatsappChat() {
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(true);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClick = () => {
    setShowForm(!showForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const phoneNumber = "+201026159353";
    const encodedMessage = encodeURIComponent(message);
    const whatsappWebUrl = `https://web.whatsapp.com/send?phone=${encodeURIComponent(
      phoneNumber
    )}&text=${encodedMessage}`;
    const whatsappAppUrl = `https://api.whatsapp.com/send?phone=${encodeURIComponent(
      phoneNumber
    )}&text=${encodedMessage}`;

    // Try to open the WhatsApp app. If it fails, fallback to the web version
    if (navigator.userAgent.match(/Android|iPhone|iPad|iPod|Windows Phone/i)) {
      window.open(whatsappAppUrl, "_blank");
    } else {
      window.open(whatsappWebUrl, "_blank");
    }

    // Reset the message input and hide the form
    setMessage("");
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="whatsapp-chat-container" style={{}}>
      {/* Render your icon here */}
      {/* Render the form */}
      {showForm && (
        <div
          style={{
            backgroundColor: "#ffffff",
            position: "relative",
            borderRadius: "10px",
            boxShadow: " #b9afdf 0px 0px 10px 0px",
            bottom: "19px",
          }}
        >
          <div
            className="d-flex justify-content-between align-items-center"
            style={{
              backgroundColor: "#128C7E",
              color: "white",
              borderRadius: "10px 10px 0px 0px",
            }}
          >
            <span
              style={{
                padding: "10px",
              }}
            >
              <i className="fab fa-whatsapp px-2"></i> WhatsApp
            </span>
            <span onClick={handleCancel} className="btn btn-sm">
              <i className="fas fa-times"></i>
            </span>
          </div>

          <div
            className="d-flex justify-content-start align-items-center"
            style={{
              backgroundColor: "#E5DDD5",
              color: "white",
            }}
          >
            <span
              style={{
                margin: "10px",
                padding: "10px 15px",
                background: "#ffffff",
                color: "#000000",
                borderRadius: "10px",
                border: "1px solid #000000",
              }}
            >
              مرحبا كيف يمكنني مساعدتك؟
            </span>
          </div>
          <form
            onSubmit={handleSubmit}
            style={{
              padding: "12px",
            }}
            className="d-flex justify-content-between align-items-center"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتب رسالتك هنا"
              className="form-control"
              style={{
                fontSize: "14px",
              }}
            />
            <button
              type="submit"
              style={{
                border: "none",
                margin: "0px 6px",
              }}
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      )}
      {hasScrolled && (
        <FontAwesomeIcon
          icon={faWhatsapp}
          onClick={handleClick}
          style={{
            color: "#25D366",
            fontSize: "7rem",
            cursor: "pointer",
            position: "fixed",
            zIndex: "9999",
            position: "absolute",
            bottom: "-53",
          }}
        />
      )}
    </div>
  );
}

export default WhatsappChat;
