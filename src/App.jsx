import { useEffect, useSyncExternalStore } from "react";
import { Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MotionConfig } from "framer-motion";

// components and pages
import HomePage from "./pages/HomePage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import CollectionPage from "./pages/CollectionPage";
import NotFoundPage from "./pages/NotFoundPage";
import Projects from "./components/projects";
import Nav from "./components/nav";
import { subscribe, getVersion } from "./data/contentStore";

function App() {
  /**
   * Bumps whenever development live content arrives. In production nothing
   * ever calls setContent, so this stays 0 and the key below never changes.
   */
  const contentVersion = useSyncExternalStore(subscribe, getVersion, getVersion);

  // Development only: start the live Sanity subscription. The dynamic import
  // keeps @sanity/client out of the production bundle entirely.
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    import("./data/devLiveContent")
      .then((m) => m.startLiveContent())
      .catch(() => {});
  }, []);

  const { i18n } = useTranslation();
  useEffect(() => {
    // Update document direction based on current language
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    // reducedMotion="user": framer-motion skips transform/scale animations for
    // visitors who ask their OS for reduced motion.
    <MotionConfig reducedMotion="user">
      <div className="App">
        <a className="skip-to-content" href="#main-content">
          {i18n.language === "ar" ? "تخطي إلى المحتوى" : "Skip to main content"}
        </a>
        <Nav />
        <main id="main-content">
          <Routes key={contentVersion}>
            <Route path="projects" element={<Projects />} />
            <Route path="project/:slug" element={<ProjectDetailsPage />} />
            <Route
              path="collection/:collectionId"
              element={<CollectionPage />}
            />
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </MotionConfig>
  );
}

export default App;
