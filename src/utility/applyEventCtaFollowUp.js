import { notify } from "../redux/slices/alertSlice.js";

function parseEventCta(raw) {
  if (raw == null) return null;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  return raw;
}

/**
 * After event CTA is recorded: open external link, or copy email + trigger mailto.
 * Same behavior as Event details "Register" button.
 */
export async function applyEventCtaFollowUp(dispatch, eventPayload) {
  if (!eventPayload) return;
  const cta = parseEventCta(eventPayload.cta);
  const ctaType = (cta?.type || "LINK").toUpperCase();
  const ctaValue =
    typeof cta?.value === "string" ? cta.value.trim() : String(cta?.value || "").trim();
  if (ctaType === "EMAIL" && ctaValue) {
    try {
      await navigator.clipboard.writeText(ctaValue);
      dispatch(
        notify({
          type: "success",
          message:
            "Email address copied to clipboard. If your email client did not open, paste it there.",
        }),
      );
    } catch {
      // clipboard may be blocked; continue to try mailto
    }
    const mailtoUrl = `mailto:${encodeURIComponent(ctaValue)}`;
    const link = document.createElement("a");
    link.href = mailtoUrl;
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else if (ctaType === "LINK" && ctaValue) {
    window.open(ctaValue, "_blank", "noopener,noreferrer");
  }
}
