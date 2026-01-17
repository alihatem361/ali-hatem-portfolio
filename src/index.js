import React from "react";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import "./i18n";
import { Provider } from "react-redux";
import store from "./store/index";
import { BrowserRouter } from "react-router-dom";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SpeedInsights } from "@vercel/speed-insights/react";
import AOS from "aos";
import "aos/dist/aos.css";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
        <SpeedInsights />
      </Provider>
    </BrowserRouter>
  </StrictMode>,
);

AOS.init({
  duration: 1000,
  once: true,
  offset: 100,
});
