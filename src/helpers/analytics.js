/**
 * Conversion tracking. Events go to Google Tag Manager's dataLayer, where a
 * single GA4 Event tag forwards them (see docs/analytics-setup.md).
 *
 * Only the production host sends anything — GTM itself is also gated to that
 * host in index.html, so localhost, `vite preview` and Vercel preview
 * deployments never reach the GA4 property. In development each event is
 * logged to the console instead.
 *
 * Event names and parameters are the contract with GA4 custom dimensions;
 * rename them only together with the GA4/GTM configuration.
 */

export const PRODUCTION_HOSTS = ["www.alihatem.me", "alihatem.me"];

export const track = (event, params = {}) => {
  if (typeof window === "undefined") return;

  const payload = {
    event,
    ui_language: document.documentElement.lang || "en",
    ...params,
  };

  if (import.meta.env.DEV) {
    console.debug("[track]", payload);
  }

  if (!PRODUCTION_HOSTS.includes(window.location.hostname)) return;

  const dataLayer = (window.dataLayer = window.dataLayer || []);
  dataLayer.push(payload);
  // GTM merges every push into one persistent model, so a parameter from one
  // event (say project_slug) would otherwise leak into the next event that
  // doesn't set it. Resetting after the event has been processed prevents it.
  dataLayer.push(function resetDataModel() {
    this.reset();
  });
};

/** Classifies a social/contact link for tracking. */
export const trackSocialClick = (platform, placement) => {
  if (["email", "phone", "whatsapp"].includes(platform)) {
    track("contact_click", { method: platform, placement });
  } else {
    track("profile_link_click", { platform, placement });
  }
};
