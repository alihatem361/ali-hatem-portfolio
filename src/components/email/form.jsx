import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

const Form = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    // console.log("data from form " + e.target);

    emailjs
      .sendForm(
        "service_u0q5t7d",
        "template_5j7fjt3",
        form.current,
        "9V0wWIVFgnEvsQUl9"
      )
      .then(
        (result) => {
          // console.log(result.text);
        },
        (error) => {
          // console.log(error.text);
        }
      );

    e.target.reset();
  };

  return (
    <>
      <form ref={form} onSubmit={sendEmail} id="Form">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            id="exampleFormControlInput1"
            placeholder="Enter your name"
            name="user_name"
          />
        </div>

        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            id="exampleFormControlInput1"
            placeholder="name@example.com"
            name="user_email"
          />
        </div>

        <div className="mb-3">
          <textarea
            className="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
            name="message"
            placeholder="Enter your message"
          ></textarea>
        </div>

        <span className="w-100 d-flex justify-content-end">
          <input type="submit" value="submit" className="btn " />
        </span>
      </form>
    </>
  );
};

export default Form;
