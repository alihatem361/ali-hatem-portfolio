import { useEffect, useState, Fragment } from "react";
import { Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";

// importing aos
import AOS from "aos";
import "aos/dist/aos.css";

// components and pages
import HomePage from "./pages/HomePage";
import Projects from "./components/projects";
import AnimationLoader from "./components/Utilities/AnimationLoader";
import Nav from "./components/nav";

function App() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // to change the direction of the page
    document.documentElement.dir = t("direction");
  }, [t]);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  return (
    <div className="App">
      <Fragment>
        <Nav />
        <Routes>
          <Route path="projects" element={<Projects />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Fragment>
    </div>
  );
}

export default App;
