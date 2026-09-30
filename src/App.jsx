import {
  useEffect,
  useState,
  useSyncExternalStore,
  Fragment,
} from "react";
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
      <Fragment>
        <a className="skip-to-content" href="#main-content">
          {i18n.language === "ar"
            ? "تخطي إلى المحتوى"
            : "Skip to main content"}
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
          </Routes>
        </main>
      </Fragment>
    </div>
  );
}

export default App;
