"use client";

import React from "react";

/**
 * Shown instead of the loader when a fetch finished but produced nothing
 * usable — either it failed, or it legitimately returned no rows.
 * Without this, a failed Sanity request leaves the page spinning forever.
 */
const StateMessage = ({ message, onRetry, retryLabel }) => {
  return (
    <div
      className="w-100 d-flex flex-column align-items-center justify-content-center text-center"
      style={{ padding: "3rem 1rem", gap: "1rem", minHeight: "200px" }}
      role="status"
      aria-live="polite"
    >
      <p style={{ margin: 0, opacity: 0.75, fontSize: "1.05rem" }}>{message}</p>

      {onRetry && (
        <button
          type="button"
          className="btn btn-outline-warning"
          onClick={onRetry}
          style={{ borderRadius: "15px", padding: "6px 18px" }}
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
};

export default StateMessage;
