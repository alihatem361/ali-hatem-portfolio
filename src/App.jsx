import { useEffect, useState, Fragment } from "react";
import { Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";

// importing aos
import AOS from "aos";
import "aos/dist/aos.css";

// components and pages
import HomePage from "./pages/HomePage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import CollectionPage from "./pages/CollectionPage";
import Projects from "./components/projects";
import AnimationLoader from "./components/Utilities/AnimationLoader";
import Nav from "./components/nav";
import SEO from "./components/SEO";

function App() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Update document direction based on current language
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  return (
    <div className="App">
      <SEO />
      <Fragment>
        <Nav />
        <Routes>
          <Route path="projects" element={<Projects />} />
          <Route path="project/:slug" element={<ProjectDetailsPage />} />
          <Route path="collection/:collectionId" element={<CollectionPage />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Fragment>
    </div>
  );
}

export default App;
