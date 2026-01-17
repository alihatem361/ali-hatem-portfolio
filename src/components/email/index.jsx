import React, { useRef } from "react";
import emailjs from "@emailjs/browser";

import Form from "./form.jsx";
import "./style.css";
const ContactUs = () => {
  return (
    <>
      <button
        className="btn"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        name="ContactUs"
      >
        Hir me 🤝
      </button>

      <div
        className="modal fade  "
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" class="btn-close" data-bs-dismiss="modal">
                <i class="fa-regular fa-circle-xmark"></i>
              </button>
            </div>
            <div className="modal-body">
              <Form />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
