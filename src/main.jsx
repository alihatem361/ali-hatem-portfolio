import React from "react";
import { hydrateRoot, createRoot } from "react-dom/client"; // استيراد الوظائف
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import "./i18n";
import { Provider } from "react-redux";
import store from "./store/index";
import { BrowserRouter } from "react-router-dom";
import { StrictMode } from "react";
import { HelmetProvider } from "react-helmet-async";
import AOS from "aos";
import "aos/dist/aos.css";

// تهيئة AOS
AOS.init({
  duration: 1000,
  once: true,
  offset: 100,
});

const container = document.getElementById("root");

const app = (
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);

// المنطق الصحيح لتشغيل التطبيق (Hydration vs Render)
const hasPrerenderedMarkup = Boolean(container && container.hasChildNodes());

if (hasPrerenderedMarkup) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
