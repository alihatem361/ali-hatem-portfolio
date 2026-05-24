"use client";

/**
 * translateWithGemini — Sanity Custom Document Action
 *
 * Adds a "Translate with Gemini" button inside the Studio editor for
 * `project` and `hero` documents. When clicked it:
 *   1. Reads the current English fields from the document.
 *   2. POSTs them to the Next.js /api/translate endpoint (which calls Gemini
 *      server-side so the API key is never exposed to the browser).
 *   3. Patches the Arabic sibling fields with the returned translations.
 */

import { useCallback, useState } from "react";
import { useClient, useDocumentOperation } from "sanity";

// Fields that have localised siblings {en, ar} for each schema type.
const LOCALISED_FIELDS = {
  project: ["title", "description"],
  hero: ["name", "jobTitle", "bio"],
};

export function translateWithGemini(props) {
  const { id, type, draft, published } = props;
  const client = useClient({ apiVersion: "2024-01-01" });
  const { patch } = useDocumentOperation(id, type);

  const [isTranslating, setIsTranslating] = useState(false);
  const [dialogMessage, setDialogMessage] = useState(null);

  const fields = LOCALISED_FIELDS[type] ?? [];
  const doc = draft ?? published;

  const onHandle = useCallback(async () => {
    if (!doc) return;

    // Collect all English strings that need to be translated.
    const toTranslate = {};
    for (const field of fields) {
      const en = doc[field]?.en;
      if (en) toTranslate[field] = en;
    }

    if (Object.keys(toTranslate).length === 0) {
      setDialogMessage("No English content found to translate.");
      return;
    }

    setIsTranslating(true);
    setDialogMessage("Translating with Gemini…");

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields: toTranslate }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error ?? `HTTP ${response.status}`);
      }

      const { translations } = await response.json();

      // Build Sanity patch operations for each translated field.
      const patches = {};
      for (const [field, arText] of Object.entries(translations)) {
        patches[`${field}.ar`] = arText;
      }

      patch.execute([{ set: patches }]);
      setDialogMessage("Arabic fields updated successfully ✓");
    } catch (err) {
      console.error("[translateWithGemini]", err);
      setDialogMessage(`Translation failed: ${err.message}`);
    } finally {
      setIsTranslating(false);
    }
  }, [doc, fields, patch]);

  return {
    label: isTranslating ? "Translating…" : "Translate with Gemini",
    tone: "positive",
    disabled: isTranslating || !doc,
    title: "Auto-translate English fields → Arabic using Gemini AI",
    onHandle,
    dialog: dialogMessage
      ? {
          type: "dialog",
          header: "Gemini Translation",
          content: dialogMessage,
          onClose: () => {
            setDialogMessage(null);
            props.onComplete();
          },
        }
      : undefined,
  };
}
