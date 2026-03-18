/**
 * Email / phone for org dashboard "CTAs received" cards.
 * Checks response document and populated user (userId).
 */
export function getCtaResponseContact(resp, user) {
  const u = user && typeof user === "object" && !Array.isArray(user) ? user : {};
  const r = resp && typeof resp === "object" ? resp : {};

  const emailRaw = [r.email, r.userEmail, u.email]
    .find((x) => x != null && String(x).trim());
  const phoneRaw = [
    r.phone,
    r.mobile,
    r.phoneNumber,
    u.mobile,
    u.telephone,
    u.phone,
  ].find((x) => x != null && String(x).trim());

  return {
    email: emailRaw != null ? String(emailRaw).trim() : "",
    phone: phoneRaw != null ? String(phoneRaw).trim() : "",
  };
}
